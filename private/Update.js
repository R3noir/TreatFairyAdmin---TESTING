const database = require('./Database.js');

class Update {
    constructor(database) {
        this.database = database;
        if (!Update.instance) {
            Update.instance = this;
        }
        return Update.instance;
    }
    async updateInventory(item, id) {
        try{
        const { data, error } = await this.database._client
            .from('inventory')
            .update(item)
            .eq('item_id', id);
        if (error) {
            console.log(error)
            return { error: error.message }
        }

        return {data : data};
        }
        catch(e){
            return { error: e }
        }
    }
    async updateSalesInvoice(data1, id) {
        try{
        const { data, error } = await this.database._client
            .from('invoice')
            .update(data1)
            .eq('invoice_id', id);
        if (error) {
            console.log(error)
            return { error: error.message }
        }
        return {data : data};
        }
        catch(e){
            return { error: e }
        }
    }
    async updateSalesInvoiceItems(data1, invoice_id, item_id) {
        try{
        const { data, error } = await this.database._client
            .from('invoice_items')
            .update(data1)
            .eq('invoice_id', invoice_id)
            .eq('invoice_item_id', item_id)
        if (error) {
            console.log(error)
            return { error: error.message }
        }
        return {data : data};
        }
        catch(e){
            return { error: e }
        }
    }
}

module.exports = new Update(database);