const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Signature Service API',
    description: 'This API doc is for Signature Service, including signature image and file CRUD.'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
