FROM node
WORKDIR /app
COPY build build
RUN npm install -g serve
CMD ["serve", "build"]