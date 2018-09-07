FROM nginx:stable-alpine

COPY ./dist/ /var/www

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf.template

ENV uri \$uri

# Default configuration
ENV PORT 80
ENV SERVER_NAME _

ENTRYPOINT ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
