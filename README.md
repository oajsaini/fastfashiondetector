# Amazon Fashion Brand Scraper

A Python script that uses BeautifulSoup to scrape Amazon for fashion brands on the first page of search results.

## Features

- Searches Amazon for "fashion" products
- Extracts brand names from product listings
- Cleans and filters brand names
- Saves results to JSON file
- Handles common scraping challenges

## Requirements

- Python 3.7 or higher
- Internet connection

## Installation

1. Clone or download this repository
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Run the script:

```bash
python amazon_fashion_scraper.py
```

The script will:
1. Navigate to Amazon and search for "fashion"
2. Extract brand names from the first page of results
3. Display the found brands in the console
4. Save results to `fashion_brands.json`

## Output

The script generates two types of output:

1. **Console output**: Lists all found brands with numbering
2. **JSON file**: Contains structured data including:
   - Search query
   - Total number of brands
   - List of brand names
   - Timestamp

## Troubleshooting

If the script doesn't find brands:

1. **Check your internet connection**
2. **Amazon may have blocked the request** - Try running again later
3. **HTML structure may have changed** - The selectors may need updating
4. **Rate limiting** - Amazon may be blocking requests due to frequency

## Customization

You can modify the script to:
- Search for different terms by changing the query in `scrape_fashion_brands()`
- Adjust the brand name cleaning logic in `clean_brand_name()`
- Add more CSS selectors in `extract_brands()` if Amazon's structure changes

## Dependencies

- `requests`: For making HTTP requests
- `beautifulsoup4`: For parsing HTML
- `lxml`: XML/HTML parser backend for BeautifulSoup 
