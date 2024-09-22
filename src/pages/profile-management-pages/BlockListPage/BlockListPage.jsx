import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Alert } from "react-native";
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const ADS_API_URL = 'http://10.0.2.2:8080';

export default function BlockListPage({ navigation }) {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlockedUsers();
    }, []);

    const getAccessToken = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                return JSON.parse(credentials.password).accessToken;
            }
            throw new Error('No credentials stored');
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    };

    const loadBlockedUsers = async () => {
        setLoading(true);
        try {
            const accessToken = await getAccessToken();
            const response = await axios.get(`${ADS_API_URL}/ban`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setBlockedUsers(response.data);
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            Alert.alert('오류', '차단 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const unblockUser = async (banId) => {
        try {
            const accessToken = await getAccessToken();
            await axios.delete(`${ADS_API_URL}/ban/${banId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            Alert.alert('성공', '차단이 해제되었습니다.');
            loadBlockedUsers();
        } catch (error) {
            console.error('Error unblocking user:', error);
            Alert.alert('오류', '차단 해제에 실패했습니다.');
        }
    };

    const renderBlockedUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <Text style={styles.userName}>{item.bannedNickname}</Text>
            <TouchableOpacity
                style={styles.unblockButton}
                onPress={() => unblockUser(item.banId)}
            >
                <Text style={styles.unblockButtonText}>차단 해제</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>차단 목록을 불러오는 중...</Text>
            ) : (
                <>
                    <Text style={styles.sectionTitle}>차단 목록</Text>
                    {blockedUsers.length === 0 ? (
                        <Text style={styles.noBlockedUsersText}>차단한 사용자가 없습니다.</Text>
                    ) : (
                        <FlatList
                            data={blockedUsers}
                            renderItem={renderBlockedUserItem}
                            keyExtractor={(item) => item.banId.toString()}
                            style={styles.list}
                        />
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    list: {
        flex: 1,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    unblockButton: {
        backgroundColor: '#FF9800',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    unblockButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    noBlockedUsersText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
});