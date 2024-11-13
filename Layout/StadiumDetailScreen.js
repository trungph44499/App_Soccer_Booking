// StadiumDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { URL } from '../Layout/HomeScreen';

const StadiumDetailScreen = ({ route, navigation }) => {
    const { stadiumId } = route.params;
    const [stadium, setStadium] = useState(null);

    useEffect(() => {
        const fetchStadiumDetails = async () => {
            try {
                const response = await axios.get(`${URL}/stadiums/getStadium/${stadiumId}`);
                setStadium(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStadiumDetails();
    }, [stadiumId]);

    if (!stadium) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* <View style={styles.container}> */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../Image/back.png")}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>{stadium.name}</Text>
            </View>
            <Image style={styles.image} source={{ uri: stadium.img }} />
            <View style={{ padding: 20 }}>
                <Text style={styles.textStly}>Địa chỉ sân: </Text>
                <Text style={styles.address}>{stadium.address}</Text>
                <Text style={styles.textStly}>Loại sân: </Text>
                <Text style={styles.type}>{stadium.type}</Text>
            </View>
            {/* </View> */}
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
        marginBottom: 10
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    address: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    textStly: {
        fontSize: 17,
        fontWeight: "bold",
        color: 'black',
        marginBottom: 10,
    },
    type: {
        fontSize: 16,
        color: '#888',
    },
});

export default StadiumDetailScreen;
