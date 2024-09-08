import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const HOST_IP = '10.0.2.2' //안드에서는 이거로 해야됨
// baseURL: `http://${HOST_IP}:8080`, // 8번줄 수정 해줘야함

//  baseURL: "http://localhost:8080", // 웹 기본값
// baseURL: "http://본인 인터넷 아이피:8080", // 실제 기기

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers:{
        Accept:'application/json',
        Authorization:`Bearer ${API_KEY}`
    }
});

// Axios 공식 문서 코드
// 요청 인터셉터 추가하기
axios.interceptors.request.use(function (config) {
    // 요청이 전달되기 전에 작업 수행
    return config;
}, function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
});

// 응답 인터셉터 추가하기
axios.interceptors.response.use(function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행
    return response;
}, function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    return Promise.reject(error);
});

export default api;