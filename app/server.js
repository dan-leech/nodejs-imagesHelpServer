var config = require("./config/config");
var http = require("http");
var url = require("url");

module.exports = function start(route) {
    function onReqest(request, response) {
        var path = url.parse(request.url).pathname.substr(1).split("/");

        route(path, response);
    }

    http.createServer(onReqest).listen(config.get("http:port"), function () {
        console.log("Server started on port: ", config.get("http:port"));
    });
};

