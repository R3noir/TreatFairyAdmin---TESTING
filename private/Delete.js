const database = require('./Database.js');

class Delete {
    constructor(database) {
        this.database = database;
    }
    async deleteInvoice(id) {
        try{
        const { data, error } = await database.client
            .from('invoice')
            .delete()
            .eq('invoice_id', id);
        if (error) {
            return { error: error.message }
        }

        return {data : data};
        }
        catch(e){
            return { error: e }
        }
    }
    async deleteInvoiceItems(invoice_id, item_id) {
        try{
        const { data, error } = await database.client
            .rpc('deleteinvoiceitem', { invoiceid: invoice_id, invoiceitemid: item_id });
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

module.exports = new Delete(database);