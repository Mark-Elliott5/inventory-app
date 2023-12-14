const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true, minLength: 4, maxLength: 100 },
  description: { type: String, required: true, minLength: 10, maxLength: 500 },
  category: [{ type: Schema.ObjectId, ref: 'Category', required: true }],
  price: {
    type: Number,
    required: true,
    min: 0.01,
    validate: {
      validator(value) {
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        return Number.isFinite(value) && decimalPlaces === 2;
      },
      message: 'Price must be a float with 1 decimal places.',
    },
  },
  numberInStock: {
    type: Number,
    required: true,
    validate: {
      validator(value) {
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Number in stock must be an integer.',
    },
  },
});

ItemSchema.virtual('url').get(function () {
  return `/products/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);

// Item: name, description, category,
// price, number in stock, URL
