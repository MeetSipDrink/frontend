import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const BottomNavigation = ({ navigation }) => {
    return (
        <View style={styles.bottomNavigation}>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('ChatRoomList')}>
                <Icon name="chatbubble-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>채팅방</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('FriendList')}>
                <Icon name="people-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>친구 만나러 가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('Home')}>
                <Icon name="home-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>홈</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('BoardList')}>
                <Icon name="list-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>자랑 게시판</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('MyPage')}>
                <Icon name="person-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>마이 페이지</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNavigation: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
    },
    navItemContainer: {
        alignItems: 'center',
    },
    image: {
        marginBottom: 5,
    },
    navItem: {
        fontSize: 11,
        color: '#333',
    },
});

export default BottomNavigation;