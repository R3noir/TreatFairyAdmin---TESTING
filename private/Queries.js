const database = require('./Database.js');

class Queries {
    constructor() {
        if (!Queries.instance) {
            Queries.instance = this;
        }
        return Queries.instance;
    }

    async getInventory() {
        const { data, error } = await database.client.from('inventory').select();
        if (error) {
            return { error };
        }
        return { data };
    }
}

module.exports = new Queries();