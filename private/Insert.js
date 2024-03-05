const database = require('./Database.js');

class Insert {
    constructor(database) {
        this.database = database;
        if (!Insert.instance) {
            Insert.instance = this;
        }
        return Insert.instance;
    }

    async insertUser(user) {
        try{
            const SanboxDatabase = require('./SandBoxedDatabase.js');
            const {data, error } = await SanboxDatabase.client.auth.signUp({
                email: user.email,
                password: user.password,
                options: {
                    data:{
                        fname: user.options.data.fname,
                        lname: user.options.data.lname
                    }
                }
            })
            if (error) {
                return { error: error.message }
            }
            SanboxDatabase.client.auth.signOut()
            return {data : data};
        }
        catch(e){
            return { error: e }
        }
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
            if(error.code == 23505){
                return { error: 'Invoice number already exists' };
            }
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