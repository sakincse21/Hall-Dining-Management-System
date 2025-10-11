import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { Meal } from "./meal.model";
import { IItem } from "./meal.interface";

export const createMeal = async (req: Request, res: Response) => {
  try {
    const { meals, items, type } = req.body;
    let totalCost = 0;
    items?.forEach((item: IItem) => (totalCost += item.price * item.quantity));
    const date = String(new Date().toLocaleDateString('en-GB').split('/').join('-'));
    // console.log(date);
    
    const payload = {
      meals,
      items,
      type,
      totalCost,
      date,
    };
    const meal = await Meal.create(payload);
    if (!meal) {
      throw new AppError(httpStatus.BAD_REQUEST, "Meal is not created.");
    }
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Meal creation successful.",
      data: meal,
    });
  } catch (err: any) {
    console.error(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

export const updateMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    let totalCost = 0;
    payload?.items?.forEach(
      (item: IItem) => (totalCost += item.price * item.quantity)
    );
    if (totalCost != 0) {
      payload.totalCost = totalCost;
    }
    const meal = await Meal.findByIdAndUpdate(id, payload);
    if (!meal) {
      throw new AppError(httpStatus.BAD_REQUEST, "Meal is not updated.");
    }
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meal updated successfully.",
      data: meal,
    });
  } catch (err: any) {
    console.error(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

// export const deleteMeal = async (req: Request, res: Response) => {
//   try {
//     const {id} = req.body;
//     const meal = await Meal.findByIdAndDelete(id);

//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "Meal deletion successful.",
//       data: meal,
//     });
//   } catch (err: any) {
//     console.error(err);
//     throw new AppError(httpStatus.BAD_REQUEST, err.message);
//   }
// };

export const getMeal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meal = await Meal.findById(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meal fetched successfully.",
      data: meal,
    });
  } catch (err: any) {
    console.error(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

export const getMealByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    if (!date) {
      throw new AppError(httpStatus.BAD_REQUEST, "A date is mandatory");
    }
    const dateValue = String(new Date(date).toLocaleDateString('en-GB').split('/').join('-'));
    console.log(dateValue)
    const meal = await Meal.findOne({ date: dateValue });
    if (!meal) {
      throw new AppError(httpStatus.BAD_REQUEST, "Meal not found.");
    }
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meal fetched successfully.",
      data: meal,
    });
  } catch (err: any) {
    console.error(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

export const getAllMeals = async (req: Request, res: Response) => {
  try {
    const meal = await Meal.find();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Meals fetched successfully.",
      data: meal,
    });
  } catch (err: any) {
    console.error(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};
