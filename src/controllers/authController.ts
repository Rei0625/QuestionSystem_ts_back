import { Request, Response } from "express";
import { tokenPayload } from "../services/JWTService";
import { NumericLiteral } from "typescript";
import { tokenPay } from "../models/model";
import { JwtPayload } from "jsonwebtoken";

interface TokenPayload {
  admin_id: number;
  // 必要なら他のフィールドも追加
}

export const loginAdminCheck = async (req: Request, res: Response) => {
  try {
    const token = await tokenPayload(req.cookies.access_token);

    // token が null の場合
    if (token == null) {
      return res.status(200).json({ valid: false });
    }

    // token が object で admin_id を持つ場合のみチェック
    if (typeof token === "object" && "admin_id" in token) {
      const t = token as TokenPayload;

      if (t.admin_id === 0 || t.admin_id === 10) {
        return res.status(200).json({ valid: true });
      }
    }

    // それ以外は無効
    return res.status(200).json({ valid: false });
  } catch (error) {
    return res.status(500).json({ error: "エラーが起こりました" });
  }
};

export const logout = async (req: Request, res: Response) => {
  console.log("tetete");
  res.cookie("access_token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ message: "OK" });
};
