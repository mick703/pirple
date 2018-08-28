var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var fs = require("fs");

var httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, function() {
  console.log(
    "The server is listening on port " +
      config.httpPort +
      " : " +
      config.envName
  );
});

var httpsSeverOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};

var httpsServer = https.createServer(httpsSeverOptions, function(req, res) {
  unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, function() {
  console.log(
    "The server is listening on port " +
      config.httpsPort +
      " : " +
      config.envName
  );
});

var handlers = {
  sample: function(data, callback) {
    //Callback a http status code, a payload object
    callback(200, data);
  },
  notFound: function(data, callback) {
    callback(404);
  }
};

//Define a request router
var router = {
  sample: handlers.sample
};

var unifiedServer = function(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  var method = req.method.toLowerCase();
  var queryStringObject = parsedUrl.query;
  var headers = req.headers;

  var decoder = new StringDecoder("utf-8");
  var payload = "";
  req.on("data", function(data) {
    payload += decoder.write(data);
  });
  req.on("end", function() {
    payload += decoder.end();

    //Route the request
    var handler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers["notFound"];

    var data = {
      trimmedPath: trimmedPath,
      queryStringObjct: queryStringObject,
      method: method,
      headers: headers,
      payload: payload
    };

    handler(data, function(statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      payload = typeof payload == "object" ? payload : {};

      //Convert the payload to string
      var payloadString = JSON.stringify(payload);

      //Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log(
        "Request received on path: " + trimmedPath + " with method: " + method
      );
      console.log(
        "Request received with query string params: ",
        queryStringObject
      );

      console.log("Returning status code: ", statusCode);
      console.log("Returning payload: ", payloadString);
    });
  });
};
