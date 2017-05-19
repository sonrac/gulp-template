# Gulp template for page-proofs

Run ` npm install` before use

## Introduction

Copy `config.dist.js` to `config.js` and change config variables

[See options description](global.html#config) first

## Tasks list

| Task | Command | Definition |
| ---- | ------- | ---------- |
| server | `gulp connect` | Run server |
| build-css | `gulp build-css` | build less files |
| minify-css | `gulp minify-css` | build sass files |
| imagemin | `gulp imagemin` | optimize images |
| build-js | `gulp build-js` | Build js source |
| templates | `gulp templates` | build html files from template |
| release | `gulp release` | Pack build version to zip archive |
| build | `gulp build` | run build all files |
| watch | `gulp watch` | Run gulp watcher |
| copy | `gulp copy` | Copy files |
| move | `gulp move` | Move files |
| concat | `gulp concat` | Concatenation task |
| amd-build | `gulp amd-build` | Build amd application |

#### Run watcher, server & first build 

Run in terminal

```bash
gulp
```

`watch`, `connect` & `build` tasks

# Test 

Install dev dependencies first:

```bash
npm install --with-dev
```

Running test:

```bash
npm test
```

## Links 
1. [Github Documnetation](https://sonrac.github.io/docs/gulp-template)
2. [Official documentation](https://sonrac.info/front/gulp-template)