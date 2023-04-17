const request = require('supertest');
const app = require('../app');
const { errMsgs } = require('../constants/msgs');

describe('File Apis', () => {
  describe('GET /file', () => {
    it('responds with status 200', (done) => {
      request(app)
        .get('/file')
        .query({ from: 0, count: 100 })
        .expect(200, done);
    });
  
    it('responds with status 400 if from or count is missing', (done) => {
      request(app)
        .get('/file')
        .expect(400)
        .expect({
          status: true,
          code: 400,
          message: errMsgs.GET_FILES_FROM_ERROR,
        }, done);
    });
  
    it('responds with status 400 if query string from is missing', (done) => {
      request(app)
        .get('/file')
        .query({ count: 100 })
        .expect(400)
        .expect({
          status: true,
          code: 400,
          message: errMsgs.GET_FILES_FROM_ERROR,
        }, done);
    });
  
    it('responds with status 400 if query string count is missing', (done) => {
      request(app)
        .get('/file')
        .query({ from: 0 })
        .expect(400)
        .expect({
          status: true,
          code: 400,
          message: errMsgs.GET_FILES_COUNT_ERROR,
        }, done);
    });
  });

  // describe('GET /file/:id', () => {
  //   it('responds with status 200', (done) => {
  //     request(app)
  //     .get('/file/123')
  //     .expect(200, done);
  //   });
  // });
});
