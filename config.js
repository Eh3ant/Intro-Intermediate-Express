/** Common settings for auth-api app. */

const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql://postgres:ehsan@localhost/express_auth_test"
  : "postgresql://postgres:ehsan@localhost/express_auth";

const SECRET_KEY = process.env.SECRET_KEY || "thisisasecretkeyforcreatingatoken12345";

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR
};




