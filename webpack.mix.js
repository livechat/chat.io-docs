let mix = require('laravel-mix');

mix.js('src/js/app.js', 'dist/js')
   .sass('src/css/app.scss', 'dist/css')
   .sourceMaps()
   .options({
      processCssUrls: false
   })
   .browserSync({
      server: 'dist',
      proxy: false,
      files: [
        'dist/**/*.js',
        'dist/**/*.css',
        'dist/**/*.html',
      ],
      reloadThrottle: 100
   });
