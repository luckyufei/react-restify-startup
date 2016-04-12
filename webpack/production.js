import webpack           from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpackConfig     from './_base';

webpackConfig.devtool = 'source-map';
webpackConfig.module.loaders = webpackConfig.module.loaders.map(loader => {
  if (/css/.test(loader.test)) {
    const [first, ...rest] = loader.loaders;

    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
  }

  return loader;
});

webpackConfig.plugins.push(
  new ExtractTextPlugin('css/[name].css'),    // [name].[contenthash].css
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      'unused': true,
      'dead_code': true
    }
  })
);

export default webpackConfig;
