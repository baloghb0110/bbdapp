/*
* Gulp Builder (Build)
* @version: 1.0.0 (Fri, 08 May 2020)
* @author: HtmlStream
* @license: Htmlstream (https://htmlstream.com/licenses)
* Copyright 2020 Htmlstream
*/

const del = require('del');

const {
  config,
  context,
  pathLevel,
  shieldingVariables,
  shieldingFunctions,
  additionNames,
  gulpLighten,
  gulpDarken,
  gulpRGBA
} = require('./core');
const paths = require('./paths');
const { svgCompiler } = require('./svg-compiler')

const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const replace = require('gulp-replace');
const deleteLines = require('gulp-delete-lines');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const rtlcss = require("gulp-rtlcss");
const rename = require('gulp-rename');
const prettify = require("gulp-prettify");
const ngAnnotate = require('gulp-ng-annotate');
const { contains } = require('jquery');
const hash = require('gulp-hash-filename');


let css = [],
  minifyCSSFiles = [],
  js = [],
  vendor_css = [],
  vendor_js = [],
  skippedNodeFiles = [],
  skippedFiles = [],
  images = [],
  teszt_a = [];

function fileInclude() {
  return gulp
    .src([
      paths.build.html.files,
      '!' + paths.src.assets.files,
      '!' + paths.src.tmp.files,
      '!' + paths.src.partials.files
    ])
    .pipe(replace(/@@autopath/g, function (match) {
      return pathLevel(this.file)
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
      context: context
    }))
    .pipe(replace(/@@autopath/g, function (match) {
      return pathLevel(this.file)
    }))
    .pipe(replace(new RegExp('(.*?)(\\.+\\/)+' + `(${additionNames.vendor}|node_modules)` + '\/.*\\.(js|css)', 'g'), function (match, p1, p2, p3, p4) {
      if (p1.search(/(&gt|&lt|<!--|\/\/)/g) >= 0) return match;

      path = match.replace(/(\.+\/)+/, '').replace(p1, '')

      // Node Modules Vendor
      if (path.search('node_modules') === 0) {
        if (config.skipFilesFromBundle.build.indexOf(path) < 0) {
          if (p4 === "css") {
            vendor_css.push(path)
          } else {
            vendor_js.push(path)
          }

          return match + " " + config.deleteLine
        } else {
          if (path in config.replacePathsToCDN) {
            return config.replacePathsToCDN[path]
          } else {
            splitedPath = path.split('/')

            skippedNodeFiles.push(splitedPath[0] + '/*' + splitedPath[1] + '/**')
          }
        }

        return match.replace('node_modules', paths.build.vendor.dir.replace(paths.build.base.dir + '/', ''))
      }

      // Local Vendor
      else {
        if (config.skipFilesFromBundle.build.indexOf(path) < 0) {
          if (p4 === "css") {
            vendor_css.push(paths.src.base.dir + "/" + path)
          } else {
            vendor_js.push(paths.src.base.dir + "/" + path)
          }

          return match + " " + config.deleteLine
        } else {
          if (path in config.replacePathsToCDN) {
            return config.replacePathsToCDN[path]
          } else {
            splitedPath = path.split('/')

            skippedFiles.push(paths.src.base.dir + '/*' + splitedPath[0] + '/' + splitedPath[1] + '/' + splitedPath[2] + '/**')
          }
        }

        return match
      }
    }))
    .pipe(replace(new RegExp('(.*?)(\\.+\\/)+' + `(${additionNames.js}|${additionNames.css})` + '\/.*\\.(js|css)', 'g'), function (match, p1, p2, p3, p4) {
      if (p1.search(/(&gt|&lt|<!--|\/\/)/g) >= 0) return match;

      path = match.replace(/(\.+\/)+/, '').replace(p1, '')

      if (config.skipFilesFromBundle.build.indexOf(path) < 0) {
        if (p4 === "css") {
          css.push(paths.src.base.dir + "/" + path)
        } else {
          js.push(paths.src.base.dir + "/" + path)
        }

        return match + " " + config.deleteLine
      } else {
        if (config.minifyCSSFiles.indexOf(path) > -1) {
          minifyCSSFiles.push(paths.src.base.dir + "/" + path)
          return match.replace('.css', '.min.css')
        }
        if (path in config.replacePathsToCDN) {
          return config.replacePathsToCDN[path]
        } else {
          skippedFiles.push(paths.src.base.dir + "/*" + path)
        }
      }

      return match
    }))
    .pipe(replace(new RegExp('(.*?)(\\.+\\/)+(.*?)\\.' + '(' + config.fileTypes + '|html' + ')', 'g'), function (match, p1, p2) {
      if (p1.search(/(&gt|&lt|<!--|\/\/|\.html)/g) >= 0) return match
      if (match.search(/\.html/g) >= 0) return match

      path = match.replace(/(\.+\/)+/, '').replace(p1, '')

      if (path.search('node_modules') >= 0) {
        splitedPath = path.split('/')

        skippedNodeFiles.push(splitedPath[0] + '/*' + splitedPath[1] + '/**')

        return match.replace('node_modules', paths.build.vendor.dir.replace(paths.build.base.dir + '/', ''))
      } else {
        images.push(paths.src.base.dir + "/*" + path)
      }

      return match
    }))
    .pipe(replace(/gulpLighten\[(.*?)\]/g, function (math, p1) {
      return gulpLighten(p1)
    }))
    .pipe(replace(/gulpDarken\[(.*?)\]/g, function (math, p1) {
      return gulpDarken(p1)
    }))
    .pipe(replace(/gulpRGBA\[(.*?)\]/g, function (math, p1) {
      return gulpRGBA(p1)
    }))
    .pipe(deleteLines({
      'filters': [
        new RegExp(config.deleteLine, 'i')
      ]
    }))
    .pipe(deleteLines({
      'filters': [
        new RegExp(config["deleteLine:build"], 'i')
      ]
    }))
    .pipe(replace(new RegExp(config["deleteLine:dist"], 'g'), ''))
    .pipe(replace(/<!-- bundlecss:vendor \[(.*?)\](.*)-->/g, function (math, p1, p2) {
      return `<link rel="stylesheet" href="${p1}/${paths.build.build.css}/${config.fileNames.build.vendorCSS}${p2.trim()}">`;
    }))
    .pipe(replace(/<!-- bundlecss:theme \[(.*?)\](.*)-->/g, function (math, p1, p2) {
      return `<link rel="stylesheet" href="${p1}/${paths.build.build.css}/${config.fileNames.build.css}${p2.trim()}">`;
    }))
    .pipe(replace(/<!-- bundlejs:vendor \[(.*?)\](.*)-->/g, function (math, p1, p2) {
      return `<script src="${p1}/${paths.build.build.js}/${config.fileNames.build.vendorJS}${p2.trim()}"></script>`;
    }))
    .pipe(replace(/<!-- bundlejs:theme \[(.*?)\](.*)-->/g, function (math, p1, p2) {
      return `<script src="${p1}/${paths.build.build.js}/${config.fileNames.build.js}${p2.trim()}"></script>`;
    }))
    .pipe(replace(/(\[\@\@\]).*?/g, function (match, p1) {
      return shieldingVariables(match, p1);
    }))
    .pipe(replace(/(\[@\@F\]).*?/g, function (match, p1) {
      return shieldingFunctions(match, p1);
    }))
    .pipe(replace(/\<\/head\>/g, function (math, p1) {
      const visablilityStyles = `<style>[data-hs-theme-appearance]:not([data-hs-theme-appearance='${config.themeAppearance.layoutSkin}']){display:none;}</style>`
      return `
        <script>
        window.hs_config = ${JSON.stringify(config)}
        window.hs_config.gulpRGBA = ${gulpRGBA}
        window.hs_config.gulpDarken = ${gulpDarken}
        window.hs_config.gulpLighten = ${gulpLighten}
        </script>${!config.layoutBuilder.extend.switcherSupport ? visablilityStyles : ''}                
      </head>`
    }))
    .pipe(replace(/\<\!\-\- ONLY DEV \-\-\>(.|\n)*?\<\!\-\- END ONLY DEV \-\-\>\s+/g, ''))
    .pipe(replace(/\/\/ ONLY DEV(.|\n)*?\/\/ END ONLY DEV\s+/g, ''))
    .pipe(prettify({
      indent_inner_html: false,
      unformatted: ['pre', 'code', 'script'],
      preserve_newlines: true
    }))
    .pipe(gulp.dest(paths.build.base.dir))
};

