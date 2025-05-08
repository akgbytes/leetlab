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

router.post("/create-problem", isLoggedIn, isAdmin, createProblem);
router.get("/get-all-problem", getAllProblems);
router.get("/get-problem/:id", getProblemById);
router.put("/update-problem/:id", isLoggedIn, isAdmin, updateProblem);
router.delete("/delete-problem/:id", isLoggedIn, isAdmin, deleteProblem);

export default router;
