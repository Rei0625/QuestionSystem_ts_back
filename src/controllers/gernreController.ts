import { Request, Response } from "express";
import {
  createCategory,
  createExamGroup,
  deleteCategory,
  deleteExamgroup,
  getCategorys,
  getExameGroups,
  deleteCategorys,
  editExamgroup,
  editCategory,
} from "../services/gernreService";
import { ExamGroup } from "../models/model";
import { deleteQuestions } from "../services/questionService";

export const fetchGernres = async (req: Request, res: Response) => {
  try {
    const exams = await getExameGroups();
    const gernres: ExamGroup[] = [];
    for (const exam of exams) {
      const category_lows = await getCategorys(exam.examgroup_id);
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

export const fetchExamgroups = async (req: Request, res: Response) => {
  try {
    const examgroups = await getExameGroups();
    res.status(200).json({ examgroups });
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

export const createdExamgroup = async (req: Request, res: Response) => {
  const { examgroup_name } = req.body;
  try {
    const result = await createExamGroup(examgroup_name);

    console.log("✅ 試験科目作成成功:", result);
    res.status(200).json({ message: "✅ 試験科目作成成功" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "❌ 試験科目作成に失敗しました" });
  }
};

export const createdCatagory = async (req: Request, res: Response) => {
  const { category_name, category_examgroup_id } = req.body;
  try {
    const result = await createCategory(category_name, category_examgroup_id);

    console.log("✅ 試験科目作成成功:", result);
    res.status(200).json({ message: "✅ 試験科目作成成功" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "❌ 試験科目作成に失敗しました" });
  }
};

export const deletedExamgroup = async (req: Request, res: Response) => {
  const { examgroup_id } = req.body;
  try {
    const result = await deleteExamgroup(examgroup_id);
    const categorys = await getCategorys(examgroup_id);
    const result2 = await deleteCategorys(examgroup_id);
    for (const category of categorys) {
      await deleteQuestions(category.category_id);
    }
    console.log(result);
    res.status(200).json({ message: "試験科目削除を行いました" });
  } catch (erroe) {
    console.log(erroe);
    res.status(500).json({ error: "試験科目削除に失敗しました" });
  }
};

export const deletedCategory = async (req: Request, res: Response) => {
  const { category_id } = req.body;
  try {
    const result = await deleteCategory(category_id);
    const result2 = await deleteQuestions(category_id);
    console.log(result);
    res.status(200).json({ message: "カテゴリーを削除しました" });
  } catch (erroe) {
    console.log(erroe);
    res.status(500).json({ error: "カテゴリー削除に失敗しました" });
  }
};

export const editedExamgroup = async (req: Request, res: Response) => {
  const { examgroup_id, examgroup_name } = req.body;
  try {
    const result = await editExamgroup(examgroup_id, examgroup_name);
    res.status(200).json({ message: "試験科目を編集しました" });
  } catch (error) {
    res.status(500).json({ error: "試験科目編集に失敗しました" });
  }
};

export const editedCategory = async (req: Request, res: Response) => {
  const { cateogry_id, cateogry_name, category_examgroup_id } = req.body;
  try {
    const result = await editCategory(
      cateogry_id,
      cateogry_name,
      category_examgroup_id
    );
    res.status(200).json({ message: "カテゴリー名を編集しました" });
  } catch (error) {
    res.status(500).json({ error: "カテゴリー名の編集に失敗しました" });
  }
};
