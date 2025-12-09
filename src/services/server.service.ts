import express from "express";
import Routes from "../routes/Routes";
import cors from "cors";
import mysql from "mysql2/promise";
import Redis from "ioredis";
import cookieParser from "cookie-parser";
import cookieService from "./cookieService";
import path from "path";

// ✅ MySQL（DB）プールを定義・接続
const sql = mysql.createPool({
  host: "localhost", //MySQLのIPアドレス
  port: 3306,
  user: "root",
  password: "password",
  database: "question_system",
  waitForConnections: true,
  connectionLimit: 300,
  queueLimit: 0,
});

// ✅ Redis 接続（ioredis 使用）
const redis = new Redis({
  host: "localhost", //RedisのIPアドレス
  port: 6379,
});

redis.on("connect", () => {
  console.log("🔗 Redis に接続しました");
});

redis.on("error", (err) => {
  console.error("❌ Redis 接続エラー:", err);
});

// ✅ Express アプリ構築
const app = express();
app.use(
  cors({
    origin: ["http://localhost:4200", "http://172.16.30.24:4200"], //フロントエンドサーバのIPアドレス
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ルーティングの設定
app.use("/api", Routes);

const angularDistPath = path.join(
  __dirname,
  "dist",
  "QuestionSystem_ts_front",
  "browser"
);

// 静的ファイルを配信する
app.use(express.static(angularDistPath));

// ルートアクセスはAngularのindex.htmlを返す
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(angularDistPath, "index.html"));
});

// ✅ サーバー起動 → `yarn start` でここが動く
const PORT = 3000;
app.listen(PORT, () => {
  console.log("🌐 サーバー実行中");
});

// ✅ 他ファイルで app, sql, redis を使いたいとき用に export
export { app, sql, redis };
