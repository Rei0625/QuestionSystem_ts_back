import { sql } from "./server.service";
import { AnswerDB, User } from "../models/model";

export async function getUsers() {
  const [rows] = await sql.query(
    "SELECT user_id, user_name, email, admin_id FROM user_info"
  );
  return rows;
}

export async function getUser(user_name: string): Promise<User | null> {
  const [rows]: any = await sql.query(
    "SELECT * FROM user_info WHERE user_name = ?",
    [user_name]
  );

  if (rows.length === 0) return null;

  return new User(rows[0]);
}

export async function getAnswer(user_id: string) {
  const [rows] = await sql.query(
    "SELECT * FROM answer_info WHERE answer_user_id = ?",
    [user_id]
  );

  return rows;
}

export async function createAnswer(
  answer_user_id: String,
  answer_question_id: String,
  answer: String[],
  answer_flg: boolean,
  answer_examgroup_name: String,
  answer_category_name: String
) {
  const json_answer = JSON.stringify(answer);
  const answer_id = Date.now().toString();
  const [result] = await sql.query(
    "INSERT INTO Answer_info (answer_id,answer_user_id,answer_question_id,answer,answer_flg,answer_examgroup_name,answer_category_name) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      answer_id,
      answer_user_id,
      answer_question_id,
      json_answer,
      answer_flg,
      answer_examgroup_name,
      answer_category_name,
    ]
  );
  return result;
}

export async function deleteUser(user_id: string) {
  const [result] = await sql.query("DELETE FROM user_info WHERE user_id = ?", [
    user_id,
  ]);
  return result;
}
