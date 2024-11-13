import React, { useState, useEffect } from 'react'; 
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { URL } from "../Layout/HomeScreen"; // URL của backend API

const StadiumScreen = ({ navigation }) => {
  const [stadiums, setStadiums] = useState([]);  // Lưu danh sách các sân
  const [loading, setLoading] = useState(true);   // Trạng thái loading
  const [error, setError] = useState('');         // Lỗi khi tải dữ liệu

  // Hàm render từng item trong danh sách sân
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('BookingScreen', { stadiumId: item._id })} // Điều hướng tới màn BookingScreen
      >
        <View style={styles.bgitem}>
          <View style={styles.stadiumItem}>
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.textContainer}>
              <Text style={styles.stadiumName}>{item.name}</Text>
              <Text>Loại: {item.type}</Text>
              <Text>Địa chỉ: {item.address}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Hàm lấy dữ liệu sân vận động từ API
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get(`${URL}/stadiums`); // Gọi API để lấy danh sách sân
        setStadiums(response.data); // Lưu dữ liệu sân vào state
      } catch (err) {
        setError('Có lỗi xảy ra khi tải danh sách sân vận động!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStadiums(); // Gọi hàm lấy sân khi màn hình được tải
  }, []);

  // Nếu đang tải dữ liệu, hiển thị loading spinner
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Thử lại" onPress={() => { setLoading(true); setError(''); }} />
      </View>
    );
  }

  // Nếu không có sân vận động nào, hiển thị thông báo
  if (stadiums.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Không có sân vận động nào để hiển thị.</Text>
      </View>
    );
  }

  // Hiển thị danh sách sân vận động
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../Image/back.png")} // Hình ảnh nút quay lại
          />
        </TouchableOpacity>
        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
          Danh sách sân
        </Text>
        <View />
      </View>

      {/* Hiển thị danh sách sân */}
      <FlatList
        data={stadiums}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}  // Hiển thị từng sân
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgitem: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  stadiumItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
    elevation: 5,
  },
  stadiumName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textContainer: {
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
});

export default StadiumScreen;
