import express from "express";
import response from "../config/response.js";
import {
  savePowerUsageService,
  saveDailyPowerUsageService,
  getPowerUsageService,
  getDailyPowerUsageService
} from "../service/s-powerUsage.js";

export const powerUsage = express.Router();
powerUsage.post("/", async (req, res) => {
  try {
    const { current_mA, status } = req.body;
    const result = await savePowerUsageService(current_mA, status);

    if (!result) {
      throw new Error("Failed to save data");
    }
    return response(res, 201, "Data saved successfully", result);
  } catch (error) {
    return response(res, 400, error.message);
  }
});

powerUsage.get("/", async (req, res) => {
  try {
    const result = await getPowerUsageService();
    if (!result) {
      throw new Error("Failed to save data");
    }
    return response(res, 201, "Data saved successfully", result);
  } catch (error) {
    return response(res, 400, error.message);
  }
})

export const dailyPowerUsage = express.Router();
dailyPowerUsage.post("/", async (req, res) => {
  const { totalPowerUsage } = req.body;
  try {
    const result = await saveDailyPowerUsageService(totalPowerUsage);
    if (!result) {
      throw new Error("Failed to save data");
    }
    return response(res, 201, "Data saved successfully", result);
  } catch (error) {
    return response(res, 400, error.message);
  }
});

dailyPowerUsage.get("/", async (req, res) => {
  try {
    const result = await getDailyPowerUsageService();
    if (!result) {
      throw new Error("Failed to save data");
    }
    return response(res, 201, "Data saved successfully", result);
  } catch (error) {
    return response(res, 400, error.message);
  }
})
