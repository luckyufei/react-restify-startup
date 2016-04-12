/* eslint-disable */
import path     from 'path';
import chalk    from 'chalk';
import pkg      from '../package.json';

const config = new Map();

// ------------------------------------
// User Configuration
// ------------------------------------
config.set('dir_src', 'src');
config.set('dir_dist', 'dist');
config.set('html_dist', 'views');
config.set('static_dist', 'beta2.0');
config.set('dir_test', 'tests');

config.set('webpack_host', 'localhost');
config.set('webpack_port', process.env.PORT || 3000);
config.set('nginx_port', 8888);

// Define what dependencies we'd like to treat as vendor dependencies,
// but only include the ones that actually exist in package.json. This
// makes it easier to remove dependencies without breaking the
// vendor bundle.
config.set('vendor_dependencies', [
  'history',
  'react',
  'react-redux',
  'react-router',
  'redux',
  'react-router-redux',
  'immutable'
].filter(dep => {
  if (pkg.dependencies[dep]) return true;

  console.log(chalk.yellow(
    `Package "${dep}" was not found as an npm dependency and won't be ` +
    `included in the vendor bundle.\n` +
    `Consider removing it from vendor_dependencies in ~/config/index.js`
  ));
}));

/*  *********************************************
 -------------------------------------------------

 All Internal Configuration Below
 Edit at Your Own Risk

 -------------------------------------------------
 ************************************************/
// ------------------------------------
// Environment
// ------------------------------------
console.log(`origin node env: ${process.env.NODE_ENV}`);
config.set('env', process.env.NODE_ENV || 'development');
config.set('basePath', '/beta2.0/');
config.set('globals', {
  'process.env': {
    'NODE_ENV': JSON.stringify(config.get('env'))
  },
  'NODE_ENV': config.get('env'),
  '__DEV__': config.get('env') === 'development',
  '__PROD__': config.get('env') === 'production',
  '__DEBUG__': config.get('env') === 'development' ,
  '__ROOTPATH__': config.get('env') === 'development' ? "'php'" : "'beta2.0'",
  '__BASEPATH__': `'${config.get('basePath')}'`
});

// ------------------------------------
// Webpack
// ------------------------------------
config.set('webpack_public_path',
  `http://${config.get('webpack_host')}:${config.get('nginx_port')}/`
);

// ------------------------------------
// Project
// ------------------------------------
config.set('path_project', path.resolve(__dirname, '../'));

// ------------------------------------
// Utilities
// ------------------------------------
const paths = (() => {
  const base = [config.get('path_project')];
  const resolve = path.resolve;

  const project = (...args) => resolve.apply(resolve, [...base, ...args]);

  return {
    project: project,
    src: project.bind(null, config.get('dir_src')),
    dist: project.bind(null, config.get('dir_dist')),
    html_dist: project.bind(null, "../../../resources/", config.get('html_dist')),
    static_dist: project.bind(null, "../../../public/", config.get('static_dist'))
  };
})();
console.log("paths: ", paths.html_dist("index.html"), ", static: ", paths.static_dist('css'));

config.set('utils_paths', paths);
config.set('utils_aliases', [
  'components',
  'containers',
  'routes',
  'styles',
  'images',
  'utils',
  'store'
].reduce((acc, dir) => ((acc[dir] = paths.src(dir)) && acc), {}));

export default config;

/* eslint-enable */
