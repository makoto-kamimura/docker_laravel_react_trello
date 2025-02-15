const mix = require('laravel-mix');

// React のホットリロードを有効にする
mix.ts('resources/js/app.js', 'public/js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .webpackConfig({
        devServer: {
            hot: true,  // ホットリロードを有効にする
            host: '0.0.0.0',  // コンテナ内からアクセス可能にする
            port: 3000,  // Reactの開発サーバーのポートを設定
            headers: {
                'Access-Control-Allow-Origin': '*',  // CORSを許可する
            },
            watchFiles: ['resources/js/**/*', 'resources/sass/**/*'],  // 監視するファイルを指定
            historyApiFallback: true,
        }
    });
