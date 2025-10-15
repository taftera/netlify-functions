// Netlify Function to fetch Judge.me product data
const API_TOKEN = process.env.JUDGE_ME_PRIVATE_API_TOKEN;
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;

// The main handler function for your Netlify Function
exports.handler = async (event, context) => {
  // 1. Set the headers to allow *any* origin (your Shopify store) to access this function
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allows requests from any domain
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight request (OPTIONS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // 2. Extract product_id from query parameters
    const productId = event.queryStringParameters?.product_id;

    // 3. Validate that product_id was provided
    if (!productId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required parameter',
          message:
            'Please provide product_id as a query parameter (e.g., ?product_id=1104270388)',
        }),
      };
    }

    // 4. Build the Judge.me API URL with the product_id
    const JUDGE_ME_API_URL = `https://api.judge.me/api/v1/products/-1?api_token=${API_TOKEN}&shop_domain=${SHOP_DOMAIN}&external_id=${productId}`;

    // 5. Make the request from the Netlify Function to the Judge.me API
    const response = await fetch(JUDGE_ME_API_URL, {
      method: 'GET',
    });

    // 6. Check for a successful response from Judge.me
    if (!response.ok) {
      throw new Error(`Judge.me API error: ${response.statusText}`);
    }

    // 7. Get the JSON data
    const data = await response.json();

    // 8. Return the data to the client (your Shopify storefront)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch product data from Judge.me',
        details: error.message,
      }),
    };
  }
};
