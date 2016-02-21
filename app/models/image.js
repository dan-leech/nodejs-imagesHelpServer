var db = require("../db");
var fs = require("fs");
var path = require('path');

function _errorHandler(err, response, callback) {
    if (!(callback instanceof Function)) throw new Error("Wrong function parameters");
    if (!err) {
        callback(response);
    } else {
        switch(err.code) {
            case 404:
                response.writeHead("404", {"Content-Type": "text/plain"});
                response.write("404 Not Found.");
                break;
            case 500:
                response.writeHead("500", {"Content-Type": "text/plain"});
                response.write("Server problems.");
                break;
            default:
                response.writeHead("404", {"Content-Type": "text/plain"});
                response.write("404 Not Found.");
                break;
        }
        response.end();
    }
}

function getImage(idPath, response) {
    _getImgPath(idPath, function (err, file) {
        _errorHandler(err, response, function(response) {
            file = path.normalize(__dirname + '/../' + file);
            fs.access(file, fs.F_OK, function (err) {
                if(err) {
                    err = {code: 404};
                    console.log('Image not found: ', file);
                }
                _errorHandler(err, response, function (response) {
                    var mime = 'text/plain';
                    var ext =   path.extname(file);
                    switch (ext) {
                        case ".jpg":
                        case ".jpeg":
                            mime = "image/jpeg";
                            break;
                        case ".png":
                            mime = "image/png";
                            break;
                        case ".gif":
                            mime = "image/gif";
                            break;
                    }
                    fs.readFile(file, function (err, data) {
                        if(err) {
                            err = {code: 500};
                            console.error('Error fs.access!!! ', file);
                        }
                        _errorHandler(err, response, function (response) {
                            response.writeHead(200, {'Content-Type': mime});
                            response.end(data);
                            console.log('Image sent: ', file);
                        });
                    });
                });
            });
        });

    });
}

function _getImgPath (idPath, callback) {
    if ((typeof idPath !== 'number' && !Array.isArray(idPath)) || !(callback instanceof Function)) throw new Error("Wrong function parameters");
    db(function(err, connection) {
        if(!err) {
            var id = 0,
                num = 0;
            if(Array.isArray(idPath)) {
                id = idPath[0];
                if(idPath.length > 1)
                    num = idPath[1];
            } else
                id = idPath;
            connection.query('SELECT url FROM photo WHERE id = ' + parseInt(id, 10), function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length && num < rows.length)
                        callback(false, rows[num].url);
                    else
                        callback({code: 404});
                }
                else
                    callback({code: 500});

            });
        } else {
            callback({code: 500});
        }

    });

}

function getImagesCount(id, response) {
    _getImgCount(id, function (err, count) {
        _errorHandler(err, response, function (response) {
            response.writeHead("200", {"Content-Type": "text/plain"});
            response.write(count.toString());
            response.end();
        });
    });
}

function _getImgCount (id, callback) {
    if (!(callback instanceof Function)) throw new Error("Wrong function parameters");
    db(function(err, connection) {
        if(!err) {
            connection.query('SELECT COUNT(id) as count FROM photo WHERE id = ' + parseInt(id, 10), function (err, rows) {
                connection.release();
                if (!err) {
                    if (rows.length)
                        callback(false, rows[0].count);
                    else
                        callback({code: 404});
                }
                else
                    callback({code: 500});

            });
        } else {
            callback({code: 500});
        }

    });

}

exports.getImage = getImage;
exports.getImagesCount = getImagesCount;