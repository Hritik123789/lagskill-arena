import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

async def fix_admin():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["lagskill_arena"]
    users = db["users"]
    
    # Update admin user to have Pro status
    result = await users.update_one(
        {"email": "admin@lagskill.com"},
        {
            "$set": {
                "is_pro": True,
                "credits": 999,
                "credits_reset_date": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count > 0:
        print("✓ Admin user updated successfully!")
        
        # Verify the update
        admin = await users.find_one({"email": "admin@lagskill.com"})
        print(f"  is_pro: {admin.get('is_pro')}")
        print(f"  credits: {admin.get('credits')}")
    else:
        print("✗ Failed to update admin user")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_admin())
