const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { NodeAsyncHttpRuntime } = require("@telenko/node-mf");
const path = require("path");
const packageJson = require("./package.json");

const getConfig = (target) => ({
  entry: "./src/index.js",
  target: target === "web" ? "web" : false,
  mode: "development",
  devtool: "hidden-source-map",
  output: {
    path: path.resolve(__dirname, "dist", target),
    publicPath: `https://619821c987d83f0a7c0832d9--sleepy-ride-c6740a.netlify.app/${target}/`,
    clean: true,
  },
  devServer: {
    compress: true,
    port: "3002",
    static: './dist',
    hot: true,
  },
  resolve: {
    extensions: [
      ".jsx",
      ".js",
      ".json",
      ".css",
      ".scss",
      ".jpg",
      "jpeg",
      "png",
    ],
  },
  module: {
    rules: [
      {
        test: /bootstrap\.js$/,
        loader: "bundle-loader",
        options: {
          lazy: true,
        },
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        loader: "url-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteLib",
      filename: "remoteEntry.js",
      exposes: {
        "./Layout": "./src/Layout.jsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: packageJson.dependencies["react"],
        },
        ["react-dom"]: {
          singleton: true,
          requiredVersion: packageJson.dependencies["react-dom"],
        },
      },
    }),
    ...(target === "web"
      ? [
          new HtmlWebpackPlugin({
            template: "./public/index.html",
          }),
        ]
      : [new NodeAsyncHttpRuntime()]),
  ],
});

module.exports = [getConfig("web"), getConfig("node")];
