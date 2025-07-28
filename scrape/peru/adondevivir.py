from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd
import time

def get_location_slug(location):
    """Formats the location string into a URL-friendly slug."""
    parts = [part.strip().lower().replace(" ", "-") for part in location.split(',')]
    if len(parts) == 2 and "lima" in parts[1]:
        # Handle Lima districts, e.g., "Miraflores, Lima" -> "miraflores--lima--lima"
        return f"{parts[0]}--lima--lima"
    else:
        # Handle single locations like "Cusco"
        return parts[0]

def scrape_adondevivir(location):
    """Scrapes property data from AdondeVivir.com using Selenium."""
    
    properties = []
    property_types = ["casas", "departamentos"]

    for prop_type in property_types:
        location_slug = get_location_slug(location)
        url = f"https://www.adondevivir.com/buscar/venta-de-{prop_type}-en-{location_slug}"
        
        print(f"Scraping AdondeVivir.com for {prop_type} in {location}: {url}")

        # Set up Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

        try:
            # Set up the WebDriver
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            
            driver.get(url)
            time.sleep(5)  # Wait for the page to load

            soup = BeautifulSoup(driver.page_source, "html.parser")
            driver.quit()

        except Exception as e:
            print(f"An error occurred: {e}")
            if 'driver' in locals():
                driver.quit()
            continue

        # This is a placeholder for the actual scraping logic.
        # We will refine this based on the actual HTML structure of AdondeVivir.com
        listings = soup.find_all("div", {"data-qa": "posting-card"})

        if not listings:
            print(f"No listings found on AdondeVivir.com for {prop_type} in {location}.")
            continue

        for listing in listings:
            try:
                title_element = listing.find("h2", {"data-qa": "POSTING_CARD_TITLE"})
                title = title_element.text.strip() if title_element else "N/A"
                
                # ... extract other fields ...
                
                properties.append({
                    "title": title,
                    # ... add other fields ...
                    "source": "adondevivir.com"
                })
            except AttributeError as e:
                print(f"Error parsing a listing: {e}")
                continue

    return properties

if __name__ == "__main__":
    # This allows you to run the scraper directly for testing
    test_location = "Miraflores, Lima"
    scraped_data = scrape_adondevivir(test_location)
    if scraped_data:
        df = pd.DataFrame(scraped_data)
        print(df)
