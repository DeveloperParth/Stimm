import axios from 'axios'
const client = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3ZlciI6e30sIl9pZCI6IjYyZTUxZmI5ZDhjODIxYzI5YzFkNWI3NyIsInVzZXJuYW1lIjoicGFydGh0aGVndXkiLCJlbWFpbCI6InBhcm1hcnBhcnRoOTk2QGdtYWlsLmNvbSIsIm5hbWUiOiJQYXJ0aCBQYXJtYXIiLCJhdmF0YXIiOiJhdmF0YXIuanBnIiwidmVyaWZpZWQiOnRydWUsImlhdCI6MTY1OTU5NDUyNX0.Vb9nkUAjpntOj40LSnmyk6ObbbeC4lSXrMQuuifUPlQ'
    }
})
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