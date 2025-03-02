#!/bin/sh
set -e

cd /var/www/html 

# .env ファイルが存在しない場合、デフォルトをコピー
if [ ! -f /var/www/html/.env ]; then
    cp /var/www/html/.env.example /var/www/html/.env
fi

php artisan key:generate || echo "⚠️ key:generate error"

php artisan migrate --force --seed  || echo "⚠️ migration error"

npm install

# caniuse-liteの更新
npx update-browserslist-db@latest

# MUIとアイコンライブラリをインストール
npm install @mui/icons-material @mui/material @emotion/react @emotion/styled || echo "⚠️ MUI install error"

# ビルドを実行
# npm run hot
npm run production --no-cache

exec apache2-foreground
