import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret is not defined in environment");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 60 * 60 * 1000,
  });

  return token;
};
