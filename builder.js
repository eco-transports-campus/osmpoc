/**
 *  Config Variable
**/
const Config = {
    JS_IN: 'app/src',
    JS_OUT: 'app/www/js'
  };



/**
 *  Dependencies
**/
const fs = require('fs'),
      browserify = require('browserify');



/**
 *  Main Process
**/
fs
  // Retrieve all JS source file
  .readdirSync(Config.JS_IN)
  .forEach(function(file) {
    var inPath = Config.JS_IN + '/' + file,
        outPath = Config.JS_OUT + '/' + file;

    console.log('\tBuild: ' + inPath + ' -> ' + outPath);

    // For each JS src write the output into the application
    browserify(inPath)
      .transform("babelify", { presets: ["env"] })
      .bundle()
      .pipe(fs.createWriteStream(outPath));
  });
  
console.log('\tFinished');