const express = require('express');
const router = express.Router();
const BookingModel = require('../models/BookingModel');

// Tạo mới một booking (POST)
router.post('/book', async (req, res) => {
  const { userEmail, stadiumId, date, timeSlot, price, name, soDienThoai, ghiChu } = req.body;

  // Kiểm tra xem thông tin có hợp lệ không
  if (!userEmail || !stadiumId || !date || !timeSlot || !price || !name || !soDienThoai || !ghiChu) {
    console.log("Dữ liệu thiếu: ", req.body); // Log thêm dữ liệu gửi lên
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  try {
    // Tạo mới booking với stadium (stadium là ObjectId) và giá tiền
    const newBooking = new BookingModel({
      userEmail,
      stadiumId,  // stadium sẽ là ObjectId
      date,
      timeSlot,
      price,  // Thêm giá của booking
      name,
      soDienThoai,
      ghiChu,
      status: 'pending', // Mặc định là pending
    });

    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    console.error("Lỗi khi lưu booking: ", err);  // Log lỗi khi lưu
    res.status(500).json({ message: 'Đặt sân thất bại. Vui lòng thử lại.' });
  }
});

// Kiểm tra booking (POST)
router.post('/checkBooking', async (req, res) => {
  const { stadiumId, date, timeSlot } = req.body;  // Kiểm tra theo stadiumId

  try {
    const booking = await BookingModel.findOne({
      stadiumId: stadiumId,   // Kiểm tra theo stadiumId
      date: date,
      timeSlot: timeSlot
    });

    if (booking) {
      res.status(200).json({ booked: true });
    } else {
      res.status(200).json({ booked: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Đã xảy ra lỗi khi kiểm tra booking." });
  }
});

// Lấy danh sách các booking của người dùng (GET)
router.get('/my-bookings', async (req, res) => {
  const { userEmail } = req.query;  // Lấy email người dùng từ query string

  if (!userEmail) {
    return res.status(400).json({ message: 'Vui lòng cung cấp email người dùng.' });
  }

  try {
    const bookings = await BookingModel.find({ userEmail }).populate('stadiums');  // Populate stadium thông tin sân
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể lấy danh sách booking của bạn.' });
  }
});

// Cập nhật trạng thái booking (PUT)
router.put('/update-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Vui lòng cung cấp trạng thái mới.' });
  }

  try {
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }  // Trả về đối tượng đã được cập nhật
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Không tìm thấy booking.' });
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái booking.' });
  }
});

// Xóa một booking (DELETE)
router.delete('/cancel/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBooking = await BookingModel.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Không tìm thấy booking để hủy.' });
    }

    res.status(200).json({ message: 'Đã hủy booking thành công.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Có lỗi khi hủy booking.' });
  }
});

module.exports = router;
