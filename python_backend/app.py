from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Kenya Airways API",
    description="API for Kenya Airways Inventory Management System",
)

# Add CORS middleware with specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://java-jeff-kenya-airways.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

@app.options("/{full_path:path}")
async def options_route(full_path: str):
    """Handle OPTIONS requests."""
    return JSONResponse(
        content="OK",
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

async def initialize_database():
    """Initialize database tables if they don't exist"""
    try:
        with open('migrations/01_create_tables.sql', 'r') as f:
            sql = f.read()
            # Execute the SQL migration directly using Supabase's REST API
            result = supabase.table("inventory").select("*").limit(1).execute()
            if not result.data:
                print("Initializing database tables...")
                # Load sample inventory data if tables are empty
                from seed_data import load_inventory
                load_inventory()
                print("Database initialized with sample inventory data")
    except Exception as e:
        print(f"Error initializing database: {str(e)}")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await initialize_database()

async def check_inventory_exists():
    """Check if any inventory items exist in the database"""
    try:
        response = supabase.table("inventory").select("part_number").limit(1).execute()
        return len(response.data) > 0
    except Exception as e:
        print(f"Error checking inventory: {str(e)}")
        return False

@app.post("/api/upload/inventory")
async def upload_inventory(file: UploadFile = File(...)):
    try:
        # Read file based on extension
        file_extension = file.filename.split('.')[-1].lower()
        
        if file_extension == 'csv':
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        # Process inventory data
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
        
        # First check for duplicate part numbers
        for item in inventory_data:
            existing = supabase.table("inventory").select("part_number").eq("part_number", item["part_number"]).execute()
            if len(existing.data) > 0:
                # Update existing record instead of inserting
                result = supabase.table("inventory").update(item).eq("part_number", item["part_number"]).execute()
            else:
                # Insert new record
                result = supabase.table("inventory").insert(item).execute()
        
        return {"message": "Inventory data uploaded successfully", "count": len(inventory_data)}
    except Exception as e:
        error_message = f"Upload failed: {str(e)}"
        print(f"Error in upload_inventory: {error_message}")
        # Check for specific error types
        error_details = str(e)
        if "'part_number)=(KQ" in error_details and "not present in table" in error_details:
            return {
                "error": "One or more part numbers in your file don't exist in the inventory database. Please add these parts to inventory first.",
                "details": {"type": "ValidationError"}
            }
        elif "duplicate key value violates unique constraint" in error_details:
            return {
                "error": "This inventory item already exists. The system will update the existing record.",
                "details": {"type": "DuplicateError"}
            }
        else:
            return {"error": error_message, "details": {"type": type(e).__name__}}

@app.post("/api/upload/orders")
async def upload_orders(file: UploadFile = File(...)):
    try:
        # First check if any inventory exists
        if not await check_inventory_exists():
            return {
                "error": "No inventory items found. Please upload inventory data before adding orders.",
                "details": {"type": "ValidationError"}
            }
            
        # Read file based on extension
        file_extension = file.filename.split('.')[-1].lower()
        
        if file_extension == 'csv':
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)
        
        # Process orders data
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
        
        # Validate that all part numbers exist in inventory
        for order in orders_data:
            part_number = order["part_number"]
            existing = supabase.table("inventory").select("part_number").eq("part_number", part_number).execute()
            if len(existing.data) == 0:
                raise ValueError(f"Part number {part_number} does not exist in inventory")
        
        # All part numbers exist, proceed with insert
        result = supabase.table("orders").insert(orders_data).execute()
        
        print(f"Successfully uploaded {len(orders_data)} orders")
        return {"message": "Orders data uploaded successfully", "count": len(orders_data)}
    except Exception as e:
        error_message = f"Upload failed: {str(e)}"
        print(f"Error in upload_orders: {error_message}")
        
        # Check for specific error types
        error_details = str(e)
        if isinstance(e, ValueError) and "does not exist in inventory" in str(e):
            return {
                "error": "One or more part numbers in your orders file don't exist in inventory. Please add these parts to inventory first.",
                "details": {"type": "ValidationError"}
            }
        elif "orders_part_number_fkey" in error_details:
            return {
                "error": "One or more parts in your orders file don't exist in inventory. Please ensure all parts are added to inventory first.",
                "details": {"type": "ForeignKeyError"}
            }
        else:
            return {"error": error_message, "details": {"type": type(e).__name__}}

@app.get("/api/inventory")
async def get_inventory():
    try:
        response = supabase.table("inventory").select("*").execute()
        return response.data
    except Exception as e:
        error_message = f"Upload failed: {str(e)}"
        print(f"Error in upload_orders: {error_message}")
        return {"error": error_message, "details": {"type": type(e).__name__}}

@app.get("/api/orders")
async def get_orders():
    try:
        response = supabase.table("orders").select("*").execute()
        return response.data
    except Exception as e:
        error_message = f"Failed to fetch orders: {str(e)}"
        print(f"Error in get_orders: {error_message}")
        return {"error": error_message, "details": {"type": type(e).__name__}}

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    try:
        # Get inventory data
        inventory = supabase.table("inventory").select("*").execute()
        orders = supabase.table("orders").select("*").execute()
        
        inventory_data = inventory.data
        orders_data = orders.data
        
        # Calculate summary metrics
        total_parts = sum(item["in_stock"] for item in inventory_data)
        total_value = sum(item["in_stock"] * 1000 for item in inventory_data)  # Assuming average value
        low_stock = sum(1 for item in inventory_data if item["in_stock"] <= item["min_required"])
        backorders = sum(1 for order in orders_data if order["status"] == "Pending")
        
        return {
            "total_parts": total_parts,
            "total_value": total_value,
            "low_stock": low_stock,
            "backorders": backorders,
            "turnover_rate": 4.2,  # This should be calculated based on historical data
            "accuracy_rate": 98.5  # This should be calculated based on audit data
        }
    except Exception as e:
        error_message = f"Failed to fetch analytics summary: {str(e)}"
        print(f"Error in get_analytics_summary: {error_message}")
        return {"error": error_message, "details": {"type": type(e).__name__}}

# Handle startup differently in production vs development
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    if ENVIRONMENT == "development":
        uvicorn.run(app, host=host, port=port, reload=True)
    else:
        uvicorn.run(app, host=host, port=port)
