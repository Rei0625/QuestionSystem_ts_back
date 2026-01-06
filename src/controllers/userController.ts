import { Request, Response } from "express";
import { UploadUsers, User } from "../models/model";
import {
  getUsers,
  createUser,
  getUserName,
  deleteUser,
  getUserID,
  resetPassword,
} from "../services/userService";
import { hashPassword, comparePassword } from "../services/hashService";
import { tokenCreate, tokenPayload } from "../services/JWTService";

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch (error) {
    if (error instanceof Error) {
      console.error("ユーザー取得失敗:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("予期しないエラー:", error);
    }

    res.status(500).json({ error: "ユーザーの取得に失敗しました" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { user_name, password } = req.body;

  try {
    if (!user_name || !password) {
      res.status(400).json({ error: "ユーザー名とパスワードは必須です" });
      return;
    }

    const user: User | null = await getUserName(user_name);

    if (!user || (await comparePassword(password, user.password)) === false) {
      res.status(401).json({ error: "ユーザー名またはパスワードが違います" });
      return;
    }
    const token = await tokenCreate(user);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/",
    });
    let admin_check = "user";
    if (user.admin_id == 0 || user.admin_id == 10) {
      admin_check = "admin";
    }

    res.status(200).json({
      token: admin_check,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
      },
    });
  } catch (error) {
    console.error("❌ ログイン失敗:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
};

export const createdUser = async (req: Request, res: Response) => {
  const { admin_id, user_name, password, email } = req.body;
  const hashedPassword = await hashPassword(password);

  const user: User | null = await getUserName(user_name);
  if (user) {
    res.status(500).json({ error: "❌ ユーザーネームが被っています" });
  } else {
    try {
      const result = await createUser(
        admin_id,
        user_name,
        email,
        hashedPassword
      );

      res.status(200).json({ message: "✅ ユーザー作成成功" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "❌ ユーザー作成に失敗しました" });
    }
  }
};

export const createdUsers = async (req: Request, res: Response) => {
  const users: UploadUsers[] = req.body.users;
  const results: any[] = [];
  for (const user of users) {
    const hashedPassword = await hashPassword(user.email);
    const useuser: User | null = await getUserName(user.user_name);
    if (useuser) {
      results.push({
        user_name: user.user_name,
        message: "❌ ユーザーネームが被っています",
      });
      continue;
    } else {
      try {
        const result = await createUser(
          user.admin_id,
          user.user_name,
          user.email,
          hashedPassword
        );

        results.push({
          user_name: user.user_name,
          message: "✅ ユーザー作成成功",
        });
      } catch (error) {
        console.log(error);
        results.push({
          user_name: user.user_name,
          message: "❌ ユーザー作成に失敗しました",
        });
      }
    }
  }
  res.status(200).json({ results: results });
};

export const deletedUser = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  try {
    const result = await deleteUser(user_id);
    res.status(200).json({ message: "ユーザー削除を行いました" });
  } catch (erroe) {
    console.log(erroe);
    res.status(500).json({ error: "ユーザー削除に失敗しました" });
  }
};

export const changedPassword = async (req: Request, res: Response) => {
  const { user_id, now_password, new_password } = req.body;
  try {
    const user = await getUserID(user_id);

    if (
      !user ||
      (await comparePassword(now_password, user.password)) === false
    ) {
      res.status(401).json({ error: "パスワードが違います" });
      return;
    }
    const hash_password = await hashPassword(new_password);
    await resetPassword(user_id, hash_password);
    res.status(200).json({ result: "パスワードを変更しました" });
  } catch (err) {
    res.status(500).json({ error: "問題が発生しました" });
  }
};

export const resetedPassword = async (req: Request, res: Response) => {
  const user_id = req.body.user_id;
  try {
    const user = await getUserID(user_id);
    if (user) {
      const hash_password = await hashPassword(user.email);
      await resetPassword(user_id, hash_password);
      res.status(200).json({ result: "パスワードをリセットしました" });
    } else {
      res.status(500).json({ error: "ユーザーの取得に失敗しました" });
    }
  } catch (err) {
    res.status(500).json({ error: "エラーが発生しました" });
  }
};
