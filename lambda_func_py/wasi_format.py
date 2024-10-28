import json
import os

import psycopg2
import requests
from dotenv import load_dotenv
from psycopg2.extras import Json
from python_maps.map import viva_ideal_features, viva_ideal_types
from wasi.wasi_map import featuresMap, propertyTypeMapping

load_dotenv()


def get_currencies():
    dsn = os.getenv('POSTGRES_URL')
    if not dsn:
        raise ValueError("No DSN found in environment variables")

    print(f"Connecting to database with DSN: {dsn}")

    # Connect to PostgreSQL
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()

        # Execute the query to fetch currency data
        query = 'SELECT symbol, "usdPrice" FROM "currencies";'
        cursor.execute(query)

        # Fetch all results
        results = cursor.fetchall()

        # Process results into a list of dictionaries
        currencies = {row[0]: row[1] for row in results}

        return currencies

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Ensure the connection is closed
        if conn:
            cursor.close()
            conn.close()


# Database connection
def insert_property(new_property):
    try:
        # Connect to your postgres DB
        dsn = os.getenv('POSTGRES_URL')
        if not dsn:
            raise ValueError("No DSN found in environment variables")

        print(f"Connecting to database with DSN: {dsn}")

        # Connect to PostgreSQL
        conn = psycopg2.connect(dsn=dsn)

        # Create a cursor
        cur = conn.cursor()

        # Define the insert query with placeholders
        query = """
        INSERT INTO Homes (
            photos, "ownerId", title, description, address, municipality, "subRegion", 
            region, country, latitude, longitude, bedrooms, bathrooms, "areaSqm", 
            type, features, currency, price, "priceNegotiable", language, 
            "contactName", "contactEmail", "contactPhone", "listingFlowStep", source, 
            "listingType", "isDeleted", "isActive", "isComplete", "completedAt", "updatedAt"
        ) VALUES (
            %(photos)s, %(ownerId)s, %(title)s, %(description)s, %(address)s, %(municipality)s, 
            %(subRegion)s, %(region)s, %(country)s, %(latitude)s, %(longitude)s, %(bedrooms)s, 
            %(bathrooms)s, %(areaSqm)s, %(type)s, %(features)s, %(currency)s, %(price)s, 
            %(priceNegotiable)s, %(language)s, %(contactName)s, %(contactEmail)s, %(contactPhone)s, 
            %(listingFlowStep)s, %(source)s, %(listingType)s, %(isDeleted)s, %(isActive)s, 
            %(isComplete)s, %(completedAt)s, %(updatedAt)s
        );
        """

        # Execute the query with the new_property data
        cur.execute(query, new_property)

        # Commit the transaction
        conn.commit()

        print("Property inserted successfully!")

    except Exception as e:
        print("Error inserting property:", e)
    finally:
        # Close the cursor and connection
        cur.close()
        conn.close()

def get_address(long_lat_array):
    AWS_LOCATION_SERVICE_ENDPOINT = os.getenv("AWS_LOCATION_SERVICE_ENDPOINT")  # Replace with your AWS endpoint
    INDEX_NAME = os.getenv("AWS_LOCATION_INDEX_NAME")  # Replace with your index name
    API_KEY = os.getenv("AWS_MAPS_API_KEY")  # Replace with your API key
    language = "en"

    longitude, latitude = long_lat_array

    # Adjust latitude if it is out of range
    if latitude > 90:
        latitude = 90 - (latitude - 90)
    elif latitude < -90:
        latitude = -90 - (latitude + 90)

    # Adjust longitude if it is out of range
    if longitude > 180:
        longitude = longitude - 360
    elif longitude < -180:
        longitude = longitude + 360

    # Make the API request to AWS Location Service
    try:
        url = f"{AWS_LOCATION_SERVICE_ENDPOINT}/places/v0/indexes/{INDEX_NAME}/search/position?key={API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "Position": [longitude, latitude],
            "MaxResults": 1,
            "language": language
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an error for HTTP status codes 4xx/5xx

        full_response = response.json()
        if "Results" in full_response and full_response["Results"]:
            place = full_response["Results"][0]["Place"]
            return {
                "address": place.get("Label"),
                "municipality": place.get("Municipality"),
                "subRegion": place.get("SubRegion"),
                "region": place.get("Region"),
                "country": place.get("Country")
            }
        else:
            return {"error": "No results found"}
    except requests.RequestException as e:
        return {"error": str(e)}

