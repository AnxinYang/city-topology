const path = require('path');
const webpack = require('webpack');
const { spawn, spawnSync } = require('child_process');
const http = require('http')
const fs = require('fs')
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const config_production = require('./webpack.config.production.js');
const config_dev = require('./webpack.config.dev');

const argv = process.argv;
const isProduction = argv.includes('production');
const isServerRunning = false;

console.log(`Mode: ${isProduction ? 'production' : 'development'}`)

const config = isProduction ? config_production : config_dev;
if (!isProduction) {
    let cmd_sass = spawn('cmd');
    cmd_sass.stdout.on('data', d => console.log(d.toString()));
    cmd_sass.stdin.write('sass --watch src/main.scss build/main.css\n');
    webpack(config)
        .watch(config.watchOptions, function (err, stats) {
            console.log(stats.toString({
                chunks: false,
                colors: true
            }));
            console.log('Process completed. Starting http server');
            !isServerRunning && runServer();
        });

} else {
    webpack(config)
        .run(function (err, stats) {
            console.log(stats.toString({
                chunks: false,
                colors: true
            }));
            console.log('Compiling CSS file...')
            let result = spawnSync('cmd', ['/c sass --no-source-map src/main.scss build/main.css']);
            console.log('Compiled.')
        })
}



function runServer() {
    let server = http.createServer(function (req, res) {
        let parsedUrl = url.parse(req.url, true);
        let path = parsedUrl.pathname;
        let trimmedPath = path.replace(/^\/+|\/+$/g, '') || 'index.html';
        let method = req.method.toLowerCase();
        console.log('path=' + trimmedPath);
        fs.readFile('./' + trimmedPath, (e, file) => {
            if (e) {
                res.writeHead(404);
                resp.write(e);
            } else {
                res.writeHead(200);
                res.write(file);
            }
            res.end()
        })

    }).listen(config.devServer.port, config.devServer.host, function () {
        console.log(`Server running at http://${config.devServer.host}:${config.devServer.port}/`);
    })
}