/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const { ObjectId } = require('mongodb');
const Book = require('../models/book');

module.exports = function (app) {
  app
    .route('/api/books')
    .get((req, res) => {
      Book.find()
        .then((doc) => {
          res.status(200).send(doc);
        })
        .catch((error) => {
          res.status(200).send(error.message);
        });
    })

    .post((req, res) => {
      const { title } = req.body;

      if (!title) {
        return res.status(200).send('missing required field title');
      }

      const newBook = {
        _id: new ObjectId(),
        title: title,
        comments: [],
        commentcount: 0,
      };

      Book.create(newBook)
        .then((doc) => {
          res.status(200).send({ title: doc.title, _id: doc._id });
        })
        .catch(() => {
          res.status(200).send('error posting book');
        });
    })

    .delete((req, res) => {
      Book.deleteMany({})
        .then((doc) => {
          res.status(200).send('complete delete successful');
        })
        .catch(() => {
          res.status(200).send('error deleting books');
        });
    });

  app
    .route('/api/books/:_id')
    .get((req, res) => {
      const { _id } = req.params;

      Book.findById({ _id })
        .then((doc) => {
          if (!doc) {
            return res.status(200).send('no book exists');
          }
          res.status(200).send(doc);
        })
        .catch(() => {
          res.status(200).send('error getting book');
        });
    })

    .post((req, res) => {
      const { _id } = req.params;
      const { comment } = req.body;

      if (!comment) {
        return res.status(200).send('missing required field comment');
      }

      Book.findById({ _id })
        .then((doc) => {
          doc.comments = doc.comments.concat(comment);
          doc.commentcount = doc.commentcount + 1;

          doc.save().then((docUpdated) => {
            res.status(200).send(docUpdated);
          });
        })
        .catch(() => {
          res.status(200).send('no book exists');
        });
    })

    .delete(function (req, res) {
      const { _id } = req.params;

      Book.findById({ _id: _id })
        .then((doc) => {
          doc.remove().then(() => {
            res.status(200).send('delete successful');
          });
        })
        .catch(() => {
          res.status(200).send('no book exists');
        });
    });
};
