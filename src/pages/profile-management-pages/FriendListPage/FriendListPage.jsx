import {StyleSheet, TouchableOpacity, View, Text} from "react-native";

export default function FriendListPage({ navigation }) {
    return(
        <View style={styles.container}>
            <Text style={styles.pageText}>친구 목록 페이진</Text>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('FriendRequest')}>
                <Text style={styles.buttonText}>친구요청</Text>
            </TouchableOpacity>

        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    pageText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    Button: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});