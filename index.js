const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const { sequelize } = require("./configs/db");
const errorMiddleware = require("./middlewares/error.middleware");
const Routes = require("./routes/index.routes");
const { registerSocketServer } = require("./socket/socketServer");
const app = express();
const server = require("http").createServer(app);
connectToDatabase();
initializeMiddlewares(app);
function setupCORS(app) {
  const origins = [];
  if (["development"].includes(process.env.NODE_ENV)) {
    origins.push(`/localhost:/`);
    origins.push("http://localhost:5173");
    origins.push("http://localhost:3000");
  }
  const corsOrigins = process.env.CORS_ORIGINS.split(",");
  if (corsOrigins.length > 0) {
    origins.push(
      ...corsOrigins.map((corsOrigin) => {
        return corsOrigin.trim();
      })
    );
  }
  console.log(origins);
  const corsOptions = {
    origin: origins,
    methods: ["GET", "POST", `PUT`, `PATCH`, `DELETE`],
    credentials: true,
  };

  app.use(cors(corsOptions));
}
function initializeMiddlewares(app) {
  setupCORS(app);
  app.use(hpp());
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

}

async function initializeRoutes(app, routes) {
  try {
    app.get("/", async (req, res) => {
      console.log(req.headers);
      res.status(200).json({
        title: "Express Testing",
        message: "The app is working properly!",
      });
    });

    routes.forEach((route) => {
      app.use("/api/v1", route);
    });
  } catch (error) {
    console.error("Error initializing routes:", error);
  }
}

function initializeErrorHandling(app) {
  app.use(errorMiddleware);
}
function initializeSocketIO() {
  registerSocketServer(app, server);
}

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
}

initializeRoutes(app, Routes);
initializeErrorHandling(app);
initializeSocketIO();

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("listening on port", port);
});