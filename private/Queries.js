const database = require('./Database.js');
const Auth = require('./Auth.js');

class Queries {
    constructor(database) {
        this.database = database;
        if (!Queries.instance) {
            Queries.instance = this;
        }
        return Queries.instance;
    }

    async getInventory(offset, limit, archived, search) {
        try{
            const { data, error } = await this.database.client.rpc('getinventory', { offsets: offset, limits: limit, archiveds: archived, search: search })
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

    async getID(){
        try{
            const { data, error } = await this.database.client
            .from('admin')
            .select('user_id')
            .eq('auth_uuid', (await Auth.getUser()).data.user.id)
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
}


module.exports = new Queries(database);