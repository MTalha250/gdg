import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import contactRoutes from "./routes/contact.js";
import dashboardStatsRoutes from "./routes/dashboardStats.js";
import recruitmentRoutes from "./routes/recruitment.js";
import eventRoutes from "./routes/event.js";
import brainGamesRoutes from "./routes/brainGames.js";
import coderushRoutes from "./routes/coderush.js";
import voucherRoutes from "./routes/voucher.js";
import sponsorRoutes from "./routes/sponsor.js";
import ambassadorRoutes from "./routes/ambassador.js";
import partnerRoutes from "./routes/partner.js";
import certificateRoutes from "./routes/certificates.js";
import coreApplicationRoutes from "./routes/coreApplication.js";

dotenv.config();

const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://gdg-itu.vercel.app",
  "https://gdg-itu-admin.vercel.app",
  "https://gdg-itu.netlify.app",
  "https://gdg.itu.edu.pk",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // server-to-server / curl / mobile webviews
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  return /^https:\/\/(gdg-itu|gdg-itu-admin)(-[a-z0-9-]+)?\.(vercel|netlify)\.app$/.test(
    origin
  );
};

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    // Don't throw — silently deny so the client gets a clean CORS error
    // instead of a 500 that Safari interprets as a network failure.
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB connected");
});

db.on("error", (error) => {
  console.log(error);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardStatsRoutes);
app.use("/api/recruitment", recruitmentRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/brain-games", brainGamesRoutes);
app.use("/api/coderush", coderushRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/ambassadors", ambassadorRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/core-team", coreApplicationRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
