const form = document.querySelector('.form');
const emailField = form.querySelector('.email-field');
const emailInput = emailField.querySelector('.email');
const passField = form.querySelector('.create-password');
const passInput = passField.querySelector('.password');
const confirmPassField = form.querySelector('.confirm-password');
const confirmPassInput = confirmPassField.querySelector('.cPassword');

//Email Validation
function checkEmail() {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!emailInput.value.match(emailPattern)) {
        return emailField.classList.add('invalid');
    }

    emailField.classList.remove('invalid');
}

//Hide and show password
const eyeIcons = document.querySelectorAll('.show-hide');

eyeIcons.forEach((eyeIcon) => {
    eyeIcon.addEventListener('click', () => {
        const pInput = eyeIcon.parentElement.querySelector('input');

        if (pInput.type === 'password') {
            eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            return (pInput.type = 'text');
        }

        eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
        pInput.type = 'password';
    });
});

//Password Validation
function createPass() {
    const passPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passInput.value.match(passPattern)) {
        return passField.classList.add('invalid');
    }

    passField.classList.remove('invalid');
}

//Confirm password validation
function confirmPass() {
    if (
        passInput.value !== confirmPassInput.value ||
        confirmPassInput.value === ''
    ) {
        return confirmPassField.classList.add('invalid');
    }

    confirmPassField.classList.remove('invalid');
}

//Calling Function on Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Preventing form submitting
    checkEmail();
    createPass();
    confirmPass();

    emailInput.addEventListener('keyup', checkEmail);
    passInput.addEventListener('keyup', createPass);
    confirmPassInput.addEventListener('keyup', confirmPass);

    // if (
    //     !emailField.classList.contains('invalid') &&
    //     !passField.classList.contains('invalid') &&
    //     !confirmPassField.classList.contains('invalid')
    // ) {
    //     location.href = form.getAttribute('action');
    // }
});
