import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from supabase import create_client, Client

ENVIRONMENT = os.getenv("ENVIRONMENT", "production")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/inventory")
async def get_inventory():
    try:
        response = supabase.table("inventory").select("*").execute()
        return response.data or []
    except Exception as e:
        print(f"Error fetching inventory: {str(e)}")
        return []

@app.get("/api/orders")
async def get_orders():
    try:
        response = supabase.table("orders").select("*").execute()
        return response.data or []
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        return []

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    try:
        inventory = supabase.table("inventory").select("*").execute()
        orders = supabase.table("orders").select("*").execute()
        
        inventory_data = inventory.data or []
        orders_data = orders.data or []
        
        total_parts = sum(item.get("in_stock", 0) for item in inventory_data)
        total_value = sum(item.get("in_stock", 0) * 1000 for item in inventory_data)
        low_stock = sum(1 for item in inventory_data if item.get("in_stock", 0) <= item.get("min_required", 0))
        backorders = sum(1 for order in orders_data if order.get("status") == "Pending")
        
        return {
            "total_parts": total_parts,
            "total_value": total_value,
            "low_stock": low_stock,
            "backorders": backorders,
            "turnover_rate": 4.2,
            "accuracy_rate": 98.5
        }
    except Exception as e:
        print(f"Error fetching analytics: {str(e)}")
        return {
            "total_parts": 0,
            "total_value": 0,
            "low_stock": 0,
            "backorders": 0,
            "turnover_rate": 0,
            "accuracy_rate": 0
        }

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", "")
)

@app.post("/api/upload/inventory")
async def upload_inventory(file: UploadFile = File(...)):
    try:
        # Read file based on extension
        file_extension = file.filename.split('.')[-1].lower()
        
        if file_extension == 'csv':
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        inventory_data = []
        for _, row in df.iterrows():
            item = {
                "part_number": row.get("Part Number"),
                "name": row.get("Name"),
                "category": row.get("Category"),
                "in_stock": int(row.get("In Stock", 0)),
                "min_required": int(row.get("Min Required", 0)),
                "on_order": int(row.get("On Order", 0)),
                "last_updated": row.get("Last Updated")
            }
            inventory_data.append(item)
            
            existing = supabase.table("inventory").select("part_number").eq("part_number", item["part_number"]).execute()
            if existing.data:
                supabase.table("inventory").update(item).eq("part_number", item["part_number"]).execute()
            else:
                supabase.table("inventory").insert(item).execute()
        
        return {"success": True, "count": len(inventory_data)}
    except Exception as e:
        print(f"Error uploading inventory: {str(e)}")
        return {"success": False, "error": str(e)}

@app.post("/api/upload/orders")
async def upload_orders(file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split('.')[-1].lower()
        
        if file_extension == 'csv':
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        orders_data = []
        for _, row in df.iterrows():
            order = {
                "order_number": row.get("Order Number"),
                "part_number": row.get("Part Number"),
                "part_name": row.get("Part Name"),
                "quantity": int(row.get("Quantity", 0)),
                "status": row.get("Status"),
                "order_date": row.get("Order Date"),
                "expected_delivery": row.get("Expected Delivery"),
                "supplier": row.get("Supplier")
            }
            orders_data.append(order)
        
        result = supabase.table("orders").insert(orders_data).execute()
        return {"success": True, "count": len(orders_data)}
    except Exception as e:
        print(f"Error uploading orders: {str(e)}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    uvicorn.run(app, host=host, port=port, reload=ENVIRONMENT == "development")
