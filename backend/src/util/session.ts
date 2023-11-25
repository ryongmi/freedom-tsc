import session from "express-session";
const MySQLStore = require("express-mysql-session")(session);

type User = {
  userId: number;
  authId: number;
};

declare module "express-session" {
  interface SessionData {
    user: User;
    isLoggedIn: boolean;
    access_token: string;
  }
}

const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
};

const sessionConfig = session({
  secret: process.env.SESSION_SECRET as string,
  name: "freedom-session",
  store: new MySQLStore(options),
  resave: false,
  saveUninitialized: true,
});

export default sessionConfig;
