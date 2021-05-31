
var fs = require("fs-extra");
var path = require("path");
var unzip = require("unzipper");

var mongoClient = require("mongodb").MongoClient;

var databaseUri;
var fileNames = [];
var client; //global client object
var db; //global db object
var zipPath; // path/to/zipfile.zip
var tempPath = __dirname + "/temp";

//var winston = require("winston");
var ObjectID = require("mongodb").ObjectID;

//this boolean value will determine if the database utilizes the ObjectID class of mongodb
var isObjectID = true;

async function remove(path) {
	return await new Promise((resolve, reject) => {
		fs.remove(path, (error) => (error) ? reject(error) : resolve())
	})
}

async function readJson(path) {
	return await new Promise((resolve, reject) => fs.readJson(path, (err, data) => (err) ? reject(err) : resolve(data)))
}

async function restore (dbaseUri, pathToZipFile, useObjectID = true) {
  if(!dbaseUri || !pathToZipFile) { 
  	//winston.error("incomplete params \ndbaseUri = " + dbaseUri + "\npathToZipFile = " + pathToZipFile); 
  	throw new Error("incomplete params \ndbaseUri = " + dbaseUri + "\npathToZipFile = " + pathToZipFile);
  }

	isObjectID = useObjectID;
  //winston.error("isObjectID = "  + isObjectID + " useObjectID = " + useObjectID);

	databaseUri = dbaseUri;
	zipPath = pathToZipFile;

	client = await mongoClient.connect(databaseUri, { useUnifiedTopology: true });
	//winston.info("Restore Script Connected to MongoDb successfully");
	const dbname = databaseUri.split("/").pop();
	db = client.db(dbname);

	//winston.info("client && db set");

	try {
		//winston.info("Start extraction...");
		var unzipExtractor = unzip.Extract({ path: tempPath});
		fs.createReadStream(zipPath).pipe(unzipExtractor);
		await new Promise(resolve => unzipExtractor.on("close", resolve));
		//winston.info("Extraction Complete . . .");
	
		var results = await new Promise((resolve, reject) => fs.readdir(tempPath, (err, res) => (err) ? reject(err) : resolve(res)));
		//winston.info("dir read and contains " + results.length + " files");
		for(var x in results) {
			if(results[x].indexOf(".zip") < 0) { // remove the .zip archive
				fileNames.push(path.win32.basename(results[x], ".json"));
			}
			if(x == results.length - 1) { 
				//winston.info("fileNames = " + fileNames);
				await loadJsonData(0);
			}
		}
	} catch(e) {
		client.close();
		throw e;
	}
}

async function loadJsonData(z) {
	if(z > fileNames.length - 1) { 
		//winston.info("Restoration procedure complete..."); 
		if (client && typeof client.close !== "undefined") client.close();
		await remove(tempPath);
		//winston.verbose("tempPath removed");
	}	else {
		//winston.debug("\nload json data invoked " + z);
		var collectionName = fileNames[z];
		//winston.info("collection under processing = " + collectionName + "\n");
		const data = await readJson(`${tempPath}/${collectionName}.json`);
		try {
			await saveToDb(data, 0, collectionName);
			await loadJsonData(z + 1);
		} catch(e) {
			await remove(tempPath);
			throw e;
		}
	}
}

async function saveToDb(fileData, x, collectionName) {
	if (x > fileData.length - 1) return; //winston.info("Done Processing " + collectionName + "\n");
	//winston.verbose("fileData length = " + fileData.length);
	var collection = fileData[x];

	if(isObjectID) collection._id = new ObjectID.createFromHexString(collection._id);
	if(collection._created_at) collection._created_at = new Date(collection._created_at);
	if(collection._updated_at) collection._updated_at = new Date(collection._updated_at);	

	// winston.info("collection object = " + collection);
	const col = db.collection(collectionName);
	const result = await col.replaceOne({ "_id": collection._id }, collection, { upsert: true });
	//winston.verbose("update successful " + result);
	await saveToDb(fileData, (x + 1), collectionName);
}

module.exports = restore;