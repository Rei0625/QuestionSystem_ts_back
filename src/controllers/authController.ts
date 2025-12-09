import { Request, Response } from "express";
import { tokenPayload } from "../services/JWTService";
import { NumericLiteral } from "typescript";
import { tokenPay } from "../models/model";
import { JwtPayload } from "jsonwebtoken";

export const loginAdminCheck = async (req: Request, res: Response) => {
  try {
    const token = await tokenPayload(req.cookies.access_token);
    if (token == null) {
      res.status(200).json({ valid: false });
    } else if (typeof token != "string") {
      if (token.admin_id == 0 || token.admin_id == 10) {
        res.status(200).json({ valid: true });
      }
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ error: "エラーが起こりました" });
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
