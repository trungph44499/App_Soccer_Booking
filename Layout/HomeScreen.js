import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import SliderShow from "./components/SliderShow";
import ip from "./config/ipconfig.json";

export const URL = `http://${ip.ip}`;

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar hidden />
        <View style={{ width: screenWidth, height: 320 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginTop: 30, }}>
              <Text
                style={{
                  color: "#F79515",
                  fontSize: 23,

                  fontWeight: "400",
                }}
              >
                Soccer Booking
              </Text>
              <Text
                style={{
                  color: "#F79515",
                  fontSize: 23,
                  fontWeight: "400",
                  marginBottom: 10,
                }}
              >
                Đặt lịch mọi nơi !!
              </Text>
            </View>
            {/* <Image
              source={
                user.avatar
                  ? { uri: user.avatar }
                  : require("../Image/pesonal.png")
              }
              style={{ width: 40, height: 40, borderRadius: 20 }}
            /> */}
          </View>
          <SliderShow />

          {/* <TouchableOpacity
            style={styles.newSP}
            onPress={() => navigation.navigate("")}
          >
            <Text
              style={{
                fontSize: 17,
                color: "black",
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              Xem quy định ➭
            </Text>
          </TouchableOpacity> */}
        </View>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Image
            source={require("../Image/baner_03.png")}
            style={styles.image}
          />
          <Text style={{ color: '#2223ab', fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Chào mừng bạn đến với sân F5 Hoàng Mai</Text>
          <Text style={{ color: '#2223ab', fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Xem nội quy</Text>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => navigation.navigate("StadiumScreen")}
          >
            <Text
              style={{
                fontSize: 17,
                color: "#FFFFFF",
                fontWeight: "bold",

              }}
            >
              Đặt sân ngay ➭
            </Text>
          </TouchableOpacity>
          <Text style={{ color: '#2223ab', fontSize: 16, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>Các Bạn Là Một Phần Phát Triển Của Chúng Tôi</Text>
          <Text style={{ color: '#2223ab', fontSize: 16, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>Chúng tôi cung cấp những gì chúng tôi hứa. Hãy xem khách hàng đang bày tỏ gì về chúng tôi</Text>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  container: {
    height: "100%",
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  itemDog: {
    backgroundColor: "white",
    width: "45%",
    borderRadius: 12,
    padding: 12,
    margin: 10,
    gap: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 5,
    shadowOpacity: 0.35,
    elevation: 10,
  },
  itemImage: {
    width: "100%",
    height: 130,
    borderRadius: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  itemStatus: {
    fontSize: 18,
    fontStyle: "italic",
    color: "green",
    fontWeight: "bold", // Làm cho chữ đậm hơn
    backgroundColor: "#e0f7e0", // Nền màu nhẹ
    borderRadius: 5, // Bo góc
    padding: 5, // Thêm khoảng cách bên trong
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",

  },
  itemStyle: {
    fontSize: 16,
    fontWeight: "300",
  },
  Xemthem: {
    width: "100%",
    padding: 12,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: "red",
  },
  cart: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 40, // Khoảng cách từ trên cùng
    right: 30, // Khoảng cách từ bên trái
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
  },
  adminAdd: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 40,
    bottom: 90,
  },
  newSP: {
    bottom: 0,
    marginTop: 10,
  },
  Button: {
    backgroundColor: "#6465c4",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: "center",
  },
});