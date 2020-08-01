let sourceFolder = '#src';
let projectFolder= require('path').basename(__dirname);

let fs = require('fs');

let path = {
	src: {
		html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
		css: sourceFolder + '/scss/style.scss',
		js: sourceFolder + '/js/script.js',
		img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,wepb}',
		fonts: sourceFolder + '/fonts/*.ttf'
	},
	build: {
		html: projectFolder + '/',
		css: projectFolder + '/css/',
		js: projectFolder + '/js/',
		img: projectFolder + '/img/',
		fonts: projectFolder + '/fonts/'
	},
	watch: {
		html: sourceFolder + '/**/*.html',
		css: sourceFolder + '/scss/**/*.scss',
		js: sourceFolder + '/js/**/*.js',
		img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,wepb}'
	},
	clean: './' + projectFolder + '/'
};

let {src, dest} = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileInclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	groupMediaQueries = require('gulp-group-css-media-queries'),
	cleanCss = require('gulp-clean-css'),
	gulpRename = require('gulp-rename'),
	gulpUglifyEs = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webpHtml = require('gulp-webp-html'),
	webpCss = require('gulp-webpcss'),
	svgSprite = require('gulp-svg-sprite'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2');
	fonter = require('gulp-fonter');

function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: path.clean
		},
		port: 3000,
		notify: false
	});
}

function html() {
	return src(path.src.html)
		.pipe(fileInclude())
		.pipe(webpHtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function css() {
	return src(path.src.css)
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(groupMediaQueries())
		.pipe(autoprefixer({
			overrideBrowserlist: ["last 5 version"],
			cascade: true
		}))
		.pipe(webpCss())
		.pipe(dest(path.build.css))
		.pipe(cleanCss())
		.pipe(gulpRename({
			extname: '.min.css'
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js() {
	return src(path.src.js)
		.pipe(fileInclude())
		.pipe(dest(path.build.js))
		.pipe(gulpUglifyEs())
		.pipe(gulpRename({
			extname: '.min.js'
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)
		.pipe(webp({
			quality: 70
		}))
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			interlaced: true,
			optimizationLevel: 3
		}))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function fonts(params) {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function() {
	return gulp.src([sourceFolder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(sourceFolder + '/fonts/'));
})

gulp.task('svgSprite', function() {
	return gulp.src([sourceFolder + '/iconsprite/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../icons/icons.svg',
					example: true
				}
			}
		}))
		.pipe(dest(path.build.img))
});

function fontsStyle(params) {
	let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}

function cb() {

}

function watchFiles(params) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function clean(params) {
	return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.fontsStyle = fontsStyle;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;