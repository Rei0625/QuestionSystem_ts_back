import { QuestionDB } from "../models/model";
import { sql } from "./server.service";

export async function createRadioButtonQuestion(
  question_category_id: string,
  question_memo: string,
  option_type: string,
  question_option: string,
  question_radio_answer: number,
  question_code: string
) {
  const question_id = Date.now().toString();
  console.log(question_radio_answer);
  const [result] = await sql.query(
    "INSERT INTO Question_info (question_id, question_category_id, question_memo, option_type, question_option, question_radio_answer, question_code, del_flg ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      question_id,
      question_category_id,
      question_memo,
      option_type,
      question_option,
      question_radio_answer ?? null,
      question_code,
      0,
    ]
  );
  return result;
}

export async function createCheckboxQuestion(
  question_category_id: string,
  question_memo: string,
  option_type: string,
  question_option: string,
  question_checkbox_answer: string,
  question_code: string
) {
  const question_id = Date.now().toString();
  const [result] = await sql.query(
    "INSERT INTO Question_info (question_id, question_category_id, question_memo, option_type, question_option, question_checkbox_answer, question_code, del_flg ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      question_id,
      question_category_id,
      question_memo,
      option_type,
      question_option,
      question_checkbox_answer,
      question_code,
      0,
    ]
  );
  return result;
}

export async function getQuestion(category_id: string) {
  const [rows]: any = await sql.query<QuestionDB[]>(
    "SELECT * FROM question_info WHERE question_category_id = ?",
    [category_id]
  );
  return rows;
}

export async function deleteQuestions(question_category_id: string) {
  const [result] = await sql.query(
    "DELETE FROM Question_info WHERE question_category_id = ?",
    [question_category_id]
  );
  return result;
}

export async function deleteQuestion(question_id: string) {
  const [result] = await sql.query(
    "DELETE FROM Question_info WHERE question_id = ?",
    [question_id]
  );
  return result;
}

export async function editRadioQuestion(
  question_id: string,
  question_category_id: string,
  question_memo: string,
  option_type: string,
  question_option: string,
  question_radio_answer: number,
  question_code: string
) {
  const [result] = await sql.query(
    "UPDATE Question_info SET question_category_id = ?, question_memo = ?, option_type = ?, question_option = ?, question_radio_answer = ?, question_code = ? WHERE question_id = ?",
    [
      question_category_id,
      question_memo,
      option_type,
      question_option,
      question_radio_answer,
      question_code,
      question_id,
    ]
  );
  return result;
}

export async function editCheckboxQuestion(
  question_id: string,
  question_category_id: string,
  question_memo: string,
  option_type: string,
  question_option: string,
  question_checkbox_answer: string,
  question_code: string
) {
  const [result] = await sql.query(
    "UPDATE Question_info SET question_category_id = ?, question_memo = ?, option_type = ?, question_option = ?, question_checkbox_answer = ?, question_code = ? WHERE question_id = ?",
    [
      question_category_id,
      question_memo,
      option_type,
      question_option,
      question_checkbox_answer,
      question_code,
      question_id,
    ]
  );
  return result;
}

export async function aiQuestionGet() {
  const [result] = await sql.query<QuestionDB[]>("SELECT * FROM question_info");
  return result;
}
