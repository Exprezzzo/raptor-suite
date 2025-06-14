// postcss.config.js
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [ // Plugins must be an array
    autoprefixer,
    process.env.NODE_ENV === 'production' && cssnano({
      preset: 'default',
    })
  ].filter(Boolean)
};