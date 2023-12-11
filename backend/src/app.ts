import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "./config", "/.env") });

import imgUpload from "./util/imgUpload";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import FRONT_PATH from "./util/constance";
import session from "./util/session";
import { swaggerUi, specs } from "./util/swagger";
import indexRoutes from "./routes/index";

const app = express();

// CORS에러 설정
// app.use(cors());
// front와 backend간에 포트가 달라 세션쿠키가 공유되지 않아, front fetch에 include 추가함
const corsOptions = {
  origin: process.env.REDIRECT_URI as string, //"http://localhost:3050",
  credentials: true,
};

app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가

// helmet - 보안을 위해 사용
// 다양한 보안문제가 되는 부분들을 방지해주는 NPM
app.use(
  helmet({
    // 트위치 이미지와 유튜브 영상을 사용하기 위해 해당 URL 제한 해제
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "static-cdn.jtvnw.net"],
        "frame-src": ["'self'", "www.youtube.com"],
      },
    },
  })
);

// 세션 설정
app.use(session);

// 정적으로 파일의 경로를 지정
// 정적의미 : 다른 미들웨어를 거쳐서 처리되지 않고, 바로 파일 시스템에 포워딩됨
app.use(express.static(FRONT_PATH));
app.use("/images", express.static(path.join(__dirname, "..", "images")));

// Express 4.16.0버전 부터 body-parser의 일부 기능이 익스프레스에 내장 body-parser 연결
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded <form>

// 이미지 업로드
app.post("/api/upload", imgUpload.single("file"), (req, res) => {
  res.status(200).json(req.file);
});
app.use("/api", indexRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs)); // swagger - API DOCS

// front 메인화면
// 이걸 안해주면 새로고침시 404 에러 발생
app.get("*", function (req: Request, res: Response) {
  res.sendFile(path.join(FRONT_PATH, "index.html"));
});

// app.get("*", function (req: Request, res: Response) {
//   res.sendFile(FRONT_PATH + req.originalUrl + ".html");
// });

// express에서 사용할 수 있는 특수한 미들웨어, 에러 처리 미들웨어라고 함
// error 인수를 포함한 4개의 인수를 가짐
// next()를 호출할때, 매개변수를 포함한다면, 다른 미들웨어를 무시하고 이 미들웨어를 실행함
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(500).send({ error });
  // res.status(500).render("500", {
  //   title: "Error!",
  //   path: "/500",
  //   isAuthenticated: req.session.isLoggedIn,
  // });
});

app.listen(8000);
