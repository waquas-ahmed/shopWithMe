import axios from "axios";
import { showAlert } from './alerts';

export const paymentOption =  async (obj) => {
    document.querySelector('.payment--mode__session button').innerHTML = 'Processing...';
    const response = await axios({
        url: `api/v1/bookings/checkout-session/fromCart/${obj}`,
        method: 'GET'
    });

    console.log(response.data.status === 'error')
    if (response.data.status === 'error') {
        showAlert('warn', `Please shop and add products to the cart!`);
    }
    if (response.data.session.url) {
        showAlert('success', `NEXT - Please pass all necessary credit card information!`);
        window.setTimeout(()=> {
            location.assign(response.data.session.url);
        }, 2000);
    }


}
