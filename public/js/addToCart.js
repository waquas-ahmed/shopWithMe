import axios from "axios";
import { showAlert } from './alerts';


export const addToCart = async url => {
    // console.log(url)
    try {
        const response = await axios({
            url,
            method: 'POST'
        });
        showAlert('success', `Product Added to Cart`);
        // console.log(response)
    } catch(error) {
        if (error.response.data.message.includes('Duplicate field Value')) {
            showAlert('warn', `Product already added at Your Cart`);
        } else {
            showAlert('error', `${error.response.data.message}`);
        }
    }


}

export const removeFromCart = async url => {
    // console.log(url)
    try {
        const response = await axios({
            url,
            method: 'DELETE'
        });
        if(response.status === 204) {
            showAlert('success', `Removed from the cart`);
            window.location.reload(true);
        }
    } catch(error) {
        showAlert('error', `${error.response.data.message}`);
    }
}
