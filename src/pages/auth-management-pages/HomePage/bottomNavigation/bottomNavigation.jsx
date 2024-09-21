import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from '../../../../AuthContext';

const BottomNavigation = ({ navigation }) => {
    const { isLoggedIn, checkLoginStatus } = useAuth();

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkLoginStatus();
        });

        return unsubscribe;
    }, [navigation, checkLoginStatus]);

    const handleNavigation = (routeName) => {
        if (isLoggedIn || routeName === 'Home' || routeName === 'BoardList') {
            navigation.navigate(routeName);
        } else {
            Alert.alert(
                "로그인 필요",
                "이 기능을 사용하려면 로그인이 필요합니다.",
                [
                    { text: "취소", style: "cancel" },
                    { text: "로그인", onPress: () => navigation.navigate('Login') }
                ]
            );
        }
    };

    return (
        <View style={styles.bottomNavigation}>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => handleNavigation('ChatRoomList')}>
                <Icon name="chatbubble-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>채팅방</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => handleNavigation('FriendList')}>
                <Icon name="people-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>친구 만나러 가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => handleNavigation('Home')}>
                <Icon name="home-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>홈</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => handleNavigation('BoardList')}>
                <Icon name="list-outline" size={24} color="#333" style={styles.image} />
                <Text style={styles.navItem}>자랑 게시판</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItemContainer} onPress={() => handleNavigation('MyPage')}>
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