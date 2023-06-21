import { signup, login, logout } from './login';
import { updateData } from './accountSettings';
import { addingReview } from './reviewAdding';

// DOM Elements
const signupForm = document.querySelector('.user--signup__form');
const loginForm = document.querySelector('.login--form__box');
const logoutButton = document.querySelector('.logout--button');
const userDataForm = document.querySelector('.form--user__data');
const userPasswordForm = document.querySelector('.form--user__password');
const userFormReview = document.querySelector('#adding__review');

// Delegation

// implementing user signup

if (signupForm)
    signupForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        document.querySelector('.signup__button').textContent = 'Creating...';
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('password', document.getElementById('password').value);
        form.append('passwordConfirm', document.getElementById('passwordConfirm').value);
        document.getElementById('photo').files[0] ? form.append('photo', document.getElementById('photo').files[0]) : '';

        signup(form);

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
        const formPasswordButton = document.querySelector('.form--user__passwordButton').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        updateData({passwordCurrent, password, passwordConfirm}, 'Password');
        formPasswordButton.textContent = 'Save Password';
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
