import axios from 'axios'
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';


const client = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
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
            showNotification({
                title: error.response.data.message,
                icon: <IconX />,
            });
            return Promise.reject(error.response.data);
        }
        showNotification({
            title: JSON.stringify(error),
            icon: <IconX />,
        });
        return Promise.reject(error);
    }
);

export default client