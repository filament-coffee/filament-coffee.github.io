#!/usr/bin/env node

var datauri = require('datauri');
var fs = require('fs');
var path = require('path');

fs.readFile(path.join(process.cwd(), process.argv[2]), function (err, file) {
    file = file.toString();

    file = file.replace(/url\(('|")?([^)'"]+)('|")?\)/g, function (full, quote, match) {
        var duri = datauri(path.join(process.cwd(), match));
        return 'url(' + duri + ')';
    });

    process.stdout.write(file);
});
