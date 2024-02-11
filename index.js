const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const tasksRouter = require("./routes/tasks");
const errorHandler = require("./middleware/error");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

// Database connection
mongoose.connect("mongodb://0.0.0.0:27017/task_manager");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
