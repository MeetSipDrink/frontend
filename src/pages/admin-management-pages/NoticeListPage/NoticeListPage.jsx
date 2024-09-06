import {StyleSheet, TouchableOpacity, View, Text} from "react-native";

export default function NoticeListPage({navigation}) {
    return(<View style={styles.container}>
        <Text style={styles.pageText}>공지사항 리스트 페이지</Text>
    <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('NoticePost')}>
        <Text style={styles.buttonText}>공지사항  등록(관리자)</Text>
    </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('NoticeView')}>
            <Text style={styles.buttonText}>공지사항  이동</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>홈으로</Text>
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