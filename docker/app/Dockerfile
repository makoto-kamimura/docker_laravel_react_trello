FROM php:8.1-apache

# Apache モジュールを有効化
RUN a2enmod rewrite

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libonig-dev libxml2-dev curl \
    npm nodejs \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Composer のインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ設定
WORKDIR /var/www/html

# Laravel の依存関係をインストール
COPY app /var/www/html
RUN composer install --no-dev --optimize-autoloader

# React フロントエンドをビルド
# RUN npm install
# npm run production --no-cache

# パーミッション設定
RUN chmod -R 777 /var/www/html/public
RUN chown -R www-data:www-data /var/www/html/public

# Apache の設定をコピー
COPY docker/app/apache/apache.conf /etc/apache2/sites-available/000-default.conf

# entrypoint.sh をコピーして実行権限を付与
COPY docker/app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# エントリーポイントとして設定
ENTRYPOINT ["/entrypoint.sh"]

# サーバー起動
CMD ["apache2-foreground"]
