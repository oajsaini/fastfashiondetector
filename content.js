// Amazon Sustainability Highlighter
// This script runs on Amazon pages to highlight products based on brand sustainability

// Sustainability database based on your rankings
const sustainabilityData = {
  // Ultra Fast Fashion / Drop-Ship (worst)
  worst: [
    'anrabess', 'aokosor', 'automet', 'chantomoo', 'chicgal', 'coofandy', 'dokotoo', 'enunube', 'evaless', 'eymuse', 'fisoew', 'funtour', 'gembera', 'kkj', 'lillusory', "linda's essentials", 'ofeefan', 'prettygarden', 'saloogoe', 'sampeel', 'sialois', 'tanming', 'trendy queen', 'vertvie', 'voch gala', 'wiholl', 'xieerduo', 'yocur', 'zeagoo', 'shein', 'romwe', 'zaful', 'prettylittlething', 'boohoo', 'missguided', 'fashion nova', 'zesica', 'astylish', 'kancystore', 'floerns', 'grace karin', 'ecowish', 'simplee', 'allegra k', 'cupshe', 'btfbm', 'kirundo', 'merokeety', 'vamjump', 'himosyber'
  ],

  // Basic Fast Fashion / Questionable (bad)
  bad: [
    'forever 21', 'rue21', 'papaya clothing', 'charlotte russe', 'wet seal', 'aeropostale', 'urban coco', 'milumia', 'asvivid', 'exlura', 'hybrid & company', 'romacci', 'tobeinstyle', "joe’s usa", 'joe boxer', 'basic editions', 'wild fable', 'no boundaries'
  ],

  // Mass Market / Mainstream (better)
  better: [
    'gap', 'old navy', 'banana republic', 'athleta', "levi’s", 'wrangler', 'lee', 'hanes', 'gildan', 'fruit of the loom', 'champion', 'columbia', 'carhartt', 'dickies', 'russell athletic', 'nautica', 'izod', 'jockey', 'under armour', 'adidas', 'nike', 'reebok', 'skechers', 'converse', 'vans', 'the north face', 'timberland'
  ],

  // Better / Recognized Sustainable (best)
  best: [
    'patagonia', 'prana', 'tentree', 'pact', 'alternative apparel', 'outerknown', 'people tree', "levi’s wellthread", 'ecoalf', 'thought clothing', 'boody', 'quince', 'pact organic'
  ]
};

// Function to get sustainability rating for a brand
function getSustainabilityRating(brandName) {
  const brand = brandName.toLowerCase().trim();
  if (sustainabilityData.worst.includes(brand)) {
    return 'worst';
  } else if (sustainabilityData.bad.includes(brand)) {
    return 'bad';
  } else if (sustainabilityData.better.includes(brand)) {
    return 'better';
  } else if (sustainabilityData.best.includes(brand)) {
    return 'best';
  }
  return 'unknown';
}

// Function to extract brand names from product cards
function extractBrands() {
  const brandElements = document.querySelectorAll('span.a-size-base-plus.a-color-base');
  const products = [];

  brandElements.forEach((element, index) => {
    const brandName = element.textContent.trim();
    const rating = getSustainabilityRating(brandName);

    // Find the product card container (the whole box)
    let productCard = element.closest('.s-result-item[data-asin]');
    if (productCard && brandName) {
      products.push({
        element: productCard,
        brand: brandName,
        rating: rating,
        index: index
      });
    }
  });

  return products;
}

// Function to apply sustainability highlighting
function applyHighlighting(products) {
  products.forEach(product => {
    const element = product.element;

    // Remove existing highlighting
    element.classList.remove('sustainability-worst', 'sustainability-bad', 'sustainability-better', 'sustainability-best');

    // Add appropriate highlighting class
    if (product.rating !== 'unknown') {
      element.classList.add(`sustainability-${product.rating}`);

      // Add a small badge with the rating
      addRatingBadge(element, product.rating, product.brand);
    }
  });
}

// Function to add a rating badge to product cards
function addRatingBadge(element, rating, brandName) {
  // Remove existing badges
  const existingBadge = element.querySelector('.sustainability-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  // Create new badge
  const badge = document.createElement('div');
  badge.className = 'sustainability-badge';
  badge.textContent = rating.toUpperCase();
  badge.title = `${brandName}: ${rating} sustainability rating`;

  // Position the badge
  element.style.position = 'relative';
  element.appendChild(badge);
}

// Function to initialize the highlighting
function initializeHighlighting() {
  // Wait for page to load
  setTimeout(() => {
    const products = extractBrands();
    applyHighlighting(products);
  }, 2000);
}

// Function to handle dynamic content loading
function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if new product cards were added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.querySelector && node.querySelector('span.a-size-base-plus.a-color-base')) {
              shouldUpdate = true;
            }
          }
        });
      }
    });

    if (shouldUpdate) {
      setTimeout(() => {
        const products = extractBrands();
        applyHighlighting(products);
      }, 1000);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeHighlighting();
    observePageChanges();
  });
} else {
  initializeHighlighting();
  observePageChanges();
}

// Re-initialize when navigating (for SPA behavior)
let currentUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== currentUrl) {
    currentUrl = url;
    setTimeout(initializeHighlighting, 1000);
  }
}).observe(document, { subtree: true, childList: true });

// Message handling for popup communication
let highlightingEnabled = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'toggleHighlighting':
      highlightingEnabled = !highlightingEnabled;

      if (highlightingEnabled) {
        // Re-enable highlighting
        const products = extractBrands();
        applyHighlighting(products);
        sendResponse({ active: true });
      } else {
        // Disable highlighting
        const highlightedElements = document.querySelectorAll('.sustainability-worst, .sustainability-bad, .sustainability-better, .sustainability-best');
        highlightedElements.forEach(element => {
          element.classList.remove('sustainability-worst', 'sustainability-bad', 'sustainability-better', 'sustainability-best');
        });

        // Remove badges
        const badges = document.querySelectorAll('.sustainability-badge');
        badges.forEach(badge => badge.remove());

        sendResponse({ active: false });
      }
      break;

    case 'getStatus':
      sendResponse({ active: highlightingEnabled });
      break;

    case 'showLegend':
      showLegendOnPage();
      sendResponse({ success: true });
      break;
  }

  return true; // Keep the message channel open for async response
});

// Function to show legend on the page
function showLegendOnPage() {
  // Remove existing legend
  const existingLegend = document.querySelector('.sustainability-legend');
  if (existingLegend) {
    existingLegend.remove();
    return;
  }

  // Create legend
  const legend = document.createElement('div');
  legend.className = 'sustainability-legend';
  legend.innerHTML = `
    <h3>Sustainability Ratings</h3>
    <div class="legend-item">
      <div class="legend-color best"></div>
      <span>Best - High sustainability</span>
    </div>
    <div class="legend-item">
      <div class="legend-color better"></div>
      <span>Better - Moderate sustainability</span>
    </div>
    <div class="legend-item">
      <div class="legend-color bad"></div>
      <span>Bad - Low sustainability</span>
    </div>
    <div class="legend-item">
      <div class="legend-color worst"></div>
      <span>Worst - Very low sustainability</span>
    </div>
    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
  `;

  document.body.appendChild(legend);
}