function buildCSS() {
  css = new Set(css)

  if ([...css].length) {
    return gulp
      .src([...css])
      .pipe(cleanCSS({ compatibility: 'ie11' }))
      .pipe(concat(config.fileNames.build.css))
      .pipe(gulp.dest(paths.build.css.dir));
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function buildMinifyCSSFiles() {
  minifyCSSFiles = new Set(minifyCSSFiles)

  if ([...minifyCSSFiles].length) {
    return gulp
      .src([...minifyCSSFiles])
      .pipe(cleanCSS({ compatibility: 'ie11' }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.build.css.dir));
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function buildJS() {
  js = new Set(js)

  if ([...js].length) {
    return gulp
      .src([...js], {
        allowEmpty: true,
      })
      .pipe(concat(config.fileNames.build.js))
      .pipe(uglify())
      .pipe(gulp.dest(paths.build.js.dir));
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function buildVendorCSS() {
  vendor_css = new Set(vendor_css)

  if ([...vendor_css].length) {
    return gulp
      .src([...vendor_css])
      .pipe(cleanCSS({ compatibility: 'ie11' }))
      .pipe(concat(config.fileNames.build.vendorCSS))
      .pipe(gulp.dest(paths.build.css.dir));
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function rtlCSS() {
  return gulp
    .src(paths.build.build.css)
    .pipe(rtlcss())
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(rename({ suffix: '-rtl' }))
    .pipe(gulp.dest(paths.build.build.css))
}

function teszt() {

  return gulp
    .src(['./src/app/app.js', './src/app/controllers/**/*.js', './src/app/directives/**/*.js', './src/app/factories/**/*.js', './src/app/services/**/*.js'])
    .pipe(concat('script.js'))
    .pipe(ngAnnotate())
    .pipe(uglify({ mangle: false }))
    .pipe(hash({
      "format": "{name}-{hash:8}{mtime}{ext}"
    }))
    .pipe(gulp.dest('./build/app/'))
}

function buildVendorJS() {
  vendor_js = new Set(vendor_js)

  if ([...vendor_js].length) {
    return gulp
      .src([...vendor_js], {
        allowEmpty: true,
      })
      .pipe(concat(config.fileNames.build.vendorJS))
      .pipe(uglify())
      .pipe(gulp.dest(paths.build.js.dir));
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function copeImages() {
  images = new Set(images)

  if ([...images].length) {
    return gulp
      .src([...images])
      .pipe(gulp.dest(paths.build.base.dir));
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function copySkippedFiles() {
  skippedFiles = new Set(skippedFiles)

  if ([...skippedFiles].length) {
    return gulp
      .src([...skippedFiles])
      .pipe(gulp.dest(paths.build.base.dir))
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function copySkippedNodeFiles() {
  skippedNodeFiles = new Set(skippedNodeFiles)

  if ([...skippedNodeFiles].length) {
    return gulp
      .src([...skippedNodeFiles])
      .pipe(gulp.dest(paths.build.vendor.dir))
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function copyDependencies() {
  for (var k in config.copyDependencies.build) {
    path = k;

    if (k.search('node_modules') !== 0) {
      path = './src' + '/' + k
    }

    gulp
      .src(path)
      .pipe(gulp.dest(paths.build.base.dir + '/' + config.copyDependencies.build[k]))
  }

  return new Promise(function (resolve, reject) {
    resolve();
  });
}

function copyFavicon() {
  return gulp
    .src(paths.src.base.dir + "/favicon.ico")
    .pipe(gulp.dest(paths.build.base.dir));
}

function clean() {
  return del(paths.build.base.dir, { force: true });
}

gulp.task('build', gulp.series(clean, fileInclude, buildCSS, buildMinifyCSSFiles, buildVendorCSS, buildJS, buildVendorJS, svgCompiler, copeImages, copySkippedFiles, copySkippedNodeFiles, copyDependencies, copyFavicon, teszt));
