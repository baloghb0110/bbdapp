/*
* Gulp Builder (Config)
* @version: 4.0.0 (01 January, 2022)
* @author: HtmlStream
* @license: Htmlstream (https://htmlstream.com/licenses)
* Copyright 2022 Htmlstream
*/


// You may find more detailed documentation at documentation/gulp.html

module.exports = {

  //
  // Start path when launching a Gulp
  //

  startPath: "/index.html",


  //
  // Variables that can be used in HTML pages and SVG files
  //

  vars: {
    themeFont: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap",
    version: "?v=1.0"
  },


  //
  // Layout builder to customize look and feel of siderbar and navbar
  //

  layoutBuilder: {
    extend: {
      switcherSupport: true, // ture, false to add/remove dark mode switcher with dependency files
    },
    header: {
      layoutMode: 'default', // default, single, double
      containerMode: 'container' // container, container-fluid
    },
    sidebarLayout: 'default', // default, compact, mini
  },


  //
  // Theme Appearance
  //

  themeAppearance: {
    layoutSkin: 'dark', // default, auto, dark
    sidebarSkin: 'dark', // default, dark, light

    styles: {
      colors: {
        primary: '#377dff',
        transparent: 'transparent',
        white: '#fff',
        dark: '132144',
        gray: {
          100: '#f9fafc',
          900: '#1e2022'
        }
      },
      font: 'Inter' // Primary Font
    }
  },


  //
  // Language Direction
  //

  languageDirection: {
    lang: 'en' // e.g. en, ar
  },


  //
  // Skip CSS & JavaScript files from bundle files (e.g. vendor.min.css)
  //

  skipFilesFromBundle: {
    dist: [
      "assets/js/hs.theme-appearance.js",
      "assets/js/hs.theme-appearance-charts.js"
    ],

    build: [
      "assets/css/theme.css",
      "assets/vendor/hs-navbar-vertical-aside/dist/hs-navbar-vertical-aside-mini-cache.js",
      "assets/js/demo.js",
      "assets/css/theme-dark.css",
      "assets/css/docs.css",
      "assets/vendor/icon-set/style.css",
      "assets/js/hs.theme-appearance.js",
      "assets/js/hs.theme-appearance-charts.js",
      "node_modules/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js",
      "*app/app.js",
      "*app/*/**.js",
      "*app/*/*/**.js",
    ]
  },


  //
  // Minify CSS files
  //

  minifyCSSFiles: [
    "assets/css/theme.css",
    "assets/css/theme-dark.css"
  ],


  //
  // Copy/Paste files and folders into different path
  //

  copyDependencies: {
    dist: {
      "*assets/js/theme-custom.js": ""
    },

    build: {
      "*assets/js/theme-custom.js": "",
      "node_modules/bootstrap-icons/font/*fonts/**": "assets/css",
      "*app/**.js": "",
      "*app/*/**.js": "",
      "*app/*/*/**.js": "",
      "*backend/*/**.php": "",
    }
  },


  //
  // An option to set custom folder name for build process
  //

  buildFolder: "", // e.g. my-project


  //
  // Replace an asset paths in HTML to CDN
  //

  replacePathsToCDN: {},


  //
  // Change directory folder names
  //

  directoryNames: {
    src: "./src",
    dist: "./dist",
    build: "./build"
  },


  //
  // Change bundle file names
  //

  fileNames: {
    dist: {
      js: "theme.min.js",
      css: "theme.min.css"
    },

    build: {
      css: "theme.min.css",
      js: "theme.min.js",
      vendorCSS: "vendor.min.css",
      vendorJS: "vendor.min.js",
    }
  },


  //
  // Files types that will be copied to the ./build/* folder
  //

  fileTypes: "jpg|png|svg|mp4|webm|ogv|json",
}
