const database = require('./Database.js');

class Queries {
    constructor(database) {
        this.database = database;
        if (!Queries.instance) {
            Queries.instance = this;
        }
        return Queries.instance;
    }

    async getInventory(offset, limit, archived, search, Sort) {
        try{
            const { data, error } = await this.database.client.rpc('getinventory', { offsets: offset, limits: limit, archiveds: archived, search: search, order_by: Sort})
            if (error) {
                return { error: error.message  };
            }
            return { data };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getTotalInventoryRecords(archived, search) {
        try{
            const { data, error } = await this.database.client.rpc('getinventorycount', { archiveds: archived, search: search })
            if (error) {
                return { error: error.message  };
            }
            return { data: parseInt(data) };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getInvoice(offset, limit, search, Sort) {
        try{
            const { data, error } = await this.database.client.rpc('getinvoices', { offsets: offset, limits: limit, search: search, order_by: Sort })
            if (error) {
                return { error: error.message  };
            }
            return { data };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getTotalInvoiceRecords(search) {
        try{
            const { data, error } = await this.database.client.rpc('getinvoicescount', { search: search })
            if (error) {
                return { error: error.message  };
            }
            return { data: parseInt(data) };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getID(req){
        try{
            const { data, error } = await this.database.client
            .from('admin')
            .select('user_id')
            .eq('auth_uuid', (await database._client.auth.getUser(req.cookies.session)).data.user.id)
            if (error) {
                return { error: error.message };
            }
            const user_id = data[0].user_id;
            return user_id;
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getInvoiceItemsTotalBeforeDeletion(invoice_id, array_of_item_ids){
        try{
            const { data, error } = await this.database.client.rpc('getinvoicetotal', { invoiceid: invoice_id, invoiceitemids: array_of_item_ids })
            if (error) {
                return { error: error.message };
            }
            return { data: data };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getInvoiceItemTotal(invoice_id, item_id){
        try{
            const { data, error } = await this.database.client.rpc('getproducttotal', { invoiceid: invoice_id, invoiceitemid: item_id })
            if (error) {
                return { error: error.message };
            }
            return { data: data[0].total };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async InvoiceIDExists(invoice_id){
        try{
            const { data, error } = await this.database.client
            .from('invoice')
            .select('*', { count: 'exact' })
            .eq('invoice_id', invoice_id)
            if (error) {
                return { error: error.message };
            }
            return { data: data.length > 0 };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getlistofAdmins(offset, limit, search){
        try{
            const { data, error } = await this.database.client.rpc('get_admin_users', { offset_val: offset, limit_val: limit, search_val: search})
            if (error) {
                return { error: error.message  };
            }
            return { data };
        }
        catch(e){
            return { error: e.message }
        }
    }
    async getTotalAdminRecords(search) {
        try{
            const { data, error } = await this.database.client.rpc('get_admin_users_count', { search_val: search })
            if (error) {
                return { error: error.message  };
            }
            return { data: parseInt(data) };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getuserinfo(req){
        try{
            const { data, error } = await this.database.client.rpc('getadmindetails', {p_auth_uuid: (await database._client.auth.getUser(req.cookies.session)).data.user.id})
            if (error) {
                return { error: error.message  };
            }
            return { data: data };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async checkIfAdminExists(email){
        try{
            const { data, error } = await this.database.client.rpc('email_exists', {email_to_check: email})
            if (error) {
                return { error: error.message  };
            }
            return { data: data };
        }
        catch(e){
            return { error: e.message }
        }
    }
}

module.exports = new Queries(database);