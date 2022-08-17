const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    const phoneNumber = phoneInput.getNumber();
    document.getElementById("phone").value = phoneNumber;
});