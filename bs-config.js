const ssi = require('browsersync-ssi');

module.exports = {
  "files": "./dist/**/*.css, ./dist/**/*.js, ./dist/**/*.html, ./dist/**/*.php",
  "server": {
    baseDir: "./dist/",
    index: "index.html"
  },
  "proxy": false,
  "port": 3000,
  "middleware": ssi({
    baseDir: "./dist",
    ext: ".html",
    version: "1.4.0"
  })
}