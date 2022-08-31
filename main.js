#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const packageJSON = require('./package.json');
const { exec } = require('child_process');
const utils = require('./utils');
const ignoreList = require('./config/ignoreList');
const { truncate } = require('fs-extra');
const { join, path } = require('path');


/* Program Variables */
const currentDirectory = process.cwd();

program
    .version('1.0.0')
    .usage('[options] <file ...>')
    .option('-D, --dry', '(set by default) Drymode no files will be generated only previewed of what will be done')
    .option('-l, --live', 'Ready to create files? Turn on the live mode')
    .option('-P, --path [value]', '(Default is ./) Provide the path to the project source file')
    .option('-A, --absolute', 'Use this flag for system paths (Relative pathing is default)')
    .option('-R, --report', '(set by default) Enables a report to be generated in dry or live mode')
    .option('-H, --help', 'Need some help?')
    .parse(process.argv);

// Gather options from the CLI
var options = program.opts();
// Construct settings object
const settings = utils.settings.construct(options);

console.info('settings we are using');
console.log(settings);

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

var processFiles = function (dir, done) {
    var currentDirectory = process.cwd();
    if(settings.absoluteMode && dir.indexOf(currentDirectory) === -1){
    dir = currentDirectory+'/'+dir;
    }
    var includedFiles = [];
    var excludedFiles = [];
    var fileCount = 0;
    const filePath =settings.relativeMode?`${currentDirectory}${dir}`:dir;

    fs.readdir(dir, function (err, list) {

        if (err){
            err.message = `Error reading directory ${dir}`;
            return done(err);
        } 

        var pending = list.length;
        if (!pending){
             return done(null, {includedFiles, excludedFiles, fileCount});
        }

        list.forEach(function (file) {
            let fileWithPath = dir + '/'+file;
            if(fileWithPath.indexOf('//')!==-1){
                fileWithPath = fileWithPath.replace('//','/');
            }

            if(occurrences(dir, filePath)>1) fileWithPath.replace(dir,'');


            fs.stat(fileWithPath, function (err, stat) {
                if(err){
                    console.log('ERROR HERE',err);
                    return done(err);
                }

                // deep dive into directories but not ones that are ignored
                if (stat && stat.isDirectory() && (ignoreList.some(ignoreItem => file.includes(ignoreItem)) === false)) {
                    
                    // recursively start this process again for the next directory

                    processFiles(file, function (err, res) {
                        if(res && res.includedFiles && Array.isArray(res.includedFiles))includedFiles = includedFiles.concat(res.includedFiles);
                        if (!--pending){
                             return done(null, {includedFiles, excludedFiles, fileCount});
                        }
                    });
     
    
                // if files are not in the ingnore list
                } else if ((ignoreList.some(ignoreItem => file.includes(ignoreItem)) === false))  { 

                    fileCount++;
                    includedFiles.push(fileWithPath);
                    if (!--pending){
                         return done(null, {includedFiles, excludedFiles, fileCount});
                    }

                } else {
                    // Files are ignored
                    excludedFiles.push(fileWithPath);
                    if (!--pending){
                         return done(null, {includedFiles, excludedFiles, fileCount});
                    }
                }
            

            });
        });
    });
};


function finishedProcessing(err, response){
    if (err){
        console.log('ERROR',err);
        return;
    }
    console.log('final results here',response.includedFiles);
    console.log('\n\nincluded files',response.includedFiles.length);
    console.log('\n\n not included files',response.excludedFiles.length);
    console.log('\n\n not included files',response.excludedFiles);
}




const filePath = settings.absoluteMode?settings.pathToProject:currentDirectory+settings.pathToProject;
processFiles(filePath, finishedProcessing);
