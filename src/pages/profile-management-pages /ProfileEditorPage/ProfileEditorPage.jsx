import {StyleSheet, View, Text, TouchableOpacity} from "react-native";

export default function ProfileEditorPage({ navigation }) {
    return(
        <View style={styles.container}>
            <Text style={styles.pageText}>개인정보 수정 페이지</Text>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('MyPage')}>
                <Text style={styles.buttonText}>마이 페이지</Text>
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