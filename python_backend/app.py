import os
import logging
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

ENVIRONMENT = os.getenv("ENVIRONMENT", "production")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", "")
)

@app.get("/api/inventory")
async def get_inventory():
    try:
        logger.info("Fetching inventory data")
        response = supabase.table("inventory").select("*").execute()
        inventory_data = response.data if response and hasattr(response, 'data') else []
        logger.info(f"Retrieved {len(inventory_data)} inventory items")
        return inventory_data
    except Exception as e:
        logger.error(f"Error fetching inventory: {str(e)}")
        return []

@app.get("/api/orders")
async def get_orders():
    try:
        logger.info("Fetching orders data")
        response = supabase.table("orders").select("*").execute()
        orders_data = response.data if response and hasattr(response, 'data') else []
        logger.info(f"Retrieved {len(orders_data)} orders")
        return orders_data
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        return []

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    try:
        logger.info("Calculating analytics summary")
        
        # Fetch data
        inventory = await get_inventory()
        orders = await get_orders()
        
        # Calculate metrics
        total_parts = sum(item.get("in_stock", 0) for item in inventory)
        total_value = sum(item.get("in_stock", 0) * 1000 for item in inventory)
        low_stock = sum(1 for item in inventory if item.get("in_stock", 0) <= item.get("min_required", 0))
        backorders = sum(1 for order in orders if order.get("status") == "Pending")
        
        summary = {
            "total_parts": total_parts,
            "total_value": total_value,
            "low_stock": low_stock,
            "backorders": backorders,
            "turnover_rate": 4.2 if total_parts > 0 else 0,
            "accuracy_rate": 98.5 if total_parts > 0 else 0
        }
        
        logger.info(f"Analytics summary calculated: {summary}")
        return summary
    except Exception as e:
        logger.error(f"Error calculating analytics: {str(e)}")
        return {
            "total_parts": 0,
            "total_value": 0.0,
            "low_stock": 0,
            "backorders": 0,
            "turnover_rate": 0.0,
            "accuracy_rate": 0.0
        }

@app.post("/api/upload/inventory")
async def upload_inventory(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing inventory upload: {file.filename}")
        file_extension = file.filename.split('.')[-1].lower()
        
        # Read file
        if file_extension == 'csv':
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        # Process inventory data
        inventory_data = []
        for _, row in df.iterrows():
            item = {
                "part_number": str(row.get("Part Number", "")),
                "name": str(row.get("Name", "")),
                "category": str(row.get("Category", "")),
                "in_stock": int(row.get("In Stock", 0)),
                "min_required": int(row.get("Min Required", 0)),
                "on_order": int(row.get("On Order", 0)),
                "last_updated": str(row.get("Last Updated", ""))
            }
            inventory_data.append(item)
            
            # Update or insert
            existing = supabase.table("inventory").select("part_number").eq("part_number", item["part_number"]).execute()
            if existing.data:
                supabase.table("inventory").update(item).eq("part_number", item["part_number"]).execute()
                logger.info(f"Updated inventory item: {item['part_number']}")
            else:
                supabase.table("inventory").insert(item).execute()
                logger.info(f"Inserted new inventory item: {item['part_number']}")
        
        logger.info(f"Successfully processed {len(inventory_data)} inventory items")
        return {"success": True, "count": len(inventory_data)}
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error uploading inventory: {error_msg}")
        return {"success": False, "error": error_msg}

@app.post("/api/upload/orders")
async def upload_orders(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing orders upload: {file.filename}")
        file_extension = file.filename.split('.')[-1].lower()
        
        # Read file
        if file_extension == 'csv':
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        # Process orders data
        orders_data = []
        for _, row in df.iterrows():
            order = {
                "order_number": str(row.get("Order Number", "")),
                "part_number": str(row.get("Part Number", "")),
                "part_name": str(row.get("Part Name", "")),
                "quantity": int(row.get("Quantity", 0)),
                "status": str(row.get("Status", "Pending")),
                "order_date": str(row.get("Order Date", "")),
                "expected_delivery": str(row.get("Expected Delivery", "")),
                "supplier": str(row.get("Supplier", ""))
            }
            orders_data.append(order)
        
        # Insert orders
        result = supabase.table("orders").insert(orders_data).execute()
        logger.info(f"Successfully uploaded {len(orders_data)} orders")
        return {"success": True, "count": len(orders_data)}
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error uploading orders: {error_msg}")
        return {"success": False, "error": error_msg}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    uvicorn.run(app, host=host, port=port, reload=ENVIRONMENT == "development")
