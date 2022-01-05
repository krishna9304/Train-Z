// Consts
import dotenv from "dotenv";
dotenv.config(); //configure the ENVs

export const PORT: string = (process.env.PORT || 8080) + "";
export const ISDEV: boolean = process.env.NODE_ENV !== "production";
export const CLIENT_URL = ISDEV ? `http://localhost:3000` : "";
