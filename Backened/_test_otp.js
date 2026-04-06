const axios = require('axios');
const redisClient = require('./src/config/redis'); // Use the actual app config!

async function runQuiz() {
    console.log("Connecting to Redis...");
    await redisClient.connect().catch(err => console.log("Did it connect already?", err.message));

    const email = "quiztest@example.com";
    const redisKey = `otp:${email}`;

    console.log("1. Triggering Send OTP...");
    try {
        const response1 = await axios.post('http://localhost:8000/person/send-otp', { email });
        console.log("Send OTP response:", response1.data);
    } catch (err) {
        console.error("Send OTP failed:", err.response ? err.response.data : err.message);
        process.exit(1);
    }

    console.log("\n2. Fetching OTP from Redis directly...");
    const storedOtp = await redisClient.get(redisKey);
    console.log(`Stored OTP found in Redis for key [${redisKey}]:`, storedOtp);

    if (!storedOtp) {
        console.error("FAILED: Redis returned null/undefined for the key just created!");
        process.exit(1);
    }

    console.log("\n3. Testing Registration with STRICT Match OTP...");
    try {
        const response2 = await axios.post('http://localhost:8000/person/register', {
            firstname: "Strict",
            lastname: "Match",
            email: email,
            contactNumber: "1234567890",
            college: "NIT Calicut",
            password: "Password123!",
            confirmPassword: "Password123!",
            role: "User",
            otp: storedOtp
        });
        console.log("Register response:", response2.data);
    } catch (err) {
        console.error("Register failed status:", err.response ? err.response.status : 'No response');
        console.error("Register failed body:", err.response ? err.response.data : err.message);
    }

    console.log("\n4. Testing Registration with a mismatch OTP to confirm difference...");
    try {
        const response3 = await axios.post('http://localhost:8000/person/register', {
            firstname: "Strict",
            lastname: "Match",
            email: email,
            contactNumber: "1234567890",
            college: "NIT Calicut",
            password: "Password123!",
            confirmPassword: "Password123!",
            role: "User",
            otp: "000000"
        });
        console.log("Register mismatch response:", response3.data);
    } catch (err) {
        console.log("Register failed as expected with status:", err.response ? err.response.status : 'No response');
        console.log("Register failed body (expected Invalid OTP):", err.response ? err.response.data : err.message);
    }

    await redisClient.quit();
}

runQuiz();
