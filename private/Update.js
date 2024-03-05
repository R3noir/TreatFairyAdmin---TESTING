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

    async updateuseremail(email, req){
        const { user, error } = await this.database.client.auth.updateUser(req.cookies.session, {email: email})
        if (error) {
            return { error: error.message }
        }
        return {data : user};
    }

    async updateuserpassword(oldpassword, newpassword, req){
        try{
            console.log(typeof(newpassword))
            const SanboxDatabase = require('./SandBoxedDatabase.js');
            const { user, error } = await SanboxDatabase.client.auth.signInWithPassword({
                email: (await this.database.client.auth.getUser()).data.user.email,
                password: oldpassword
            });
            if(error){
                return { error: 'Current Password is Wrong' }
            }
            else{
                SanboxDatabase.client.auth.signOut();
                const { user, error } = await this.database.client.auth.updateUser(req.cookies.session, {password: newpassword})
                if (error) {
                    return { error: error.message }
                }
                return {data : user};
            }
        }
        catch(e){
            return { error: e }
        }
    }

    async resetpassword(newpassword, req){
        try{
            const { user, error } = await this.database.client.auth.updateUser(req.cookies.session, {password: newpassword})
            if (error) {
                return { error: error.message }
            }
            return {data : user};
        }
        catch(e){
            return { error: e }
        }
    }
    async userfname(data, req){
        const { user, error } = await this.database.client.auth.updateUser(req.cookies.session, {
            data: { fname: data }
        })
        console.log(user, error)
        if (error) {
            return { error: error.message }
        }
        return {data : user};
    }
    async userlname(data, req){
        const { user, error } = await this.database.client.auth.updateUser(req.cookies.session, {
            data: { lname: data }
        })
        console.log(user, error)
        if (error) {
            return { error: error.message }
        }
        return {data : user};
    }
}

module.exports = new Update(database);