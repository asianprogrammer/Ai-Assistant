exports.handler = async function(event, context) {
    const apiKey = process.env.MY_SECRET_API_KEY;
    return apiKey;
    // use fetch or axios to call external API
    const response = await fetch(`https://api.example.com/data?key=${apiKey}`);
    const data = await response.json();
  
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  };
  