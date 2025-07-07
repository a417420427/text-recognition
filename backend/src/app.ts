import { AppDataSource } from "./data-source";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes"; // tsoa 自动生成的路由注册函数
import multer from "multer";

import * as swaggerDocument from "./dist/swagger.json"; // 这里路径要确保正确
import cors from "cors";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandler";



const app = express();

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:10086",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const upload = multer({ dest: "uploads/" });

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)) // ← 重要：支持预检请求

app.use('/api', (req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});


// 初始化数据库连接
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    const apiRouter = express.Router();
    apiRouter.use(upload.single("image"));
    // 这里可以挂载自定义的中间件或者路由
    // 例如登录鉴权后访问的接口
    // 如果有 auth 相关接口，通常不需要鉴权
    // app.use("/auth", authRoutes); // 如果用自定义路由文件

    // Swagger 文档接口（一般公开）
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // 注册 tsoa 自动生成的所有路由
    RegisterRoutes(apiRouter);

    app.use("/api", authMiddleware, apiRouter);

    // 错误处理中间件一定要放在路由注册后面

    app.use(errorHandler);
    // 启动服务
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
      console.log("Swagger docs available at http://localhost:3000/docs");
    });


  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
