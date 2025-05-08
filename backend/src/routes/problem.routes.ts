import { Router } from "express";
const router = Router();

import { isAdmin, isLoggedIn } from "../middlewares/auth.middlewares";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controllers";

router.post("/create", isLoggedIn, isAdmin, createProblem);
router.get("/get-all", getAllProblems);
router.get("/get/:id", getProblemById);
router.put("/update/:id", isLoggedIn, isAdmin, updateProblem);
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteProblem);

export default router;
