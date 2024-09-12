'use strict';
var _ = require('lodash');
var axios = require('axios');
const url = require('url');
const envVar = require("../config");

import { Service } from "typedi";
@Service()
class SalesforceApiService {
    static fetchSFCompositeAPIService(apiName: string, body: any) {
        return new Promise(async function (resolve, reject) {
            const token = await fetchToken();
            if (token) {
                const dynamicApiURL = envVar.SFDC_REST_API_URL
                const compositeV = envVar.SFDC_REST_API_COMPOSITE_V || 'v56.0';
                const apiUrl = `${dynamicApiURL}/services/data/${compositeV}/composite`;
                body = setCompositeApiRequestData(apiName, compositeV, body);
                const result = await fetchAPI(token, apiUrl, body);
                resolve(result);
            } else {
                reject('salesforce composite service rest api access_token not generated');
            }
        })
    }
   
    static async fetchSFService(apiName:any, body:any) {
        return new Promise(async function (resolve, reject) {
            const token = await fetchToken();
            if (token) {
                const dynamicApiURL = envVar.SFDC_REST_API_URL;
                const apiUrl = `${dynamicApiURL}/services/apexrest/${apiName}`;
                const result = await fetchAPI(token, apiUrl, body);
                resolve(result);
            } else {
                reject('salesforce service rest api access_token not generated');
            }
        })
    }
    static asyncfetchSFCompositeService(apiName:any, body:any) {
        return new Promise(async function (resolve, reject) {
            const token = await fetchToken();
            if (token) {
                const dynamicApiURL = envVar.SFDC_REST_API_URL
                const compositeV = envVar.SFDC_REST_API_COMPOSITE_V || 'v51.0';
                const apiUrl = `${dynamicApiURL}/services/data/${compositeV}/composite/tree/${apiName}`;
                const result = await fetchAPI(token, apiUrl, body);
                resolve(result);
            } else {
                reject('salesforce composite service rest api access_token not generated');
            }
        })
    }
    static fetchSFCompositeServiceTimeclock(apiName:any, body:any) {
        return new Promise(async function (resolve, reject) {
            const token = await fetchToken();
            if (token) {
                const dynamicApiURL = envVar.SFDC_REST_API_URL
                //const compositeV =  'v56.0';
                const apiUrl = `${dynamicApiURL}/services/data/v56.0/composite`;
                const result = await fetchAPI(token, apiUrl, body);
                resolve(result);
            } else {
                reject('salesforce composite service rest api access_token not generated');
            }
        })
    }
}
export default SalesforceApiService;
function fetchToken() {
    return new Promise(function (resolve, reject) {
        // Default Assign Value Is Sandbox Authentication Details.
        const apiUrl = envVar.SFDC_REST_API_AUTH_URL;
        const httpOptions = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        const body = new url.URLSearchParams({
            client_id: envVar.SFDC_REST_API_CLIENT_ID,
            client_secret: envVar.SFDC_REST_API_CLIENT_SECRET,
            username: envVar.SFDC_REST_API_USERNAME,
            password: envVar.SFDC_REST_API_PASSWORD,
            grant_type: envVar.SFDC_REST_API_GRANT_TYPE || 'password'
        });

        axios.post(apiUrl, body.toString(), httpOptions).then((res:any) => {
            if (res && res.data && res.data.access_token) {
                resolve(res.data);
            } else {
                resolve(null);
            }
        }).catch((error:any) => {
            reject(error);
        });

    });
}
function fetchAPI(token:any, apiUrl:any, body:any):Promise<any>  {
    console.log('body.compositeRequest[0]', body.compositeRequest[0]);
    console.log('fetchApiBody',body.compositeRequest[0].body)
    return new Promise(function (resolve, reject) {
        const httpOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.token_type + ' ' + token.access_token
            }
        };
        axios.post(apiUrl, body, httpOptions).then((res:any) => {
            if (res && res.data && res.data.length && res.data[0].status == 'Success') {
                resolve(res.data[0])
            } else if (res && res.data && Object.keys(res.data).length && !res.data.hasErrors) {
                resolve(res.data)
            } else {
                resolve(null);
            }
        }).catch((error:any) => {
            reject(error);
        });
    });
}
function setCompositeApiRequestData(apiName:any, compositeV:any, body:any) {
    console.log('------Body SF-----',body)
    const apiUrl = `/services/data/${compositeV}/sobjects/`;
    return {
        "compositeRequest": [
            {
                "method": "POST",
                "referenceId": `ref_${apiName}_${new Date().getTime()}`,
                "url": `${apiUrl}${apiName}`,
                body
            }
        ]
    }
}
