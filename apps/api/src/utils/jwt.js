export const jwtSecret =
  process.env.JWT_ACCESS_SECRET ||
  process.env.JWT_SECRET ||
  "change_me_access";
