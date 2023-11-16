import request from "request";
import { Request, Response, NextFunction } from "express";

import { tyrCatchControllerHandler } from "../../middleware/try-catch";

import * as USER from "../../models/user";

export const getLogin = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const code = req.query.code;
    const state = req.query.state;
    const grant_type = "authorization_code";
    const redirect_uri = "http://localhost:8000";
    const twitchState = process.env.TWITCH_STATE;

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
        if (err) {
          // 에러 발생..
          throw err;
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
            if (error) {
              throw error;
            }

            const twichUser = JSON.parse(body).data[0];

            await USER.createdUser(req, twichUser);

            const user = await USER.getUser(req, twichUser.id);
            if (!user || user.userStatus === "B") {
              // 에러 발생, 벤 유저가 로그인시 로그인불가 및 팝업창 띄우기
              throw new Error("밴 유저는 로그인이 불가능합니다.");
            }

            req.session.isLoggedIn = true;
            req.session.access_token = access_token;
            req.session.user = {
              userId: user.userId,
              authId: user.authId,
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

    const user = await USER.getUser(req, req.session.user?.userId);
    if (!user || user.userStatus === "B") {
      // 에러 발생, 벤 유저가 로그인시 로그인불가 및 팝업창 띄우기
    }
    res.send({
      displayName: user.displayName,
      userLoginId: user.userLoginId,
      //AUTH_ID: user.AUTH_ID,
      profileImgUrl: user.profileImgUrl,
      broadcasterType: user.broadcasterType,
      isLoggedIn: req.session.isLoggedIn,
      adminFlag: user.adminFlag,
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
      }
    });
  }
);
