import React, { useState } from "react";
import { View, ScrollView, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { URL } from "../Layout/HomeScreen"; // Thêm URL của bạn
import { numberUtils } from "./utils/stringUtils";

const Payment2Screen = ({ route, navigation }) => {
  // Lấy dữ liệu từ màn BookingScreen
  const { bookingData } = route.params;
  const [card, setCard] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra tính hợp lệ của thông tin thẻ
  const validateCardInfo = () => {
    const datePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;  // Định dạng MM/YY
    if (!card || !cardName || !cardDate || !cvv) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thẻ.");
      return false;
    }
    if (cvv.length !== 3) {
      Alert.alert("Lỗi", "CVV phải có 3 chữ số.");
      return false;
    }
    return true;
  };

  const handleCardInput = (text) => {
    let value = text.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
  
    // Định dạng theo nhóm 4 số
    if (value.length > 4) {
      value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Thêm khoảng trắng sau mỗi nhóm 4 số
    }
  
    setCard(value); // Cập nhật giá trị số thẻ
  };

  const handleExpiryDateChange = (text) => {
    if (text.length === 0) {
      setCardDate('');
    } else if (text.length === 2 && !text.includes('/')) {
      const month = parseInt(text, 10);
      if (month > 12) {
        Alert.alert('Lỗi', 'Tháng phải nằm trong khoảng từ 01 đến 12!');
        setCardDate('');
      } else {
        setCardDate(text + '/');
      }
    } else if (text.length === 5) {
      const [month, year] = text.split('/');
      if (parseInt(year, 10) < 24) {
        Alert.alert('Lỗi', 'Ngày hết hạn phải là một ngày trong tương lai!');
      } else {
        setCardDate(text);
      }
    } else if (text.length === 3 && text[2] !== '/') {
      setCardDate(text.slice(0, 2) + '/' + text[2]);
    } else {
      setCardDate(text);
    }
  };
  

  const priceTotal = bookingData.price;
  

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    if (!validateCardInfo()) return; // Kiểm tra tính hợp lệ của thông tin thẻ

    // Tạo đối tượng dữ liệu thanh toán, kết hợp thông tin từ màn BookingScreen
    const paymentData = {
      ...bookingData,  // Dữ liệu booking đã có từ BookingScreen
      stadiumId: bookingData.stadiumId, // Chỉ giữ trường stadium 
      name: bookingData.name,
      soDienThoai: bookingData.soDienThoai,  // Thêm số điện thoại
      ghiChu: bookingData.ghiChu,  // Thêm ghi chú
      card, // Thêm thông tin thẻ
      cardName,
      cardDate,
      cvv,
    };
    console.log("Payment data: ", paymentData); // Debug để kiểm tra dữ liệu

    setLoading(true); // Hiển thị loading khi đang xử lý thanh toán

    try {
      // Gửi yêu cầu thanh toán
      const response = await axios.post(`${URL}/bookings/book`, paymentData);

      if (response.status === 200) {
        Alert.alert("Thành công", "Thanh toán thành công.");
        navigation.navigate("Home"); // Điều hướng về màn hình chính hoặc xác nhận
      } else {
        // Nếu server trả về lỗi, hiển thị thông báo lỗi cụ thể
        Alert.alert("Lỗi", response.data.message || "Có lỗi xảy ra khi thanh toán.");
      }
    } catch (error) {
      console.error(error);
      // Kiểm tra lỗi từ server nếu có thông báo lỗi chi tiết
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("Lỗi", error.response.data.message);
      } else {
        // Nếu không có lỗi cụ thể từ server, hiển thị thông báo chung
        Alert.alert("Lỗi", "Có lỗi xảy ra khi thanh toán. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false); // Ẩn loading khi xong
    }
  };


  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Thanh toán</Text>
      </View>
      <Text style={{textAlign: "center", fontSize: 18, fontWeight: "bold" }}>Nhập thông tin thẻ</Text>

      <View style={styles.contend}>
      <Text style={styles.textSty}>Số thẻ:</Text>
      <TextInput
        style={styles.input}
        value={card}
        onChangeText={handleCardInput}
        keyboardType="numeric"
        
        placeholder="Nhập số thẻ"
      />

      <Text style={styles.textSty}>Họ tên chủ thẻ:</Text>
      <TextInput
        style={styles.input}
        value={cardName}
        onChangeText={setCardName}
        placeholder="Nhập họ tên chủ thẻ"
      />

      <Text style={styles.textSty}>Ngày hết hạn:</Text>
      <TextInput
        style={styles.input}
        value={cardDate}
        onChangeText={handleExpiryDateChange}
        placeholder="MM/YY"
      />

      <Text style={styles.textSty}>CVV:</Text>
      <TextInput
        style={styles.input}
        value={cvv}
        onChangeText={setCvv}
        secureTextEntry
        keyboardType="numeric"
        placeholder="Nhập CVV"
      />
      </View>
      <View style={{flexDirection: 'row', alignItems: "flex-end", paddingHorizontal: 25}}>
        <Text style={{flex: 1, fontSize: 18, fontWeight: "bold"}}>Tổng tiền: </Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "red"}}>{numberUtils(priceTotal)}</Text>

      </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePayment} style={styles.button}>
          <Text style={styles.buttonText}>Thanh toán</Text>
        </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    flex: 1, 
    textAlign: "center", 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  textSty:{
    fontSize: 16, 
    fontWeight: "bold" ,
    marginBottom: 10,
  },
  contend:{
    padding: 20
  },
  input: {
    height: 60,
    backgroundColor: "#F5F5F5",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer:{
    padding: 20
  },
  button: {
    backgroundColor: "#825640",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default Payment2Screen;
