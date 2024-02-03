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
        const { data, error } = await this.database.client.rpc('getinventory')
        if (error) {
            return { error };
        }
        return { data };
    }
}


module.exports = new Queries(database);