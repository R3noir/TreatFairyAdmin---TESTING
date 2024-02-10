class Validation {
    constructor() {
        if (Validation.instance) {
            return Validation.instance;
        }
        Validation.instance = this;
    }

    getDate() {
        return new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
    }

    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    }
    validatePassword(password) {
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,72}$/
        return passwordRegex.test(password);
    }
    validateName(name) {
        const nameRegex = /^[a-zA-Z\s].{0,70}$/;
        return nameRegex.test(name);
    }
    validateNewProduct(body){
        if(!this.validateName(body.productName)){
            return { error: 'Invalid product name' };
        }
        if(((new Date(body.expirationDate) < this.getDate()))){
            return { error: 'Invalid expiration date' };
        }
        if(body.quantity <= 0){
            return { error: 'Invalid quantity' };
        }
        if(body.retailPrice <= 0 | body.retailPrice > body.wholesalePrice){
            return { error: 'Invalid retail price' };
        }
        if(body.wholesalePrice <= 0 | body.wholesalePrice < body.retailPrice){
            return { error: 'Invalid wholesale price' };
        }
        return { message: 'Valid' };
    }
    validateUpdateInventory(field, data) {
        if(field === 'item_id'){
            return true
        }
        if (field === 'item_name') {
            return this.validateName(data);
        }
        if (field === 'earliest_expiry') {
            return ((new Date(data) > this.getDate()));
        }
        if (field === 'quantity') {
            return data > 0;
        }
        if (field === 'wholesale_price') {
            return data > 0;
        }
        if (field === 'retail_price') {
            return data > 0;
        }

    }
}

module.exports = new Validation();
