const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: process.env.DB_HOST as string,
  port: 3306 as number,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_SCHEMA as string,
};

const sessionConfig = session({
  secret: process.env.SESSION_SECRET as string,
  name: "freedom-session",
  store: new MySQLStore(options),
  resave: false,
  saveUninitialized: true,
});

export default sessionConfig;
