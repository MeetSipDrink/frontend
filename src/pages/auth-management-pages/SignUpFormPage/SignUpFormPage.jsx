import React from 'react';
import {TouchableOpacity, View,Text,StyleSheet} from "react-native";

export  default  function  SignUpFormPage({navigation}) {
    return(
        <View style={styles.container}>
            <Text style={styles.pageText}>회원가입 페이지</Text>
            <TouchableOpacity style={styles.Button} onPress={()=> navigation.navigate('SignUpAgreement')}>
                <Text>다음</Text>
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