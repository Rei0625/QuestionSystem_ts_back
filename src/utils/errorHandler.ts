import { Response } from 'express';

export function handleServerError(error: unknown, res: Response, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : '未知のエラー';
  const errorStack = error instanceof Error ? error.stack : null;

  console.error(`${context || '処理'}失敗:`, errorMessage);
  if (errorStack) console.error('Stack trace:', errorStack);

  res.status(500).json({ error: `${context || '処理'}に失敗しました` });
}