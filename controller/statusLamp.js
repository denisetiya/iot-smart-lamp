import express from "express";
import response from "../config/response.js";
import cron from "node-cron";

export const statusLamp = express.Router();

let lampStatus = "off";

statusLamp.get("/", (req, res) => {
  res.json({ status: lampStatus });
});

export const updateStatusLamp = express.Router();

updateStatusLamp.post("/", (req, res) => {
  const { status } = req.body;
  if (status === "on" || status === "off") {
    lampStatus = status;
    response(res, 200, "Status lampu diperbarui", lampStatus);
  } else {
    response(res, 400, "Status lampu tidak valid");
  }
});

export const schedule = express.Router();

let scheduledJobs = [];

schedule.post("/", (req, res) => {
  const { time1, time2 } = req.body;


  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time1) || !timeRegex.test(time2)) {
    return response(res, 400, "Format waktu tidak valid");
  }

 
  scheduledJobs.forEach(job => job.stop());
  scheduledJobs = [];

  // Schedule lamp on
  const job1 = cron.schedule(`0 ${time1.split(':')[1]} ${time1.split(':')[0]} * * *`, () => {
    lampStatus = "on";
    console.log("Lampu menyala pada", time1);
  });
  scheduledJobs.push(job1);

  // Schedule lamp off
  const job2 = cron.schedule(`0 ${time2.split(':')[1]} ${time2.split(':')[0]} * * *`, () => {
    lampStatus = "off";
    console.log("Lampu mati pada", time2);
  });
  scheduledJobs.push(job2);

  response(res, 200, "Jadwal lampu diperbarui", { onTime: time1, offTime: time2 });
});


