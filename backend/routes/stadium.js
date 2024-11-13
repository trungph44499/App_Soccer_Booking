const express = require('express');
const Stadium = require('../models/stadiumModel');
const router = express.Router();

// 1. Lấy tất cả các sân
router.get('/', async (req, res) => {
  try {
    const stadiums = await Stadium.find();
    res.status(200).json(stadiums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Lấy sân theo ID
router.get('/getStadium/:_id', async (req, res) => {
  const { _id } = req.params;
  try {
    const stadium = await Stadium.findById(_id);
    if (!stadium) {
      return res.status(404).json({ message: 'Sân không tồn tại' });
    }
    res.status(200).json(stadium);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 3. Thêm sân mới
router.post('/register', async (req, res) => {
  const { name, address, type, img } = req.body;

  if (!name || !address || !type || !img) {
    return res.status(400).json({ response: "Tất cả các trường đều phải có", type: false });
  }

  try {
    const newStadium = new Stadium({
      name,
      address,
      type,
      img,
    });

    await newStadium.save();
    res.status(200).json({ response: "Thêm sân thành công!", type: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Lỗi khi thêm sân", type: false });
  }
});

// 4. Cập nhật thông tin sân
router.post('/update', async (req, res) => {
  const { name, address, type, img, stadiumId } = req.body;

  if (!stadiumId || !name || !address || !type || !img) {
    return res.status(400).json({ response: "Tất cả các trường đều phải có", type: false });
  }

  try {
    const updatedStadium = await Stadium.findByIdAndUpdate(
      stadiumId,
      { name, address, type, img },
      { new: true }
    );

    if (!updatedStadium) {
      return res.status(404).json({ response: "Sân không tồn tại", type: false });
    }

    res.status(200).json({ response: "Cập nhật sân thành công!", type: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Lỗi khi cập nhật sân", type: false });
  }
});

// 5. Xóa sân
router.post('/delete', async (req, res) => {
  const { stadiumId } = req.body;

  if (!stadiumId) {
    return res.status(400).json({ response: "ID sân không hợp lệ", type: false });
  }

  try {
    const deletedStadium = await Stadium.findByIdAndDelete(stadiumId);

    if (!deletedStadium) {
      return res.status(404).json({ response: "Sân không tồn tại", type: false });
    }

    res.status(200).json({ response: "Xóa sân thành công!", type: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Lỗi khi xóa sân", type: false });
  }
});

module.exports = router;
