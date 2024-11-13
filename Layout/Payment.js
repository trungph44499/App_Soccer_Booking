import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import UnderLine from "../components/UnderLine";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "./HomeScreen";
import axios from "axios";
import { validateSDT } from "./utils/stringUtils"; // Kiểm tra số điện thoại hợp lệ

const Payment = ({ navigation, route }) => {
  const { price } = route.params; // Nhận giá trị price từ params
  const [user, setUser] = useState({}); // Lưu thông tin người dùng
  const [diaChi, setDiaChi] = useState(""); // Lưu địa chỉ
  const [soDienThoai, setSoDienThoai] = useState(""); // Lưu số điện thoại
  const [err, setErr] = useState(false); // Kiểm tra lỗi khi người dùng không điền đầy đủ thông tin
  const [card, setCard] = useState(true); // Phương thức thanh toán bằng thẻ

  // Lấy thông tin người dùng từ AsyncStorage
  const retrieveData = async () => {
    try {
      const UserData = await AsyncStorage.getItem("@UserLogin");
      if (UserData != null) {
        const { status, data: { response } } = await axios.post(URL + "/users/getUser", { email: UserData });
        if (status === 200) {
          setUser(response); // Lưu thông tin người dùng vào state
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Tải thông tin người dùng khi component được mount
  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backIcon} source={require("../Image/back.png")} />
        </TouchableOpacity>
        <Text style={styles.headerText}>THANH TOÁN</Text>
        <View />
      </View>

      <ScrollView>
        {/* Thông tin khách hàng */}
        <View style={styles.section}>
          <UnderLine value={"Thông tin khách hàng"} color={"black"} />
          <TextInput
            placeholder="Nhập họ tên"
            style={styles.input}
            value={user.fullname}
            editable={false}
          />
          <TextInput
            placeholder="Nhập email"
            style={styles.input}
            value={user.email}
            editable={false}
          />
          <TextInput
            placeholder="Nhập địa chỉ"
            style={styles.input}
            value={diaChi}
            onChangeText={(txt) => setDiaChi(txt)}
          />
          {err && diaChi === "" && (
            <Text style={styles.errorText}>Vui lòng nhập địa chỉ</Text>
          )}
          <TextInput
            placeholder="Nhập số điện thoại"
            style={styles.input}
            value={soDienThoai}
            onChangeText={(txt) => setSoDienThoai(txt)}
            keyboardType="numeric"
          />
          {err && soDienThoai === "" && (
            <Text style={styles.errorText}>Vui lòng nhập số điện thoại</Text>
          )}
          {err && !validateSDT(soDienThoai) && (
            <Text style={styles.errorText}>Số điện thoại chưa đúng</Text>
          )}
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <UnderLine value={"Hình thức thanh toán"} color={"black"} />
          <Pressable onPress={() => setCard(true)} style={styles.paymentOption}>
            <UnderLine value={"Thẻ VISA/MASTERCARD"} color={"gray"} color2={card ? "green" : "gray"} />
            {card && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>

          <Pressable onPress={() => setCard(false)} style={styles.paymentOption}>
            <UnderLine value={"Thẻ ATM"} color={"gray"} color2={!card ? "green" : "gray"} />
            {!card && <Image style={styles.checkIcon} source={require("../Image/select.png")} />}
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.footer}>
      {price && (
        <Text style={styles.priceText}>
          Tổng tiền: {price.toLocaleString()} đ
        </Text>
      )}
      </View>

      {/* Tiếp tục thanh toán */}
      <TouchableOpacity
        onPress={() => {
          if (soDienThoai && diaChi && validateSDT(soDienThoai)) {
            navigation.navigate("Payment2", {
              user,
              diaChi,
              soDienThoai,
              listItem: route.params.listItem,
            });
          } else {
            setErr(true);
          }
        }}
        style={[styles.continueButton, { backgroundColor: soDienThoai && diaChi ? "#825640" : "gray" }]}>
        <Text style={styles.continueButtonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  priceText: {
    fontSize: 18,
    color: 'green',
    marginVertical: 10,
  },
  section: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  errorText: {
    color: "#d9534f",
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 10,
  },
  paymentOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#eaeaea",
    borderBottomWidth: 1,
    width: "100%", // Đảm bảo phần tử chiếm đầy chiều rộng
  },
  checkIcon: {
    width: 18,
    height: 18,
  },
  continueButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
});
