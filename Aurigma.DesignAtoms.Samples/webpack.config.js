const webpack = require("webpack");
const path = require("path");

const indexPath = path.join(__dirname, "scripts");

module.exports = {
    entry: {
        "index": path.join(indexPath, "index.js")
    },

    output: {
        path: path.join(__dirname, "scripts", "Bundles"),
        pathinfo: true,
        filename: "[name].js",
        chunkFilename: "[name]-chunk.js"
    },

    resolve: {
        extensions: [".js", ".json", ".css"],
        modules: [
            path.join(__dirname, "node_modules")
        ]
    },

    node: {
        Buffer: false,
        fs: "empty"
    }
}