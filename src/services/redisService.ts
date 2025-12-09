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
    console.log(result);
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

// await redis.set('key', 'value');

// const value = await redis.get('key');
// console.log(value); // string | null

// const deletedCount = await redis.del('key');
// console.log(deletedCount);  // 削除されたキー数（0か1）

//   // 1. 左端に要素を追加（LPUSH）
//   await redis.lpush('tasks', 'task1');
//   await redis.lpush('tasks', 'task2');
//   // 今のtasksリスト: ['task2', 'task1']

//   // 2. 右端に要素を追加（RPUSH）
//   await redis.rpush('tasks', 'task3');
//   // tasksリスト: ['task2', 'task1', 'task3']

//   // 3. リストの全要素を取得（LRANGE）
//   const allTasks = await redis.lrange('tasks', 0, -1);
//   console.log('タスク一覧:', allTasks);
//   // 出力: ['task2', 'task1', 'task3']

//   // 4. 左端から要素を取り出して削除（LPOP）
//   const firstTask = await redis.lpop('tasks');
//   console.log('取り出したタスク:', firstTask);
//   // 出力: 'task2'

//   // 5. リストの長さを取得（LLEN）
//   const length = await redis.llen('tasks');
//   console.log('残りのタスク数:', length);
//   // 出力: 2

//   // 最後に接続を閉じる
//   redis.disconnect();
// }

// redisListExample().catch(console.error);
