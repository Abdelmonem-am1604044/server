const mongoose = require('mongoose');

const RecordSchema = mongoose.Schema(
  {
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model('record', RecordSchema);

module.exports = Record;
