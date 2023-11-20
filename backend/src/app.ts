//require("dotenv").config({ path: "../config/.env" });
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "./config", "/.env") });

import imgUpload from "./util/imgUpload";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import FRONT_PATH from "./config/constance";
import session from "./util/session";
import { swaggerUi, specs } from "./config/swagger";
import indexRoutes from "./routes/index";

const app = express();

// app.use((req: Request, res: Response, next: NextFunction) => {
//   const result = dotenv.config({
//     path: path.join(__dirname, "./config", "/.env"),
//   }); // .env 파일의 경로를 dotenv.config에 넘겨주고 성공여부를 저장함
//   if (result.parsed == undefined) {
//     // .env 파일 parsing 성공 여부 확인
//     const error = new Error("Cannot loaded environment variables file."); // parsing 실패 시 Throwing
//     next(error);
//   }
// });

// CORS에러 설정
app.use(cors());
// 세션 설정
app.use(session);

// Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded <form>

// 정적으로 파일의 경로를 지정
// 정적의미 : 다른 미들웨어를 거쳐서 처리되지 않고, 바로 파일 시스템에 포워딩됨
app.use(express.static(FRONT_PATH));
app.use("/images", express.static(path.join(__dirname, "..", "images")));

// 이미지 업로드
app.post("/api/upload", imgUpload.single("file"), (req, res) => {
  res.status(200).json(req.file);
});
app.use("/api", indexRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); // swagger - API DOCS

// front 메인화면
// app.get("*", function (req, res) {
//   res.sendFile(FRONT_PATH + "/index.html");
// });

// app.get("*", function (req: Request, res: Response) {
//   res.sendFile(FRONT_PATH + req.originalUrl + ".html");
// });

// express에서 사용할 수 있는 특수한 미들웨어, 에러 처리 미들웨어라고 함
// error 인수를 포함한 4개의 인수를 가짐
// next()를 호출할때, 매개변수를 포함한다면, 다른 미들웨어를 무시하고 이 미들웨어를 실행함
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  //res.status(error.httpStatusCode).render(...); 에러가 발생했을때 httpStatusCode를 설정하면, 페이지 render()에서 사용할 수 있음
  console.log(error);
  res.status(500).send({ error });
  // res.status(500).render("500", {
  //   title: "Error!",
  //   path: "/500",
  //   isAuthenticated: req.session.isLoggedIn,
  // });
});

app.listen(8000);
