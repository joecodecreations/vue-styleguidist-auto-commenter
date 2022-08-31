#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const packageJSON = require('./package.json');
const { exec } = require('child_process');
var path = require('path');
const utils = require('./utils');
const ignoreList = require('./config/ignoreList');
const { truncate } = require('fs-extra');


/* Program Variables */


program
    .version('1.0.0')
    .usage('[options] <file ...>')
    .option('-D, --dry', '(set by default) Drymode no files will be generated only previewed of what will be done')
    .option('-l, --live', 'Ready to create files? Turn on the live mode')
    .option('-P, --path [value]', '(Default is ./) Provide the path to the project source file')
    .option('-S, --system', 'Use this flag for system paths (Relative pathing is default)')
    .option('-R, --report', '(set by default) Enables a report to be generated in dry or live mode')
    .option('-H, --help', 'Need some help?')
    .parse(process.argv);

// Gather options from the CLI
const options = program.opts();
// Construct settings object
const settings = utils.settings.construct(options);

console.info('settings we are using');
console.log(settings);

var processFiles = function (dir, done) {
    var includedFiles = [];
    var excludedFiles = [];
    var fileCount = 0;
    fs.readdir(dir, function (err, list) {

        if (err) return done(err);

        var pending = list.length;

        if (!pending){
            console.log('RETURN A')
             return done(null, {includedFiles, excludedFiles, fileCount});
        }

        list.forEach(function (file) {

            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {

                // deep dive into directories but not ones that are ignored
                if (stat && stat.isDirectory() && (ignoreList.some(ignoreItem => file.includes(ignoreItem)) === false)) {
                    
                    // recursively start this process again for the next directory
                    processFiles(file, function (err, res) {
                        includedFiles = includedFiles.concat(res.includedFiles);
                        if (!--pending){
                             return done(null, {includedFiles, excludedFiles, fileCount});
                        }
                    });
     
    
                // if files are not in the ingnore list
                } else if ((ignoreList.some(ignoreItem => file.includes(ignoreItem)) === false))  { 

                    fileCount++;
                    includedFiles.push(file);
                    if (!--pending){
                         return done(null, {includedFiles, excludedFiles, fileCount});
                    }

                } else {
                    // Files are ignored
                    excludedFiles.push(file);
                    if (!--pending){
                         return done(null, {includedFiles, excludedFiles, fileCount});
                    }
                }
            

            });
        });
    });
};


function finishedProcessing(err, response){
    console.log('final results here',response.includedFiles);
    console.log('\n\nincluded files',response.includedFiles.length);
    console.log('\n\n not included files',response.excludedFiles.length);
    console.log('\n\n not included files',response.excludedFiles);
}

processFiles('/Users/josephsanchez/Desktop/Projects/vue-styleguidist-auto-commenter', finishedProcessing);
