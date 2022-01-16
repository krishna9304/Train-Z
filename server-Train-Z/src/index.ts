import express, { Application, NextFunction, Request, Response } from "express";
import colors from "ansi-colors";
import { Server } from "http";
import "./database";
import mainRouter from "./routes";
import bodyParser from "body-parser";
import response from "./utils/response";
import timeout from "connect-timeout";
import { ISDEV, PORT } from "./constants";
import path from "path";
import cors from "cors";
import morgan from "morgan";

// Main Application
const app: Application = express();

// Middlewares
app.use(cors());
app.use(timeout("120s"));
app.use(bodyParser());
app.use(haltOnTimedout);
app.use(morgan("dev"));

// Static file serving
app.use("/static", express.static(path.join(__dirname, "public")));

function haltOnTimedout(req: Request, res: Response, next: NextFunction) {
  if (!req.timedout) next();
}

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  response(res, 200, "Server running", {});
});

// Main routes
app.use("/", mainRouter);

// 404 Route
const route404 = (req: Request, res: Response, next: NextFunction) => {
  response(res, 404, "Route not Found", {});
};

app.use("*", timeout("1200s"), route404);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  response(res, 200, "Something went wrong", {
    err: Array.isArray(err)
      ? err
      : typeof err === "object" && err.message
      ? [err.message]
      : [err],
  });
});

// TODO: init sockets
const server: Server = app.listen(PORT, () => {
  ISDEV && console.clear();
  console.log(
    ` Server running on PORT \n\t${
      ISDEV ? colors.cyan("http://localhost:8080") : colors.cyan(PORT)
    }\n at ${Date()}`
  );
});
