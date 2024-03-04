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
        const nameRegex = /^[a-zA-Z\s].{1,70}$/;
        return nameRegex.test(name);
    }

    validateFieldname(name) {
        const nameRegex = /^[a-zA-Z\s].{1,35}$/;
        return nameRegex.test(name);
    }

    validateInvoiceName(name) {
        const nameRegex = /^[^\s].{1,70}$/;
        return nameRegex.test(name);
    }

    validateProductName(name) {
        const nameRegex = /^.{1,75}$/;
        return nameRegex.test(name);
    }

    validateItemID(id) {
        return (id > 0 & id <= 32767);
    }

    validateInvoiceID(id) {
        return (id > 0 & id <= 2147483647);
    }

    validateClientTIN(tin) {
        const tinRegex = /^(\d{9}|\d{12})$/;
        return tinRegex.test(tin);
    }

    validateInvoiceItemID(invoice_id, item_id) {
        return (invoice_id > 0 & invoice_id <= 2147483647 & item_id > 0 & item_id <= 32767);
    }

    validateAddress(address) {
        const addressRegex = /^.{1,140}$/;
        return addressRegex.test(address);
    }

    validateNewProduct(body){
        if(!this.validateProductName(body.productName)){
            return { error: 'Invalid product name' };
        }
        if(Date.parse(body.expirationDate) < Date.parse(this.getDate())){
            return { error: 'Invalid expiration date' };
        }
        if(body.quantity < 0 || body.quantity > 32767){
            return { error: 'Invalid quantity' };
        }
        if(body.retailPrice <= 0 && body.retailPrice > 100000){
            return { error: 'Invalid retail price' };
        }
        if(body.wholesalePrice <= 0 && body.wholesalePrice > 100000){
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
            const result = this.validateProductName(data);
            const field = 'Product name';
            return {result, field};
        }
        if (field === 'earliest_expiry') {
            const result = Date.parse(data) > Date.parse(this.getDate());
            const field = 'Expiration date';
            return {result, field};
        }
        if (field === 'quantity') {
            const result = (data >= 0 && data <= 32767);
            const field = 'Quantity';
            return {result, field};
        }
        if (field === 'wholesale_price') {
            const result = (data > 0 && data <= 100000);
            const field = 'Wholesale price';
            return {result, field};
        }
        if (field === 'retail_price') {
            const result = (data > 0 && data <= 100000);
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
        let soldDate = new Date(Date.parse(body.soldDate));
        soldDate.setHours(0, 0, 0, 0);

        let currentDate = new Date(Date.parse(this.getDate()));
        currentDate.setHours(0, 0, 0, 0);

        let comparisonDate = new Date(Date.parse('2019-12-01'));
        comparisonDate.setHours(0, 0, 0, 0);
        if(!this.validateInvoiceID(body.invoiceID)){
            return { error: 'Invalid invoice ID' };
        }

        if(soldDate.getTime() > currentDate.getTime() && soldDate.getTime() <= comparisonDate.getTime()){
            return { error: 'Invalid date' };
        }

        if(!this.validateInvoiceName(body.soldTo)){
            return { error: 'Invalid name' };
        }
        if(!this.validateClientTIN(body.clientTIN)){
            return { error: 'Invalid TIN' };
        }
        if(!this.validateName(body.issuedBy)){
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
            if(!this.validateProductName(body.items[i].invoice_item_name)){
                return { error: 'Invalid item name' };
            }
            if(body.items[i].invoice_item_quantity <= 0 || body.items[i].invoice_item_quantity > 32767){
                return { error: 'Invalid quantity' };
            }
            if(body.items[i].invoice_item_price <= 0 || body.items[i].invoice_item_price > 100000){
                return { error: 'Invalid price' };
            }
            totalCost += body.items[i].invoice_item_quantity * body.items[i].invoice_item_price;
        }
        if(body.amount_paid > totalCost || body.amount_paid <= 0){
            return { error: 'Invalid Amount Paid' };
        }
        return { message: 'Valid' };
    }

    validateUpdateInvoice(field, data) {
        if(field === 'invoice_id'){
            const result = this.validateInvoiceID(data);
            const field = 'invoice id';
            return {result, field};
        }
        if(field === 'old_invoice_id'){
            const result = this.validateInvoiceID(data);
            const field = 'old invoice id';
            return {result, field};
        }
        if(field === 'name'){
            const result = this.validateInvoiceName(data);
            const field = 'Name';
            return {result, field};
        }
        if(field === 'sold_date'){
            let soldDate = new Date(Date.parse(data));
            soldDate.setHours(0, 0, 0, 0);
        
            let currentDate = new Date(Date.parse(this.getDate()));
            currentDate.setHours(0, 0, 0, 0);
        
            const result = soldDate.getTime() <= currentDate.getTime() && soldDate.getTime() > Date.parse('2019-12-01');
            const field = 'Sold date';
            return {result, field};
        }
        if(field === 'business_style'){
            const result = this.validateInvoiceName(data);
            const field = 'Business Style';
            return {result, field};
        }
        if(field === 'amount_paid'){
            const result = data > 0;
            const field = 'Amount Paid';
            return {result, field};
        }
        if(field === 'tin'){
            const result = this.validateClientTIN(data);
            const field = 'TIN ID';
            return {result, field};
        }
        if(field === 'issued_by'){
            const result = this.validateName(data);
            const field = 'Issued By';
            return {result, field};
        }
        if(field === 'address'){
            const result = this.validateAddress(data);
            const field = 'Address';
            return {result, field};
        }
    }

    validateNewUser(user){
        if(!this.validateEmail(user.email)){
            return { error: 'Invalid email' };
        }
        if(!this.validatePassword(user.password)){
            return { error: 'Invalid password' };
        }
        if(!this.validateName(user.options.data.firstName)){
            return { error: 'Invalid first name' };
        }
        if(!this.validateName(user.options.data.lastName)){
            return { error: 'Invalid last name' };
        }
        return { message: 'Valid' };
    }
}

module.exports = new Validation();
