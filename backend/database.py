# database.py
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "CRITICAL: Supabase environment variables are missing. Check your .env file."
    )

# Initialize and expose the database client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
