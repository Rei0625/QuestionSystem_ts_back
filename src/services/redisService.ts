import { QuestionData } from "../models/model";
import { redis } from "./server.service";

export class RedisService {
  async questionsDataEntry(questions_data: QuestionData[], user_id: string) {
    for (const question_data of questions_data) {
      const json_question_data = JSON.stringify(question_data);
      try {
        await redis.lpush("questions:" + user_id, json_question_data);
        await redis.expire("questions:" + user_id, 86400);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async questionDataEntry(question_data: QuestionData, user_id: string) {
    const json_question_data = JSON.stringify(question_data);
    await redis.lpush(user_id, json_question_data);
  }

  async questionDataClear(user_id: string) {
    await redis.del("questions:" + user_id);
  }

  async questionDataGet(user_id: string) {
    const result = await redis.lpop("questions:" + user_id);
    if (result == null) {
      return result;
    }
    return JSON.parse(result);
  }

  async createGuestAnswer(
    answer_guest_user_id: String,
    answer_question_id: String,
    answer: String[],
    answer_flg: boolean,
    answer_examgroup_name: String,
    answer_category_name: String
  ) {
    const answer_data = {
      answer_user_id: answer_guest_user_id,
      answer_question_id: answer_question_id,
      answer: answer,
      answer_flg: answer_flg,
      answer_examgroup_name: answer_examgroup_name,
      answer_category_name: answer_category_name,
    };
    await redis.lpush(
      "answers:" + answer_guest_user_id,
      JSON.stringify(answer_data)
    );
    await redis.expire("answers:" + answer_guest_user_id, 86400);
  }

  async getGuestAnswer(answer_user_id: string) {
    const answers = await redis.lrange("answers:" + answer_user_id, 0, -1);
    const answers_json = [];
    for (const answer of answers) {
      answers_json.push(JSON.parse(answer));
    }
    return answers_json;
  }

  //確認用プログラム
  async questionsDataGet(user_id: string) {
    const alldata = await redis.lrange("questions:" + user_id, 0, -1);
    console.log(alldata);
  }
}
