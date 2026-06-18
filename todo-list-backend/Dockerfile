FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    && rm -rf /var/list/apt/lists/*

RUN docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

COPY . /var/www/html/

RUN composer install --no-interaction --optimize-autoloader --no-dev

RUN a2enmod rewrite
# ... (todo lo anterior igual)

# Asegurar que Apache permita el uso de .htaccess en /var/www/html/public
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf


EXPOSE 80