const database = require('./Database.js');

class Queries {
    constructor(database) {
        this.database = database;
        if (!Queries.instance) {
            Queries.instance = this;
        }
        return Queries.instance;
    }

    async getInventory() {
        try{
            const { data, error } = await this.database.client.rpc('getinventory')
            if (error) {
                return { error: error.message  };
            }
            return { data };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getID(){
        try{
            const { data, error } = await this.database.client
            .from('admin')
            .select('userid')
            .eq('authuid', (await database._client.auth.getUser()).data.user.id)
            if (error) {
                return { error: error.message };
            }
            return { data };
        }
        catch(e){
            return { error: e.message }
        }
    }
}


module.exports = new Queries(database);