const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const RegisterModel = require('./models/Register')
require("dotenv").config();

const app = express()
app.use(cors(
    {
        origin: ["https://deploy-mern-frontend-psi.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.get("/", (req, res) => {
  res.json("Hello");
});


app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  RegisterModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.status(400).json({ error: "User already exists" });
      } else {
        RegisterModel.create({ name: name, email: email, password: password })
          .then((result) => res.json(result))
          .catch((err) => res.status(500).json({ error: err.message }));
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
