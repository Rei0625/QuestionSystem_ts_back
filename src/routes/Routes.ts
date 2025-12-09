import { Router } from "express";
import {
  changedPassword,
  createdUsers,
  deletedUser,
  fetchUsers,
  login,
  resetedPassword,
} from "../controllers/userController";
import { createdUser } from "../controllers/userController";
import {
  createdCatagory,
  createdExamgroup,
  deletedCategory,
  deletedExamgroup,
  editedCategory,
  editedExamgroup,
  fetchExamgroups,
  fetchGernres,
} from "../controllers/gernreController";
import {
  createdCheckboxButtonQuestion,
  createdQuestions,
  createdRadioButtonQuestion,
  deletedQuestion,
  editedCheckboxQuestion,
  editedRadioQuestion,
  fetchQuestions,
} from "../controllers/questionController";
import {
  getExamQuestions,
  getFieldQuestions,
  getMockQuestions,
  getQuestionDataGet,
} from "../controllers/userQuestionController";
import {
  createdAnswer,
  createdGuestAnswer,
  getedAnswer,
  getedGuestAnswer,
} from "../controllers/answerController";
import { redisQuestionDataClear } from "../controllers/redisController";
import { loginAdminCheck, logout } from "../controllers/authController";

const router = Router();
//一般ユーザー用API
router.get("/user/getusers", fetchUsers);
router.post("/user/login", login);
router.post("/user/create_user", createdUser);
router.post("/user/exam_questions_get", getExamQuestions);
router.post("/user/field_questions_get", getFieldQuestions);
router.post("/user/mock_questions_get", getMockQuestions);
router.post("/user/answer", createdAnswer);
router.post("/user/guest_answer", createdGuestAnswer);
router.post("/user/change_password", changedPassword);
router.post("/user/get_score", getedAnswer);
router.post("/user/get_guest_score", getedGuestAnswer);

//管理者用ユーザー管理API
router.get("/manage/user_get", fetchUsers);
router.post("/manage/user_delete", deletedUser);
router.post("/manage/user_reset_password", resetedPassword);
router.post("/manage/create_users", createdUsers);

//管理者用分野管理API
router.get("/manage/gernres_get", fetchGernres);
router.get("/manage/examgroups_get", fetchExamgroups);
router.post("/manage/examgroup_create", createdExamgroup);
router.post("/manage/examgroup_edit", editedExamgroup);
router.post("/manage/category_create", createdCatagory);
router.post("/manage/category/edit", editedCategory);
router.post("/manage/delete_examgroup", deletedExamgroup);
router.post("/manage/delete_category", deletedCategory);

//管理者用問題管理API
router.get("/manage/questions_get", fetchQuestions);
router.post("/manage/question/radiobutton_create", createdRadioButtonQuestion);
router.post("/manage/question/checkbox_create", createdCheckboxButtonQuestion);
router.post("/manage/delete_question", deletedQuestion);
router.post("/manage/question_create/upload", createdQuestions);
router.post("/manage/question/radiobutton_edit", editedRadioQuestion);
router.post("/manage/question/checkbox_edit", editedCheckboxQuestion);

//Redis操作用API
router.post("/redis/clear", redisQuestionDataClear);
router.post("/redis/questions_data_get", getQuestionDataGet);

//権限確認用
router.post("/auth/verify", loginAdminCheck);
router.post("/logout", logout);

export default router;
