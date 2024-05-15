import express from 'express';
import { loginService } from '../service/s-login.js';
import response from '../config/response.js';
const login = express.Router();


login.post('/', async(req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return response(res, 400, 'Email and password are required');
  }
 
  try {
    const result = await loginService(email, password);

    if (!result) {
      return response(res, 400, 'Invalid email or password');
    }

    return response(res, 200, 'Login success', result);
    
  } catch (error) {
    return response(res, 400, error.message);
  }
})

export default login