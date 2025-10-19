// WiP: Work in Progress

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
  let product_rating = {
    count: 0,
    score_1: 0,
    score_2: 0,
    score_3: 0,
    score_4: 0,
    score_5: 0,
  };
  try {
    // 2. Extract product_id from query parameters
    const internal_id = event.queryStringParameters?.internal_id;

    // 3. Validate that product_id was provided
    if (!internal_id) {
      let error_message = 'Please provide ';
      if (!internal_id) {
        error_message += 'internal_id, ';
      }
      console.log(internal_id);

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required parameter',
          message: `${error_message}, as a query parameter (e.g., ?internal_id=684657414)`,
        }),
      };
    }
    // 4. Build the Judge.me API URL with the product_id
    const JUDGE_ME_API_URL = `https://api.judge.me/api/v1/reviews/count?api_token=${API_TOKEN}&shop_domain=${SHOP_DOMAIN}&product_id=${internal_id}`;
    // console.log('JUDGE_ME_API_URL);

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
    product_rating.count = data.count;
    console.log('--> ', product_rating);

    // Create an array of product_rating.count keys
    for (let i = 1; i <= 5; i++) {
      // 5. Make the request from the Netlify Function to the Judge.me API
      const response = await fetch(`${JUDGE_ME_API_URL}&rating=${i}`, {
        method: 'GET',
      });

      // 6. Check for a successful response from Judge.me
      if (!response.ok) {
        throw new Error(`Judge.me API error: ${response.statusText}`);
      }

      // 7. Get the JSON data
      const data = await response.json();
      // console.log(`count ${i} --> `, data);
      product_rating[`score_${i}`] = data.count;
    }

    // 8. Return the data to the client (your Shopify storefront)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(product_rating),
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
