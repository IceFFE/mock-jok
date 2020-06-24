var http = require("http");
var fs = require("fs");
var url = require("url");
var status = require("./Status.json");
var { FormatUnit } = require("../Unit");

http.createServer(function (req, res) {
    console.log("start working: 6003");

    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Headers": "content-type,x-requested-with",
        "Access-Control-Allow-Origin": "*"
    });

    const { pathname } = url.parse(req.url, true);
    const jsonPath = "./json/" + pathname + ".json";
    const funcPath = "../func/" + pathname + ".js";

    new Promise(function (rs, rj) {
        fs.readFile(jsonPath, "utf-8", function (err, data) {
            if (err) {
                rj(JSON.stringify("读取文件失败"));
            } else {
                rs(FormatUnit.isJsonString(data) ? JSON.parse(data) : data);
            }
        });
    })
        .then(
            data => {
                const func = require(funcPath);
                res.end(
                    JSON.stringify({
                        code: 100,
                        msg: "处理成功",
                        result: typeof func === "function" ? func(data) : data
                    })
                );
            },
            err => {
                res.end(
                    JSON.stringify({
                        code: -1,
                        msg: "读取文件失败",
                        err
                    })
                );
            }
        )
        .catch(err => {
            res.end(
                JSON.stringify({
                    code: -2,
                    msg: "读取文件失败",
                    err
                })
            );
        });
}).listen(status.retrieve);
