import express from 'express';
import {powerUsage, dailyPowerUsage} from './controller/powerUsage.js';
import {statusLamp, updateStatusLamp, schedule} from './controller/statusLamp.js';
import login from './controller/login.js';

const router = express.Router();

router.use('/power-usage', powerUsage);
router.use('/daily-power-usage', dailyPowerUsage);
router.use('/status', statusLamp);
router.use('/update', updateStatusLamp);
router.use('/login', login);
router.use('/schedule', schedule);



export default router