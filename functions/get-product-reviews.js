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
    const internal_id = event.queryStringParameters?.internal_id;
    const per_page = event.queryStringParameters?.per_page;
    const page = event.queryStringParameters?.page;

    // 3. Validate that product_id was provided
    if (!internal_id || !per_page || !page) {
      let error_message = 'Please provide ';
      if (!internal_id) {
        error_message += 'internal_id, ';
      }
      if (!per_page) {
        error_message += 'per_page, ';
      }
      if (!page) {
        error_message += 'page, ';
      }
      console.log(internal_id, per_page, page);

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required parameter',
          message: `${error_message}, as a query parameter (e.g., ?internal_id=684657414&per_page=10&page=1)`,
        }),
      };
    }

    // 4. Build the Judge.me API URL with the product_id
    const JUDGE_ME_API_URL = `https://api.judge.me/api/v1/reviews?api_token=${API_TOKEN}&shop_domain=${SHOP_DOMAIN}&internal_id=${internal_id}&per_page=${per_page}&page=${page}`;
    // console.log(JUDGE_ME_API_URL);

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
