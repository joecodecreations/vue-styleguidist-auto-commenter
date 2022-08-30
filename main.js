#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const packageJSON = require('./package.json');
const { exec } = require('child_process');
var path = require('path');
const utils = require('./utils');

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

var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {

        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function (file) {

            file = path.resolve(dir, file);

            fs.stat(file, function (err, stat) {

                if (stat && stat.isDirectory()) {
                    
                    // recursively start this process again for the next directory
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });

                } else {

                    results.push(file);
                    if (!--pending) done(null, results);

                }
            });
        });
    });
};


// walk(path, done);

const done = (err, results) => {
    if (err) throw err;
    console.log('results', results);
}

