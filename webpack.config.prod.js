const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const deps = require("./package.json").dependencies;

module.exports = (_, argv) => ({
  output: {
    publicPath: "/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 8580,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "layout",
      filename: "remoteEntry.js",
      remotes: {
        content1: `content1@https://webmf-microfrontend-content1.vercel.app/remoteEntry.js`,
        content2: `content2@https://webmf-microfrontend-content2.vercel.app/remoteEntry.js`
      },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new Dotenv({
      systemvars: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/firebase-messaging-sw.js', to: 'firebase-messaging-sw.js' }
      ]
    })
  ],
});
