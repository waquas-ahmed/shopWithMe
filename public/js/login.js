import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (data) => {

    try {

        console.log(data)
        const response = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/signup',
            data
        });
        console.log(response)
        if (response.data.status === 'success') {
            showAlert('success', `Your account has created!!`);
            window.setTimeout(()=> {
                location.assign('/');
            }, 1000)
        }
    } catch(error) {
        showAlert('error', `${error.response.data.message}`);
        window.setTimeout(()=> {
                location.assign('/');
            }, 100000)
    }

}

export const login = async (email, password) => {

    try {
        const response = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (response.data.status === 'success') {
            showAlert('success', `Logged In successfully!`);
            window.setTimeout(()=> {
                location.assign('/');
            }, 1000)
        }
    } catch(error) {
        showAlert('error', `${error.response.data.message}`);
    }

}

export const logout = async () => {

    try {
        const response = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/users/logout',
        });
        console.log(response)
        if (response.data.status === 'success') {
            showAlert('success', `Logged Out from the site!`);
            window.setTimeout(()=> {
                if (window.location.href.includes('/myaccount')) {
                    location.assign('/');
                } else {
                    location.reload(true);
                }
            }, 1500)
        }
    } catch(error) {
        console.log(error)
    }

}
