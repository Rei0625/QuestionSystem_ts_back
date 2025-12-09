export type UserType = {
  user_id: string;
  admin_id: number;
  user_name: string;
  password: string;
  email: string;
  del_flg?: number | null;
};

export type ExamGroupType = {
  examgroup_id: string;
  examgroup_name: string;
  del_flg?: number | null;
  categorys: CategoryType[] | null;
};

export type CategoryType = {
  category_id: string;
  category_examgroup_id: string;
  category_name: string;
  del_flg?: number | null;
  questions: QuestionType[] | null;
};

export type QuestionType = {
  question_id: string;
  question_category_id: string;
  question_memo: string;
  option_type: string;
  question_option: string;
  question_radio_answer: number | null;
  question_checkbox_answer: string | null;
  question_code: string;
  del_flg: number | null;
};

export type QuestionDataType = {
  question_id: string;
  question_category_id: string;
  question_memo: string;
  option_type: string;
  question_option: string[];
  question_radio_answer: number | null;
  question_checkbox_answer: boolean[] | null;
  question_code: string;
  del_flg: number | null;
  question_examgroup_name: string;
  question_category_name: string;
};

export type LoginRequestType = {
  email: string;
  password: string;
};

export type LoginResponseType = {
  token: string;
  user: UserType;
};

export type UploadUsersType = {
  admin_id: number;
  user_name: string;
  email: string;
};
