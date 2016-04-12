import webpack           from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import config            from './config';

const paths = config.get('utils_paths');

const webpackConfig = {
  name: 'beta',
  target: 'web',
  entry: {
    app: paths.src('index.jsx'),
    vendor: config.get('vendor_dependencies')
  },
  output: {
    filename: 'js/[name].js', //[name].[hash].js
    path: config.get('env') === 'development' ? paths.src() : paths.static_dist(),
    publicPath: config.get('basePath')
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader'] },
      { test: /\.css/, 
        loaders: [
          'style-loader',
           'css-loader'
           ] 
       },
       {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
          // 'autoprefixer?browsers=last 2 version',
          'sass-loader?outputStyle=expanded&sourceMap'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          //'image?{bypassOnDebug: true, progressive:true, \
          //    optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
          // url-loader更好用，小于10KB的图片会自动转成dataUrl，
          // 否则则调用file-loader，参数直接传入
          'url?limit=10000&name=images/[name].[ext]' //[hash:8].[name].[ext] 
        ]
      },
      /* eslint-disable */
      { test: /\.woff(\?.*)?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?.*)?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2" },
      { test: /\.ttf(\?.*)?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?.*)?$/, loader: "file-loader?name=fonts/[name].[ext]&limit=10000" },
      { test: /\.svg(\?.*)?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml" }
      /* eslint-enable */
    ]
  },
  sassLoader: {
    includePaths: paths.src('styles')
  },
  plugins: [
    new webpack.DefinePlugin(config.get('globals')),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      title: 'Beta App',
      template: './src/index.html',
      hash: true,
      filename: '/index.html',
      inject: 'body'
    })
  ],
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.js', '.jsx', '.css', '.scss', '.png', '.jpg', '.svg'],
    alias: config.get('utils_aliases')
  },
  devServer: {
    contentBase: paths.src(),
    publicPath: '/beta2.0',
    hot: true
  }
};

// NOTE: this is a temporary workaround. I don't know how to get Karma
// to include the vendor bundle that webpack creates, so to get around that
// we remove the bundle splitting when webpack is used with Karma.
// '[name].[hash].js'
const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin(
  'vendor', 'js/[name].js'
);
commonChunkPlugin.__KARMA_IGNORE__ = true;
webpackConfig.plugins.push(commonChunkPlugin);

export default webpackConfig;
