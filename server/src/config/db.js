const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    // Set DNS servers to Google and Cloudflare DNS to avoid querySrv ECONNREFUSED on some networks (e.g., Jio, Windows IPv6 setup)
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (dnsErr) {
      console.warn("Failed to set custom DNS servers:", dnsErr.message);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;