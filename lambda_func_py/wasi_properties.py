company_id = 25428550
wasi_token = "0ukg_HwYU_v7DX_zhXc"

import requests


def run_main():
    # API endpoint
    url = "https://api.wasi.co/v1/property/search"
    
    # Credentials
    company_id = 25428550
    wasi_token = "0ukg_HwYU_v7DX_zhXc"
    
    # Parameters for the GET request
    params = {
        "id_company": company_id,
        "wasi_token": wasi_token
    }
    
    # Make the request
    response = requests.get(url, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Print the response
        print("Response:", response.json())
    else:
        # Print the error
        print(f"Request failed with status code {response.status_code}: {response.text}")


if __name__ == "__main__":
    run_main()
