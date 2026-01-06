import { Request, Response } from "express";
import {
  createCheckboxQuestion,
  createRadioButtonQuestion,
  deleteQuestion,
  editCheckboxQuestion,
  editRadioQuestion,
  getQuestion,
} from "../services/questionService";
import {
  getCategorys,
  getExameGroups,
  getCategory,
} from "../services/gernreService";
import { ExamGroup } from "../models/model";
import { error } from "console";

export const fetchQuestions = async (req: Request, res: Response) => {
  try {
    const exams = await getExameGroups();
    const gernres: ExamGroup[] = [];
    for (const exam of exams) {
      const category_lows = await getCategorys(exam.examgroup_id);
      for (const category of category_lows) {
        const question_lows = await getQuestion(category.category_id);
        category.questions = question_lows;
      }
      exam.categorys = category_lows;
      gernres.push(exam);
    }
    res.status(200).json({ gernres });
  } catch (error) {
    if (error instanceof Error) {
      console.error("データ取得失敗:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("予期しないエラー:", error);
    }

    res.status(500).json({ error: "データの取得に失敗しました" });
  }
};

export const createdRadioButtonQuestion = async (
  req: Request,
  res: Response
) => {
  const {
    question_category_id,
    question_memo,
    option_type,
    question_option,
    question_radio_answer,
    question_code,
  } = req.body;
  try {
    const question_oprion_json = JSON.stringify(question_option);
    const result = await createRadioButtonQuestion(
      question_category_id,
      question_memo,
      option_type,
      question_oprion_json,
      question_radio_answer,
      question_code
    );
    res.status(200).json({ message: "✅ 問題作成成功" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "❌ 問題作成に失敗しました" });
  }
};

export const createdCheckboxButtonQuestion = async (
  req: Request,
  res: Response
) => {
  const {
    question_category_id,
    question_memo,
    option_type,
    question_option,
    question_checkbox_answer,
    question_code,
  } = req.body;
  try {
    const question_oprion_json = JSON.stringify(question_option);
    const checkbox_answer_json = JSON.stringify(question_checkbox_answer);
    const result = await createCheckboxQuestion(
      question_category_id,
      question_memo,
      option_type,
      question_oprion_json,
      checkbox_answer_json,
      question_code
    );
    res.status(200).json({ message: "✅ 問題作成成功" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "❌ 問題作成に失敗しました" });
  }
};

export const createdQuestions = async (req: Request, res: Response) => {
  const { questions } = req.body;
  const resultMessages = [];
  for (const question of questions) {
    if (!question.question_memo.trim() || !question.question_code.trim()) {
      resultMessages.push({
        error: "問題文、もしくは解説が入力されていません",
      });
      continue;
    } else if (
      question.question_category_id == "" ||
      question.option_type == "" ||
      question.question_option.length === 0
    ) {
      resultMessages.push({
        error: "入力されていない項目があります",
      });
      continue;
    } else if (await getCategory(question.question_category_id)) {
      resultMessages.push({
        error: "カテゴリーが存在しません",
      });
      continue;
    } else if (question.option_type == "radiobutton") {
      if (question.question_radio_answer == "") {
        resultMessages.push({
          error: "ラジオタイプの回答が選択されていません",
        });
        continue;
      } else if (
        question.question_radio_answer > question.question_option.length ||
        0 > question.question_radio_answer ||
        question.question_radio_answer == null
      ) {
        resultMessages.push({
          error: "ラジオタイプの回答が不正です",
        });
        continue;
      } else {
        try {
          const result = await createRadioButtonQuestion(
            question.question_category_id,
            question.question_memo,
            question.option_type,
            JSON.stringify(question.question_option),
            question.question_radio_answer,
            question.question_code
          );
          resultMessages.push({
            result: "問題を作成しました",
          });
        } catch (error) {
          resultMessages.push({
            error: error,
          });
        }
      }
    } else if (question.option_type == "checkbox") {
      if (
        question.question_checkbox_answer.length == 0 ||
        question.question_checkbox_answer.every(
          (value: boolean) => value === false
        )
      ) {
        resultMessages.push({
          error: "チェックボックスの回答が選択されていません",
        });
        continue;
      } else if (
        question.question_checkbox_answer.length !=
        question.question_option.length
      ) {
        resultMessages.push({
          error: "チェックボックスの回答が不正です",
        });
        continue;
      } else {
        try {
          const result = await createCheckboxQuestion(
            question.question_category_id,
            question.question_memo,
            question.option_type,
            JSON.stringify(question.question_option),
            JSON.stringify(question.question_checkbox_answer),
            question.question_code
          );
          resultMessages.push({
            result: "問題を作成しました",
          });
        } catch (error) {
          resultMessages.push({
            error: error,
          });
        }
      }
    } else {
      resultMessages.push({
        error: "問題が発生しました",
      });
    }
  }
  res.status(200).json({ result: resultMessages });
};

export const deletedQuestion = async (req: Request, res: Response) => {
  const { question_id } = req.body;
  try {
    const result = await deleteQuestion(question_id);
    res.status(200).json({ message: "✅ 問題削除成功" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "❌ 問題削除に失敗しました" });
  }
};

export const editedRadioQuestion = async (req: Request, res: Response) => {
  const {
    question_id,
    question_category_id,
    question_memo,
    option_type,
    question_option,
    question_radio_answer,
    question_code,
  } = req.body;
  try {
    const result = await editRadioQuestion(
      question_id,
      question_category_id,
      question_memo,
      option_type,
      JSON.stringify(question_option),
      question_radio_answer,
      question_code
    );
    res.status(200).json({ message: "問題を編集しました" });
  } catch (err) {
    res.status(500).json({ error: "問題編集に失敗しました" });
  }
};

export const editedCheckboxQuestion = async (req: Request, res: Response) => {
  const {
    question_id,
    question_category_id,
    question_memo,
    option_type,
    question_option,
    question_checkbox_answer,
    question_code,
  } = req.body;
  try {
    const result = await editCheckboxQuestion(
      question_id,
      question_category_id,
      question_memo,
      option_type,
      JSON.stringify(question_option),
      JSON.stringify(question_checkbox_answer),
      question_code
    );
    res.status(200).json({ message: "問題を編集しました" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "問題編集に失敗しました" });
  }
};
