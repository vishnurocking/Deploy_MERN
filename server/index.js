const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');
require("dotenv").config();

const app = express();
app.use(cors({
    origin: ["https://deploy-mern-frontend-psi.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
    optionsSuccessStatus: 204
}));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

// Connect to MongoDB outside of the request handler
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add these options to help with connection issues
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

app.get("/", (req, res) => {
    res.json("Hello");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        const existingUser = await RegisterModel.findOne({ email: email }).exec();
        
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        
        const newUser = new RegisterModel({ name, email, password });
        const savedUser = await newUser.save();
        
        res.json(savedUser);
    } catch (err) {
        console.error("Registration error:", err);
        if (err.name === 'MongoTimeoutError') {
            res.status(503).json({ error: "Database operation timed out. Please try again later." });
        } else {
            res.status(500).json({ error: "An error occurred during registration" });
        }
    }
});

module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
