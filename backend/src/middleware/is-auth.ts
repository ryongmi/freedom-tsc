import { Request, Response, NextFunction } from "express";
import * as USER from "../models/user";
import * as MENU from "../models/menu";

// 로그인 체크
export const sesstionCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }

  const user = await USER.getUser(req, req.session.user?.userId);
  if (user.userStatus === "B") {
    // 에러 발생, 벤 유저가 로그인시 로그인불가 및 팝업창 띄우기
    req.session.destroy(function (err) {
      if (err) {
        console.log("세션 삭제 에러");
        throw new Error("세션 삭제 에러");
      } else {
        return res.redirect("/");
      }
    });
  }
  next();
};

// 게시판 권한 체크
// 글쓰기, 댓글쓰기, 조회 권한이 있는지 체크
// 조회 권한이 없다면 홈으로 돌려보내기
// 글쓰기, 댓글쓰기 권한을 같이 send
export const menuAuthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = await MENU.getMenuAuth(req);
  if (auth.read === "N") {
    // 읽기 권한이 없다면 홈으로
    // 추후 권한관련 페이지 만들어 그쪽으로 이동예정
    // return res.status(401).redirect("http://localhost:8000");
    return res.status(401).send();
  }

  req.menuAuth = {
    post: auth.post,
    comment: auth.comment,
  };
  next();
};

// 관리자 체크
// 관리자 권한이 없다면 리턴
export const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }

  const user = await USER.getUser(req, req.session.user?.userId);
  if (user.userStatus === "B") {
    // 에러 발생, 벤 유저가 로그인시 로그인불가 및 팝업창 띄우기
    req.session.destroy(function (err) {
      if (err) {
        console.log("세션 삭제 에러");
        throw new Error("세션 삭제 에러");
      } else {
        return res.redirect("/");
      }
    });
  }

  if (user.adminFlag !== "Y") {
    // 해당 유저가 관리자가 아니라면 홈으로 이동
    return res.redirect("/");
  }
  next();
};
