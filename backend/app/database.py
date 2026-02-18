import os
import motor.motor_asyncio
from dotenv import load_dotenv

import certifi

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DB_NAME = os.getenv("DB_NAME", "userform_db")

if not MONGODB_URL:
    raise ValueError("No MONGODB_URL found in environment variables")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL, tlsCAFile=certifi.where())
database = client[DB_NAME]
applicants_collection = database.get_collection("applicants")
