#!/bin/sh
set -e

cd /var/www/html 

echo "🚀 Laravel コンテナ起動中..."

# .env ファイルが存在しない場合、デフォルトをコピー
if [ ! -f /var/www/html/.env ]; then
    echo "📄 .env ファイルが見つからないため、.env.example からコピーします..."
    cp /var/www/html/.env.example /var/www/html/.env
else
    echo "✅ .env ファイルがすでに存在します"
fi

echo "🔑 Laravel アプリケーションキーを生成..."
php artisan key:generate || echo "⚠️ key:generate に失敗しました"

echo "🛠 マイグレーションを実行..."
php artisan migrate --force --seed  || echo "⚠️ マイグレーションに失敗しました"

npm install

# caniuse-liteの更新
npx update-browserslist-db@latest

# MUIとアイコンライブラリをインストール
echo "📦 MUIとアイコンライブラリをインストール..."
npm install @mui/icons-material @mui/material @emotion/react @emotion/styled || echo "⚠️ MUIのインストールに失敗しました"

# ビルドを実行
# npm run hot
npm run production --no-cache

echo "🚀 Apache を起動..."
exec apache2-foreground
