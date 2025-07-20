//importing the required modules
const express = require("express");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const {itemRouter} = require("./routes/itemRouter");
const {authRouter} = require("./routes/authRouter");
const cors = require("cors");

//configuring the express-rate-limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 10, // Limit each IP to `10` requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false, 
});

//setting up the express app
const app = express();

//setting up the middleware
app.use(bodyParser.json());
app.use(limiter);
app.use(cors())

//setting up the the router for the items 
app.use("/items", itemRouter);
app.use("/auth", authRouter);

//setting up the home route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the lost and found API");
});

//setting up the port
const port = process.env.PORT ||  3000;

//starting the server
app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
})
