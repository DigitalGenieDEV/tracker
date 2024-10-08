const path = require('path');

module.exports = {
  entry: './index.js', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出文件名
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配 JavaScript 文件
        exclude: /node_modules/, // 排除 node_modules 目录
        use: {
          loader: 'babel-loader', // 使用 babel-loader 进行转译
          options: {
            presets: ['@babel/preset-env'] // 使用 @babel/preset-env 进行转译，根据目标环境自动选择需要的转译规则
          }
        }
      }
    ]
  }
};