const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const redisClient = require("./config/redis");

console.log("DB_URL from env:", process.env.DB_URL);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

// Solve CORS issue
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const authRouter    = require("./routes/UserAuth");
const productRouter = require("./routes/productAuth");
const orderRouter   = require("./routes/orderAuth");
const cartRouter    = require("./routes/cartAuth");
const adminRequestRouter = require("./routes/adminRequestAuth");
const newsletterRouter   = require("./routes/newsletterAuth");

app.use("/person",  authRouter);
app.use("/product", productRouter);
app.use("/order",   orderRouter);
app.use("/cart",    cartRouter);
app.use("/admin-request", adminRequestRouter);
app.use("/newsletter",    newsletterRouter);


const startServer = async () => {
  try {
    // connect MongoDB first
    await connectDB();
    // connect Redis second
    await redisClient.connect()
      .then(() => console.log("Redis connected"))
      .catch((err) => console.log("Redis connection error:", err));

    // start server last
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server start failed:", error);
  }
};

startServer();
