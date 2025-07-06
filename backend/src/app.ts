import { AppDataSource } from "./data-source";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes"; // tsoa 自动生成的路由注册函数

import * as swaggerDocument from "./dist/swagger.json"; // 这里路径要确保正确
import cors from "cors";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*", // 或写成 'http://10.97.6.3:10086' 等
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 初始化数据库连接
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    const apiRouter = express.Router();

    // 这里可以挂载自定义的中间件或者路由
    // 例如登录鉴权后访问的接口
    // 如果有 auth 相关接口，通常不需要鉴权
    // app.use("/auth", authRoutes); // 如果用自定义路由文件

    // Swagger 文档接口（一般公开）
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    // 注册 tsoa 自动生成的所有路由
    RegisterRoutes(apiRouter);

    app.use("/api", apiRouter);

    // 错误处理中间件一定要放在路由注册后面

    // 启动服务
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
      console.log("Swagger docs available at http://localhost:3000/docs");
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
