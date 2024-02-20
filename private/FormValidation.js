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

    validateProdctName(name) {
        const nameRegex = /^[a-zA-Z][a-zA-Z0-9\s()\-'"!]{0,74}$/
        return nameRegex.test(name);
    }

    validateItemID(id) {
        return (id > 0 & id <= 32767);
    }

    validateNewProduct(body){
        if(!this.validateProdctName(body.productName)){
            return { error: 'Invalid product name' };
        }
        if(Date.parse(body.expirationDate) < Date.parse(this.getDate())){
            return { error: 'Invalid expiration date' };
        }
        if(body.quantity <= 0){
            return { error: 'Invalid quantity' };
        }
        if(body.retailPrice <= 0){
            return { error: 'Invalid retail price' };
        }
        if(body.wholesalePrice <= 0){
            return { error: 'Invalid wholesale price' };
        }
        if(body.wholesalePrice > body.retailPrice){
            return { error: 'Wholesale price is greater than retail price' };
        }
        return { message: 'Valid' };
    }
    
    validateUpdateInventory(field, data) {
        if(field === 'item_id'){
            const result = this.validateItemID(data);
            const field = 'Item id';
            return {result, field};
        }
        if (field === 'item_name') {
            const result = this.validateProdctName(data);
            const field = 'Product name';
            return {result, field};
        }
        if (field === 'earliest_expiry') {
            const result = Date.parse(data) > Date.parse(this.getDate());
            const field = 'Expiration date';
            return {result, field};
        }
        if (field === 'quantity') {
            const result = data > 0;
            const field = 'Quantity';
            return {result, field};
        }
        if (field === 'wholesale_price') {
            const result = data > 0;
            const field = 'Wholesale price';
            return {result, field};
        }
        if (field === 'retail_price') {
            const result = data > 0;
            const field = 'Retail price';
            return {result, field};
        }
    }

    validatePrice(wholesale, retail){
        if(wholesale > retail){
            return true;
        }
        return false;
    }
}

module.exports = new Validation();
