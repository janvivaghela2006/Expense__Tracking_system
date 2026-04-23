import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import filterRoutes from "./routes/filterRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ message: "Expense backend is running" });
});

app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", transactionRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", filterRoutes);
app.use("/api", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
