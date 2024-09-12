const { Client } = require('@elastic/elasticsearch');
import { ELASTIC_NODE, ELASTIC_USERNAME, ELASTIC_PASSSWORD } from '../config';
const client = new Client({
    node: ELASTIC_NODE,
    auth: {
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSSWORD 
    }
});

module.exports = { client };
