FROM php:7.2-cli

MAINTAINER You Ming <youming@funcuter.org>

COPY apt-sources.list /etc/apt/sources.list

RUN groupadd -g 1133 starrynight && useradd -g starrynight -u 1133 starrynight

RUN apt-get update \
 && apt-get install -y --no-install-recommends libsodium-dev libzip-dev libssl-dev \
        zlib1g-dev libpng-dev libjpeg-dev libfreetype6-dev \
        openssh-client curl git procps cron supervisor zip unzip

RUN docker-php-ext-install bcmath calendar exif pcntl shmop sockets sodium zip \
        sysvmsg sysvsem sysvshm pdo_mysql

RUN curl -L http://pecl.php.net/get/redis-4.0.2.tgz -o php-redis.tar.gz \
 && mkdir -p /usr/src/php-redis \
 && tar -xzf php-redis.tar.gz -C /usr/src/php-redis --strip-components=1 \
 && rm -rf php-redis.tar.gz \
 && cd /usr/src/php-redis \
 && phpize \
 && ./configure \
        --disable-redis-session \
 && make \
 && make install \
 && docker-php-ext-enable redis \
 && cd /

RUN curl -L http://pecl.php.net/get/swoole-1.10.5.tgz -o php-swoole.tar.gz \
 && mkdir -p /usr/src/php-swoole \
 && tar -xzf php-swoole.tar.gz -C /usr/src/php-swoole --strip-components=1 \
 && rm -rf php-swoole.tar.gz \
 && cd /usr/src/php-swoole \
 && phpize \
 && ./configure \
    --enable-openssl \
    --enable-mysqlnd \
 && make \
 && make install \
 && docker-php-ext-enable swoole \
 && cd /

RUN docker-php-source extract \
 && cd /usr/src/php/ext/gd \
 && phpize \
 && ./configure --with-freetype-dir=/usr/include/freetype2 --with-jpeg-dir=/usr/include \
 && make \
 && make install \
 && docker-php-ext-enable gd \
 && cd /

COPY composer docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/composer /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080 8081

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["supervisord"]
