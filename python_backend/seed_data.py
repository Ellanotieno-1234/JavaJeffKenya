import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def load_inventory():
    """Load sample inventory data"""
    try:
        df = pd.read_csv('examples/sample_inventory.csv')
        inventory_data = []
        
        for _, row in df.iterrows():
            item = {
                "part_number": row["Part Number"],
                "name": row["Name"],
                "category": row["Category"],
                "in_stock": int(row["In Stock"]),
                "min_required": int(row["Min Required"]),
                "on_order": int(row["On Order"]),
                "last_updated": row["Last Updated"]
            }
            inventory_data.append(item)
        
        # First clear existing inventory
        supabase.table("inventory").delete().neq("part_number", "dummy").execute()
        
        # Insert new inventory data
        for item in inventory_data:
            print(f"Adding inventory item: {item['part_number']}")
            try:
                result = supabase.table("inventory").insert(item).execute()
                print(f"Successfully added {item['part_number']}")
            except Exception as e:
                print(f"Error adding {item['part_number']}: {str(e)}")
                return False
        print(f"Successfully loaded {len(inventory_data)} inventory items")
        return True
    except Exception as e:
        print(f"Error loading inventory data: {str(e)}")
        return False

def load_orders():
    """Load sample orders data"""
    try:
        df = pd.read_csv('examples/sample_orders.csv')
        orders_data = []
        
        for _, row in df.iterrows():
            order = {
                "order_number": row["Order Number"],
                "part_number": row["Part Number"],
                "part_name": row["Part Name"],
                "quantity": int(row["Quantity"]),
                "status": row["Status"],
                "order_date": row["Order Date"],
                "expected_delivery": row["Expected Delivery"],
                "supplier": row["Supplier"]
            }
            orders_data.append(order)
        
        # First clear existing orders
        supabase.table("orders").delete().neq("order_number", "dummy").execute()
        
        # Insert new orders data
        for order in orders_data:
            print(f"Adding order: {order['order_number']}")
            try:
                result = supabase.table("orders").insert(order).execute()
                print(f"Successfully added order {order['order_number']}")
            except Exception as e:
                print(f"Error adding order {order['order_number']}: {str(e)}")
                return False
        print(f"Successfully loaded {len(orders_data)} orders")
        return True
    except Exception as e:
        print(f"Error loading orders data: {str(e)}")
        return False

if __name__ == "__main__":
    print("Starting data seeding process...")
    
    # Load inventory first since orders reference inventory items
    if load_inventory():
        print("Inventory data loaded successfully")
        
        # Load orders after inventory
        if load_orders():
            print("Orders data loaded successfully")
        else:
            print("Failed to load orders data")
    else:
        print("Failed to load inventory data")
