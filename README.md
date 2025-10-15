# Shopify to Judge.me Product Data Function

This Netlify Function fetches product data from Judge.me API based on a Shopify product ID.

## Project Structure

```
/your-netlify-project
├── netlify.toml
├── .gitignore
└── functions
    └── get-product-id.js
```

## Setup

1. **Environment Variables**  
   Add these to your Netlify site's environment variables:

   - `JUDGE_ME_PRIVATE_API_TOKEN` - Your Judge.me API token
   - `SHOP_DOMAIN` - Your Shopify shop domain (e.g., `yourstore.myshopify.com`)

2. **Deploy to Netlify**  
   Push this repository to your Git provider and connect it to Netlify.

## Usage

Make a GET request to your Netlify function with the `product_id` query parameter:

```
https://your-site.netlify.app/.netlify/functions/get-product-id?product_id=1104270388
```

### Example Response

```json
{
  "product": {
    "id": 684657414,
    "external_id": 6949717966899,
    "title": "KIDS GLOW IN THE DARK PANTHER HOODIE - BLACK",
    "handle": "kids-glow-in-the-dark-panther-hoodie-black",
    "in_store": true,
    "product_type": "Hoodies",
    "lowest_price": "45.0",
    "highest_price": "45.0",
    "image_url": "https://cdn.shopify.com/...",
    ...
  }
}
```

### Error Responses

**Missing product_id:**

```json
{
  "error": "Missing required parameter",
  "message": "Please provide product_id as a query parameter (e.g., ?product_id=1104270388)"
}
```

**API Error:**

```json
{
  "error": "Failed to fetch product data from Judge.me",
  "details": "Error details here"
}
```
