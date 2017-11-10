let mix = require('laravel-mix');

mix.autoload({
  'jquery': ['jQuery', '$']
})

mix.copy('src/_redirects', 'dist/_redirects')
   .scripts('src/js/app.js', 'dist/docs/js')
   .sass('src/css/app.scss', 'dist/docs/css')
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
