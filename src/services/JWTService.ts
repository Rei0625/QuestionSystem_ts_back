import jwt from "jsonwebtoken";

export const tokenCreate = async (user:any) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      admin_id: user.admin_id,
      role: user.admin_id,
    },
    "localhost",
    { expiresIn: "12h" }
  );
};

export const tokenPayload = async (token: string) => {
  try {
    const decoded: string | object = jwt.verify(token, "localhost");
    return decoded;
  } catch (error) {
    return null;
  }
};
