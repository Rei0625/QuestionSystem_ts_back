CREATE SCHEMA IF NOT EXISTS question_system;
USE question_system;

CREATE TABLE User_info (
    user_id VARCHAR(100) PRIMARY KEY COMMENT 'ユーザーID',
    admin_id INT DEFAULT 0 COMMENT '権限ID',
    user_name VARCHAR(100) COMMENT 'ユーザー名',
    password VARCHAR(256) COMMENT 'パスワード',
    email VARCHAR(255) COMMENT 'メールアドレス',
    del_flg TINYINT(1) NULL COMMENT '削除フラグ',
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ExamGroup_info (
    examgroup_id VARCHAR(100) PRIMARY KEY COMMENT '試験ID',
    examgroup_name VARCHAR(100) COMMENT '試験名',
    del_flg TINYINT(1) NULL COMMENT '削除フラグ',
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Category_info (
    category_id VARCHAR(100) PRIMARY KEY COMMENT 'カテゴリーID',
    category_examgroup_id VARCHAR(100) COMMENT '試験ID',
    category_name VARCHAR(100) COMMENT 'カテゴリー名',
    del_flg TINYINT(1) NULL COMMENT '削除フラグ',
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Question_info (
    question_id VARCHAR(100) PRIMARY KEY COMMENT '問題ID',
    question_category_id VARCHAR(100) COMMENT 'カテゴリーID',
    question_memo TEXT COMMENT '問題文',
    option_type VARCHAR(100) COMMENT '選択肢の形式',
    question_option TEXT COMMENT '選択肢(配列)',
    question_radio_answer TINYINT(1) NULL COMMENT 'ラジオボタン答え',
    question_checkbox_answer TEXT NULL COMMENT 'チェックボックス答え(配列)',
    question_code TEXT COMMENT '解説',
    del_flg TINYINT(1) NULL COMMENT '削除フラグ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Answer_info (
    answer_id VARCHAR(100) PRIMARY KEY COMMENT '回答ID',
    answer_user_id VARCHAR(100) COMMENT 'ユーザーID',
    answer_question_id VARCHAR(100) COMMENT '問題ID',
    answer VARCHAR(100) COMMENT '回答内容',
    answer_flg BOOLEAN NULL COMMENT '正誤判定'
    answer_examgroup_name VARCHAR(100) COMMENT '科目名',
    answer_category_name VARCHAR(300) COMMENT 'カテゴリー名'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;