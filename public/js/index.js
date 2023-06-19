import { login, logout } from './login';
import { updateData } from './accountSettings';
import { addingReview } from './reviewAdding';

// DOM Elements
const loginForm = document.querySelector('.login--form__box');
const logoutButton = document.querySelector('.logout--button');
const userDataForm = document.querySelector('.form--user__data');
const userPasswordForm = document.querySelector('.form--user__password');
const userFormReview = document.querySelector('#adding__review');

// Delegation

// login functionality
if (loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

// logout functionality
if (logoutButton)
    logoutButton.addEventListener('click', e => {
        e.preventDefault();
        logout();
    });

// updating user data under methodology
if (userDataForm)
    userDataForm.addEventListener('submit', e=> {
        e.preventDefault();

        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        document.getElementById('photo').files[0] ? form.append('photo', document.getElementById('photo').files[0]) : '';
        updateData(form, 'Data');
    })

// updating password data under methodology
if (userPasswordForm)
    userPasswordForm.addEventListener('submit', e=> {
        e.preventDefault();
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        updateData({passwordCurrent, password, passwordConfirm}, 'Password');
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