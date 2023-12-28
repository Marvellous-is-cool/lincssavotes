// sessionStore.js

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const connection = require("./models/connection");

const sessionStore = new MySQLStore(
  {
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  connection.promise()
);

module.exports = sessionStore;
