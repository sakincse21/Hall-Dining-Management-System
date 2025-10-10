import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";
import { Request, Response } from "express";
import { Summary } from "./summary.model";
import { User } from "../user/user.model";
import { IStatus } from "../user/user.interface";

export const getSummaryByDate = async (req: Request, res: Response) => {
  try {
    const payload = req.params;
    // console.log(payload)
    const date = new Date(payload?.date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // console.log(date)
    const summaryExists = await Summary.findOne({ date: date });
    if (!summaryExists) {
      throw new AppError(httpStatus.BAD_REQUEST, "Summary does not exist for the date.");
    }
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.CREATED,
      message: "Summary fetch successful.",
      data: summaryExists,
    });
  } catch (err: any) {
    console.error(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

export const getSummary = async (req: Request, res: Response) => {
  try {
    const date = new Date(Date.now()).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const summaryExists = await Summary.findOne({ date: date });
    if (summaryExists) {
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Summary fetch successful.",
        data: summaryExists,
      });
    } else {
      const { mealRate } = req.body;
      const totalMeal = await User.countDocuments({ mealStatus: IStatus.on });
      const totalMoney = mealRate * totalMeal;

      const summary = await Summary.create({
        date,
        mealRate,
        totalMeal,
        totalMoney,
      });
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Summary created successful.",
        data: summary,
      });
    }
  } catch (err: any) {
    console.error(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};
