# backup-mongodb-restorer

This module will restore backup of mongodb in .zip created by [backup-mongodb](https://github.com/SeunMatt/backup-mongodb).

**You should use this module alongside [backup-mongodb](https://github.com/SeunMatt/backup-mongodb)**

## Usage Example

~~~javascript
//example dbUri with no authentication
var databaseUri = "mongodb://127.0.0.1:27017/dev";
//example dbUri with username and password for the database test
// var dbUri = "mongodb://username:pwd@127.0.0.1:27017/test";
var zipFilePath = "test/dev_19_9_16.21.40.28.zip";
var restore = require("backup-mongodb-restorer");

restore(databaseUri, zipFilePath).catch(console.error);

//optionally you can call new Restore (databaseUri, zipFilePath, useObjectID).restore(done);
//where done is the callback to be called when done

~~~

## Installation

> npm install --save "git://github.com/MNLaugh/backup-mongodb-restorer.git"

## Test

> clone this git repo and cd into it `git clone httpd://github.com/MNLaugh/backup-mongodb-restorer.git`.
>
> then run `npm install` to install all the dependencies
>
> then run the command `npm test` to run the tests

## API Refrence

params

- databaseUri [required]: the uri to the mongodatabase e.g. mongodb://127.0.0.1:27017/test
- zipFilePath [required]: path/to/backupfile.zip
- useObjectID [optional]: Default = false;

## LICENSE

[MIT License](./LICENSE)
