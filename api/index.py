from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Query, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import hmac
import time
import asyncio
import cloudinary
import cloudinary.utils
import cloudinary.uploader
from passlib.context import CryptContext
from jose import JWTError, jwt
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'calius-digital-secret-key-2024')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Midtrans configuration
MIDTRANS_SERVER_KEY = os.environ.get('MIDTRANS_SERVER_KEY', '')
MIDTRANS_CLIENT_KEY = os.environ.get('MIDTRANS_CLIENT_KEY', '')
MIDTRANS_IS_PRODUCTION = os.environ.get('MIDTRANS_IS_PRODUCTION', 'False').lower() == 'true'

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.environ.get("CLOUDINARY_API_KEY", ""),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET", ""),
    secure=True
)

# Resend Email configuration
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@calius.digital")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ==================== EMAIL HELPERS ====================

async def send_order_notification_email(order_data: dict):
    """Send email notification to admin when new order is successful"""
    if not RESEND_API_KEY:
        logger.warning("Resend API key not configured, skipping email notification")
        return None
    
    items_html = ""
    for item in order_data.get("item_details", []):
        items_html += f"<tr><td style='padding:8px;border-bottom:1px solid #eee'>{item.get('name', '-')}</td><td style='padding:8px;border-bottom:1px solid #eee'>Rp {item.get('price', 0):,}</td></tr>"
    
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9">
        <div style="background:#FF4500;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0">🎉 Order Baru!</h1>
        </div>
        <div style="background:white;padding:20px;border-radius:0 0 8px 8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)">
            <h2 style="color:#333;margin-top:0">Detail Order</h2>
            <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#666">Order ID:</td><td style="padding:8px 0;font-weight:bold">{order_data.get('order_id', '-')}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Customer:</td><td style="padding:8px 0">{order_data.get('customer_name', '-')}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Email:</td><td style="padding:8px 0">{order_data.get('customer_email', '-')}</td></tr>
                <tr><td style="padding:8px 0;color:#666">Status:</td><td style="padding:8px 0;color:#22c55e;font-weight:bold">✅ SUKSES</td></tr>
            </table>
            
            <h3 style="color:#333;margin-top:20px">Items</h3>
            <table style="width:100%;border-collapse:collapse">
                <thead><tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px;text-align:left">Harga</th></tr></thead>
                <tbody>{items_html}</tbody>
            </table>
            
            <div style="margin-top:20px;padding:15px;background:#f5f5f5;border-radius:8px;text-align:center">
                <span style="color:#666">Total:</span>
                <span style="font-size:24px;font-weight:bold;color:#FF4500;margin-left:10px">Rp {order_data.get('gross_amount', 0):,}</span>
            </div>
            
            <p style="color:#666;font-size:12px;margin-top:20px;text-align:center">
                Notifikasi otomatis dari Calius Digital • {datetime.now().strftime('%d %b %Y %H:%M')}
            </p>
        </div>
    </div>
    """
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"🛒 Order Baru #{order_data.get('order_id', '')} - Rp {order_data.get('gross_amount', 0):,}",
            "html": html_content
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Order notification email sent: {result}")
        return result
    except Exception as e:
        logger.error(f"Failed to send order notification email: {str(e)}")
        return None

async def send_customer_confirmation_email(order_data: dict):
    """Send confirmation email to customer after successful payment"""
    if not RESEND_API_KEY:
        return None
    
    customer_email = order_data.get("customer_email")
    if not customer_email:
        return None
    
    items_html = ""
    for item in order_data.get("item_details", []):
        items_html += f"<li style='padding:8px 0'>{item.get('name', '-')} - Rp {item.get('price', 0):,}</li>"
    
    html_content = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9">
        <div style="background:#FF4500;padding:20px;text-align:center;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0">Terima Kasih!</h1>
        </div>
        <div style="background:white;padding:20px;border-radius:0 0 8px 8px">
            <p>Halo <strong>{order_data.get('customer_name', 'Customer')}</strong>,</p>
            <p>Pembayaran Anda telah berhasil diproses. Berikut detail pesanan Anda:</p>
            
            <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:20px 0">
                <p style="margin:0"><strong>Order ID:</strong> {order_data.get('order_id', '-')}</p>
                <p style="margin:10px 0 0"><strong>Total:</strong> <span style="color:#FF4500">Rp {order_data.get('gross_amount', 0):,}</span></p>
            </div>
            
            <p><strong>Items:</strong></p>
            <ul style="margin:0;padding-left:20px">{items_html}</ul>
            
            <p style="margin-top:20px">Link download akan dikirim ke email ini dalam 1x24 jam.</p>
            
            <p style="color:#666;font-size:12px;margin-top:30px;border-top:1px solid #eee;padding-top:15px">
                Ada pertanyaan? Hubungi kami via WhatsApp: +62 812 6067 561
            </p>
        </div>
    </div>
    """
    
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [customer_email],
            "subject": f"✅ Pembayaran Berhasil - Order #{order_data.get('order_id', '')}",
            "html": html_content
        }
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Customer confirmation email sent to {customer_email}")
        return result
    except Exception as e:
        logger.error(f"Failed to send customer email: {str(e)}")
        return None

