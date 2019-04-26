const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

const samples = fs.readdirSync(path.join(__dirname, 'samples')).map(folder => {
    return {
        name: folder,
        file: path.join(__dirname, 'samples', folder, 'index.ts')
    };
}).reduce(function (acc, cur, i) {
    acc[cur.name] = cur.file;
    return acc;
}, {});

module.exports = {
    entry: samples,

    output: {
        path: path.join(__dirname, "scripts", "Bundles"),
        pathinfo: true,
        filename: "index.js"
    },

    resolve: {
        extensions: [".ts",".js", ".json", ".css"],
        modules: [
            path.join(__dirname, "node_modules")
        ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' }
        ]
    },

    node: {
        Buffer: false,
        fs: "empty"
    }
}