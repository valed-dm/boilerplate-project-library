var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
  book_title: { type: String, required: true },
  comments: [
    {
      comment: { type: String },
      comment_date: { type: Date }
    }
  ],
  book_created_on: { type: Date, required: true },
  last_comment_on: { type: Date },
  num_of_comments: { type: Number }
});

module.exports = mongoose.model("BOOK", bookSchema, "books");
