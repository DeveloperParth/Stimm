import axios from 'axios'

const token = localStorage.getItem('token')


const client = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

client.interceptors.request.use(async (config) => {
    const t = await localStorage.getItem('token')
    config.headers['Authorization'] = t
    return config
}, undefined)
// const navigate = useNavigate()
client.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        let res = error.response;
        if (res.status === 401) {
            // window.location = '/login'
        }
        if (error.response.data) {
            console.log(error.response.data);
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

export default client