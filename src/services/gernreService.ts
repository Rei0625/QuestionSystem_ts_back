import { sql } from "./server.service";
import { ExamGroupDB, CategoryDB } from "../models/model";

export async function getExameGroups() {
  const [rows] = await sql.query<ExamGroupDB[]>("SELECT * FROM examgroup_info");
  return rows;
}

export async function selectExamGroup(examgroup_id: String) {
  const [rows] = await sql.query<ExamGroupDB[]>(
    "SELECT * FROM examgroup_info WHERE examgroup_id = ?",
    [examgroup_id]
  );
  return rows[0];
}

export async function selectCategory(category_id: String) {
  const [rows] = await sql.query<CategoryDB[]>(
    "SELECT * FROM category_info WHERE category_id = ?",
    [category_id]
  );
  return rows[0];
}

export async function getCategorys(examgroup_id: string) {
  const [rows]: any = await sql.query<CategoryDB[]>(
    "SELECT * FROM category_info WHERE category_examgroup_id = ?",
    [examgroup_id]
  );
  return rows;
}

export async function getCategory(category_id: string) {
  const [rows]: any = await sql.query<CategoryDB[]>(
    "SELECT * FROM category_info WHERE category_id = ?",
    [category_id]
  );
  console.log(rows);
  if (rows.length === 0) {
    return true;
  } else {
    return false;
  }
}

export async function createExamGroup(examgroup_name: string) {
  const examgroup_id = Date.now().toString();
  const [result] = await sql.query(
    "INSERT INTO ExamGroup_info (examgroup_id, examgroup_name, del_flg) VALUES (?, ?, ?)",
    [examgroup_id, examgroup_name, 0]
  );
  return result;
}

export async function createCategory(
  category_name: string,
  category_examgroup_id: string
) {
  const category_id = Date.now().toString();
  const [result] = await sql.query(
    "INSERT INTO Category_info (category_id, category_examgroup_id, category_name, del_flg) VALUES (?, ?, ?, ?)",
    [category_id, category_examgroup_id, category_name, 0]
  );
  return result;
}

export async function deleteExamgroup(examgroup_id: string) {
  const [result] = await sql.query(
    "DELETE FROM Examgroup_info WHERE examgroup_id = ?",
    [examgroup_id]
  );
  return result;
}

export async function deleteCategory(category_id: string) {
  const [result] = await sql.query(
    "DELETE FROM Category_info WHERE category_id = ?",
    [category_id]
  );
  return result;
}

export async function deleteCategorys(category_examgroup_id: string) {
  const [result] = await sql.query(
    "DELETE FROM Category_info WHERE category_examgroup_id = ?",
    [category_examgroup_id]
  );
  return result;
}

export async function editExamgroup(
  examgroup_id: string,
  examgroup_name: string
) {
  const [result] = await sql.query(
    "UPDATE Examgroup_info SET examgroup_name = ? WHERE examgroup_id = ?",
    [examgroup_name, examgroup_id]
  );
  return result;
}

export async function editCategory(
  category_id: string,
  category_name: string,
  category_examgroup_id: string
) {
  const [result] = await sql.query(
    "UPDATE Category_info SET category_name = ? , category_examgroup_id = ? WHERE category_id = ?",
    [category_name, category_examgroup_id, category_id]
  );
  return result;
}
