const https = require("https");
const { Client } = require("pg");

// Reuse the connection for warm invocations
let client;

exports.fetchAndUpload = async (event, context) => {
  if (!client) {
    const dsn = process.env.POSTGRES_URL;
    if (!dsn) {
      throw new Error("No DSN found in environment variables");
    }

    client = new Client({
      connectionString: dsn,
    });

    await client.connect();
  }

  // Get the API key from environment variables
  const apiKey = process.env.coin_exchange_api_key;
  if (!apiKey) {
    throw new Error("No API key found in environment variables");
  }

  // Make the API request
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

  const fetchData = (url) => {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            resolve(JSON.parse(data));
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };

  const data = await fetchData(apiUrl);

  // Insert or update data into PostgreSQL
  const insertQuery = `
    INSERT INTO Currencies (symbol, "usdPrice", "createdAt", "updatedAt") 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (symbol) DO UPDATE 
    SET "usdPrice" = EXCLUDED."usdPrice", 
        "updatedAt" = EXCLUDED."updatedAt";
    `;

  const conversionRates = data.conversion_rates;
  const now = new Date();

  for (const [symbol, usdPrice] of Object.entries(conversionRates)) {
    await client.query(insertQuery, [symbol, usdPrice, now, now]);
  }

  return {
    statusCode: 200,
    body: "Currencies updated successfully!",
  };
};
