import { Request, Response } from "express";
import { RedisService } from "../services/redisService";

export const redisQuestionDataClear = async (req: Request, res: Response) => {
  try {
    const user_id = req.body.user_id;
    const redis = new RedisService();
    redis.questionDataClear(user_id);
    res.status(200).json({ result: user_id });
  } catch (error) {
    res.status(500).json({ error: "エラーが発生しました。" });
  }
};
