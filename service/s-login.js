import { findUser } from "../repository/r-main.js";
import bcrypt from "bcrypt";

export async function loginService(email, password) {

  const user = await findUser(email);

  if (!user) {
    throw new Error("Email not Registered");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password not match");
  }

  return user;

  
}