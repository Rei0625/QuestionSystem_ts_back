import { Request, Response } from "express";
import { getQuestion } from "../services/questionService";
import {
  getCategorys,
  selectExamGroup,
  selectCategory,
} from "../services/gernreService";
import { Category, ExamGroup } from "../models/model";
import { UserQuestionService } from "../services/userquestionService";
import { RedisService } from "../services/redisService";

export const getExamQuestions = async (req: Request, res: Response) => {
  const { exams, user_id } = req.body;
  const examgroups: ExamGroup[] = [];
  try {
    for (const exam of exams) {
      const examgroup: ExamGroup = await selectExamGroup(exam);
      const categorys = await getCategorys(examgroup.examgroup_id);
      for (const category of categorys) {
        const questions = await getQuestion(category.category_id);
        category.questions = questions;
      }
      examgroup.categorys = categorys;
      examgroups.push(examgroup);
    }
    const redis = new RedisService();
    const user_quest = new UserQuestionService(redis);
    const test = await user_quest.storeQuestionData(examgroups, user_id);
    res.status(200).json({ result: test });
  } catch (err) {
    res.status(500).json({ error: "データの登録に失敗しました" });
  }
};

export const getFieldQuestions = async (req: Request, res: Response) => {
  const { field, field_select, user_id } = req.body;
  const examgroups: ExamGroup[] = [];
  const categorys: Category[] = [];
  try {
    for (const category_id of field) {
      const category = await selectCategory(category_id);
      category.questions = await getQuestion(category.category_id);
      categorys.push(category);
    }
    for (const exam_id of field_select) {
      const examgroup: ExamGroup = await selectExamGroup(exam_id);
      examgroup.categorys = [];
      for (const category of categorys) {
        if (category.category_examgroup_id == examgroup.examgroup_id) {
          examgroup.categorys.push(category);
        }
      }
      examgroups.push(examgroup);
    }

    const redis = new RedisService();
    const user_quest = new UserQuestionService(redis);
    const test = await user_quest.storeQuestionData(examgroups, user_id);
    res.status(200).json({ result: test });
  } catch (err) {
    res.status(500).json({ error: "データの登録に失敗しました" });
  }
};

export const getMockQuestions = async (req: Request, res: Response) => {
  try {
    const { examgroup_id, user_id } = req.body;
    const examgroups: ExamGroup[] = [];
    const examgroup: ExamGroup = await selectExamGroup(examgroup_id);
    const categorys = await getCategorys(examgroup.examgroup_id);
    for (const category of categorys) {
      category.questions = await getQuestion(category.category_id);
    }

    examgroup.categorys = categorys;
    examgroups.push(examgroup);

    const redis = new RedisService();
    const user_quest = new UserQuestionService(redis);
    const test = await user_quest.storeQuestionData(examgroups, user_id);
    res.status(200).json({ result: test });
  } catch (err) {
    res.status(500).json({ error: "データの登録に失敗しました" });
  }
};

export const getQuestionDataGet = async (req: Request, res: Response) => {
  const user_id = req.body.user_id;
  const redis = new RedisService();
  try {
    const result = await redis.questionDataGet(user_id);
    res.status(200).json({ question_data: result });
  } catch (err) {
    res.status(500).json({ error: "データ取得に失敗しました" });
  }
};
