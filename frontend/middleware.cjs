// Middleware for JSON Server
module.exports = (req, res, next) => {
  // Add CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  // Add timestamps to transactions
  if (req.method === "POST" && req.url.includes("/transactions")) {
    const now = new Date().toISOString();
    req.body.createdAt = now;
    req.body.updatedAt = now;
  }

  // Add updatedAt to PUT requests
  if (req.method === "PUT" && req.url.includes("/transactions")) {
    req.body.updatedAt = new Date().toISOString();
  }

  next();
};
