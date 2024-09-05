import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function HomePage() {
    return (

        <View style={styles.container}>

            {/* 헤더 영역 */}
            <View style={styles.header}>
                <Text style={styles.headerText}>한마디 한 잔</Text>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>
            </View>

            {/* 이미지 영역 */}
            <View style={styles.mainImageContainer}>
                <Image source={require('/Users/gimchanjun/Desktop/MeetSipDrink/frontend/src/assets/images/image 24.png')}
                       style={styles.mainImage} />
            </View>

            {/* 기능 버튼들 */}
            <View style={styles.buttonRow1}>
                <TouchableOpacity style={[styles.featureButton,  { flex: 1 }]}>
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.buttonText}>화상채팅하러가기</Text>
                        <Text style={styles.buttonText}>오늘 나의 술친구는 누굴까?</Text>
                    </View>
                    <Text style={styles.imageText}>이미지</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.featureButton,  { flex: 1 }]}>
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.buttonText}>채팅하러 가기</Text>
                        <Text style={styles.buttonText}>체팅으로도 충분히 재밌으니까</Text>
                    </View>
                    <Text style={styles.imageText}>이미지</Text>
                </TouchableOpacity>
            </View>

            {/* 3개의 버튼을 한 줄에 배치 */}
            <View style={styles.buttonRow2}>
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]}>
                    <Text style={styles.buttonText}>오늘의 술상 자랑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 1 }]}>
                    <Text style={styles.buttonText}>안주 룰렛</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]}>
                    <Text style={styles.buttonText}>공지사항</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonRow3}>
                <Text>최근 게시글</Text>
                <Button title={'쳇봇'} />
            </View>

            {/* 하단 네비게이션 */}
            <View style={styles.bottomNavigation}>
                <TouchableOpacity style={styles.navItemContainer}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>채팅방</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>친구 만나러 가기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>홈</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>자랑 게시판</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>마이 페이지</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // 화면 전체를 차지하도록 설정
        backgroundColor: '#f8f8f8', // 배경색을 연한 회색으로 설정
    },
    scrollContainer: {
        flexGrow: 1, // 스크롤 가능한 콘텐츠가 화면을 넘칠 때 확장 가능하도록 설정
        justifyContent: 'space-between', // 콘텐츠 사이에 균등한 공간을 배치
    },
    header: {
        marginTop: 30,
        height: '11.4%', // 헤더의 높이를 80px로 설정
        flexDirection: 'row', // 헤더 내부의 요소들을 가로로 배치
        justifyContent: 'space-between', // 헤더 내부 요소들 사이에 공간을 균등하게 배치
        padding: 20, // 헤더 상하좌우에 20px의 여백을 추가
        alignItems: 'center', // 헤더 내의 요소들을 수직 중앙 정렬
        backgroundColor: '#ffffff', // 배경을 흰색으로 설정
        borderBottomWidth: 1, // 헤더 하단에 1px의 경계선 추가
        borderColor: '#e0e0e0', // 경계선 색상을 밝은 회색으로 설정
    },
    headerText: {
        fontSize: 24, // 텍스트 크기를 24px로 설정
        fontWeight: 'bold', // 텍스트를 굵게 표시
        color: '#333', // 텍스트 색상을 진한 회색으로 설정
    },
    loginButton: {
        backgroundColor: '#FF6347', // 로그인 버튼의 배경색을 밝은 주황색으로 설정
        paddingVertical: 10, // 버튼의 상하에 10px의 패딩 추가
        paddingHorizontal: 20, // 버튼의 좌우에 20px의 패딩 추가
        borderRadius: 5, // 버튼의 모서리를 둥글게 (5px) 설정
    },
    loginText: {
        color: '#fff', // 로그인 텍스트 색상을 흰색으로 설정
        fontSize: 16, // 텍스트 크기를 16px로 설정
    },
    mainImageContainer: {
        height: '35%',
        alignItems: 'center', // 이미지 컨테이너 안의 내용을 가로로 중앙 정렬
        justifyContent: 'center', // 이미지 컨테이너 안의 내용을 세로로 중앙 정렬
        marginTop: 20, // 컨테이너 상단에 20px의 여백 추가
    },
    mainImage: {
        width: 500, // 이미지의 너비를 250px로 설정
        flex: 1,
    },
    buttonRow1: {
        height: '18%',
        flexDirection: 'row',  // 버튼들을 가로로 배치
        justifyContent: 'center',  // 버튼 사이에 공간을 균등하게 배치
        marginVertical: 10,  // 상하에 10px의 여백 추가
        paddingHorizontal: 20, // 좌우에 20px의 패딩 추가
    },
    leftTextContainer: {
        flex: 1, // 왼쪽 텍스트가 공간을 차지하도록 설정
        justifyContent: 'flex-start', // 텍스트를 왼쪽 정렬
    },
    imageText: {
        justifyContent: 'center',  // 이미지 텍스트를 세로 중앙에 맞춤
        alignItems: 'flex-end', // 이미지를 오른쪽으로 정렬
        fontSize: 16,
        color: '#fff',
    },
    buttonRow2: {
        height: '9%',
        flexDirection: 'row',  // 버튼들을 가로로 배치
        justifyContent: 'center',  // 버튼 사이에 공간을 균등하게 배치
        marginVertical: 10,  // 상하에 10px의 여백 추가
        paddingHorizontal: 20, // 좌우에 20px의 패딩 추가
    },
    buttonRow3: {
        height: '9%',
        flexDirection: 'column',  // 버튼들을 가로로 배치
        alignItems: 'flex-end',  // 버튼 사이에 공간을 균등하게 배치
        marginVertical: 10,  // 상하에 10px의 여백 추가
        paddingHorizontal: 20, // 좌우에 20px의 패딩 추가
    },
    featureButton: {
        backgroundColor: '#FF6347', // 버튼의 배경색을 밝은 주황색으로 설정
        padding: 15,  // 버튼 내부에 15px의 패딩 추가
        borderRadius: 5,  // 버튼의 모서리를 둥글게 (5px) 설정
        marginHorizontal: 5,  // 버튼 간의 좌우 여백을 5px로 설정
        flexDirection: 'row', // 텍스트와 이미지를 가로 배치
    },
    subFeatureButton: {
        backgroundColor: '#FFAD60',  // 서브 버튼의 배경색을 연한 주황색으로 설정
        padding: 15,  // 버튼 내부에 15px의 패딩 추가
        borderRadius: 5,  // 버튼의 모서리를 둥글게 (5px) 설정
        marginHorizontal: 5,  // 버튼 간의 좌우 여백을 5px로 설정
    },
    buttonText: {
        color: '#fff',  // 버튼 텍스트 색상을 흰색으로 설정
        fontSize: 16,  // 텍스트 크기를 16px로 설정
        textAlign: 'left',  // 왼쪽 정렬
    },
    bottomNavigation: {
        height: '8%',
        flexDirection: 'row',  // 하단 네비게이션 바 안의 항목들을 가로로 배치
        justifyContent: 'space-around',  // 항목들 사이에 균등한 공간을 배치
        paddingVertical: 15,  // 상하에 15px의 패딩 추가
        backgroundColor: '#ffffff',  // 네비게이션 바의 배경색을 흰색으로 설정
        borderTopWidth: 1,  // 상단에 1px의 경계선 추가
        borderColor: '#e0e0e0',  // 경계선 색상을 밝은 회색으로 설정
        position: 'absolute',  // 네비게이션 바를 절대 위치로 설정
        bottom: 10,  // 화면 하단에 위치시킴
        width: '100%',  // 화면 너비에 맞춤
        padding: 10,
    },
    navItemContainer: {
        alignItems: 'center', // 가로 방향 중앙 정렬
        justifyContent: 'center', // 세로 방향 중앙 정렬
    },
    image: {
        fontSize: 24, // 이미지 대체 텍스트의 크기
        marginBottom: 5, // 이미지와 텍스트 사이 간격
    },
    navItem: {
        fontSize: 11,  // 네비게이션 항목 텍스트 크기를 16px로 설정
        color: '#333',  // 텍스트 색상을 진한 회색으로 설정​⬤
    },
});