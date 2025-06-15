import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import cssnano from 'cssnano';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const outputPath = path.resolve(__dirname, 'dist');

export default {
  mode: isProduction ? 'production' : 'development',
  entry: './src/main.jsx',
  output: {
    path: outputPath,
    filename: isProduction ? `[name].${Date.now()}.[contenthash:8].js` : '[name].js',
    chunkFilename: isProduction ? `[name].${Date.now()}.[contenthash:8].chunk.js` : '[name].chunk.js',
    clean: true, // Set to true to clean the dist folder before each build
    publicPath: '/',
    assetModuleFilename: isProduction ? `assets/[name].${Date.now()}.[hash:8][ext]` : 'assets/[name].[hash:8][ext]'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: isProduction ? [
              '@babel/plugin-transform-runtime',
              'babel-plugin-transform-remove-console'
            ] : ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer',
                  isProduction && cssnano({ preset: 'default' })
                ].filter(Boolean)
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
        type: 'asset/resource', // Changed to asset/resource to ensure separate files are generated
        generator: {
          filename: isProduction ? `images/[name].${Date.now()}.[hash:8][ext]` : 'images/[name].[hash:8][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: isProduction ? `fonts/[name].${Date.now()}.[hash:8][ext]` : 'fonts/[name].[hash:8][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Path to your source index.html
      inject: 'body', // Injects all assets into the body
      filename: 'index.html', // Output filename in the dist folder
      scriptLoading: 'defer', // Defer script loading for better performance
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true,
      } : false,
      // No need for a custom templateContent function here.
      // We'll ensure the source index.html is clean.
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: `[name].${Date.now()}.[contenthash:8].css`,
      chunkFilename: `[id].${Date.now()}.[contenthash:8].css`
    }),
    isProduction && new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    isProduction && new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    process.env.ANALYZE && new BundleAnalyzerPlugin()
  ].filter(Boolean),
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
          },
          mangle: true,
          format: {
            comments: false
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        firebase: {
          test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
          name: 'firebase',
          priority: 20,
          reuseExistingChunk: true
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          priority: 20,
          reuseExistingChunk: true
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: 'single',
    moduleIds: 'deterministic'
  },
  devServer: {
    port: 5173,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    static: outputPath, // Serve content from the output path in development
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  stats: {
    children: false,
    modules: false
  }
};