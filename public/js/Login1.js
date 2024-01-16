document.getElementById('togglePassword').addEventListener('click', function (e) {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Get the i element
    const icon = this.querySelector('i');
    
    // Toggle the text content of the i element
    if (icon.textContent === 'visibility') {
        icon.textContent = 'visibility_off';
    } else {
        icon.textContent = 'visibility';
    }
});