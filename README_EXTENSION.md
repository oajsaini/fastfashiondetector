# Amazon Sustainability Highlighter - Chrome Extension

A Chrome extension that highlights Amazon products based on brand sustainability ratings, helping you make more environmentally conscious purchasing decisions.

## Features

- **Color-coded highlighting**: Products are highlighted with different colors based on brand sustainability
- **Real-time detection**: Works on Amazon search results and product pages
- **Dynamic updates**: Handles Amazon's dynamic content loading
- **Easy controls**: Toggle highlighting on/off via popup
- **Visual badges**: Small badges show sustainability ratings on each product

## Color Coding

- 🟢 **Green**: Best sustainability (e.g., Columbia)
- 🟡 **Yellow**: Better sustainability (e.g., Gildan, Hanes, Gap)
- 🟠 **Orange**: Bad sustainability (e.g., Linda's Essentials)
- 🔴 **Red**: Worst sustainability (e.g., Anrabess, Automet, etc.)

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download the extension files** to a folder on your computer
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"** and select the folder containing the extension files
5. **Pin the extension** to your toolbar for easy access

### Method 2: Install from Chrome Web Store (Future)

Once published, you'll be able to install directly from the Chrome Web Store.

## Usage

1. **Navigate to Amazon.com** (any page with products)
2. **Click the extension icon** in your toolbar to open the popup
3. **View the sustainability legend** to understand the color coding
4. **Browse products** - they will be automatically highlighted
5. **Use the controls** in the popup to:
   - Toggle highlighting on/off
   - Refresh the page
   - Show a legend overlay on the page

## Files Included

- `manifest.json` - Extension configuration
- `content.js` - Main script that runs on Amazon pages
- `styles.css` - Styling for highlights and badges
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `README_EXTENSION.md` - This file

## How It Works

1. **Brand Detection**: The extension scans Amazon pages for brand names using CSS selectors
2. **Rating Lookup**: Each brand is checked against a sustainability database
3. **Visual Highlighting**: Product cards are highlighted with colored borders and badges
4. **Dynamic Updates**: The extension monitors for new content and updates highlighting accordingly

## Sustainability Database

The extension includes a built-in database of brand sustainability ratings based on research and analysis. Brands are categorized as:

- **Best**: High sustainability practices
- **Better**: Moderate sustainability practices  
- **Bad**: Low sustainability practices
- **Worst**: Very low sustainability practices

## Troubleshooting

### Extension Not Working?
- Make sure you're on an Amazon.com page
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the page
- Check the browser console for any error messages

### No Highlights Appearing?
- Wait a few seconds for the page to fully load
- Scroll down to trigger dynamic content loading
- Check if you're on a supported Amazon page (search results, product listings)

### Performance Issues?
- The extension is designed to be lightweight
- If you experience slowdowns, try disabling the extension temporarily

## Development

### Adding New Brands
Edit the `sustainabilityData` object in `content.js` to add new brands and their ratings.

### Customizing Colors
Modify the CSS classes in `styles.css` to change the highlighting colors and effects.

### Updating Selectors
If Amazon changes their HTML structure, update the CSS selectors in `content.js`.

## Privacy

- The extension only runs on Amazon.com pages
- No data is collected or transmitted
- All processing happens locally in your browser
- No personal information is accessed

## Support

For issues or feature requests, please check the troubleshooting section above or create an issue in the project repository.

## License

This extension is provided as-is for educational and personal use. 