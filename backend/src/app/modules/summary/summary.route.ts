import { Router } from "express";
import { getSummary, getSummaryByDate } from "./summary.controller";
import { authCheck } from "../../middlewares/authUser";
import { IROLE } from "../user/user.interface";
import { Request, Response } from "express";

const router = Router();

router.post("/", authCheck(IROLE.admin), getSummary);
router.get("/health", (req: Request, res: Response) => {
  res.send(`Summary route working fine`);
});
router.get("/:date", getSummaryByDate);

export const SummaryRouter = router;
