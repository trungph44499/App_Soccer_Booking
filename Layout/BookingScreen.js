import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from "../Layout/HomeScreen";

const BookingScreen = ({ route, navigation }) => {
  const [stadium, setStadium] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [name, setName] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [ghiChu, setGhiChu] = useState('');

  const { stadiumId } = route.params;

  const timeSlots = {
    ca1: { label: "Ca 1 (7:00 - 9:00)  có giá 100.000đ", price: 100000 },
    ca2: { label: "Ca 2 (9:00 - 11:00) có giá 150.000đ", price: 150000 },
    ca3: { label: "Ca 3 (13:00 - 15:00) có giá 150.000đ", price: 150000 },
    ca4: { label: "Ca 4 (15:00 - 17:00) có giá 200.000đ", price: 200000 },
    ca5: { label: "Ca 5 (17:00 - 19:00) có giá 250.000đ", price: 250000 },
    ca6: { label: "Ca 6 (19:00 - 21:00) có giá 250.000đ", price: 250000 },
    ca7: { label: "Ca 7 (21:00 - 23:00) có giá 300.000đ", price: 300000 },
  };

  // Hàm kiểm tra số điện thoại Việt Nam
  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^(03|05|07|08|09)\d{8}$/; // Regex cho số điện thoại Việt Nam
    return regex.test(phoneNumber);
  };

  // Lấy thông tin người dùng từ AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const emailUser = await AsyncStorage.getItem('@UserLogin');
        if (emailUser) {
          setUserEmail(emailUser);
        } else {
          Alert.alert('Lỗi', 'Bạn cần đăng nhập để tiếp tục.');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi lấy thông tin người dùng.');
      }
    };

    getUserData();
  }, []);

  // Lấy thông tin sân từ API
  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const response = await axios.get(`${URL}/stadiums/getStadium/${stadiumId}`);
        setStadium(response.data);
      } catch (error) {
        Alert.alert('Lỗi', 'Có lỗi khi lấy thông tin sân.');
      }
    };

    if (stadiumId) {
      fetchStadium();
    }
  }, [stadiumId]);

  // Kiểm tra tình trạng đặt sân
  const checkBookingStatus = async () => {
    try {
      const response = await axios.post(`${URL}/bookings/checkBooking`, {
        stadiumId: stadiumId,
        date: selectedDate.toLocaleDateString('vi-VN'),
        timeSlot: selectedTimeSlot,
      });

      setIsBooked(response.data.booked);
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi kiểm tra tình trạng đặt sân.');
    }
  };

  // Kiểm tra tình trạng đặt sân khi các lựa chọn thay đổi
  useEffect(() => {
    if (stadiumId && selectedTimeSlot && selectedDate) {
      checkBookingStatus();
    }
  }, [stadiumId, selectedTimeSlot, selectedDate]);

  const handleProceedToPayment = () => {
    if (!stadiumId || !selectedTimeSlot || !name || !selectedDate || !soDienThoai) {
      Alert.alert('Lỗi', 'Vui lòng chọn đầy đủ thông tin và nhập số điện thoại.');
      return;
    }
    if (isBooked) {
      Alert.alert('Lỗi', 'Sân đã có người đặt vào ca này.');
      return;
    }

    if (!userEmail) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục.');
      return;
    }
    // Kiểm tra số điện thoại
    if (!validatePhoneNumber(soDienThoai)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    // Kiểm tra và chuyển ghi chú thành null nếu nó là chuỗi rỗng
    const ghiChuValue = ghiChu.trim() === '' ? "null" : ghiChu;

    // Chuyển sang màn thanh toán
    const selectedPrice = timeSlots[selectedTimeSlot]?.price;
    const bookingData = {
      userEmail,
      stadiumId,
      date: selectedDate.toLocaleDateString('vi-VN'),
      timeSlot: selectedTimeSlot,
      price: selectedPrice,
      name,
      soDienThoai,
      ghiChu: ghiChuValue,
    };

    navigation.navigate('Payment2', { bookingData });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {stadium ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../Image/back.png")}
                />
              </TouchableOpacity>
              <Text style={styles.title}>{stadium.name}</Text>
            </View>
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Chọn ca:</Text>
              <Picker
                selectedValue={selectedTimeSlot}
                onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Chọn ca" value="" />
                {Object.entries(timeSlots).map(([key, { label }]) => (
                  <Picker.Item label={label} value={key} key={key} />
                ))}
              </Picker>

              {/* {selectedTimeSlot && (
                <Text style={styles.priceText}>
                  Giá: {timeSlots[selectedTimeSlot].price.toLocaleString()} đ
                </Text>
              )} */}
              <View>
                <View style={styles.inputRow}>
                  <Text style={styles.textItem}>Chọn ngày:</Text>
                  <Text style={styles.textItem}>Ngày đã chọn:</Text>
                </View>
                <View style={styles.inputRow}>
                  <TouchableOpacity
                    style={styles.buttonSelectDay}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#242424" }}>Nhấp để chọn</Text>

                  </TouchableOpacity>
                  <View style={styles.buttonDay}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#242424" }}>{selectedDate.toLocaleDateString('vi-VN')}</Text>
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        setSelectedDate(date || selectedDate);
                        setShowDatePicker(false);
                      }}
                    />
                  )}
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên)"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                maxLength={10}
                value={soDienThoai}
                onChangeText={setSoDienThoai}
              />
              <TextInput
                style={styles.input}
                placeholder="Ghi chú (tuỳ chọn)"
                value={ghiChu}
                onChangeText={setGhiChu}
              />

              {isBooked && <Text style={styles.errorText}>Sân đã có người đặt vào ca này!</Text>}

              <TouchableOpacity
                style={styles.button}
                onPress={handleProceedToPayment}
              >
                <Text style={styles.buttonText}>Tiến hành thanh toán</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
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
  title: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold" },
  textItem: { flex: 1, fontSize: 18, fontWeight: "bold", marginLeft: 10, },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  picker: {
    width: "100%",
    height: 60,
    backgroundColor: "#F5F5F5",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dateButton: { width: 150, height: 50, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 16 },
  buttonDay: {
    flex: 1,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderColor: '#ccc',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonSelectDay: {
    flex: 1,
    height: 60,
    backgroundColor: "#F5F5F5",
    borderColor: '#ccc',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  priceText: { fontSize: 18, color: 'green', marginVertical: 10 },
  errorText: { fontSize: 18, color: 'red', marginBottom: 10 },
  button: { backgroundColor: '#FF6B6B', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 40 },
  input: {
    height: 60,
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderColor: '#ccc',
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default BookingScreen;
