/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");
const booksDBModel = require("../dbSchema.js");

module.exports = function(app) {
  /*------------------------------------------------------------------------------------------*/

  app
    .route("/api/books")
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      booksDBModel.find((err, arrayOfBooks) => {
        if (!err && arrayOfBooks) {
          let resArray = [];
          arrayOfBooks.forEach(item => {
            let book_Object = {};
            book_Object._id = item._id;
            book_Object.title = item.book_title;
            book_Object.commentcount = item.num_of_comments;
            resArray.push(book_Object);
          });
          res.json(resArray);
        }
      });
    })

    .post(function(req, res) {
      //response will contain new book object including atleast _id and title
      let title = req.body.title;

      if (!title || title == "") {
        return res.json("missing required field title");
      }

      booksDBModel.findOne({ book_title: title }, (err, book) => {
        if (!err && book) {
          console.log("error: book " + title + " already exists");
        } else {
          const newBook = new booksDBModel({
            book_title: title,
            comments: [],
            book_created_on: new Date().toUTCString(),
            num_of_comments: 0
          });
          newBook.save((err, saved_Book) => {
            if (!err && saved_Book) {
              res.json({
                _id: saved_Book._id,
                title: saved_Book.book_title,
                comments: saved_Book.comments
              });
            }
          });
        }
      });
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      booksDBModel.deleteMany({}, (err, data) => {
        if (!err && data) {
          res.json("complete delete successful");
        }
      });
    });

  /*------------------------------------------------------------------------------------------*/

  app
    .route("/api/books/:id")
    .get(function(req, res) {
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookid = req.params.id;

      booksDBModel.findOne({ _id: bookid }, (err, book) => {
        if (!err && book) {
          let book_Comments = [...book.comments];
          book_Comments = book_Comments.map(i => i.comment);
          res.json({
            title: book.book_title,
            _id: book._id,
            comments: book_Comments
          });
        } else {
          res.json("no book exists");
        }
      });
    })

    .post(function(req, res) {
      //json res format same as .get
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment || comment.length == 0) {
        return res.json("missing required field comment");
      }

      booksDBModel.findById(bookid, (err, book) => {
        //console.log(book.hasOwnProperty("comments"));
        if (!err && book) {
          let book_Comments = [...book.comments];
          let update_Object = {};
          update_Object.comment = comment;
          update_Object.comment_date = new Date().toUTCString();
          book_Comments.push(update_Object);

          booksDBModel.findByIdAndUpdate(
            bookid,
            {
              comments: book_Comments,
              last_comment_on: new Date().toUTCString(),
              num_of_comments: book.num_of_comments + 1
            },
            { new: true },
            (err, book_Updated) => {
              if (!err && book_Updated) {
                book_Comments = [...book_Updated.comments];
                res.json({
                  title: book_Updated.book_title,
                  _id: book_Updated._id,
                  comments: book_Comments.map(i => i.comment)
                });
              }
            }
          );
        } else {
          res.json("no book exists");
        }
      });
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      booksDBModel.findOneAndDelete({ _id: bookid }, (err, data) =>
        data ? res.json("delete successful") : res.json("no book exists")
      );
    });
};
