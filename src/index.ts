import express, { Application, NextFunction, Request, Response } from "express"
import colors from "ansi-colors";
import dotenv from "dotenv"

dotenv.config();  //configure the ENVs

const PORT:string = (process.env.PORT || 8080)+"";
const ISDEV:boolean = process.env.NODE_ENV!=="production"

const app:Application = express();

app.get("/", (req:Request, res:Response, next:NextFunction)=>{
    res.send("Hello")
})

app.listen(PORT, ()=>{
    console.clear();
    console.log(` Server running on PORT \n     ${ISDEV?colors.cyan("http://localhost:8080"):colors.cyan(PORT)}\n at ${Date()}`);
})