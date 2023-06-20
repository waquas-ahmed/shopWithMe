import axios from 'axios';
import { showAlert } from './alerts';

export const addingReview = async (data) => {

    try {
        await axios({
            url: `/api/v1/reviews/product/${data.productId}`,
            method: 'POST',
            data: {
                reviewTitle : data.title,
                reviewDescription: data.description,
                reviewRating: data.rating,
                user: data.userId,
                product: data.productId
            }
        });
        window.setTimeout(()=> {
                location.reload(true);
        }, 1500)
    } catch (error) {
        showAlert('error', `${error.response.data.message}`);
    }

    console.log(response)
}