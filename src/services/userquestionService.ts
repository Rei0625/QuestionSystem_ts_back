import { Request, Response } from "express";
import { getQuestion } from "./questionService";
import { getCategorys, selectExamGroup, selectCategory } from "./gernreService";
import { Category, ExamGroup, QuestionData } from "../models/model";
import { RedisService } from "./redisService";

export class UserQuestionService {
  questions_data: QuestionData[] = [];
  key_questions_id: String[] = [];

  constructor(private redis: RedisService) {}

  async storeQuestionData(examgroups: ExamGroup[], user_id: string) {
    for (const examgroup of examgroups) {
      for (const category of examgroup.categorys ?? []) {
        for (const question of category.questions ?? []) {
          const question_data: QuestionData = {
            question_id: question.question_id,
            question_category_id: question.question_category_id,
            question_memo: question.question_memo,
            option_type: question.option_type,
            question_option: question.question_option
              ? JSON.parse(question.question_option)
              : null,
            question_radio_answer: question.question_radio_answer,
            question_checkbox_answer: question.question_checkbox_answer
              ? JSON.parse(question.question_checkbox_answer)
              : null,
            question_code: question.question_code,
            del_flg: question.del_flg,
            question_examgroup_name: examgroup.examgroup_name,
            question_category_name: category.category_name,
          };

          this.questions_data.push(question_data);
        }
      }
    }
    this.shuffleQuestions();
    await this.sessionRegister(user_id);

    return "test";
  }

  shuffleQuestions() {
    const arr = this.questions_data;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  async sessionRegister(user_id: string) {
    console.log(user_id);
    await this.redis.questionsDataEntry(this.questions_data, user_id);
  }
}
