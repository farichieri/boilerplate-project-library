/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(
          res.body[0],
          'commentcount',
          'Books in array should contain commentcount'
        );
        assert.property(
          res.body[0],
          'title',
          'Books in array should contain title'
        );
        assert.property(
          res.body[0],
          '_id',
          'Books in array should contain _id'
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', () => {
    suite(
      'POST /api/books with title => create book object/expect book object',
      () => {
        test('Test POST /api/books with title', (done) => {
          chai
            .request(server)
            .post('/api/books')
            .send({
              title: 'test title',
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(
                res.body[0],
                title,
                'Book in object should contain title'
              );
              assert.property(
                res.body[0],
                _id,
                'Book in object should contain _id'
              );
            });
          done();
        });

        test('Test POST /api/books with no title given', (done) => {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: '' })
            .end((err, res) => {
              assert.equal(res.statusCode, 200);
              assert.equal(res.body, 'missing required field title');
            });
          done();
        });
      }
    );

    suite('GET /api/books => array of books', () => {
      test('Test GET /api/books', (done) => {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
          });
        done();
      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {
      test('Test GET /api/books/[id] with id not in db', (done) => {
        const _id = 'fake_id';

        chai
          .request(server)
          .get('api/books/' + _id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            assert.isNotObject(res.body, 'response should not be an object');
          });
        done();
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .post('/api/books')
          .end((err, res) => {
            const _id = res.body._id;

            chai
              .request(server)
              .get(`/api/books/${_id}`)
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(
                  res.body,
                  '_id',
                  'response should have an _id property'
                );
                assert.property(
                  res.body,
                  'title',
                  'response should have  title property'
                );
                assert.property(
                  res.body,
                  'comments',
                  'response should have an comments property'
                );
                assert.property(
                  res.body,
                  'commentcount',
                  'response should have an commentcount property'
                );
              });
          });
        done();
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      () => {
        test('Test POST /api/books/[id] with comment', (done) => {
          chai
            .request(server)
            .post('/api/books/')
            .send({ title: 'Title Example' })
            .end((err, res) => {
              const _id = res.body._id;

              chai
                .request(server)
                .post('/api/books/' + _id)
                .send({ comment: 'Comment Example' })
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.isObject(res.body, 'response should be an object');
                  assert.property(
                    res.body,
                    '_id',
                    'response should have an _id property'
                  );
                  assert.property(
                    res.body,
                    'title',
                    'response should have title property'
                  );
                  assert.property(
                    res.body,
                    'comments',
                    'response should have an comments property'
                  );
                  assert.property(
                    res.body,
                    'commentcount',
                    'response should have an commentcount property'
                  );
                  assert.include(
                    res.body.comments,
                    'Comment Example',
                    'response contains updated comment'
                  );
                });
            });
          done();
        });

        test('Test POST /api/books/[id] without comment field', (done) => {
          chai
            .request(server)
            .post('/api/books/')
            .send({ title: 'Title Example' })
            .end((err, res) => {
              const _id = res.body._id;

              chai
                .request(server)
                .post(`/api/books/${_id}`)
                .send({ comment: '' })
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.notProperty(
                    res.body,
                    '_id',
                    'response should not have an _id property'
                  );
                  assert.notProperty(
                    res.body,
                    'title',
                    'response should not have title property'
                  );
                  assert.notProperty(
                    res.body,
                    'comments',
                    'response should not have an comments property'
                  );
                  assert.notProperty(
                    res.body,
                    'commentcount',
                    'response should not have an commentcount property'
                  );
                  assert.equal(res.text, 'missing required field comment');
                });
            });
          done();
        });

        test('Test POST /api/books/[id] with comment, id not in db', (done) => {
          chai
            .request(server)
            .post('/api/books/')
            .send({ title: 'Title Example' })
            .end((err, res) => {
              const _id = '_fake_id';

              chai
                .request(server)
                .post('/api/books/' + _id)
                .send({ comment: 'Title Updated' })
                .end((err, res) => {
                  assert.equal(res.status, 200);
                  assert.notProperty(
                    res.body,
                    '_id',
                    'response should not have an _id property'
                  );
                  assert.notProperty(
                    res.body,
                    'title',
                    'response should not have title property'
                  );
                  assert.notProperty(
                    res.body,
                    'comments',
                    'response should not have an comments property'
                  );
                  assert.notProperty(
                    res.body,
                    'commentcount',
                    'response should not have an commentcount property'
                  );
                  assert.equal(res.text, 'no book exists');
                });
            });
          done();
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book object id', () => {
      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai
          .request(server)
          .post('/api/books/')
          .send({ title: 'Title Example' })
          .end((err, res) => {
            const _id = res.body._id;

            chai
              .request(server)
              .delete('/api/books/' + _id)
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.notProperty(
                  res.body,
                  '_id',
                  'response should not have an _id property'
                );
                assert.notProperty(
                  res.body,
                  'title',
                  'response should not have title property'
                );
                assert.notProperty(
                  res.body,
                  'comments',
                  'response should not have an comments property'
                );
                assert.notProperty(
                  res.body,
                  'commentcount',
                  'response should not have an commentcount property'
                );
                assert.equal(res.text, 'delete successful');
              });
          });
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', (done) => {
        chai
          .request(server)
          .post('/api/books/')
          .send({ title: 'Title Example' })
          .end((err, res) => {
            const _id = '__fake_id';

            chai
              .request(server)
              .delete('/api/books/' + _id)
              .end((err, res) => {
                assert.equal(res.status, 200);
                assert.notProperty(
                  res.body,
                  '_id',
                  'response should not have an _id property'
                );
                assert.notProperty(
                  res.body,
                  'title',
                  'response should not have title property'
                );
                assert.notProperty(
                  res.body,
                  'comments',
                  'response should not have an comments property'
                );
                assert.notProperty(
                  res.body,
                  'commentcount',
                  'response should not have an commentcount property'
                );
                assert.equal(res.text, 'no book exists');
              });
          });
        done();
      });
    });
  });
});
