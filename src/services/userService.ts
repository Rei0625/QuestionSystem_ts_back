import { sql } from "./server.service";
import { User } from "../models/model";

export async function getUsers() {
  const [rows] = await sql.query(
    "SELECT user_id, user_name, email, admin_id FROM user_info"
  );
  return rows;
}

export async function getUserName(user_name: string): Promise<User | null> {
  const [rows]: any = await sql.query(
    "SELECT * FROM user_info WHERE user_name = ?",
    [user_name]
  );

  if (rows.length === 0) return null;

  return new User(rows[0]);
}

export async function getUserID(user_id: string): Promise<User | null> {
  const [rows]: any = await sql.query(
    "SELECT * FROM user_info WHERE user_id = ?",
    [user_id]
  );

  if (rows.length === 0) return null;

  return new User(rows[0]);
}

export async function createUser(
  admin_id: number,
  user_name: string,
  email: string,
  password: string
) {
  const user_id = Date.now().toString();
  const [result] = await sql.query(
    "INSERT INTO User_info (user_id, admin_id, user_name, password, email, del_flg) VALUES (?, ?, ?, ?, ?, ?)",
    [user_id, admin_id, user_name, password, email, 0]
  );
  return result;
}

export async function deleteUser(user_id: string) {
  const [result] = await sql.query("DELETE FROM user_info WHERE user_id = ?", [
    user_id,
  ]);
  return result;
}

export async function resetPassword(user_id: string, password: string) {
  const [result] = await sql.query(
    "UPDATE user_info SET password = ? WHERE user_id = ?",
    [password, user_id]
  );
  return result;
}
