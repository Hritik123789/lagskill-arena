import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_admin():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["lagskill_arena"]
    users = db["users"]
    
    admin = await users.find_one({"email": "admin@lagskill.com"})
    
    if admin:
        print("Admin user found:")
        print(f"  Email: {admin.get('email')}")
        print(f"  Username: {admin.get('username')}")
        print(f"  is_admin: {admin.get('is_admin')}")
        print(f"  is_pro: {admin.get('is_pro')}")
        print(f"  credits: {admin.get('credits')}")
    else:
        print("Admin user NOT found!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_admin())
