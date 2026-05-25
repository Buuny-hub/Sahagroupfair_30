FROM nginx:alpine

# Copy HTML
COPY index.html /usr/share/nginx/html/index.html

# Copy product images (10 items — filenames may contain spaces, use JSON array form)
COPY ["BSC_HoneiV_HYA Serum.png",       "/usr/share/nginx/html/BSC_HoneiV_HYA Serum.png"]
COPY ["BSC_HoneiV_Sunscreen.png",        "/usr/share/nginx/html/BSC_HoneiV_Sunscreen.png"]
COPY ["BSC_Honey Yuzu.png",              "/usr/share/nginx/html/BSC_Honey Yuzu.png"]
COPY ["Enfant_Wipes extra mild.png",     "/usr/share/nginx/html/Enfant_Wipes extra mild.png"]
COPY ["Sheene_Airy Powder.png",          "/usr/share/nginx/html/Sheene_Airy Powder.png"]
COPY ["Sheene_Airy Soft Matte Lip.png",  "/usr/share/nginx/html/Sheene_Airy Soft Matte Lip.png"]
COPY ["Sheene_Lip Nude.png",             "/usr/share/nginx/html/Sheene_Lip Nude.png"]
COPY ["Sheene_Lip Pink.png",             "/usr/share/nginx/html/Sheene_Lip Pink.png"]
COPY ["Sheene_loose powder.png",         "/usr/share/nginx/html/Sheene_loose powder.png"]
COPY ["Sheene_Powder.png",               "/usr/share/nginx/html/Sheene_Powder.png"]

# Copy mascot images (5 items)
COPY Mascot_01.png /usr/share/nginx/html/Mascot_01.png
COPY Mascot_02.png /usr/share/nginx/html/Mascot_02.png
COPY Mascot_03.png /usr/share/nginx/html/Mascot_03.png
COPY Mascot_04.png /usr/share/nginx/html/Mascot_04.png
COPY Mascot_05.png /usr/share/nginx/html/Mascot_05.png

# Copy His&Her logo
COPY hisher.svg /usr/share/nginx/html/hisher.svg

# Use nginx built-in template engine (auto envsubst $PORT at startup)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Strip CRLF just in case, remove static default config
RUN sed -i 's/\r//' /etc/nginx/templates/default.conf.template \
    && rm -f /etc/nginx/conf.d/default.conf
