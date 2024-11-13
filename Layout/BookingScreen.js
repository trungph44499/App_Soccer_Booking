import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from "../Layout/HomeScreen";

const BookingScreen = ({ route, navigation }) => {
  const [stadium, setStadium] = useState(null); // State để lưu thông tin sân
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // Lưu ca đã chọn
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Lấy thông tin sân và stadiumId từ route.params
  const { stadiumId } = route.params;

  // Thông tin các ca và giá
  const timeSlots = {
    morning: { label: "Ca sáng (8:00 - 10:00)", price: 100000 },
    afternoon: { label: "Ca chiều (14:00 - 16:00)", price: 150000 },
    evening: { label: "Ca tối (18:00 - 20:00)", price: 200000 },
  };

  // Lấy thông tin người dùng từ AsyncStorage khi tải trang
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
        console.error('Lỗi khi lấy thông tin người dùng từ AsyncStorage', error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi lấy thông tin người dùng.');
      }
    };

    getUserData();
  }, []);

  // Lấy thông tin sân từ API
  useEffect(() => {
    const fetchStadium = async () => {
      try {
        console.log("ID Sân: ", stadiumId);
        
        const response = await axios.get(`${URL}/stadiums/getStadium/${stadiumId}`);

        console.log("Thông tin sân: ", response.data);

        setStadium(response.data); // Lưu thông tin sân vào state
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sân:', error);
        setErrorMessage('Có lỗi xảy ra khi lấy thông tin sân.');
      }
    };

    if (stadiumId) {
      fetchStadium();
    }
  }, [stadiumId]);

  // Kiểm tra xem sân đã có người đặt chưa
  const checkBookingStatus = async () => {
    try {
      const response = await axios.post(`${URL}/bookings/checkBooking`, {
        stadium: stadiumId,  // Truyền stadiumId từ params
        date: selectedDate.toLocaleDateString('vi-VN'),
        timeSlot: selectedTimeSlot,
      });

      if (response.status === 200) {
        setIsBooked(response.data.booked);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra booking:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleBooking = async () => {
    if (!stadiumId || !selectedTimeSlot || !selectedDate) {
      Alert.alert('Lỗi', 'Vui lòng chọn đầy đủ thông tin.');
      return;
    }
  
    if (!userEmail) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đặt sân.');
      return;
    }
  
    if (isBooked) {
      Alert.alert('Lỗi', 'Sân đã có người đặt vào ca này.');
      return;
    }
  
    // Lấy giá của ca đã chọn
    const selectedPrice = timeSlots[selectedTimeSlot]?.price;
  
    const bookingData = {
      userEmail,
      stadium: stadiumId,  // Truyền stadiumId vào bookingData
      date: selectedDate.toLocaleDateString('vi-VN'),
      timeSlot: selectedTimeSlot,
      price: selectedPrice,  // Thêm giá vào dữ liệu gửi đi
    };
  
    setLoading(true);
    setErrorMessage('');
  
    try {
      const response = await axios.post(`${URL}/bookings/book`, bookingData);
      if (response.status === 201) {
        Alert.alert('Thành công', 'Đặt sân thành công!');
        // Truyền price sang màn Payment
        navigation.navigate('Payment', { price: selectedPrice });  // Truyền price qua params
      } else {
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo booking:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  

  // Xử lý khi người dùng thay đổi sân hoặc ca
  useEffect(() => {
    if (stadiumId && selectedTimeSlot && selectedDate) {
      checkBookingStatus();
    }
  }, [stadiumId, selectedTimeSlot, selectedDate]);

  return (
    <View style={styles.container}>
      {/* Kiểm tra xem stadium đã được tải thành công chưa */}
      {stadium ? (
        <>
          <Text style={styles.title}>{stadium.name}</Text>

          <Text>Chọn ca:</Text>
          <Picker
            selectedValue={selectedTimeSlot}
            onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
            style={styles.picker}
          >
            {Object.entries(timeSlots).map(([key, { label }]) => (
              <Picker.Item label={label} value={key} key={key} />
            ))}
          </Picker>

          {selectedTimeSlot && (
            <Text style={styles.priceText}>
              Giá: {timeSlots[selectedTimeSlot].price.toLocaleString()} đ
            </Text>
          )}

          <Text>Chọn ngày:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.buttonText}>Chọn ngày</Text>
          </TouchableOpacity>

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

          <Text>Ngày đã chọn: {selectedDate.toLocaleDateString('vi-VN')}</Text>

          {isBooked && <Text style={styles.errorText}>Sân đã có người đặt vào ca này!</Text>}
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Đặt sân" onPress={handleBooking} />
          )}
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  picker: {
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  dateButton: {
    width: 150,
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  priceText: {
    fontSize: 18,
    color: 'green',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default BookingScreen;
