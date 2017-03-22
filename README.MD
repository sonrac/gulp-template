# Gulp template for page-proofs

## Introduction

* Project structure

app

-----dist - Source files

---------less - Source less files
 
---------sass - Source sass files
 
---------images - Source images files 

app

----build - Build directory

---------css - Css files

------------min - Css minify version files

---------js - Js files

------------min - Js minify version files

------------images - Optimized images from dist directory

------------html - Html files

## Tasks list

| Task | Command | Definition |
| ---- | ------- | ---------- |
| less | `gulp less` | build less files |
| sass | `gulp sass` | build sass files |
| images | `gulp images` | optimize images |
| less | `gulp minify-js` | minify js files |
| minify-css | `gulp minify-css` | minify css files |
| templates | `gulp templates` | build html files from jade (pug) templates |
| watch | `gulp watch` | watch changes and run server on http://localhost:8080 |
| release | `gulp release` | Pack build version to zip archive |
| server | `gulp server` | run server on http://localhost:8080 |
| build | `gulp build` | run build all files |


