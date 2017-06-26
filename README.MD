# Gulp template for page-proofs

Run ` npm install` before use

## Introduction

Copy `config.dist.js` to `config.js` and change config variables

[See options description](global.html#config) first

## Tasks list

| Task | Command | Definition |
| ---- | ------- | ---------- |
| server | `gulp connect` | Run server |
| minify-css | `gulp minify-css` | minify css files |
| build-css | `gulp build-css` | build css files |
| minify-js | `gulp minify-js` | minify js files |
| build-js | `gulp build-js` | Build js from source |
| imagemin | `gulp imagemin` | optimize images |
| ts | `gulp ts` | Build Typescript source to js |
| templates | `gulp templates` | build html files from templates |
| minify-html | `gulp minify-html` | Minify html files |
| coffee | `gulp coffee` | Build CoffeeScript source to js |
| copy | `gulp copy` | Copy files |
| move | `gulp move` | Move files |
| release | `gulp release` | Pack build version to zip archive |
| amd-build | `gulp amd-build` | Build amd application |
| concat | `gulp concat` | Concatenation task |
| concat-minify | `gulp concat-minify` | Minify Concatenation task files |
| build | `gulp build` | run build all files |
| watch | `gulp watch` | Run gulp watcher |
| watch-css | `gulp watch-css` | Watch source for css & templates files |
| watch-js | `gulp watch-js` | Watch source for js & ts & coffee files |
| watch-copy | `gulp watch-copy` | Watch source for copy files |
| watch-move | `gulp watch-move` | Watch source for move files |
| watch-images | `gulp watch-images` | Watch source for images files |
| watch-amd-build | `gulp watch-amd-build` | Watch source for amd build files |
| watch-concat | `gulp watch-concat` | Watch source for concat files |

#### Series registered tasks

Series task are tasks for run multiple task with waiting for completion of the previous task

| Task | Command | Tasks list runner |
| ---- | ------- | ---------- |
| s-minify-css | `gulp s-minify-css` | `build-css minify-css` |
| s-watch | `gulp s-watch` | `watch-css watch-js watch-images watch-copy watch-move watch-concat` |
| watch | `gulp watch` | Alias for `watch` |
| s-watch-all | `gulp s-watch-all` | `watch-css watch-js watch-images watch-copy watch-move watch-concat watch-amd-build watch-ts watch-coffee` |
| s-images | `gulp s-images` | `imagemin move` |
| s-minify-css-move | `gulp s-minify-css-move` | `minify-css move` |
| s-default | `gulp s-default` | `watch build-css build-js templates minify-css minify-js minify-html imagemin copy move server` |
| default | `gulp default` | Alias for `s-default` |
| s-build | `gulp s-build` | `build-css build-js server templates minify-css minify-js minify-html imagemin copy move` |
| build | `gulp build` | Alias for `s-build` |


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

## Generate Docs

Run 
```bash
npm run generate-html path/to/out/folder
```