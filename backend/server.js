import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";
import path from 'path';

// Load environment variables
dotenv.config();

connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contributions", contributionRoutes);

const __dirname = path.resolve(); // Allow to use ES6 module syntax with Node.js

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../frontend/build'))); // Serve the static files from the React app  

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));  // Send index.html for any other requests 
  });

  } else {
    app.get("/", (req, res) => {
      res.send("API is running...");
    });
  }

app.use(notFound); // Middleware for 404 errors
app.use(errorHandler); // Middleware for 500 errors

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.red.bold
  );
});

export default app;
