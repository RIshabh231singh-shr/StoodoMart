const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const redisClient = require("./config/redis");

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

app.use("/person",  authRouter);
app.use("/product", productRouter);
app.use("/order",   orderRouter);


const startServer = async () => {
  try {
    // connect MongoDB first
    await connectDB();
    // connect Redis second
    await redisClient.connect()
    .then(()=> console.log("Redis connected"))
    .catch((err) => console.log("Redis connection error:", err));

    // start server last
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("Server start failed:", error);
  }
};

startServer();
