import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

async def create_admin():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb+srv://calius_admin:CaliusDB2026abc@cluster0.enwwnbw.mongodb.net/?appName=Cluster0')
    db_name = os.environ.get('DB_NAME', 'calius_digital')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin exists
    existing = await db.users.find_one({'username': 'admin'})
    if existing:
        print('Admin user already exists!')
        return
    
    # Create admin user
    admin_user = {
        'id': str(uuid.uuid4()),
        'username': 'admin',
        'email': 'admin@calius.digital',
        'password': pwd_context.hash('admin123'),
        'role': 'admin'
    }
    
    await db.users.insert_one(admin_user)
    print('Admin user created successfully!')
    print('Username: admin')
    print('Password: admin123')

asyncio.run(create_admin())
