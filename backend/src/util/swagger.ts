import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "freedom API DOCS",
      description:
        "프로젝트 설명 Node.js Swaager swagger-jsdoc 방식 RestFul API 클라이언트 UI",
    },
    servers: [
      {
        url: "http://localhost:8000", // 요청 URL
      },
    ],
  },
  apis: [
    // __dirname을 쓰는 이유는 컴파일 후 경로가 바뀌기 때문에 자동으로 경로 지정을 해줌
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../routes/admin/*.js"),
    path.join(__dirname, "../routes/auth/*.js"),
    path.join(__dirname, "../routes/useInfo/*.js"),
    path.join(__dirname, "../routes/users/*.js"),
  ], //Swagger 파일 연동
};
const specs = swaggereJsdoc(options);

export { swaggerUi, specs };
