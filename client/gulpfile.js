"use strict";

const path = require("path");
const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const debug = require("gulp-debug");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const rollup = require("gulp-rollup");
const sort = require("gulp-sort");
const sassImage = require("gulp-sass-image");
const gap = require("gulp-append-prepend");
const addsrc = require("gulp-add-src");
const rename = require("gulp-rename");
const scaleImages = require("gulp-scale-images");
const flatMap = require("flat-map").default;
const transform = require("gulp-transform");
const inlinesource = require("gulp-inline-source");
const cssInlineImages = require("gulp-css-inline-images");
const inlineFonts = require("gulp-inline-fonts");

const imageSize = size => (file, cb) => {
  const pngFile = file.clone();
  pngFile.scale = { maxWidth: size, maxHeight: size, format: "png" };
  cb(null, [pngFile]);
};

const size32 = imageSize(32);
const size64 = imageSize(64);
const size96 = imageSize(96);

const prefixes = {
  browsers: ["last 2 versions"],
  cascade: false
};

const babelTranspile = () =>
  babel({
    presets: ["es2016"],
    plugins: ["transform-object-rest-spread"]
  }).on("error", function(error) {
    console.error(error.stack);
    this.end();
  });

gulp.task("sass-image", function() {
  return gulp
    .src("./images/ui/*.+(jpeg|jpg|png|gif|svg)")
    .pipe(
      addsrc("./images/ui/adventure_ui/png/frame/*.+(jpeg|jpg|png|gif|svg)")
    )
    .pipe(addsrc("./images/ui/fantasy_gui/**/*.+(jpeg|jpg|png|gif|svg)"))
    .pipe(
      sassImage({
        targetFile: "./.out/generated-imagehelper.scss",
        images_path: "./",
        css_path: "./_css/",
        includeData: false
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task("js", function() {
  return gulp
    .src(["./**/*.js", "!./_bundle/*", "!./_css/*"])
    .pipe(babelTranspile())
    .on("error", function(error) {
      console.error(error.stack);
      this.end();
    })
    .pipe(
      rollup({
        input: "index.js",
        output: {
          format: "iife"
        }
      })
    )
    .on("error", function(error) {
      console.error(error.stack);
      this.end();
    })
    .pipe(concat("bundle.js"))
    .on("error", function(error) {
      console.error(error.stack);
      this.end();
    })
    .pipe(gulp.dest("./_bundle/"))
    .on("error", function() {
      console.error("invalid JS");
    });
});

gulp.task("sass", function() {
  return gulp
    .src([
      "./variables.scss",
      "./ui.scss",
      "./**/*.scss",
      "!./static/**/*.scss",
      "!./node_modules/**/*.scss"
    ])
    .pipe(
      sort({
        asc: false
      })
    )
    .pipe(gap.prependFile("./.out/generated-imagehelper.scss"))
    .pipe(concat("all.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer(prefixes))
    .pipe(gulp.dest("./_css"));
});

gulp.task("backend-sass", function() {
  return gulp
    .src(["../resources/js/**/*.scss"])
    .pipe(gap.prependFile("./variables.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer(prefixes))
    .pipe(
      gulp.dest(function(file) {
        return file.base; // file location
      })
    );
});

gulp.task("backend-js", function() {
  return gulp
    .src(["../resources/js/**/*.js", "!../resources/js/**/*.es5.js"])
    .pipe(babelTranspile())
    .pipe(
      rename(function(path) {
        path.extname = ".es5.js";
      })
    )
    .pipe(
      gulp.dest(function(file) {
        return file.base;
      })
    );
});

gulp.task(
  "icons",
  // ['client-icons'],
  function() {
    return (
      gulp
        .src(["../resources/icons/**/*.png"])
        // .pipe(imageResize({
        //     width : 64,
        //     height : 64,
        // }))
        .pipe(flatMap(size96))
        .pipe(
          scaleImages((output, scale, cb) => {
            const fileName = [
              path.basename(output.path, output.extname) // strip extension
              // scale.maxWidth + 'wx',
              // scale.format || output.extname
            ].join(".");
            cb(null, path.basename(output.path, output.extname));
          })
        )
        .pipe(
          gulp.dest(function(file) {
            return file.base.replace(/resources\/icons\//, "resources/icons96");
          })
        )
    );
  }
);

// gulp.task('client-icons', function () {
//     return gulp
//         .src([
//             '../client/images/*.png',
//         ])
//         .pipe(flatMap(size32))
//         .pipe(scaleImages((output, scale, cb) => {
//             const fileName = [
//                 path.basename(output.path, output.extname), // strip extension
//                 // scale.maxWidth + 'wx',
//                 // scale.format || output.extname
//             ].join('.');
//             cb(null, path.basename(output.path, output.extname));
//         }))
//         .pipe(gulp.dest(function (file) {
//             return file.base.replace(/client\/images\//, 'client/images32');
//         }));
// });

gulp.task("image-precache", [], function() {
  return gulp
    .src("./_css/all.css")
    .pipe(
      transform("utf8", function(content, file) {
        const images = content.match(/(\.\.\/images[^")]+)/g);
        const keyed = {};
        images.forEach(img => (keyed[img] = true));
        return "window.interfaceImages=" + JSON.stringify(Object.keys(keyed));
      })
    )
    .pipe(concat("images.js"))
    .pipe(gulp.dest("./_css/"));
});

gulp.task("static-html", ["static-css"], function() {
  return gulp
    .src("./static/*.html")
    .pipe(inlinesource())
    .pipe(gulp.dest("./static/dist/"));
});

gulp.task("static-css", [], function() {
  return gulp
    .src(["./static/css/**/*.scss"])
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer(prefixes))
    .pipe(
      cssInlineImages({
        webRoot: "static/css",
        path: ""
      })
    )
    .pipe(
      gulp.dest(function(file) {
        return file.base; // file location
      })
    );
});

gulp.task("static-fonts", [], function() {
  return gulp
    .src(["./static/fonts/*"])
    .pipe(inlineFonts({ name: "BaseFont", formats: ["ttf"] }))
    .pipe(gulp.dest("./static/css/"));
});

gulp.task("static", ["static-css", "static-html"], function() {});

gulp.task("static:watch", ["static"], function() {
  gulp.watch(["./static/css/**/*.scss", "./static/*.html"], ["static"]);
});

gulp.task("image-precache:watch", ["image-precache"], function() {
  gulp.watch("./_css/all.css", ["image-precache"]);
});

gulp.task("icons:watch", ["icons"], function() {
  gulp.watch("../resources/icons/**/*.png", ["icons"]);
});

gulp.task("sass:watch", ["sass", "sass-image"], function() {
  gulp.watch("./**/*.scss", ["sass"]);
});

gulp.task("backend-sass:watch", ["backend-sass"], function() {
  gulp.watch("../resources/js/**/*.scss", ["backend-sass"]);
});

gulp.task("backend-js:watch", ["backend-js"], function() {
  gulp.watch(
    ["../resources/js/**/*.js", "!../resources/js/**/*.es5.js"],
    ["backend-js"]
  );
});

gulp.task("js:watch", ["js"], function() {
  gulp.watch(
    [
      "./**/*.js",
      "!./_bundle/bundle.js",
      "!./**/*.es5.js",
      "!./_css/images.js"
    ],
    ["js"]
  );
});

gulp.task(
  "watch",
  [
    "js:watch",
    "sass:watch",
    "backend-sass:watch",
    "backend-js:watch",
    "icons:watch",
    "image-precache:watch"
  ],
  function() {}
);
