const imagemin = require('imagemin-keep-folder');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminSvgo = require('imagemin-svgo');

imagemin(['src/images/**/*.{jpg,png,svg}'], {
  use: [
    imageminMozjpeg({ quality: 80 }),
    imageminPngquant({ quality: [.65, .8] }),
    imageminSvgo()
  ],
  replaceOutputDir: output => {
    return output.replace(/images\//, '../dist/assets/images/')
  }
}).then(() => {
  console.log('Images optimized');
});
