const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 60 },
  description: { type: String, required: true, maxLength: 500 },
});

CategorySchema.virtual('url').get(() => `/category/${this._id}`);

module.exports = mongoose.model('Category', CategorySchema);

// Category: name, description, URL
