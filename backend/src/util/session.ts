import session from "express-session";

// const session = require("express-session");

type User = {
  USER_ID: string;
  AUTH_ID: string;
};

declare module "express-session" {
  interface SessionData {
    user: User;
    isLoggedIn: boolean;
    access_token: string;
  }
}

const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: process.env.DB_HOST,
  port: 3306,
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
