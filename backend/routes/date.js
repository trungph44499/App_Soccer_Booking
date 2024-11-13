const express = require('express');
const DateModel = require('../models/DateModel');
const router = express.Router();

// API để lấy thông tin ngày theo ID
router.get('/:id', async (req, res) => {
  try {
    const date = await DateModel.findById(req.params.id);
    if (!date) {
      return res.status(404).json({ message: 'Ngày không tồn tại' });
    }
    
    // Chuyển ngày thành dạng ISO string để frontend dễ sử dụng
    res.status(200).json({
      _id: date._id,
      date: date.date.toISOString(),  // Chuyển ngày sang dạng chuỗi ISO
      stadium: date.stadium
    });
  } catch (error) {
    console.error("Lỗi khi lấy ngày:", error);
    res.status(500).json({ message: 'Lỗi khi lấy ngày' });
  }
});

// API để đăng ký ngày mới
router.post('/register', async (req, res) => {
  const { date, stadiumId } = req.body;

  if (!date || !stadiumId) {
    return res.status(400).json({ response: "Ngày và sân là bắt buộc.", type: false });
  }

  // Kiểm tra xem ngày có hợp lệ không
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ response: "Ngày không hợp lệ.", type: false });
  }

  try {
    // Kiểm tra xem ngày đã tồn tại cho sân này chưa
    const existingDate = await DateModel.findOne({ date: parsedDate, stadium: stadiumId });
    if (existingDate) {
      return res.status(400).json({ response: "Ngày đã tồn tại trong hệ thống.", type: false });
    }

    // Tạo mới bản ghi ngày
    const newDate = new DateModel({
      date: parsedDate,  // Convert ngày từ string sang kiểu Date
      stadium: stadiumId,  // Liên kết với sân
    });

    await newDate.save();
    res.status(200).json({ response: "Ngày đã được thêm thành công.", type: true });
  } catch (error) {
    console.error("Lỗi khi thêm ngày:", error);
    res.status(500).json({ response: "Lỗi khi thêm ngày.", type: false });
  }
});

module.exports = router;
