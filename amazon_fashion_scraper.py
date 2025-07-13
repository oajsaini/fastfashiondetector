#!/usr/bin/env python3
"""
Amazon Fashion Brand Scraper
This script navigates to Amazon, searches for 'fashion', and collects brand names from the first page of results.
"""

import requests
from bs4 import BeautifulSoup
import time
import random
import re
from urllib.parse import quote_plus
import json
import urllib3
import warnings
# Suppress SSL warnings when verify=False is used
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# NEW: Selenium imports
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import sys

class AmazonFashionScraper:
    def __init__(self):
        self.base_url = "https://www.amazon.com"
        self.search_url = f"{self.base_url}/s?k=fashion+clothing"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }

    def get_html_with_selenium(self, url):
        """Launch Chrome, navigate to the URL, and return the page HTML."""
        print(f"Launching browser and navigating to: {url}")
        chrome_options = Options()
        # chrome_options.add_argument('--headless')  # Run in headless mode
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument(f'user-agent={self.headers["User-Agent"]}')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option('excludeSwitches', ['enable-automation'])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # Specify Chrome binary path for macOS
        chrome_options.binary_location = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

        print("Setting up Chrome driver...")
        driver = webdriver.Chrome(options=chrome_options)
        print("Chrome driver created successfully!")
        try:
            print("Navigating to URL...")
            driver.get(url)
            print("Page loaded, waiting for content...")
            # Wait for search results to load
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'div.s-main-slot'))
            )
            print("Content loaded, waiting 2 more seconds...")
            time.sleep(2)  # Extra wait for dynamic content
            html = driver.page_source
            print("HTML extracted successfully!")
            # Save HTML to file for inspection
            with open("amazon_fashion_page.html", "w", encoding="utf-8") as f:
                f.write(html)
            print("Saved extracted HTML to amazon_fashion_page.html")
        except Exception as e:
            print(f"Error during browser automation: {e}")
            raise
        finally:
            print("Closing browser...")
            driver.quit()
        return html

    def search_amazon(self, query):
        """Use Selenium to get the HTML for the search query."""
        search_url = f"{self.base_url}/s?k={quote_plus(query)}"
        return self.get_html_with_selenium(search_url)

    def extract_brands(self, html_content):
        """Extract brand names from Amazon search results"""
        soup = BeautifulSoup(html_content, 'html.parser')
        brands = set()
        
        # Updated selectors based on current Amazon structure
        brand_selectors = [
            # Primary selector for brand names (current Amazon structure)
            'span.a-size-base-plus.a-color-base',
            # Alternative selector for brand names
            'h2 span.a-size-base-plus.a-color-base',
            # Fallback selector for any text in brand-like elements
            'span.a-size-base-plus',
        ]
        
        for selector in brand_selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(strip=True)
                if text and len(text) > 2:  # Filter out very short text
                    # Clean up the text
                    cleaned_text = self.clean_brand_name(text)
                    if cleaned_text:
                        brands.add(cleaned_text)
        
        return list(brands)
    
    def clean_brand_name(self, brand_text):
        """Clean and validate brand names"""
        # Remove common prefixes/suffixes
        brand_text = re.sub(r'^(Brand:|by\s+)', '', brand_text, flags=re.IGNORECASE)
        brand_text = brand_text.strip()
        
        # Remove common words that aren't brand names
        common_words = {
            'fashion', 'clothing', 'apparel', 'wear', 'style', 'trend', 'design', 'collection',
            'click', 'see', 'price', 'to', 'the', 'and', 'or', 'for', 'with', 'by', 'from',
            'amazon', 'choice', 'overall', 'pick', 'institute', 'costume', 'kyoto'
        }
        if brand_text.lower() in common_words:
            return None
        
        # Filter out phrases that contain multiple common words
        if len(brand_text.split()) > 3:
            return None
        
        # Filter out very short or very long names
        if len(brand_text) < 2 or len(brand_text) > 50:
            return None
        
        # Filter out names that are just numbers or have too many numbers
        if re.match(r'^[0-9]+$', brand_text) or re.search(r'[0-9]{2,}', brand_text):
            return None
        
        # Filter out names that are just punctuation or special characters
        if re.match(r'^[^a-zA-Z0-9\s]+$', brand_text):
            return None
        
        return brand_text.title()
    
    def scrape_fashion_brands(self):
        """Main method to scrape fashion brands from Amazon"""
        print("Starting Amazon Fashion Brand Scraper...")
        print("=" * 50)
        
        # Search for fashion clothing
        html_content = self.search_amazon("fashion clothing")
        
        if not html_content:
            print("Failed to retrieve search results.")
            return []
        
        # Extract brands
        brands = self.extract_brands(html_content)
        
        # Remove duplicates and sort
        unique_brands = sorted(list(set(brands)))
        
        print(f"\nFound {len(unique_brands)} unique brands:")
        print("-" * 30)
        
        for i, brand in enumerate(unique_brands, 1):
            print(f"{i:2d}. {brand}")
        
        return unique_brands
    
    def save_results(self, brands, filename="fashion_brands.json"):
        """Save results to a JSON file"""
        results = {
            "search_query": "fashion",
            "total_brands": len(brands),
            "brands": brands,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"\nResults saved to {filename}")

def main():
    """Main function to run the scraper"""
    scraper = AmazonFashionScraper()
    
    try:
        # If 'local' argument is passed, use the saved HTML file
        if len(sys.argv) > 1 and sys.argv[1] == 'local':
            print("Loading HTML from local file: amazon_fashion_page.html")
            with open("amazon_fashion_page.html", "r", encoding="utf-8") as f:
                html_content = f.read()
            brands = scraper.extract_brands(html_content)
        else:
            brands = scraper.scrape_fashion_brands()
        
        if brands:
            # Save results
            scraper.save_results(brands)
            print(f"\nSuccessfully scraped {len(brands)} fashion brands from Amazon!")
        else:
            print("\nNo brands found. This might be due to:")
            print("- Amazon's anti-bot measures")
            print("- Changes in Amazon's HTML structure")
            print("- Network connectivity issues")
            print("\nTry running the script again or check your internet connection.")
    
    except KeyboardInterrupt:
        print("\nScraping interrupted by user.")
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print("This might be due to Amazon's anti-bot measures or changes in their website structure.")

if __name__ == "__main__":
    main() 