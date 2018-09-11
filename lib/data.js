/**
 * Lib for file operations
 */
//
const fs = require("fs");
const path = require("path");

//Container for the module to be exported
const lib = {
  baseDir: path.join(__dirname, "/../.data/"),

  create: function(dir, file, data, callback) {
    filePath = this.baseDir + dir + "/" + file + ".json";
    fs.open(filePath, "wx", (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        let stringData = JSON.stringify(data);
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new file");
              }
            });
          } else {
            callback("Error writing to new file.");
          }
        });
      } else {
        callback("Could not create new file, it may already exist.");
      }
    });
  },

  read: function(dir, file, callback) {
    fs.readFile(
      this.baseDir + dir + "/" + file + ".json",
      "utf8",
      (err, res) => {
        callback(err, res);
      }
    );
  },

  update: function(dir, file, data, callback) {
    fs.open(
      this.baseDir + dir + "/" + file + ".json",
      "r+",
      (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
          fs.truncate(fileDescriptor, err => {
            if (!err) {
              const stringData = JSON.stringify(data);
              fs.writeFile(fileDescriptor, stringData, err => {
                if (!err) {
                  fs.close(fileDescriptor, err => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback("Error closing existing file.");
                    }
                  });
                } else {
                  callback("Error writing to the file.");
                }
              });
            } else {
              callback("Error truncating the file");
            }
          });
        } else {
          callback(
            "Could not open the file for updating. it might not exist yet."
          );
        }
      }
    );
  },

  delete: function(dir, file, callback) {
    fs.unlink(this.baseDir + dir + "/" + file + ".json", err => {
      if (!err) {
        callback(false);
      } else {
        callback("Error deleting the file");
      }
    });
  }
};

module.exports = lib;
