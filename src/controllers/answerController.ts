import { Request, Response } from "express";
import { getUsers } from "../services/userService";
import { createAnswer, getAnswer } from "../services/answerService";
import { AnswerDB } from "../models/model";
import { RedisService } from "../services/redisService";

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

export const createdAnswer = async (req: Request, res: Response) => {
  try {
    const {
      answer_user_id,
      answer_question_id,
      answer,
      answer_flg,
      answer_examgroup_name,
      answer_category_name,
    } = req.body;
    const result = await createAnswer(
      answer_user_id,
      answer_question_id,
      answer,
      answer_flg,
      answer_examgroup_name,
      answer_category_name
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: "成績登録失敗" });
  }
};

export const createdGuestAnswer = async (req: Request, res: Response) => {
  const redis: RedisService = new RedisService();
  try {
    const {
      answer_guest_user_id,
      answer_question_id,
      answer,
      answer_flg,
      answer_examgroup_name,
      answer_category_name,
    } = req.body;
    const result = await redis.createGuestAnswer(
      answer_guest_user_id,
      answer_question_id,
      answer,
      answer_flg,
      answer_examgroup_name,
      answer_category_name
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: "成績登録失敗" });
  }
};

export const getedAnswer = async (req: Request, res: Response) => {
  try {
    const user_id = req.body.user_id;
    const answers = await getAnswer(user_id);
    res.status(200).json({ answers: answers });
  } catch (err) {
    res.status(500).json({ error: "スコア取得失敗" });
  }
};

export const getedGuestAnswer = async (req: Request, res: Response) => {
  try {
    const guest_user_id = req.body.guest_user_id;
    const redis: RedisService = new RedisService();
    const answers = await redis.getGuestAnswer(guest_user_id);
    res.status(200).json({ answers: answers });
  } catch (err) {
    res.status(500).json({ error: "スコア取得失敗" });
  }
};
