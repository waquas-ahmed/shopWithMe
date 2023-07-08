import { signup, login, logout } from './login';
import { updateData } from './accountSettings';
import { addingReview } from './reviewAdding';
import { addToCart, removeFromCart } from './addToCart';
import { paymentOption } from './payment';

// DOM Elements
const signupForm = document.querySelector('.user--signup__form');
const loginForm = document.querySelector('.login--form__box');
const logoutButton = document.querySelector('.logout--button');
const logoutButtonSetting = document.querySelector('.logout--button__setting');
const userDataForm = document.querySelector('.form--user__data');
const userPasswordForm = document.querySelector('.form--user__password');
const userFormReview = document.querySelector('#adding__review');
const addToCartButton = document.querySelector('.addToCart__button');
const removeFromCartButton = document.querySelector('#main--container__cart');
const addToCartSubmissionForm = document.querySelector('.addToCart__submission');

// Delegation

// implementing user signup

if (signupForm)
    signupForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        // document.querySelector('.signup__button').textContent = 'Creating...';
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('password', document.getElementById('password').value);
        form.append('passwordConfirm', document.getElementById('passwordConfirm').value);
        document.getElementById('photo').files[0] ? form.append('photo', document.getElementById('photo').files[0]) : '';

        signup(form);
        // document.querySelector('.signup__button').textContent = 'Sign Up';

        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        // const password = document.getElementById('password').value;
        // const passwordConfirm = document.getElementById('confirm__password').value;
        // const photo = document.getElementById('photo').files[0];
        // signup({name, email, password, passwordConfirm, photo}, 'Data');
    })

// login functionality
if (loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

// logout functionality on header
if (logoutButton)
    logoutButton.addEventListener('click', e => {
        e.preventDefault();
        logout();
    });

// logout functionality on account settings
if (logoutButtonSetting)
    logoutButtonSetting.addEventListener('click', e => {
        e.preventDefault();
        logout();
    });

// updating user data under methodology
if (userDataForm)
    userDataForm.addEventListener('submit', e=> {
        e.preventDefault();
        const formDataButton = document.querySelector('.form--user__dataButton').textContent = 'Updating...';
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        document.getElementById('photo').files[0] ? form.append('photo', document.getElementById('photo').files[0]) : '';
        updateData(form, 'Data');
        formDataButton.textContent = 'Save Settings';
    });

// updating password data under methodology
if (userPasswordForm)
    userPasswordForm.addEventListener('submit', e=> {
        e.preventDefault();

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        let formPasswordButton;
        if (passwordCurrent && password && passwordConfirm) {
            formPasswordButton = document.querySelector('.form--user__passwordButton').textContent = 'Updating...';
            updateData({passwordCurrent, password, passwordConfirm}, 'Password');
            formPasswordButton.textContent = 'Save Password';
        }
    })

// adding review for the user

if (userFormReview) {
    userFormReview.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('review--top__title').value;
        const description = document.getElementById('review__description').value;
        const rating = document.getElementById('rating').value;
        const userId = document.getElementById('adding__review').getAttribute('userid');
        const productId = document.getElementById('adding__review').getAttribute('productid');

        addingReview({title, description, rating, userId, productId });
    });
}

if (addToCartButton) {
    addToCartButton.addEventListener('click', (e)=> {
        e.preventDefault();
        const url = addToCartButton.getAttribute('href');
        addToCart(url)
    });
}

if (removeFromCartButton) {
    removeFromCartButton.addEventListener('click', function(e){
        const currentRemoveProductFromCart = e.target.closest('.addToCart a');
        const url = currentRemoveProductFromCart ? currentRemoveProductFromCart.getAttribute('url') : '';
        url ? removeFromCart(url) : '';
    });
}

if (addToCartSubmissionForm) {
    addToCartSubmissionForm.addEventListener('submit', e => {
        e.preventDefault();

        const allIds = addToCartSubmissionForm.querySelectorAll('.addToCart') ? addToCartSubmissionForm.querySelectorAll('.addToCart') : '';
        const allQuatities = addToCartSubmissionForm.querySelectorAll('.addToCart') ? addToCartSubmissionForm.querySelectorAll('#Quantity') : '';
        const Obj = {}
        for (let index=0; index < allIds.length; index++) {
            Obj[allIds[index].getAttribute('productid')] = allQuatities[index].value;
        }
        paymentOption(JSON.stringify(Obj));
        addToCartSubmissionForm.querySelector('.payment--mode__session button').textContent = 'Make Payment';
    });
}