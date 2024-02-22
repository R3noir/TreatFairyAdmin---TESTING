const database = require('./Database.js');

class Insert {
    constructor(database) {
        this.database = database;
        if (!Insert.instance) {
            Insert.instance = this;
        }
        return Insert.instance;
    }
    async insertInventory(item) {
        try{
        const { data, error } = await database.client
            .from('inventory')
            .insert([item]);
        if (error) {
            return { error: error.message }
        }

        return {data : data};
        }
        catch(e){
            return { error: e }
        }
    }
    async insertSalesInvoice(invoice) {
        try{
        const { data, error } = await database.client
            .from('invoice')
            .insert([invoice]);
        if (error) {
            return { error: error.message }
        }

        return {data : data};
        }
        catch(e){
            return { error: e }
        }
    }
    async insertSalesInvoiceItems(items) {
        try{
        const { data, error } = await database.client
            .from('invoice_items')
            .insert([items]);
        if (error) {
            return { error: error.message }
        }

        return {data : data};
        }
        catch(e){
            return { error: e }
        }
    }
}


module.exports = new Insert(database);