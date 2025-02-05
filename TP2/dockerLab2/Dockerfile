FROM php:8-fpm-alpine
ARG USERNAME
ARG UID
ARG EMAIL
ARG NAME

RUN echo "==============================="
RUN echo "$USERNAME ($UID)"
RUN echo "$NAME ($EMAIL)"
RUN echo "==============================="

# installation bash
RUN apk --no-cache update && apk --no-cache add bash git npm shadow \ 
    && apk --no-cache add 'nodejs'

# installation de composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
&& php composer-setup.php --install-dir=/usr/local/bin \
&& php -r "unlink('composer-setup.php');"

# installation de symfony
RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.alpine.sh' | bash
RUN apk add symfony-cli


# installation de Typescript
RUN npm install -g typescript 

# Gestion user
RUN echo "UID_MAX 9223372036854775807" > /etc/login.defs
RUN /usr/sbin/useradd -m -s /bin/sh -u "$UID" $USERNAME
USER $USERNAME
RUN git config --global user.email $EMAIL \
    && git config --global user.name  $NAME

WORKDIR /var/www/html
CMD  [ "/bin/bash" ]
