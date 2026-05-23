FROM nginx:alpine

# Copy HTML and logo files
COPY index.html /usr/share/nginx/html/index.html
COPY Logowacoal-01-scaled.jpg /usr/share/nginx/html/Logowacoal-01-scaled.jpg
COPY Logo-Guy-Laroche-Innerwear.jpg /usr/share/nginx/html/Logo-Guy-Laroche-Innerwear.jpg
COPY BSC-Cosmetology.jpeg /usr/share/nginx/html/BSC-Cosmetology.jpeg
COPY Logo-Enfant-Blue.jpg /usr/share/nginx/html/Logo-Enfant-Blue.jpg

# Use nginx built-in template engine (auto envsubst $PORT at startup)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Strip CRLF just in case, remove static default config
RUN sed -i 's/\r//' /etc/nginx/templates/default.conf.template \
    && rm -f /etc/nginx/conf.d/default.conf
