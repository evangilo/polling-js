const path = require("path");

module.exports = {
  entry: "./polling.ts",
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "polling.min.js",
    libraryTarget: "var",
    library: "polling",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
};
