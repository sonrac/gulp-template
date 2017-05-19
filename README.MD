# Gulp template for page-proofs

Run ` npm install` before use

## Introduction

Copy `config.dist.js` to `config.js` and change config variables

| Option | Description |
| ------ | ----------- |
| build_dir | Path to build dir (output files directory) |
| dist_dir | Path to source files path |
| server_root_path | Path to server root directory |
| listen_port | Listen port for local server based on `gulp-connect` package |
| copy_js_files | Copy js file from destination to build directory. Using rsync |
| js | JS files directory path in build |
| js_path | JS path (adding to dist_dir/build_dir path) |
| css_path | Css path (adding to dist_dir/build_dir path) |
| dist_templates_path | Temlates path (adding to dist_dir/build_dir path) |
| sass_path | Sass path (adding to dist_dir/build_dir path) |
| less_path | Less path (adding to dist_dir/build_dir path) |
| template | Template package name (default gulp-pug) for building template files into html |
| template_options | Options for run build template |
| template_extensions | Template file extensions (array or string). If you need timestamp in template variables, added variable with value '-----timestamp------'. This replaced by current timestamp in build progress automatically |
| livereload_options | Options for livereload listener |
| rsync_js_callback | Callback after copies js files |
| delete_files | Delete JS scripts rsync |
| build_templates_path | Template path in build dir |
| skip_templates_dir | Skip dirs for template path. Exclude by adding `!` to begin path |
| copyPaths | Copy files setting. Adding to copy files to dist folder |
| skip_styles_path | Skip path in less/sass build folder (auto spipped all *.less & *.sass files which beginning from) |

## Tasks list

| Task | Command | Definition |
| ---- | ------- | ---------- |
| connect | `gulp connect` | Run server |
| less | `gulp less` | build less files |
| sass | `gulp sass` | build sass files |
| images | `gulp images` | optimize images |
| less | `gulp minify-js` | minify js files |
| minify-js | `gulp minify-js` | minify js files |
| minify-css | `gulp minify-css` | minify css files |
| templates | `gulp templates` | build html files from template |
| watch | `gulp watch` | watch changes |
| release | `gulp release` | Pack build version to zip archive |
| build | `gulp build` | run build all files |
| watch | `gulp watch` | Run gulp watcher |
| copy | `gulp copy` | Copy files |

#### Run watcher, server & first build 

Run in terminal

```bash
gulp
```

`watch`, `connect` & `build` tasks