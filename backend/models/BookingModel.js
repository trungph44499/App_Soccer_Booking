
// models/BookingModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    userEmail: { type: String, required: true },  // Email người dùng
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadiums', required: true },  // Liên kết đến sân
    date: { type: String, required: true },       // Ngày đặt sân (dưới dạng chuỗi "YYYY-MM-DD")
    timeSlot: { type: String, required: true },   // Ca chọn (sáng, chiều, tối)
    price: { type: Number, required: true },      // Giá của ca (mới thêm vào)
    status: { type: String, default: 'pending' }, // Trạng thái đặt sân (pending, confirmed, cancelled)
  },
  { timestamps: true } // Tạo trường createdAt và updatedAt tự động
);

// Tạo model từ schema
const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;

