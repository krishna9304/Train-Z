import express, { Application, NextFunction, Request, Response } from "express";
import colors from "ansi-colors";
import { Server } from "http";
import "./database";
import mainRouter from "./routes";
import bodyParser from "body-parser";
import response from "./utils/response";
import timeout from "connect-timeout";
import { ISDEV, PORT } from "./constants";

// Main Application
const app: Application = express();

// Middlewares
app.use(timeout("120s"));
app.use(bodyParser());
app.use(haltOnTimedout);
app.use(haltOnTimedout);

function haltOnTimedout(req: Request, _: Response, next: NextFunction) {
  if (!req.timedout) next();
}

// Main routes
app.use("/", mainRouter);

// 404 Route
const route404 = (req: Request, res: Response, next: NextFunction) => {
  response(res, 404, "Route not Found", {});
};
app.use("*", timeout("1200s"), route404);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(colors.bgRed(err));
  response(res, 400, "Something went wrong", {
    err: typeof err === "object" ? err : [err],
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
