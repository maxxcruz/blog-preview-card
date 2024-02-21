const { src, dest, watch, parallel } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp")

function css(done) {
  src("src/sass/**/*.scss")
    .pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write())
    .pipe(dest("build/css"))

  done();
}

function minifyImages(done) {
  const options = {
    optimizationLevel: 3,
  }

  src("src/images/**/*{jpg,png}")
    .pipe(cache(imagemin(options)))
    .pipe(dest("build/images"))

  done();
}

function webpVersion(done) {
  const options = {
    quality: 50,
  }

  src("src/images/**/*{jpg,png}")
    .pipe(webp(options))
    .pipe(dest("build/images"))

  done();
}

function dev(done) {
  watch("src/sass/**/*.scss", css);

  done();
}

exports.css = css;
exports.dev = parallel(minifyImages, webpVersion, dev);