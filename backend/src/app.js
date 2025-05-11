import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoutes.js';
import shiftRoute from './routes/shiftRoutes.js';
import notificationRoute from './routes/notificationRoutes.js';
import swapRequestRoute from './routes/swapRequest.route.js';
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { isAuthenticated } from './middlewares/authMiddleware.js';



const app = express();
app.use(express.json({ limit: '50mb' }));  // Adjust the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/user", authRoute);


//app.use("/api/shift", shiftRoute);
app.use("/api", shiftRoute);


//notification routes

app.use("/api", notificationRoute); // <-- New route

// Swap request routes

app.use("/api", swapRequestRoute); // <-- New route

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/api/user/download",isAuthenticated, (req, res) => {
  console.log("Download request received");
  const filePath = path.join(__dirname, "../assets/report.pdf");

  res.download(filePath, "ShiftSwap_Report.pdf", (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(500).json({ error: "Failed to download report" });
    }
  });
})






export  {app};