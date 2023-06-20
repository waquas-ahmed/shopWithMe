import axios  from 'axios';
import { showAlert } from './alerts';

export const updateData = async(data, type) => {
    try {
        // checking the which patch request is going for - password or for update myself
        const url = type === 'Password' ? '/api/v1/users/updatePassword' : '/api/v1/users/updateMe';

        await axios({
            url,
            method: 'PATCH',
            data
        });

        showAlert('success', `${type} updated successfully!`);
        window.setTimeout(()=> {
                location.reload(true);
        }, 2000)

    } catch (error) {
        console.log(error.response.data.message);
        showAlert('error', `${error.response.data.message}`);
    }
};