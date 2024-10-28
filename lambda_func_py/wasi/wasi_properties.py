import json

import requests


def run_main():
    # API endpoint
    url = "https://api.wasi.co/v1/property/search"
    
    # Credentials
    company_id = 17076208
    wasi_token = "ZPI4_jTau_z6aj_nzxn"
    
    # Pagination settings
    take = 100  # Maximum number of items per request
    skip = 0    # Offset to start fetching from
    all_properties = []

    while True:
        # Parameters for the GET request
        params = {
            "id_company": company_id,
            "wasi_token": wasi_token,
            "skip": skip,
            "take": take
        }
        
        # Make the request
        response = requests.get(url, params=params)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Parse the response JSON
            response_data = response.json()
            
            # Debug: Print the entire response to understand its structure
            print(f"Response data at skip {skip}: {response_data}")
            
            # Extract the total number of properties
            total_properties = response_data.get("total", 0)
            
            # Extract the properties from the response (ignoring the "total" key)
            properties = [value for key, value in response_data.items() if key.isdigit()]
            
            if not properties:
                # If no more properties are returned, break the loop
                print("No more properties found.")
                break
            
            # Add the properties to the list
            all_properties.extend(properties)
            
            # Update the skip value for the next batch
            skip += take
            print(f"Fetched {len(properties)} properties, total so far: {len(all_properties)}")
            
            # If the number of properties fetched so far is equal to or exceeds the total, stop the loop
            if len(all_properties) >= total_properties:
                break
        else:
            # Print the error
            print(f"Request failed with status code {response.status_code}: {response.text}")
            break

    # Save all the properties to a JSON file
    if all_properties:
        with open("all_properties.json", "w") as json_file:
            json.dump(all_properties, json_file, indent=4)
        print("All properties have been saved to 'all_properties.json'.")
    else:
        print("No properties were retrieved.")\
    

if __name__ == "__main__":
    run_main()
