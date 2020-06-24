var http = require("http");
var fs = require("fs");
var url = require("url");
var status = require("./Status.json");
const { exec } = require("child_process");

http.createServer(function (req, res) {
    console.log("start working: 6001");

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    const { href } = url.parse(req.url, true);
    if (href !== "/index.html") {
        res.end("404");
        return;
    }

    fs.readFile("./index.html", "utf-8", function (err, data) {
        if (err) {
            res.end(err);
        } else {
            res.end(data);
        }
    });
}).listen(status.server);

function OpenDefaultBrowser(url) {
    switch (process.platform) {
        case "darwin":
            exec(`open ${url}`);
        case "win32":
            exec(`start ${url}`);
    }
}
OpenDefaultBrowser("http://localhost:6001/index.html");
