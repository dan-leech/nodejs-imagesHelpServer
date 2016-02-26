var config = require("./config/config");
var mysql = require("mysql");

var db = mysql.createPool({
    host: config.get("db:host"),
    port: config.get("db:port"),
    user: config.get("db:user"),
    password: config.get("db:password"),
    database: config.get("db:database")
});

module.exports = function handle_database(callback) {
    if(!(callback instanceof Function)) throw new Error("Wrong function parameters");

    db.getConnection(function (err, connection) {
        if (err) {
            callback({"code": 100, "status": "Error in connection database"});
            return;
        }

        console.log('MySQL connected as id ' + connection.threadId);

        callback(false, connection);

        connection.on('error', function (err) {
            console.error("Database connection error!!!");
            console.error(err);
        });
    });
};