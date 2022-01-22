swaggerGen -c swaggerConfig.js
shx mkdir -p ./dist/src/interfaces/swagger
shx cp -Rf ./src/interfaces/swagger/temp ./dist/src/interfaces/swagger
