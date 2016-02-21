var imageModel = require("./models/image");

module.exports = function route(path, response) {
    if (path.length) {
        var cmd = path.shift();
        switch (cmd) {
            case "getimg":
                imageModel.getImage(path, response);
                break;
            case "getimgcount":
                imageModel.getImagesCount(path, response);
                break;
            default:
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not found");
                response.end();
        }
    }
};