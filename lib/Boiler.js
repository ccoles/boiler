#! /usr/bin/env node
/*
 * Boiler
 * https://github.com/ccoles/boiler
 *
 * Copyright (c) 2013 Craig Coles
 * Licensed under the MIT license.
 */

'use strict';

var program = require('commander');
var fs = require('fs');

program
  .version('0.1.0')
  .option('--useresetcss', 'do you want to use reset.css instead of normalize?',Boolean)
  .parse(process.argv);

if(program.useresetcss === "undefined") {
	program.useresetcss = false;	
}

var baseDir = __dirname+'/html5BoilerPlate/';

function readFile(path){

	fs.readFile(path,{encoding:'utf8'},function(err,data){
		
		writeFile(path,data);	

	});

}

function getFileNameFromPath(path){
	
	var nm = path.split("/"),
		fileToWrite = nm[nm.length - 1];

		return fileToWrite;
}

function writeFile(path,data){

	var fileToWrite = getFileNameFromPath(path),
		dirName = getLastDirectoryInPath(path);

	if(dirName.toLowerCase() !== "html5boilerplate") {
		fileToWrite = dirName + "/" + fileToWrite;
	}

	fs.writeFile(fileToWrite,data,{encoding:'utf8'},function(err){
		
		if(err) {
			throw err;
		} 

	});

}

function getLastDirectoryInPath(path){

	var path = path || false,
		num = 1,
		dirs = null,
		lastDir = null;

	if(path) {

		dirs = path.split("/");
		
		for(var i = 0; i < dirs.length;i++){
			
			lastDir = dirs[dirs.length - num];

			if(lastDir.indexOf(".") >= 0) {

				num++;

			} else {

				break;

			}
		}

		return lastDir;
	}

}

function createDirectory(path){

	var exists = fs.existsSync(path);
	
	if(!exists) {
		fs.mkdir(path);
	}

	return;
}

function createSubDirectories(subDirObj){

	var subDirObj = subDirObj || [],
		dir = null,
		length = subDirObj.length,
		exists = false,
		i = 0;

	for(i; i < length;i++) {
		
		dir = getLastDirectoryInPath(subDirObj[i]);
		
		exists = fs.existsSync(dir);

		if(!exists) {

			createDirectory(dir);

			readDirectory(baseDir + dir + "/");

		}
		
	}

}

function readDirectory(path,subDir){

	var subDirObj = [],
		subDir = subDir || false,
		i = 0,
		stat = null;

		
	fs.exists(path,function(exists){
		
		if(exists){

			fs.readdir(path,function(err,files){
				
				for(i; i < files.length;i++){
					
					stat = fs.statSync(path+files[i]);

					if(stat.isFile()) {
						
						readFile(path+files[i]);

					} else if(stat.isDirectory()){

						subDirObj.push(path+files[i]);

					} else {

						return;
					}
					
				}

				createSubDirectories(subDirObj);

			});

		} else {

			return;

		}

	});

}

function checkDone(){

	//this should check the number of files and directories in the source and then in the destination, if nums are the same it's done (boiled)
}

function init(path){

	readDirectory(path);

}

init(baseDir);
	










