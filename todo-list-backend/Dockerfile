FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensiones de PHP para base de datos (PDO, MySQLi)
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Instalar Composer desde la imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar Apache para que la carpeta 'public' sea la raíz
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Habilitar mod_rewrite para que las rutas (enrutador) funcionen
RUN a2enmod rewrite

# Permitir el uso de archivos .htaccess para que el enrutamiento funcione
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copiar el código fuente
COPY . /var/www/html/

# Instalar dependencias de PHP vía Composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Exponer el puerto 80
EXPOSE 80