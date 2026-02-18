"""
Smart backend starter - automatically uses the right backend based on MongoDB availability
"""
import subprocess
import sys
import os
from pathlib import Path

def check_mongodb():
    """Check if MongoDB is configured and accessible"""
    try:
        # Load environment variables
        from dotenv import load_dotenv
        env_path = Path('.') / '.env'
        load_dotenv(dotenv_path=env_path)
        
        mongodb_url = os.getenv('MONGODB_URL', '')
        
        # Check if password placeholder is still there
        if '<db_password>' in mongodb_url:
            print("❌ MongoDB password not configured!")
            print("   Please edit backend/.env and replace <db_password> with your actual password")
            print("   See MONGODB_ATLAS_SETUP.md for instructions")
            return False
        
        # Try to connect
        from pymongo import MongoClient
        client = MongoClient(mongodb_url, serverSelectionTimeoutMS=5000)
        client.server_info()
        client.close()
        return True
    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {str(e)}")
        return False

def main():
    print("🚀 LagSkillArena Backend Starter")
    print("=" * 50)
    
    # Check MongoDB
    print("\n📊 Checking MongoDB connection...")
    mongodb_available = check_mongodb()
    
    if mongodb_available:
        print("✅ MongoDB is connected!")
        print("🔐 Starting backend WITH authentication...")
        print("\n📝 Features available:")
        print("   • User registration and login")
        print("   • Session history tracking")
        print("   • Admin panel")
        print("   • Personal dashboard")
        backend_file = "main.py"
    else:
        print("\n📝 Starting backend in DEMO MODE (no authentication)...")
        print("\n📝 Features available:")
        print("   • Video analysis (public)")
        print("   • Reaction time tests")
        print("   • No session saving")
        print("\n💡 To enable authentication:")
        print("   1. Edit backend/.env with your MongoDB password")
        print("   2. See MONGODB_ATLAS_SETUP.md for help")
        backend_file = "main_no_auth.py"
    
    print(f"\n🎯 Using: {backend_file}")
    print("=" * 50)
    print("\n🌐 Backend will be available at: http://localhost:8000")
    print("📚 API docs at: http://localhost:8000/docs")
    print("\n⏹️  Press CTRL+C to stop\n")
    
    # Start uvicorn
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn",
            backend_file.replace('.py', '') + ":app",
            "--reload",
            "--host", "0.0.0.0",
            "--port", "8000"
        ])
    except KeyboardInterrupt:
        print("\n\n👋 Backend stopped. Goodbye!")

if __name__ == "__main__":
    main()
