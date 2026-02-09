import express from "express";
import matchRouter from "./routes/matches.js";
const app = express();
const PORT = 8000;

// JSON middleware
app.use(express.json());

// Route that returns a short message
app.get("/", (req, res) => {
  res.send("Welcome to Express server!");
});

app.use("/matches", matchRouter);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