# export const homeSchema = z.object({
#   id: z.number().int(),
#X   ownerId: z.string().trim().min(1, "Cannot be empty"),
#X   title: z.string().trim().min(1).nullable(), 
#X   description: z.string().trim().min(1).nullable(),
#X   address: z.string().optional().nullable(),
#X   municipality: z.string().optional().nullable(),
#X   subRegion: z.string().optional().nullable(),
#X   region: z.string().optional().nullable(),
#X   country: z.string().nullable(),
#X   latitude: z.number(),
#X   longitude: z.number(),
#X   type: z.array(z.string()),
#X   features: z.array(z.string()),
#X   bedrooms: z.number().int(),
#X   bathrooms: z.number().int(),
#X   livingrooms: z.number().int(),
#X   kitchens: z.number().int(),
#X   capacity: z.number().int(),
#X   photos: z.array(z.string()),
#X   price: z.number(),
#X   currency: z.string().nullable(),
#X   language: z.string().nullable(),
#X   priceUsd: z.number(),
#X   priceNegotiable: z.boolean(),
#X   contactName: z.string().nullable(),
#X   contactEmail: z.string().nullable(),
#X   contactPhone: z.string().nullable(),
#X   listingType: z.string().nullable(),
#X   areaSqm: z.number(),
#X   isActive: z.boolean(),
#X   isComplete: z.boolean(),
#X   completedAt: z.date().nullable(),
#X   listingFlowStep: z.number().min(0, "Cannot be empty"),
# });

def run_main():
    # load properties from all_properties.json
    with open("wasi/all_properties.json", "r") as json_file:
        all_properties = json.load(json_file)

    currencies = get_currencies()
    if not currencies:
        return

    properties_for_sale = [property for property in all_properties if property["for_sale"]]
    print(f"Total properties for sale: {len(properties_for_sale)}")

    address_info = get_address([float(all_properties[0]["longitude"]), float(all_properties[0]["latitude"])])
    # Format the first property in this format:

    photos = []
    for gallery in all_properties[0]["galleries"]:
        for key, image in gallery.items():
            if isinstance(image, dict):
                photos.append(image["url_original"])
            if len(photos) >= 10:
                break  # Stop once we have 10 images
        if len(photos) >= 10:
            break  # Stop if the limit is reached

    conversion_rate = currencies[all_properties[0]["iso_currency"]]
    print(conversion_rate)
    new_property = {
        "photos": photos,
        "ownerId": "cly4ycuwy000013zyqaazjjiq",
        "title": all_properties[0]["title"],
        "description": all_properties[0]["observations"],
        "address": all_properties[0]["address"],
        "latitude": float(all_properties[0]["latitude"]),
        "longitude": float(all_properties[0]["longitude"]),
        "bedrooms": int(all_properties[0]["bedrooms"]),
        "bathrooms": int(all_properties[0]["bathrooms"]),
        "address": address_info["address"],
        "municipality": address_info["municipality"],
        "subRegion": address_info["subRegion"],
        "region": address_info["region"],
        "country": address_info["country"],
        "latitude": all_properties[0]["latitude"],
        "longitude": all_properties[0]["longitude"],
        "areaSqm": float(all_properties[0]["area"]),
        "type": [viva_ideal_types[propertyTypeMapping[all_properties[0]["id_property_type"]]]],
        "features": [
                viva_ideal_features[featuresMap[feature["nombre"]]] 
                for feature in all_properties[0]["features"]["internal"] + all_properties[0]["features"]["external"]
                if featuresMap.get(feature["nombre"]) != "none"
            ],
        "currency": all_properties[0]['iso_currency'],
        "price": float(all_properties[0]["sale_price"]),
        "usdPrice": conversion_rate * float(all_properties[0]["sale_price"]),
        "priceNegotiable": False,
        "language": "es",
        "priceNegotiable": False,
        "contactName": all_properties[0]["user_data"]["first_name"] + " " + all_properties[0]["user_data"]["last_name"],
        "contactEmail": "ibra@ibragomez.com",
        "contactPhone": "+573001163462",
        "listingFlowStep": 14,
        "source": "wasi",
        "listingType": "standard",
        "isDeleted": False,
        "isActive": True,
        "isComplete": True,
        "completedAt": "2024-10-28T00:00:00.000Z",
        "createdAt": "2024-10-28T00:00:00.000Z",
        "updatedAt": "2024-10-28T00:00:00.000Z",
        }
    print(new_property)
    print('UPLOADING!')
    insert_property(new_property)

if __name__ == "__main__":
    run_main()
