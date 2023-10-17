const bodyParser = require("body-parser");
const cors = require("cors");


class AppConfig {
  constructor(app) {
    process.on("unhandledRejection", (reason, p) => {
      console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
    });
    this.app = app;
  }

  includeConfig() {
    this.loadAppLevelConfig();
  }

  loadAppLevelConfig() {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: "*",
        allowedHeaders: "authorization,x-custom-header",
        preflightContinue: true,
        methods: "OPTION,GET,POST,PUT,DELETE",
      })
    );
  }
}
module.exports = AppConfig;
