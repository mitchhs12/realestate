import os
from datetime import datetime

import psycopg2
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

def fetch_and_upload(event, context):
    # Get the API key from environment variables
    api_key = os.getenv('coin_exchange_api_key')
    if not api_key:
        raise ValueError("No API key found in environment variables")

    # Make the API request
    api_url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/USD"
    response = requests.get(api_url)
    data = response.json()

    # Use POSTGRES_URL instead of POSTGRES_PRISMA_URL
    dsn = os.getenv('POSTGRES_URL')
    if not dsn:
        raise ValueError("No DSN found in environment variables")

    print(f"Connecting to database with DSN: {dsn}")

    # Connect to PostgreSQL
    conn = psycopg2.connect(dsn=dsn)
    cur = conn.cursor()

    # Insert or update data into PostgreSQL
    insert_query = """
    INSERT INTO Currencies (symbol, "usdPrice", "createdAt", "updatedAt") 
    VALUES (%s, %s, %s, %s)
    ON CONFLICT (symbol) DO UPDATE 
    SET "usdPrice" = EXCLUDED."usdPrice", 
        "updatedAt" = EXCLUDED."updatedAt";
    """    
    conversion_rates = data['conversion_rates']
    now = datetime.now()
    for symbol, usd_price in conversion_rates.items():
        cur.execute(insert_query, (symbol, usd_price, now, now))

    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'body': 'Currencies updated successfully!'
    }
