import os
import argparse
import pandas as pd

# Import your scraper functions here
from peru.urbania import scrape_urbania
from peru.adondevivir import scrape_adondevivir

# Define the locations to be scraped for each country
locations = {
    "peru": ["Miraflores, Lima", "Barranco, Lima", "San Isidro, Lima", "Cusco", "Arequipa", "Mancora"],
    # "ecuador": ["Cuenca", "Quito", "Salinas"], # Add other locations as you expand
}

# A dictionary to map country names to their scraper functions
scraper_map = {
    "peru": [scrape_urbania],
    # "ecuador": [scrape_century21, scrape_plusvalia], # Add other scrapers as they are created
}

# Define the headers for the CSV file based on the Prisma schema
headers = [
    "title", "description", "address", "municipality", "subRegion",
    "region", "country", "latitude", "longitude", "exactLocation",
    "type", "features", "bedrooms", "bathrooms", "livingrooms",
    "kitchens", "capacity", "photos", "price", "currency",
    "language", "priceUsd", "priceNegotiable", "areaSqm",
    "listingType", "contactName", "contactEmail", "contactPhone", "source"
]

def main(countries_to_scrape):
    """Main function to run all scrapers."""
    all_properties = []

    if not countries_to_scrape:
        # If no countries are specified, scrape all available
        countries_to_scrape = scraper_map.keys()

    for country in countries_to_scrape:
        if country in scraper_map and country in locations:
            print(f"Scraping {country.capitalize()} websites...")
            for location in locations[country]:
                for scraper_func in scraper_map[country]:
                    print(f"Running scraper: {scraper_func.__name__} for {location}")
                    properties = scraper_func(location)
                    if properties:
                        all_properties.extend(properties)
                        print(f"Found {len(properties)} properties in {location} on {scraper_func.__name__.split('_')[1]}")
        else:
            print(f"No scrapers or locations found for {country}. Skipping.")

    if not all_properties:
        print("No properties were scraped.")
        return

    # Create a DataFrame and save to CSV
    df = pd.DataFrame(all_properties, columns=headers)
    
    # Save to CSV at the root level
    output_path = os.path.join(os.path.dirname(__file__), '..', 'properties.csv')
    
    # Check if file exists to append or write new
    if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
        df.to_csv(output_path, index=False, mode='a', header=False)
    else:
        df.to_csv(output_path, index=False, header=True)
    
    print(f"Successfully scraped {len(all_properties)} properties.")
    print(f"Data saved to {os.path.abspath(output_path)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Web scraper for real estate websites.")
    parser.add_argument("countries", nargs='*', help="The country or countries to scrape (e.g., peru, ecuador). Scrapes all if not specified.")
    args = parser.parse_args()
    
    main(args.countries) 