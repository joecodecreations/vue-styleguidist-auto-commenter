#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fsSync = require('fs');
const fs = require('fs').promises;
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

var gatherFilesList = function (dir, done) {
    var currentDirectory = process.cwd();
    if(dir.indexOf(currentDirectory) === -1){
    dir = currentDirectory+'/'+dir;
    }
    var includedFiles = [];
    var excludedFiles = [];
    var fileCount = 0;
    const filePath =settings.relativeMode?`${currentDirectory}${dir}`:dir;

    console.log('dir top', dir);

    fsSync.readdir(dir, {encoding:'UTF-8'}, function (err, list) {

        if (err){
            err.message = `Error reading directory ${dir}`;
            return done(err);
        } 

        var pending = list.length;
        console.log('list',list);
        if (!pending){
             return done(null, {includedFiles, excludedFiles, fileCount});
        }

        list.forEach(function (file) {
            console.log('inside file',file);
            let fileWithPath = dir + '/'+file;
            if(fileWithPath.indexOf('//')!==-1){
                fileWithPath = fileWithPath.replace('//','/');
            }

            if(occurrences(dir, filePath)>1) fileWithPath.replace(dir,'');
            console.log('fileWithPath',fileWithPath);

            fsSync.stat(fileWithPath, function (err, stat) {
                if(err){
                    console.log('ERROR HERE',err);
                    return done(err);
                }

                // deep dive into directories but not ones that are ignored
                if (stat && stat.isDirectory() && (ignoreList.some(ignoreItem => file.includes(ignoreItem)) === false)) {
                    console.log('IS A DIRECTORY!!!!', fileWithPath);
                    // recursively start this process again for the next directory

                    console.log(`\n\n\n${fileWithPath} - ${file}`);
                    gatherFilesList(fileWithPath, function (err, res) {
                        if(res && res.includedFiles && Array.isArray(res.includedFiles))includedFiles = includedFiles.concat(res.includedFiles);
                        if (!--pending){
                             return done(null, {includedFiles, excludedFiles, fileCount});
                        }
                    });
     
    
                // if files are not in the ingnore list
                } else if ((ignoreList.some(ignoreItem => file.includes(ignoreItem)) === false) && file.indexOf('.vue')!== -1)  { 

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


function processList(err, response){
    if (err){
        console.log('ERROR',err);
        return;
    }
    console.log('final results here',response.includedFiles);
    console.log('\n\nincluded files',response.includedFiles.length);
    console.log('\n\n not included files',response.excludedFiles.length);
    console.log('\n\n not included files',response.excludedFiles);
}

async function processSingle(fileName){

    // get file contents
    const fileContents = await fs.readFile(fileName, 'utf8');
    // console.log('\n\n\n'+fileContents);

    const componentName = getComponentName(fileContents);
    console.log('componentName',componentName);
    let topContent = `
    /**
     * Documents for our ${componentName} component
     * @example ./docs/${componentName}.md
     * @example ../../../docs/ButtonConclusion.md
     * @displayName ${componentName}
    */`;

    if(!fileHasDocsAlready(fileContents, componentName)){
        // no docs yet
        fileContents 
    } else {
        // has docs

    }
}

function getComponentName(fileContent){
    console.log(fileContent)
    return getStringInbetweenTwoStrings(fileContent, 'name: \'', '\',');
}
function getStringInbetweenTwoStrings(str, stringA, stringB) {
   return str.split(stringA).pop().split(stringB)[0]; // returns 'two'
}
function fileHasDocsAlready(content, componentName){
    return contentContainsString(content,`@displayName ${componentName}`);
}
function contentContainsString(content, string){
    return content.indexOf(string) !== -1;
}


const filePath = settings.absoluteMode?settings.pathToProject:currentDirectory+settings.pathToProject;
// gatherFilesList(filePath, processList);
processSingle();
