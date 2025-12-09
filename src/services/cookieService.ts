import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const cookieService = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // console.log(req.method);
  if (!req.cookies.guest_back_id && !req.cookies.admin_back_id) {
    // guest_idをUUIDで新規作成
    // const guestId = crypto.randomUUID();
    // // HttpOnly, Secure, SameSiteの設定を入れてCookie発行
    // res.cookie("guest_back_id", guestId, {
    //   httpOnly: true,
    //   secure: false, // 本番環境ならsecure:trueにする
    //   sameSite: "lax",
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30日間
    // });
    // console.log(`[cookieService] guest_idを発行: ${guestId}`);
  }
  // 次のミドルウェアへ
  next();
};

export default cookieService;
