const express = require("express");
const cors = require("cors");
const http = require("http");
const logger = require("./config/winston");
const AppConfig = require("./config/app-config");
const UserRoutes = require("./service/user/route");
const StudentRoutes = require("./service/student/route");
const connectToDb = require("./config/database");
const { auth } = require("./middelware/controller/auth");
require("dotenv").config();
connectToDb;
class Server {
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.http = http.Server(this.app);
 
    this.app.use(async (req, res, next) => {
      const platform = req.headers["platform"]? req.headers["platform"].toLowerCase(): "mobile";

      const authorization = req.headers["authorization"];
      const appUser = req.headers["app-user"];
      const urls = [
        "/user/register",
        "/user/login"
      ];
      const url = urls.includes(req.originalUrl.toLowerCase()) ||["/deeplink"].some((u) =>req.originalUrl.toLowerCase().includes(u.toLowerCase())
        );
      if (
        url || authorization == "string" || authorization == process.env.INTERNAL_HEADER
      ) {
        next();
      } else if (typeof authorization === "string" && authorization !== "undefined"
      ) {
        await auth(authorization, { platform, appUser }, (err, user) => {
          if (err)
            return res.status(403).send({ error: true, message: "Permission denied!" });
          req.user = user;
          res.locals.user = user;
          if (req.originalUrl === "/validate_user") {return res.send({ _id: user._id });
        }
          next();
        });
      } else {
        res.send({ error: true, message: "Permission denied!" });
      }
    });
  }

  appConfig() {
    new AppConfig(this.app).includeConfig();
  }

  includeRoutes() {
    new UserRoutes(this.app).routesConfig();
    new StudentRoutes(this.app).routesConfig();
  }

  startTheServer() {
    this.appConfig();
    this.includeRoutes();
   
    const port = process.env.NODE_SERVER_PORT;
    const host = process.env.NODE_SERVER_HOST;

    this.http.listen(port, host, () => {
      logger.info(`Listening on http://${host}:${port}`);
    });
  }
}

module.exports = new Server();
