import { Router } from "express";
import authenticate, { requireAdmin } from "../middleware/auth.js";
import {
  adminLogin,
  adminRegister,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "../controllers/authController.js";
import {
  getAdminReports,
  getSystemRecords,
} from "../controllers/dashboardController.js";

const router = Router();

router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

router.use(authenticate, requireAdmin);
router.get("/admin/users", getAdminUsers);
router.put("/admin/users/:id", updateAdminUser);
router.delete("/admin/users/:id", deleteAdminUser);
router.get("/admin/reports", getAdminReports);
router.get("/admin/system-records", getSystemRecords);

export default router;
