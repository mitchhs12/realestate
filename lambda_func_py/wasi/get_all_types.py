import json

import requests


def run_main():
    # API endpoint
    url = "https://api.wasi.co/v1/property-type/all"
    
    # Credentials
    company_id = 17076208
    wasi_token = "ZPI4_jTau_z6aj_nzxn"

    # Parameters for the GET request
    params = {
        "id_company": company_id,
        "wasi_token": wasi_token,
    }
    
    # Make the request
    response = requests.get(url, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the response JSON
        response_data = response.json()
        
        # Create a new dictionary with 'id_property_type' as key and 'name' as value
        property_type_dict = {
            value['id_property_type']: value['name']
            for key, value in response_data.items()
            if isinstance(value, dict) and 'id_property_type' in value and 'name' in value
        }
        
        # Print the resulting dictionary
        print(property_type_dict)
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")

if __name__ == "__main__":
    run_main()
