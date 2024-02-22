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

    validateInvoiceName(name) {
        const nameRegex = /^[^\s].{0,70}$/;
        return nameRegex.test(name);
    }

    validateProdctName(name) {
        const nameRegex = /^[a-zA-Z][a-zA-Z0-9\s()\-'"!]{0,74}$/
        return nameRegex.test(name);
    }

    validateItemID(id) {
        return (id > 0 & id <= 32767);
    }

    validateInvoiceID(id) {
        return (id > 0 & id <= 2147483647);
    }

    validateClientTIN(tin) {
        const tinRegex = /^\d{9,12}$/;
        return tinRegex.test(tin);
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

    validateInvoice(body){
        if(!this.validateInvoiceID(body.invoiceID)){
            return { error: 'Invalid invoice ID' };
        }

        if(!this.validateName(body.soldTo)){
            return { error: 'Invalid name' };
        }
        if(!this.validateClientTIN(body.clientTIN)){
            return { error: 'Invalid TIN' };
        }
        if(!this.validateInvoiceName(body.issuedBy)){
            return { error: 'Invalid name' };
        }
        if(!this.validateInvoiceName(body.businessStyle)){
            return { error: 'Invalid business style' };
        }
        if(body.items.length === 0){
            return { error: 'No items' };
        }
        if(body.clientAddress.length < 1 | body.clientAddress.length > 140){
            return { error: 'Invalid address' };
        }

        let totalCost = 0;
        for (let i = 0; i < body.items.length; i++) {
            if(!this.validateProdctName(body.items[i].item)){
                return { error: 'Invalid item name' };
            }
            if(body.items[i].quantity <= 0){
                return { error: 'Invalid quantity' };
            }
            if(body.items[i].price <= 0){
                return { error: 'Invalid price' };
            }
            totalCost += body.items[i].quantity * body.items[i].price;
        }
        
        if(body.amountPaid > totalCost || body.amountPaid <= 0){
            return { error: 'Invalid Amount Paid' };
        }
        return { message: 'Valid' };
    }
}

module.exports = new Validation();
