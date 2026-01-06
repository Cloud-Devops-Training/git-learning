const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from GitHub Actions CI/CD!" });
});

module.exports = app;

// Run server only if executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
