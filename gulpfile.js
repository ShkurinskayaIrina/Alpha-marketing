import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';
import browser from 'browser-sync';

// Styles
const styles = () => {
  return gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(browser.stream());
}

// HTML
const html = () => {
  return gulp.src("*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

//Images
const copyImages = () => {
  return gulp.src("img/**/*{jpg,png,svg,webp}")
  .pipe(gulp.dest("build/img"));
}

// Copy
const copy = (done) => {
  gulp.src([
    "*fonts/**/*.{woff2,woff}"
  ])
    .pipe(gulp.dest("build"))
  done();
}

// Clean
const clean = () => {
  return deleteAsync("build");
};

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload
const reload = (done) => {
  browser.reload();
  done();
}

// Watcher
const watcher = () => {
  gulp.watch("sass/**/*.scss", gulp.series(styles));
  gulp.watch("*.html", gulp.series(html, reload));
}

// Build
export const build = gulp.series (
  clean,
  copy,
  copyImages,
  gulp.parallel (
    styles,
    html
  ),
);

// Default
export default gulp.series (
  clean,
  copy,
  copyImages,
  gulp.parallel (
    styles,
    html
  ),
  gulp.series (
    server,
    watcher
  ));
