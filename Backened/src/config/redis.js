const { createClient } = require("redis");

const redisclient = createClient({
  username: "default",
  password: "ExqNrWZxDZxeN8BXqe19lAJqIZv0FzoR",
  socket: {
    host: "redis-17812.c80.us-east-1-2.ec2.cloud.redislabs.com",
    port: 17812,
  },
});

redisclient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

module.exports = redisclient;