"use strict" 
 
const {src, dest, parallel} = require("gulp") 
const gulp = require("gulp") 
const autoprefixer = require("gulp-autoprefixer") 
const cssbeautify = require("gulp-cssbeautify") 
const removeComments = require("gulp-strip-css-comments") 
const rename = require("gulp-rename") 
const sass = require("gulp-sass")(require("sass")) 
const cssnano = require("gulp-cssnano") 
const uglify = require("gulp-uglify") 
const plumber = require("gulp-plumber") 
const imagemin = require("gulp-imagemin") 
const browserSync = require("browser-sync").create()
const del = require("del") 

 
const srcPath = "src/" 
const distPath = "dist/" 


const path = { 
  build: { 
    html: distPath + "/html/*.htlm", 
    css:  distPath + "css/css/*.css",
    js: distPath + "js/*.js", 
    images: distPath + "/images/images/*", 
    fonts: distPath + "/fonts/*" 
  }, 
  src: { 
    html: srcPath + "assets/html/*.html", 
    css: srcPath + "assets/scss/**/*.scss", 
    js: srcPath + "assets/js/*.js", 
    images: srcPath + "assets/images/**/*", 
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}" 
  }, 
  watch: { 
    html: srcPath + "assets/html/*.html", 
    js: srcPath + "assets/js/**/*.js", 
    css: srcPath + "assets/scss/**/*.scss", 
    images: srcPath + "assets/images/**/*", 
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}" 
  }, 
  clean: "./" + distPath 
} 

function html() { 
  return src(path.src.html, {base: srcPath + "assets/html/*.html"}) 
  .pipe(plumber()) 
  .pipe(dest(path.build.html))  
} 

function css() { 
  return src(path.src.css, {base: srcPath + "assets/scss/**/*.scss"}) 
  .pipe(sass()) 
  .pipe(autoprefixer()) 
  .pipe(dest(path.build.css)) 
  .pipe(cssnano({ 
    zindex: false, 
    discardComment: { 
      removeAll: true 
    } 
  })) 
  .pipe(removeComments()) 
  .pipe(rename({ 
    suffix: ".min", 
    extname: ".css" 
  })) 
  .pipe(dest(path.build.css))
} 

function js() { 
  return src(path.src.js, {base: srcPath + "assets/js/.*js"}) 
   .pipe(plumber()) 
   .pipe(dest(path.build.js)) 
   .pipe(uglify()) 
   .pipe(rename({ 
     suffix: ".min", 
    extname: ".js" 
   })) 
  .pipe(dest(path.build.js)) 
} 
 
// function images() { 
//   return src(path.src.images, {base: srcPath + "assets/images/**/*"})
//   .pipe(imagemin([ 
//     imagemin.gifsicle({interlaced: true}), 
//     imagemin.mozjpeg({quality: 0, progressive: true}), 
//     imagemin.optipng({optimizationLevel: 1}), 
//     imagemin.svgo({ 
//       plugins: [ 
//         {removeViewBox: true}, 
//         {cleanupIDs: false} 
//       ] 
//     }) 
//   ])) 
//   .pipe(dest(path.build.images)) 
// } 

function fonts() { 
  return src(path.src.fonts, {base: srcPath +"assets/fonts/"}) 
} 

function clean() { 
  return del(['dist/**']) 
} 

function watchFiles() { 
 gulp.watch([path.watch.html], html) 
  gulp.watch([path.watch.css], css) 
  gulp.watch([path.watch.js], js) 
  // gulp.watch([path.watch.images], images) 
  gulp.watch([path.watch.fonts], fonts) 
} 

const build = gulp.series(gulp.parallel(html,css,js,fonts)) 
const watch = gulp.parallel(build,watchFiles) 

exports.html = html 
exports.css = css 
exports.js = js 
// exports.images = images
exports.clean = clean 
exports.fonts = fonts 
exports.build = build 
exports.watch = watch 
exports.default = watch












