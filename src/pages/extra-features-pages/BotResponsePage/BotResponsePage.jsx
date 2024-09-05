import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function BotResponsePage({ navigation }) {
    return(<View style={styles.container}>
            <Text style={styles.pageText}>봇 응답 페이지</Text>
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