// import * as http from "http";
const http = require("http");
const lib = require("./lib/data");

// lib.create("test", "test", { hello: "world" }, err => {
//   if (err) console.log(err);
// });

// lib.read("test", "test", (err, data) => {
//   console.log(err, data);
//   lib.update("test", "test", { foo: "bar" }, err => {
//     if (err) {
//       console.log(err);
//     }
//   });
// });

lib.delete("test", "test", err => {
  console.log(err);
});