app = FastAPI(title="Calius Digital API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== AUTH HELPERS ====================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def require_editor(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["admin", "editor"]:
        raise HTTPException(status_code=403, detail="Editor access required")
    return user

# ==================== MODELS ====================

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "editor"  # admin, editor

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class ServiceModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name_id: str
    name_en: str
    description_id: str
    description_en: str
    icon: str
    features: List[str]
    price_start: int
    image: Optional[str] = None
    order: int = 0
    template_category: Optional[str] = None  # Link to template category
    included_features: Optional[List[dict]] = None  # [{text_id, text_en, included}]

class TemplateCreate(BaseModel):
    slug: str
    name: str
    category: str
    price: int
    sale_price: Optional[int] = None
    description_id: str
    description_en: str
    features: List[str] = []
    technologies: List[str] = []
    demo_url: Optional[str] = None
    image: str = ""
    images: List[str] = []
    is_featured: bool = False
    is_bestseller: bool = False
    is_new: bool = False

class PortfolioCreate(BaseModel):
    title: str
    client: str
    category: str
    description_id: str
    description_en: str
    image: str = ""
    images: List[str] = []
    url: Optional[str] = None
    technologies: List[str] = []
    year: int
    is_featured: bool = False

class BlogCreate(BaseModel):
    slug: str
    title_id: str
    title_en: str
    excerpt_id: str
    excerpt_en: str
    content_id: str
    content_en: str
    image: str = ""
    author: str
    category: str
    tags: List[str] = []
    read_time: int = 5

class TestimonialCreate(BaseModel):
    name: str
    role: str
    company: str
    content_id: str
    content_en: str
    avatar: Optional[str] = None
    rating: int = 5

class PricingCreate(BaseModel):
    name_id: str
    name_en: str
    description_id: str
    description_en: str
    price: int
    price_note_id: str
    price_note_en: str
    features: List[Dict[str, Any]]
    is_popular: bool = False
    order: int = 0

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str

class PaymentRequest(BaseModel):
    order_id: str
    gross_amount: int
    customer_email: str
    customer_name: str
    customer_phone: Optional[str] = None
    item_details: List[Dict[str, Any]]

# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Calius Digital API", "version": "2.0.0"}

# Services (Public)
@api_router.get("/services")
async def get_services():
    services = await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not services:
        # Seed default services to database
        defaults = get_default_services()
        for s in defaults:
            # Check if already exists before inserting
            existing = await db.services.find_one({"id": s["id"]})
            if not existing:
                s["created_at"] = datetime.now(timezone.utc).isoformat()
                await db.services.insert_one(s)
        return defaults
    return services

# Admin endpoint to reset services (cleanup duplicates)
@api_router.post("/admin/services/reset")
async def reset_services(user: dict = Depends(require_admin)):
    # Delete all services and re-seed with defaults
    await db.services.delete_many({})
    defaults = get_default_services()
    for s in defaults:
        s["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.services.insert_one(s)
    return {"success": True, "message": f"Reset {len(defaults)} services"}

@api_router.get("/services/{slug}")
async def get_service(slug: str):
    service = await db.services.find_one({"slug": slug}, {"_id": 0})
    if not service:
        defaults = get_default_services()
        for s in defaults:
            if s["slug"] == slug:
                return s
        raise HTTPException(status_code=404, detail="Service not found")
    return service

# Templates (Public)
@api_router.get("/templates")
async def get_templates(category: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    templates = await db.templates.find(query, {"_id": 0}).to_list(100)
    if not templates:
        return get_default_templates()
    return templates

@api_router.get("/templates/{slug}")
async def get_template(slug: str):
    template = await db.templates.find_one({"slug": slug}, {"_id": 0})
    if not template:
        defaults = get_default_templates()
        for t in defaults:
            if t["slug"] == slug:
                return t
        raise HTTPException(status_code=404, detail="Template not found")
    return template

# Portfolio (Public)
@api_router.get("/portfolio")
async def get_portfolio(category: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    portfolio = await db.portfolio.find(query, {"_id": 0}).to_list(100)
    if not portfolio:
        return get_default_portfolio()
    return portfolio

# Testimonials (Public)
@api_router.get("/testimonials")
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    if not testimonials:
        return get_default_testimonials()
    return testimonials

# Blog (Public)
@api_router.get("/blog")
async def get_blog_posts(category: Optional[str] = None, limit: int = 10):
    query = {}
    if category and category != "all":
        query["category"] = category
    posts = await db.blog.find(query, {"_id": 0}).sort("published_at", -1).to_list(limit)
    if not posts:
        return get_default_blog_posts()
    return posts

@api_router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog.find_one({"slug": slug}, {"_id": 0})
    if not post:
        defaults = get_default_blog_posts()
        for p in defaults:
            if p["slug"] == slug:
                return p
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

# Pricing (Public)
@api_router.get("/pricing")
async def get_pricing():
    packages = await db.pricing.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not packages:
        return get_default_pricing()
    return packages

# Contact (Public)
@api_router.post("/contact")
async def submit_contact(request: ContactRequest):
    contact_data = {
        "id": str(uuid.uuid4()),
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "service": request.service,
        "message": request.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "new",
        "is_read": False
    }
    await db.contacts.insert_one(contact_data)
    return {"success": True, "message": "Pesan berhasil dikirim / Message sent successfully"}

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(user: UserCreate, current_user: dict = Depends(require_admin)):
    # Check if user exists
    existing = await db.users.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user_data = {
        "id": str(uuid.uuid4()),
        "username": user.username,
        "email": user.email,
        "password": get_password_hash(user.password),
        "role": user.role,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_data)
    return {"success": True, "message": "User created successfully"}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="Account is disabled")
    
    token = create_access_token({"sub": user["id"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

@api_router.post("/auth/init-admin")
async def init_admin():
    """Initialize default admin user if no users exist"""
    count = await db.users.count_documents({})
    if count > 0:
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    admin_data = {
        "id": str(uuid.uuid4()),
        "username": "admin",
        "email": "admin@calius.digital",
        "password": get_password_hash("admin123"),
        "role": "admin",
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin_data)
    return {"success": True, "message": "Admin created", "username": "admin", "password": "admin123"}

# ==================== ADMIN ROUTES ====================

# Dashboard Stats
@api_router.get("/admin/stats")
async def get_stats(user: dict = Depends(require_editor)):
    templates_count = await db.templates.count_documents({})
    if templates_count == 0:
        templates_count = len(get_default_templates())
    
    portfolio_count = await db.portfolio.count_documents({})
    if portfolio_count == 0:
        portfolio_count = len(get_default_portfolio())
    
    blog_count = await db.blog.count_documents({})
    if blog_count == 0:
        blog_count = len(get_default_blog_posts())
    
    contacts_count = await db.contacts.count_documents({})
    unread_contacts = await db.contacts.count_documents({"is_read": False})
    orders_count = await db.transactions.count_documents({})
    successful_orders = await db.transactions.count_documents({"status": "success"})
    
    # Calculate revenue
    pipeline = [
        {"$match": {"status": "success"}},
        {"$group": {"_id": None, "total": {"$sum": "$gross_amount"}}}
    ]
    revenue_result = await db.transactions.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "templates": templates_count,
        "portfolio": portfolio_count,
        "blog": blog_count,
        "contacts": contacts_count,
        "unread_contacts": unread_contacts,
        "orders": orders_count,
        "successful_orders": successful_orders,
        "total_revenue": total_revenue
    }

# Users Management (Admin only)
@api_router.get("/admin/users")
async def get_users(user: dict = Depends(require_admin)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(100)
    return users

@api_router.put("/admin/users/{user_id}")
async def update_user(user_id: str, data: UserUpdate, user: dict = Depends(require_admin)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.users.update_one({"id": user_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, user: dict = Depends(require_admin)):
    if user_id == user["id"]:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}

# Templates Management
@api_router.post("/admin/templates")
async def create_template(data: TemplateCreate, user: dict = Depends(require_editor)):
    template_data = data.model_dump()
    template_data["id"] = str(uuid.uuid4())
    template_data["downloads"] = 0
    template_data["rating"] = 5.0
    template_data["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.templates.insert_one(template_data)
    return {"success": True, "id": template_data["id"]}

@api_router.put("/admin/templates/{template_id}")
async def update_template(template_id: str, data: TemplateCreate, user: dict = Depends(require_editor)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.templates.update_one({"id": template_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"success": True}

@api_router.delete("/admin/templates/{template_id}")
async def delete_template(template_id: str, user: dict = Depends(require_editor)):
    result = await db.templates.delete_one({"id": template_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"success": True}

# Services Management
@api_router.post("/admin/services")
async def create_service(data: ServiceModel, user: dict = Depends(require_editor)):
    service_data = data.model_dump()
    service_data["id"] = str(uuid.uuid4())
    service_data["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.services.insert_one(service_data)
    return {"success": True, "id": service_data["id"]}

@api_router.put("/admin/services/{service_id}")
async def update_service(service_id: str, data: ServiceModel, user: dict = Depends(require_editor)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    update_data["id"] = service_id  # Ensure ID is preserved
    # Use upsert to handle both existing and default services
    result = await db.services.update_one(
        {"id": service_id}, 
        {"$set": update_data},
        upsert=True
    )
    return {"success": True}

@api_router.delete("/admin/services/{service_id}")
async def delete_service(service_id: str, user: dict = Depends(require_editor)):
    # First ensure services are in database
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    if not services:
        defaults = get_default_services()
        for s in defaults:
            s["created_at"] = datetime.now(timezone.utc).isoformat()
            await db.services.insert_one(s)
    
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"success": True}

# Portfolio Management
@api_router.post("/admin/portfolio")
async def create_portfolio(data: PortfolioCreate, user: dict = Depends(require_editor)):
    portfolio_data = data.model_dump()
    portfolio_data["id"] = str(uuid.uuid4())
    portfolio_data["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.portfolio.insert_one(portfolio_data)
    return {"success": True, "id": portfolio_data["id"]}

@api_router.put("/admin/portfolio/{portfolio_id}")
async def update_portfolio(portfolio_id: str, data: PortfolioCreate, user: dict = Depends(require_editor)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.portfolio.update_one({"id": portfolio_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return {"success": True}

@api_router.delete("/admin/portfolio/{portfolio_id}")
async def delete_portfolio(portfolio_id: str, user: dict = Depends(require_editor)):
    result = await db.portfolio.delete_one({"id": portfolio_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return {"success": True}

# Blog Management
@api_router.post("/admin/blog")
async def create_blog(data: BlogCreate, user: dict = Depends(require_editor)):
    blog_data = data.model_dump()
    blog_data["id"] = str(uuid.uuid4())
    blog_data["published_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    blog_data["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.blog.insert_one(blog_data)
    return {"success": True, "id": blog_data["id"]}

@api_router.put("/admin/blog/{blog_id}")
async def update_blog(blog_id: str, data: BlogCreate, user: dict = Depends(require_editor)):
    update_data = data.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog.update_one({"id": blog_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"success": True}

@api_router.delete("/admin/blog/{blog_id}")
async def delete_blog(blog_id: str, user: dict = Depends(require_editor)):
    result = await db.blog.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"success": True}

# Testimonials Management
@api_router.post("/admin/testimonials")
async def create_testimonial(data: TestimonialCreate, user: dict = Depends(require_editor)):
    testimonial_data = data.model_dump()
    testimonial_data["id"] = str(uuid.uuid4())
    testimonial_data["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.testimonials.insert_one(testimonial_data)
    return {"success": True, "id": testimonial_data["id"]}

@api_router.put("/admin/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, data: TestimonialCreate, user: dict = Depends(require_editor)):
    update_data = data.model_dump()
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"success": True}

@api_router.delete("/admin/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, user: dict = Depends(require_editor)):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"success": True}

# Pricing Management
@api_router.post("/admin/pricing")
async def create_pricing(data: PricingCreate, user: dict = Depends(require_admin)):
    pricing_data = data.model_dump()
    pricing_data["id"] = str(uuid.uuid4())
    await db.pricing.insert_one(pricing_data)
    return {"success": True, "id": pricing_data["id"]}

@api_router.put("/admin/pricing/{pricing_id}")
async def update_pricing(pricing_id: str, data: PricingCreate, user: dict = Depends(require_admin)):
    update_data = data.model_dump()
    result = await db.pricing.update_one({"id": pricing_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Pricing package not found")
    return {"success": True}

@api_router.delete("/admin/pricing/{pricing_id}")
async def delete_pricing(pricing_id: str, user: dict = Depends(require_admin)):
    result = await db.pricing.delete_one({"id": pricing_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pricing package not found")
    return {"success": True}

# Contact Messages Management
@api_router.get("/admin/contacts")
async def get_contacts(user: dict = Depends(require_editor)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return contacts

@api_router.put("/admin/contacts/{contact_id}/read")
async def mark_contact_read(contact_id: str, user: dict = Depends(require_editor)):
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"is_read": True, "status": "read"}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"success": True}

@api_router.delete("/admin/contacts/{contact_id}")
async def delete_contact(contact_id: str, user: dict = Depends(require_editor)):
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"success": True}

# Orders/Transactions Management
@api_router.get("/admin/orders")
async def get_orders(user: dict = Depends(require_editor)):
    orders = await db.transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return orders

@api_router.get("/admin/orders/{order_id}")
async def get_order(order_id: str, user: dict = Depends(require_editor)):
    order = await db.transactions.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Export Data
@api_router.get("/admin/export/{data_type}")
async def export_data(data_type: str, user: dict = Depends(require_admin)):
    if data_type == "contacts":
        data = await db.contacts.find({}, {"_id": 0}).to_list(1000)
    elif data_type == "orders":
        data = await db.transactions.find({}, {"_id": 0}).to_list(1000)
    elif data_type == "templates":
        data = await db.templates.find({}, {"_id": 0}).to_list(1000)
    elif data_type == "portfolio":
        data = await db.portfolio.find({}, {"_id": 0}).to_list(1000)
    elif data_type == "blog":
        data = await db.blog.find({}, {"_id": 0}).to_list(1000)
    else:
        raise HTTPException(status_code=400, detail="Invalid data type")
    
    return {"data": data, "count": len(data), "exported_at": datetime.now(timezone.utc).isoformat()}

# ==================== CLOUDINARY ROUTES ====================

@api_router.get("/cloudinary/signature")
async def get_cloudinary_signature(
    resource_type: str = Query("image", enum=["image", "video"]),
    folder: str = "calius",
    user: dict = Depends(require_editor)
):
    if not os.environ.get("CLOUDINARY_API_SECRET"):
        raise HTTPException(status_code=500, detail="Cloudinary not configured")
    
    ALLOWED_FOLDERS = ("calius/", "templates/", "portfolio/", "blog/", "users/")
    if not any(folder.startswith(f) for f in ALLOWED_FOLDERS) and folder not in ["calius", "templates", "portfolio", "blog", "users"]:
        raise HTTPException(status_code=400, detail="Invalid folder path")
    
    timestamp = int(time.time())
    params = {
        "timestamp": timestamp,
        "folder": folder,
    }
    
    signature = cloudinary.utils.api_sign_request(params, os.environ.get("CLOUDINARY_API_SECRET"))
    
    return {
        "signature": signature,
        "timestamp": timestamp,
        "cloud_name": os.environ.get("CLOUDINARY_CLOUD_NAME"),
        "api_key": os.environ.get("CLOUDINARY_API_KEY"),
        "folder": folder,
        "resource_type": resource_type
    }

@api_router.delete("/cloudinary/{public_id:path}")
async def delete_cloudinary_image(public_id: str, user: dict = Depends(require_editor)):
    try:
        result = cloudinary.uploader.destroy(public_id, invalidate=True)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==================== UPLOAD ENDPOINT ====================

@api_router.get("/cloudinary-debug")
async def cloudinary_debug():
    """Debug Cloudinary configuration"""
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "")
    api_key = os.environ.get("CLOUDINARY_API_KEY", "")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET", "")
    
    return {
        "cloud_name_raw_len": len(cloud_name),
        "cloud_name_stripped": cloud_name.strip()[:5] + "..." if cloud_name.strip() else "EMPTY",
        "api_key_raw_len": len(api_key),
        "api_key_stripped": api_key.strip()[:5] + "..." if api_key.strip() else "EMPTY",
        "api_secret_raw_len": len(api_secret),
        "api_secret_stripped": api_secret.strip()[:5] + "..." if api_secret.strip() else "EMPTY",
        "configured": bool(cloud_name.strip() and api_key.strip() and api_secret.strip())
    }

@api_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Query("calius"),
    user: dict = Depends(require_editor)
):
    """Upload file to Cloudinary"""
    # Configure Cloudinary with stripped values to remove any newlines
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "").strip()
    api_key = os.environ.get("CLOUDINARY_API_KEY", "").strip()
    api_secret = os.environ.get("CLOUDINARY_API_SECRET", "").strip()
    
    if not cloud_name or not api_key or not api_secret:
        logger.error(f"Cloudinary not configured: cloud={bool(cloud_name)}, key={bool(api_key)}, secret={bool(api_secret)}")
        raise HTTPException(status_code=500, detail="Cloudinary not configured")
    
    # Re-configure cloudinary with stripped values
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    
    ALLOWED_FOLDERS = ["calius", "templates", "portfolio", "blog", "users", "settings", "uploads"]
    if folder not in ALLOWED_FOLDERS:
        raise HTTPException(status_code=400, detail=f"Invalid folder: {folder}")
    
    # Check file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")
    
    # Check file size (max 10MB)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    try:
        # Upload to Cloudinary
        import io
        result = cloudinary.uploader.upload(
            io.BytesIO(contents),
            folder=f"calius/{folder}",
            resource_type="image"
        )
        return {
            "success": True,
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "width": result.get("width"),
            "height": result.get("height")
        }
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ==================== PAYMENT ROUTES ====================

@api_router.post("/payments/create-token")
async def create_payment_token(request: PaymentRequest):
    try:
        import midtransclient
        
        if not MIDTRANS_SERVER_KEY:
            raise HTTPException(status_code=500, detail="Midtrans not configured")
        
        snap = midtransclient.Snap(
            is_production=MIDTRANS_IS_PRODUCTION,
            server_key=MIDTRANS_SERVER_KEY,
            client_key=MIDTRANS_CLIENT_KEY
        )
        
        payment_params = {
            "transaction_details": {
                "order_id": request.order_id,
                "gross_amount": request.gross_amount
            },
            "customer_details": {
                "email": request.customer_email,
                "first_name": request.customer_name,
                "phone": request.customer_phone or ""
            },
            "item_details": request.item_details,
            "credit_card": {"secure": True}
        }
        
        transaction = snap.create_transaction(payment_params)
        
        tx_record = {
            "order_id": request.order_id,
            "gross_amount": request.gross_amount,
            "customer_email": request.customer_email,
            "customer_name": request.customer_name,
            "snap_token": transaction.get("token"),
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "item_details": request.item_details
        }
        await db.transactions.insert_one(tx_record)
        
        return {
            "token": transaction.get("token"),
            "redirect_url": transaction.get("redirect_url"),
            "order_id": request.order_id
        }
    except Exception as e:
        logger.error(f"Payment error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/payments/status/{order_id}")
async def get_payment_status(order_id: str):
    tx = await db.transactions.find_one({"order_id": order_id}, {"_id": 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return tx

@api_router.post("/webhooks/midtrans")
async def handle_midtrans_webhook(request: Request):
    try:
        body = await request.json()
        order_id = body.get("order_id")
        status_code = body.get("status_code")
        gross_amount = str(int(float(body.get("gross_amount", 0))))
        signature_key = body.get("signature_key")
        
        signature_string = f"{order_id}{status_code}{gross_amount}{MIDTRANS_SERVER_KEY}"
        expected_signature = hashlib.sha512(signature_string.encode()).hexdigest()
        
        if not hmac.compare_digest(expected_signature, signature_key or ""):
            return {"status": "unauthorized"}
        
        transaction_status = body.get("transaction_status")
        status_map = {
            "settlement": "success",
            "capture": "success",
            "pending": "pending",
            "deny": "failed",
            "cancel": "cancelled",
            "expire": "expired"
        }
        
        app_status = status_map.get(transaction_status, "unknown")
        
        await db.transactions.update_one(
            {"order_id": order_id},
            {"$set": {
                "status": app_status,
                "transaction_status": transaction_status,
                "payment_type": body.get("payment_type"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        # Send email notifications for successful payments
        if app_status == "success":
            # Get full order data from DB
            order_data = await db.transactions.find_one({"order_id": order_id}, {"_id": 0})
            if order_data:
                # Send email to admin
                asyncio.create_task(send_order_notification_email(order_data))
                # Send confirmation email to customer
                asyncio.create_task(send_customer_confirmation_email(order_data))
                logger.info(f"Email notifications triggered for order {order_id}")
        
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return {"status": "error", "message": str(e)}

@api_router.get("/config/midtrans")
async def get_midtrans_config():
    return {
        "client_key": MIDTRANS_CLIENT_KEY,
        "is_production": MIDTRANS_IS_PRODUCTION
    }

# ==================== DEFAULT DATA ====================

def get_default_services():
    return [
        {"id": "1", "slug": "company-profile", "name_id": "Website Company Profile", "name_en": "Company Profile Website", "description_id": "Website profesional untuk menampilkan profil perusahaan, layanan, dan portofolio bisnis Anda.", "description_en": "Professional website to showcase your company profile, services, and business portfolio.", "icon": "Building2", "features": ["Responsive Design", "SEO Optimized", "Contact Form", "Google Maps", "Social Media Integration"], "price_start": 3500000, "order": 1},
        {"id": "2", "slug": "e-commerce", "name_id": "Website E-Commerce", "name_en": "E-Commerce Website", "description_id": "Toko online lengkap dengan keranjang belanja, payment gateway, dan manajemen produk.", "description_en": "Complete online store with shopping cart, payment gateway, and product management.", "icon": "ShoppingCart", "features": ["Product Catalog", "Shopping Cart", "Payment Gateway", "Order Management", "Inventory System"], "price_start": 8500000, "order": 2},
        {"id": "3", "slug": "landing-page", "name_id": "Landing Page", "name_en": "Landing Page", "description_id": "Halaman landing yang dioptimalkan untuk konversi tinggi dan kampanye marketing.", "description_en": "High-converting landing page optimized for marketing campaigns.", "icon": "Rocket", "features": ["High Conversion Design", "A/B Testing Ready", "Lead Capture Form", "Analytics Integration", "Fast Loading"], "price_start": 2500000, "order": 3},
        {"id": "4", "slug": "custom-web-app", "name_id": "Custom Web Application", "name_en": "Custom Web Application", "description_id": "Aplikasi web custom sesuai kebutuhan bisnis Anda dengan fitur-fitur khusus.", "description_en": "Custom web application tailored to your business needs with special features.", "icon": "Code2", "features": ["Custom Features", "API Integration", "Admin Dashboard", "User Management", "Scalable Architecture"], "price_start": 15000000, "order": 4}
    ]

def get_default_templates():
    return [
        {"id": "1", "slug": "corporate-pro", "name": "Corporate Pro Business", "category": "business", "price": 750000, "sale_price": None, "description_id": "Template bisnis korporat profesional dengan desain modern.", "description_en": "Professional corporate business template with modern design.", "features": ["Responsive Design", "SEO Optimized", "Contact Form", "12 Pages"], "technologies": ["HTML5", "CSS3", "JavaScript", "Bootstrap 5"], "demo_url": "https://demo.calius.digital/corporate-pro", "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", "images": [], "downloads": 150, "rating": 4.9, "is_featured": True, "is_bestseller": False, "is_new": True},
        {"id": "2", "slug": "shopmax-ecommerce", "name": "ShopMax E-Commerce", "category": "ecommerce", "price": 1200000, "sale_price": 950000, "description_id": "Solusi e-commerce lengkap dengan keranjang belanja dan checkout.", "description_en": "Complete e-commerce solution with shopping cart and checkout.", "features": ["Product Catalog", "Shopping Cart", "Checkout System", "18 Pages"], "technologies": ["HTML5", "CSS3", "JavaScript", "Vue.js"], "demo_url": "https://demo.calius.digital/shopmax", "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", "images": [], "downloads": 280, "rating": 4.8, "is_featured": True, "is_bestseller": True, "is_new": False},
        {"id": "3", "slug": "creative-portfolio", "name": "Creative Portfolio Pro", "category": "portfolio", "price": 600000, "sale_price": None, "description_id": "Template portfolio kreatif untuk desainer dan fotografer.", "description_en": "Creative portfolio template for designers and photographers.", "features": ["Gallery Layouts", "Project Showcase", "Smooth Animations", "8 Pages"], "technologies": ["HTML5", "CSS3", "JavaScript", "GSAP"], "demo_url": "https://demo.calius.digital/portfolio", "image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800", "images": [], "downloads": 95, "rating": 5.0, "is_featured": True, "is_bestseller": False, "is_new": True},
        {"id": "4", "slug": "launchpad-landing", "name": "LaunchPad Landing Page", "category": "landing-page", "price": 450000, "sale_price": 350000, "description_id": "Landing page konversi tinggi untuk peluncuran produk.", "description_en": "High-converting landing page for product launches.", "features": ["Lead Capture", "Countdown Timer", "Pricing Tables", "1 Page"], "technologies": ["HTML5", "CSS3", "JavaScript", "Tailwind CSS"], "demo_url": "https://demo.calius.digital/launchpad", "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", "images": [], "downloads": 320, "rating": 4.7, "is_featured": False, "is_bestseller": True, "is_new": False},
        {"id": "5", "slug": "delicious-restaurant", "name": "Delicious Restaurant", "category": "restaurant", "price": 700000, "sale_price": None, "description_id": "Template restoran dengan menu online dan sistem reservasi.", "description_en": "Restaurant template with online menu and reservation system.", "features": ["Menu System", "Reservation Form", "Gallery", "10 Pages"], "technologies": ["HTML5", "CSS3", "JavaScript", "Bootstrap 5"], "demo_url": "https://demo.calius.digital/restaurant", "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", "images": [], "downloads": 75, "rating": 4.9, "is_featured": True, "is_bestseller": False, "is_new": True}
    ]

def get_default_portfolio():
    return [
        {"id": "1", "title": "TechCorp Website", "client": "TechCorp Indonesia", "category": "company-profile", "description_id": "Website company profile modern untuk perusahaan teknologi.", "description_en": "Modern company profile website for technology company.", "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", "images": [], "url": "https://techcorp.id", "technologies": ["React", "Node.js", "MongoDB"], "year": 2024, "is_featured": True},
        {"id": "2", "title": "FashionHub Store", "client": "FashionHub", "category": "e-commerce", "description_id": "Platform e-commerce fashion dengan 500+ produk.", "description_en": "Fashion e-commerce platform with 500+ products.", "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", "images": [], "url": "https://fashionhub.co.id", "technologies": ["Next.js", "Stripe", "PostgreSQL"], "year": 2024, "is_featured": True},
        {"id": "3", "title": "StartupX Landing", "client": "StartupX", "category": "landing-page", "description_id": "Landing page untuk peluncuran aplikasi startup.", "description_en": "Landing page for startup app launch.", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800", "images": [], "url": "https://startupx.io", "technologies": ["React", "Tailwind CSS", "Framer Motion"], "year": 2024, "is_featured": True},
        {"id": "4", "title": "Resto Nusantara", "client": "Resto Nusantara", "category": "restaurant", "description_id": "Website restoran dengan sistem reservasi online.", "description_en": "Restaurant website with online reservation system.", "image": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800", "images": [], "url": "https://restonusantara.com", "technologies": ["Vue.js", "Laravel", "MySQL"], "year": 2023, "is_featured": False}
    ]

def get_default_testimonials():
    return [
        {"id": "1", "name": "Ahmad Rizki", "role": "CEO", "company": "TechCorp Indonesia", "content_id": "Calius Digital membantu kami membangun website yang profesional dan cepat. Hasilnya luar biasa!", "content_en": "Calius Digital helped us build a professional and fast website. The result is amazing!", "avatar": None, "rating": 5},
        {"id": "2", "name": "Sarah Wijaya", "role": "Marketing Director", "company": "FashionHub", "content_id": "Tim yang sangat responsif dan hasil kerjanya melampaui ekspektasi kami.", "content_en": "Very responsive team and their work exceeded our expectations.", "avatar": None, "rating": 5},
        {"id": "3", "name": "Budi Santoso", "role": "Founder", "company": "StartupX", "content_id": "Landing page yang dibuat sangat membantu meningkatkan konversi campaign kami hingga 40%.", "content_en": "The landing page they created helped increase our campaign conversion by 40%.", "avatar": None, "rating": 5}
    ]

def get_default_blog_posts():
    return [
        {"id": "1", "slug": "tips-memilih-template-website", "title_id": "Tips Memilih Template Website yang Tepat", "title_en": "Tips for Choosing the Right Website Template", "excerpt_id": "Panduan lengkap memilih template website yang sesuai dengan kebutuhan bisnis Anda.", "excerpt_en": "Complete guide to choosing a website template that fits your business needs.", "content_id": "Template website adalah...", "content_en": "A website template is...", "image": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800", "author": "Calius Team", "category": "tips", "tags": ["template", "website", "tips"], "published_at": "2024-01-15", "read_time": 5},
        {"id": "2", "slug": "pentingnya-website-untuk-bisnis", "title_id": "Pentingnya Website untuk Bisnis di Era Digital", "title_en": "The Importance of Website for Business in Digital Era", "excerpt_id": "Mengapa setiap bisnis membutuhkan website profesional di tahun 2024.", "excerpt_en": "Why every business needs a professional website in 2024.", "content_id": "Di era digital...", "content_en": "In the digital era...", "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", "author": "Calius Team", "category": "business", "tags": ["business", "website", "digital"], "published_at": "2024-01-10", "read_time": 7}
    ]

def get_default_pricing():
    return [
        {"id": "1", "name_id": "Starter", "name_en": "Starter", "description_id": "Cocok untuk bisnis kecil yang baru mulai", "description_en": "Perfect for small businesses just starting out", "price": 3500000, "price_note_id": "Pembayaran sekali", "price_note_en": "One-time payment", "features": [{"text_id": "5 Halaman Website", "text_en": "5 Website Pages", "included": True}, {"text_id": "Responsive Design", "text_en": "Responsive Design", "included": True}, {"text_id": "Contact Form", "text_en": "Contact Form", "included": True}, {"text_id": "SEO Basic", "text_en": "Basic SEO", "included": True}, {"text_id": "1 Bulan Support", "text_en": "1 Month Support", "included": True}, {"text_id": "Custom Features", "text_en": "Custom Features", "included": False}, {"text_id": "E-commerce", "text_en": "E-commerce", "included": False}], "is_popular": False, "order": 1},
        {"id": "2", "name_id": "Professional", "name_en": "Professional", "description_id": "Untuk bisnis yang ingin berkembang", "description_en": "For businesses looking to grow", "price": 7500000, "price_note_id": "Pembayaran sekali", "price_note_en": "One-time payment", "features": [{"text_id": "10 Halaman Website", "text_en": "10 Website Pages", "included": True}, {"text_id": "Responsive Design", "text_en": "Responsive Design", "included": True}, {"text_id": "Contact Form", "text_en": "Contact Form", "included": True}, {"text_id": "SEO Advanced", "text_en": "Advanced SEO", "included": True}, {"text_id": "3 Bulan Support", "text_en": "3 Months Support", "included": True}, {"text_id": "Custom Features", "text_en": "Custom Features", "included": True}, {"text_id": "E-commerce", "text_en": "E-commerce", "included": False}], "is_popular": True, "order": 2},
        {"id": "3", "name_id": "Enterprise", "name_en": "Enterprise", "description_id": "Solusi lengkap untuk bisnis besar", "description_en": "Complete solution for large businesses", "price": 15000000, "price_note_id": "Pembayaran sekali", "price_note_en": "One-time payment", "features": [{"text_id": "Unlimited Halaman", "text_en": "Unlimited Pages", "included": True}, {"text_id": "Responsive Design", "text_en": "Responsive Design", "included": True}, {"text_id": "Contact Form", "text_en": "Contact Form", "included": True}, {"text_id": "SEO Premium", "text_en": "Premium SEO", "included": True}, {"text_id": "6 Bulan Support", "text_en": "6 Months Support", "included": True}, {"text_id": "Custom Features", "text_en": "Custom Features", "included": True}, {"text_id": "E-commerce", "text_en": "E-commerce", "included": True}], "is_popular": False, "order": 3}
    ]

# ==================== SITE SETTINGS MODEL ====================
class SiteSettings(BaseModel):
    site_name: str = "Calius Digital"
    tagline_id: str = "Wujudkan Website Impian Bisnis Anda"
    tagline_en: str = "Build Your Dream Business Website"
    description_id: str = "Kami membantu bisnis Anda tampil profesional di dunia digital dengan website berkualitas tinggi dan template premium."
    description_en: str = "We help your business look professional in the digital world with high-quality websites and premium templates."
    logo_url: str = ""
    favicon_url: str = ""
    meta_title: str = "Calius Digital - Web Agency Profesional"
    meta_description: str = "Jasa pembuatan website profesional dan template premium untuk bisnis Anda."
    meta_keywords: str = "website, template, web development, digital agency"
    og_image: str = ""
    contact_email: str = ""
    contact_phone: str = ""
    contact_whatsapp: str = ""
    address: str = ""
    social_facebook: str = ""
    social_instagram: str = ""
    social_twitter: str = ""
    social_linkedin: str = ""
    social_youtube: str = ""


# ==================== SITE SETTINGS ENDPOINTS ====================
@api_router.get("/settings")
async def get_site_settings():
    settings = await db.site_settings.find_one({"_id": "site_settings"})
    if settings:
        settings.pop("_id", None)
        return settings
    # Return default settings
    default = SiteSettings()
    return default.model_dump()

@api_router.put("/settings")
async def update_site_settings(settings: SiteSettings, current_user: dict = Depends(require_admin)):
    settings_dict = settings.model_dump()
    await db.site_settings.update_one(
        {"_id": "site_settings"},
        {"$set": settings_dict},
        upsert=True
    )
    return {"message": "Settings updated successfully", "settings": settings_dict}

# ==================== DYNAMIC SITEMAP ====================
@app.get("/sitemap.xml")
async def generate_sitemap():
    from datetime import datetime
    base_url = "https://calius.digital"
    
    # Get all blog posts
    blogs = []
    async for blog in db.blog.find({"status": "published"}).sort("createdAt", -1):
        blog["_id"] = str(blog["_id"])
        blogs.append(blog)
    
    # Get all templates  
    templates = []
    async for template in db.templates.find({}).sort("createdAt", -1):
        template["_id"] = str(template["_id"])
        templates.append(template)
    
    # Get all portfolio items
    portfolio = []
    async for item in db.portfolio.find({}).sort("createdAt", -1):
        item["_id"] = str(item["_id"])
        portfolio.append(item)
    
    # Build sitemap XML
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Static pages
    static_pages = [
        {"url": "/", "priority": "1.0", "changefreq": "daily"},
        {"url": "/about", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/contact", "priority": "0.8", "changefreq": "monthly"},
        {"url": "/portfolio", "priority": "0.9", "changefreq": "weekly"},
        {"url": "/templates", "priority": "0.9", "changefreq": "weekly"},
        {"url": "/blog", "priority": "0.9", "changefreq": "daily"},
        {"url": "/pricing", "priority": "0.8", "changefreq": "weekly"},
        {"url": "/privacy-policy", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/terms-of-service", "priority": "0.3", "changefreq": "yearly"},
    ]
    
    for page in static_pages:
        sitemap += f'  <url>\n'
        sitemap += f'    <loc>{base_url}{page["url"]}</loc>\n'
        sitemap += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
        sitemap += f'    <priority>{page["priority"]}</priority>\n'
        sitemap += f'  </url>\n'
    
    # Blog posts
    for blog in blogs:
        slug = blog.get("slug", blog.get("_id"))
        updated = blog.get("updatedAt") or blog.get("createdAt") or datetime.now().isoformat()
        if isinstance(updated, datetime):
            updated = updated.strftime("%Y-%m-%d")
        elif isinstance(updated, str) and "T" in updated:
            updated = updated.split("T")[0]
        sitemap += f'  <url>\n'
        sitemap += f'    <loc>{base_url}/blog/{slug}</loc>\n'
        sitemap += f'    <lastmod>{updated}</lastmod>\n'
        sitemap += f'    <changefreq>monthly</changefreq>\n'
        sitemap += f'    <priority>0.7</priority>\n'
        sitemap += f'  </url>\n'
    
    # Templates
    for template in templates:
        slug = template.get("slug", template.get("_id"))
        sitemap += f'  <url>\n'
        sitemap += f'    <loc>{base_url}/template/{slug}</loc>\n'
        sitemap += f'    <changefreq>monthly</changefreq>\n'
        sitemap += f'    <priority>0.7</priority>\n'
        sitemap += f'  </url>\n'
    
    # Portfolio items
    for item in portfolio:
        slug = item.get("slug", item.get("_id"))
        sitemap += f'  <url>\n'
        sitemap += f'    <loc>{base_url}/portfolio/{slug}</loc>\n'
        sitemap += f'    <changefreq>monthly</changefreq>\n'
        sitemap += f'    <priority>0.6</priority>\n'
        sitemap += f'  </url>\n'
    
    sitemap += '</urlset>'
    
    from fastapi.responses import Response
    return Response(content=sitemap, media_type="application/xml")



# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

