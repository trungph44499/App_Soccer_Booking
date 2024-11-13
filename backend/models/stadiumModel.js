
// models/StadiumModel.js
const mongoose = require('mongoose');

const stadiumSchema = new mongoose.Schema({
  img: String,
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true }, // Loại sân, ví dụ: "Football", "Basketball",...
}, { timestamps: true });

const StadiumModel = mongoose.model('Stadiums', stadiumSchema);

module.exports = StadiumModel;

