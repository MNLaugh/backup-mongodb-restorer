

var expect = require('chai').expect;
var databaseUri = "mongodb://172.23.129.6:27017/test";
var zipFilePath = "./test/dev_19_9_16.21.40.28.zip";
var restore = require("../index");
var winston = require("winston");

var useObjectID = false; //this tells the module that your collections uses the default generated mongodb ObjectID.

// var done = function() { winston.info("Database Restoration Complete from Done Callback"); }

//you can call this to do the restoration
 restore(databaseUri, zipFilePath, useObjectID).then(console.log).catch(console.error);

 //or you can specify a done callback in the for the restore method
 // new Restore(databaseUri, zipFilePath).restore(done);


//to run this section, modify the package.json file and change the test in the scripts
//section to make test instead of node ./test/test.js and uncomment the describe below


// Note:
  // * You will need to have [make](http://www.equation.com/servlet/equation.cmd?fa=make) installed on your system 
  // 	to run the test for windows

// describe("restore", function() {
  
//   it("resotres the sample backupfile dev_19_9_16.21.40.28.zip into test db", function(done) {

//   	var restore = new Restore(databaseUri, zipFilePath);

//     expect( function() { restore.restore(done); } ).to.not.throw(Error);
    
//   });

// });