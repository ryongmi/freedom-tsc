import request from "request";
import * as USER from "../../models/user";
import { Request, Response, NextFunction } from "express";
import { tyrCatchControllerHandler } from "../../middleware/try-catch";

export const getLogin = tyrCatchControllerHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    request.post(
      {
        url: "https://id.twitch.tv/oauth2/token",
        form: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: req.query.code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:8000",
        },
      },
      function (err, _httpResponse, body) {
        if (!err) {
          // 에러 발생
        }
        const tokenData = JSON.parse(body);
        const access_token = tokenData.access_token;

        request.get(
          {
            uri: "https://api.twitch.tv/helix/users",
            headers: {
              Authorization: "Bearer " + access_token,
              "Client-Id": process.env.CLIENT_ID,
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
            return req.session.save((err) => {
              console.log(err);

              return res.send({
                DISPLAY_NAME: user.DISPLAY_NAME,
                USER_LOGIN_ID: user.USER_LOGIN_ID,
                //AUTH_ID: user.AUTH_ID,
                PROFILE_IMG_URL: twichUser.profile_image_url,
                BROADCASTER_TYPE: user.BROADCASTER_TYPE,
              });
            });
          }
        );
      }
    );
  }
);

// exports.getLogin = (req, res, next) => {
//   try {
//     request.post({
//       url: "https://id.twitch.tv/oauth2/token",
//       form: {
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         code: req.query.code,
//         grant_type: "authorization_code",
//         redirect_uri: "http://localhost:8000",
//       },
//       function(err, httpResponse, body) {
//         if (!err) {
//           // 에러 발생
//         }
//         const tokenData = JSON.parse(body);
//         const access_token = tokenData.access_token;

//         request.get(
//           {
//             uri: "https://api.twitch.tv/helix/users",
//             headers: {
//               Authorization: "Bearer " + access_token,
//               "Client-Id": client_id,
//             },
//           },
//           async function (error, response, body) {
//             if (!error) {
//               // 에러 발생
//             }

//             const twichUser = JSON.parse(body).data[0];

//             const result = await USER.createdUser(req, twichUser);
//             if (!result) {
//               // 에러 발생
//             }
//             const user = await USER.getUser(req, twichUser.id);
//             if (!user || user.BAN_YN === "Y") {
//               // 에러 발생, 벤 유저가 로그인시 로그인불가 및 팝업창 띄우기
//             }

//             req.session.isLoggedIn = true;
//             req.session.access_token = access_token;
//             req.session.user = {
//               USER_ID: user.USER_ID,
//               AUTH_ID: user.AUTH_ID,
//             };
//             req.session.cookie.maxAge = 1000 * 60 * 5; // 1000 = 1초, 1000 * 60 = 1분

//             // 세션을 저장하는 메서드
//             // 일반적으로는 알아서 저장되기 때문에 필요없지만, 세션이 확실히 저장되고 나서 진행해야 할 경우 사용
//             return req.session.save((err) => {
//               console.log(err);

//               return res.send({
//                 DISPLAY_NAME: user.DISPLAY_NAME,
//                 USER_LOGIN_ID: user.USER_LOGIN_ID,
//                 //AUTH_ID: user.AUTH_ID,
//                 PROFILE_IMG_URL: twichUser.profile_image_url,
//                 BROADCASTER_TYPE: user.BROADCASTER_TYPE,
//               });
//             });
//           }
//         );
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     return next(error);
//   }
// };
