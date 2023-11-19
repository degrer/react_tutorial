module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js",
  },
  {
    // enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: [
      extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    ],
    
    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        { test: /\.tsx?$/, loader: "ts-loader" },
        { test: /\.js$/, loader: "source-map-loader" },
      ],
    },
  },
  
  // Other options...
};
