import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://3.249.41.39:3000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;