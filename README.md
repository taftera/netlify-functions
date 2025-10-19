# Shopify to Judge.me Integration Functions

Netlify Functions to interact with Judge.me API for Shopify product reviews and data.

## Project Structure

```
pinging-judgeme/
├── netlify.toml
├── package.json
├── .gitignore
└── functions/
    ├── get-product-id.js      # Get Judge.me internal ID from Shopify product ID
    └── get-product-reviews.js # Get product reviews from Judge.me
```

## Setup

### 1. Environment Variables

Add these to your Netlify site's environment variables:

- `JUDGE_ME_PRIVATE_API_TOKEN` - Your Judge.me API token
- `SHOP_DOMAIN` - Your Shopify shop domain (e.g., `yourstore.myshopify.com`)

**Where to add:** Netlify Dashboard → Site Settings → Environment variables → Add variable

### 2. Deploy to Netlify

1. Push this repository to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will automatically detect and deploy the functions

### 3. Local Development (Optional)

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Test locally
# Product: PANTHER FLANNEL PAJAMA PANTS - BLACK
curl http://localhost:8888/.netlify/functions/get-product-id?product_id=6963251839027
curl http://localhost:8888/.netlify/functions/get-product-reviews?internal_id=706913212&per_page=10&page=1
```

---

## Functions

### 1. `get-product-id` - Get Judge.me Internal ID

Fetches the Judge.me internal product ID using a Shopify product ID.

**Endpoint:**

```
GET https://pinging-judgeme.netlify.app/.netlify/functions/get-product-id?product_id={shopify_product_id}
```

**Parameters:**

- `product_id` (required) - Shopify product ID

**Example Request:**

```bash
curl "https://pinging-judgeme.netlify.app/.netlify/functions/get-product-id?product_id=1104270388"
```

**Success Response (200):**

```json
684657414
```

**Error Responses:**

**Missing parameter (400):**

```json
{
  "error": "Missing required parameter",
  "message": "Please provide product_id as a query parameter (e.g., ?product_id=1104270388)"
}
```

**API Error (500):**

```json
{
  "error": "Failed to fetch product data from Judge.me",
  "details": "Error details here"
}
```

---

### 2. `get-product-reviews` - Get Product Reviews

Fetches product reviews from Judge.me using the internal product ID.

**Endpoint:**

```
GET https://pinging-judgeme.netlify.app/.netlify/functions/get-product-reviews?internal_id={judgeme_id}&per_page={count}&page={page_number}
```

**Parameters:**

- `internal_id` (required) - Judge.me internal product ID
- `per_page` (required) - Number of reviews per page
- `page` (required) - Page number (starts at 1)

**Example Request:**

```bash
curl "https://pinging-judgeme.netlify.app/.netlify/functions/get-product-reviews?internal_id=684657414&per_page=10&page=1"
```

**Success Response (200):**

```json
{
  "reviews": [
    {
      "id": 12345,
      "rating": 5,
      "title": "Great product!",
      "body": "Really happy with this purchase...",
      "created_at": "2024-01-15T10:30:00Z",
      "reviewer": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 10,
    "total_pages": 5
  }
}
```

**Error Responses:**

**Missing parameters (400):**

```json
{
  "error": "Missing required parameter",
  "message": "Please provide internal_id, per_page, page, as a query parameter (e.g., ?internal_id=684657414&per_page=10&page=1)"
}
```

**API Error (500):**

```json
{
  "error": "Failed to fetch product data from Judge.me",
  "details": "Error details here"
}
```

---

## Workflow Example

### Complete flow: Get product reviews from Shopify product ID

```javascript
// Step 1: Get Judge.me internal ID from Shopify product ID
const productId = '1104270388'; // Shopify product ID
const response1 = await fetch(
  `https://pinging-judgeme.netlify.app/.netlify/functions/get-product-id?product_id=${productId}`
);
const judgeMeId = await response1.json(); // e.g., 684657414

// Step 2: Use Judge.me ID to fetch reviews
const response2 = await fetch(
  `https://pinging-judgeme.netlify.app/.netlify/functions/get-product-reviews?internal_id=${judgeMeId}&per_page=10&page=1`
);
const reviews = await response2.json();
console.log(reviews);
```

---

## Testing with Postman

### Test 1: Get Product ID

1. Method: `GET`
2. URL: `https://pinging-judgeme.netlify.app/.netlify/functions/get-product-id?product_id=1104270388`
3. Expected: Returns Judge.me internal ID as a number

### Test 2: Get Reviews

1. Method: `GET`
2. URL: `https://pinging-judgeme.netlify.app/.netlify/functions/get-product-reviews?internal_id=684657414&per_page=10&page=1`
3. Expected: Returns reviews JSON object

---

## Troubleshooting

### Function not found

- Check that functions are deployed in Netlify Dashboard → Functions tab
- Verify `netlify.toml` has correct path: `functions = "functions"`

### Environment variables not working

- Ensure variables are set in Netlify Dashboard → Site Settings → Environment variables
- Redeploy after adding/changing environment variables

### CORS errors

- Functions already include CORS headers (`Access-Control-Allow-Origin: *`)
- If issues persist, check browser console for specific error messages

---

## Support

For issues or questions, check:

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Judge.me API Docs](https://judge.me/docs/api)
