require("dotenv").config();

const axios = require("axios");
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => {
  axios.get("https://productr-assignment-for-internship.onrender.com")
    .then(() => console.log("🔄 Self-ping successful"))
    .catch(err => console.log("❌ Self-ping failed:", err.message));
}, 10 * 60 * 1000);