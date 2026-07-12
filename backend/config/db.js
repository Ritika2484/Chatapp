const mongoose = require("mongoose");
const dns = require("dns");

/**
 * Force Node.js to use Google's public DNS (8.8.8.8 / 8.8.4.4).
 *
 * WHY: Windows may route Node's built-in dns.resolveSrv() through a DNS
 * server or network path that blocks SRV record queries (common with VPNs,
 * corporate firewalls, or some ISP routers), even though PowerShell's
 * Resolve-DnsName succeeds.  Setting servers explicitly to Google DNS fixes
 * the ECONNREFUSED / ENOTFOUND error for mongodb+srv:// URIs.
 */
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;