class Validation {
    constructor() {
        if (Validation.instance) {
            return Validation.instance;
        }
        Validation.instance = this;
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    }
    validatePassword(password) {
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,72}$/
        return passwordRegex.test(password);
    }
}

module.exports = new Validation();
