import bcrypt from "bcryptjs"; // bcryptをインポート

// パスワードをハッシュ化する関数
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 12); // 12ラウンドでハッシュ化
  return hashedPassword;
}

// パスワードを検証する関数
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword); // ハッシュと照合
  return isValid;
}
