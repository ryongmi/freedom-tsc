import request from "request";
import * as USER from "../../models/user";
import { Request, Response, NextFunction } from "express";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getLogin = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const client_id = process.env.CLIENT_ID; // "tymp4f3nwou50k5wgrameksysbthdk";
    const client_secret = process.env.CLIENT_SECRET; // "q27rhyzvw0miyty5lj6yf2ccinw33h";
    const code = req.query.code;
    const state = req.query.state;
    const grant_type = "authorization_code";
    const redirect_uri = "http://localhost:8000";
    const twitchState = process.env.TWITCH_STATE; // "c3ab8aa609ea11e793ae92361f002671"

    if (state !== twitchState)
      throw new Error("트위치 API를 받아오는 도중 에러가 발생하였습니다.");

    request.post(
      {
        url: "https://id.twitch.tv/oauth2/token",
        form: {
          client_id,
          client_secret,
          code,
          grant_type,
          redirect_uri,
        },
      },
      function (err, _httpResponse, body) {
        if (!err) {
          // 에러 발생..
        }
        const tokenData = JSON.parse(body);
        const access_token = tokenData.access_token;

        request.get(
          {
            uri: "https://api.twitch.tv/helix/users",
            headers: {
              Authorization: "Bearer " + access_token,
              "Client-Id": client_id,
            },
          },
          async function (error, _response, body) {
            if (!error) {
              // 에러 발생
            }

            const twichUser = JSON.parse(body).data[0];

            const result = await USER.createdUser(req, twichUser);
            if (!result) {
              // 에러 발생
            }
            const user = await USER.getUser(req, twichUser.id);
            if (!user || user.BAN_YN === "Y") {
              // 에러 발생, 벤 유저가 로그인시 로그인불가 및 팝업창 띄우기
            }

            req.session.isLoggedIn = true;
            req.session.access_token = access_token;
            req.session.user = {
              USER_ID: user.USER_ID,
              AUTH_ID: user.AUTH_ID,
            };
            req.session.cookie.maxAge = 1000 * 60 * 5; // 1000 = 1초, 1000 * 60 = 1분

            // 세션을 저장하는 메서드
            // 일반적으로는 알아서 저장되기 때문에 필요없지만, 세션이 확실히 저장되고 나서 진행해야 할 경우 사용
            req.session.save((err) => {
              console.log(err);
              console.log(req.session.user);
              if (err) throw err;

              res.redirect(redirect_uri);
            });
          }
        );
      }
    );
  }
);

export const getUserInfo = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.isLoggedIn) return res.send({});

    const user = await USER.getUser(req, req.session.user?.USER_ID);
    if (!user || user.BAN_YN === "Y") {
      // 에러 발생, 벤 유저가 로그인시 로그인불가 및 팝업창 띄우기
    }
    res.send({
      DISPLAY_NAME: user.DISPLAY_NAME,
      USER_LOGIN_ID: user.USER_LOGIN_ID,
      //AUTH_ID: user.AUTH_ID,
      PROFILE_IMG_URL: user.PROFILE_IMAGE_URL,
      BROADCASTER_TYPE: user.BROADCASTER_TYPE,
    });
  }
);

export const deleteLogout = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy(function (err) {
      if (err) {
        console.log("세션 삭제 에러");
        throw new Error("세션 삭제 에러");
      } else {
        console.log("세션 삭제 성공");
        res.status(200).send({ message: "세션 삭제 성공" });
        // res.status(200).redirect("/");
      }
    });
  }
);
