const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Enable CORS and pre-flight OPTIONS requests
app.use(cors());
app.options("*", cors());

// Load environment variables from config file
dotenv.config({ path: "./config/config.env" });

// Connect to the MongoDB database
connectDB();

// Route files
const auth = require("./routes/student");
const batch = require("./routes/batch");
const course = require("./routes/course");
const quiz = require("./routes/quiz"); // New quiz routes

// Parse JSON bodies and URL-encoded data, and cookies
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Use morgan for logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data to prevent NoSQL injections
app.use(mongoSanitize());

// Set various security headers using helmet
app.use(helmet());

// Prevent cross-site scripting (XSS) attacks
app.use(xss());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/batch", batch);
app.use("/api/v1/course", course);
app.use("/api/v1/quiz", quiz);

// Only start the server if the environment is not "test"
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
  );

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

// Export the app so it can be used by the test suite
module.exports = app;
