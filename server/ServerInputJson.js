var http = require("http");
var fs = require("fs");
var url = require("url");
var status = require("./Status.json");

http.createServer(function (req, res) {
    console.log("start working: 6002");

    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Headers": "content-type,x-requested-with",
        "Access-Control-Allow-Origin": "*"
    });

    const { href } = url.parse(req.url, true);
    if (href !== "/createData" || req.method !== "POST") {
        res.end(JSON.stringify({ code: 404 }));
        return;
    }

    let data = "";
    req.on("data", function (chunk) {
        data += chunk;
    });

    req.on("end", function () {
        data = decodeURI(data);
        const { src, type, json, func } = JSON.parse(data);
        const jsonPath = "./json/" + src + "." + type + ".json";
        const funcPath = "./func/" + src + "." + type + ".js";
        const writeJson = new Promise(function (rs, rj) {
            fs.writeFile(jsonPath, json, function (err) {
                if (err) {
                    rj(err);
                } else {
                    rs();
                }
            });
        });
        const writeFunc = new Promise(function (rs, rj) {
            fs.writeFile(funcPath, func, function (err) {
                if (err) {
                    rj(err);
                } else {
                    rs();
                }
            });
        });
        Promise.all([writeJson, writeFunc]).then(
            function () {
                res.end(
                    JSON.stringify({
                        code: 100,
                        msg: "写入文件成功"
                    })
                );
            },
            function (err) {
                res.end(
                    JSON.stringify({
                        code: -1,
                        msg: "写入文件失败",
                        err
                    })
                );
            }
        );
    });
}).listen(status.create);
