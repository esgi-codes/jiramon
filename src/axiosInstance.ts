import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://jiramon.nah-i-d-win.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;