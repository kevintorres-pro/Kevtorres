// Importaciones de los plugins de Gulp
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');

// NOTA: Se eliminaron 'gulp-imagemin' y 'del' de aquí.
// Se cargarán de forma asíncrona dentro de sus tareas.

// --- PATHS ---
const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    images: 'public/images/**/*',
    html: './*.html',
    dist: 'dist',
    distJS: 'dist/js',
    distCSS: 'dist/css',
    distImages: 'dist/public/images'
};

// --- TAREAS ---

// TAREA PARA LIMPIAR (MODIFICADA)
// Ahora es una función asíncrona para poder usar import()
async function clean() {
    const { deleteAsync } = await import('del'); // Carga 'del' de forma asíncrona
    await deleteAsync(paths.dist);
}

// TAREA PARA COMPILAR Y MINIFICAR SASS (Sin cambios)
function css(done) {
    gulp.src(paths.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.distCSS))
        .pipe(browserSync.stream());
    done();
}

// TAREA PARA MINIFICAR JAVASCRIPT (Sin cambios)
function javascript(done) {
    gulp.src(paths.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.distJS))
        .pipe(browserSync.stream());
    done();
}

// TAREA PARA OPTIMIZAR IMÁGENES (MODIFICADA)
// Ahora es una función asíncrona para poder usar import()
async function images() {
    const imagemin = (await import('gulp-imagemin')).default; // Carga 'gulp-imagemin'
    return gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distImages));
}

// TAREA PARA COPIAR HTML (Sin cambios)
function html(done) {
    gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
    done();
}

// TAREA PARA INICIAR BROWSERSYNC (Sin cambios)
function server(done) {
    browserSync.init({
        server: {
            baseDir: './'
        },
        browser: 'chrome',
        port: 3000
    });
    done();
}

// TAREA WATCHER (Sin cambios)
function watchFiles() {
    gulp.watch(paths.scss, css);
    gulp.watch(paths.js, javascript);
    gulp.watch(paths.images, images);
    gulp.watch(paths.html, html);
}

// --- TAREAS COMPUESTAS ---
const build = gulp.series(clean, gulp.parallel(css, javascript, images, html));
const dev = gulp.series(build, gulp.parallel(server, watchFiles));

// EXPORTAR TAREAS
exports.clean = clean;
exports.css = css;
exports.javascript = javascript;
exports.images = images;
exports.html = html;
exports.build = build;
exports.default = dev;