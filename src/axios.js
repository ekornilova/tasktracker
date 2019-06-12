import axios from 'axios'

const instance  = axios.create({
    baseURL: 'https://tasktracker-kornilova.firebaseio.com/'
    //'https://react-kornilova-burger.firebaseio.com/'
})
export default instance