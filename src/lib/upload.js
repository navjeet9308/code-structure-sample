const fs = require('fs');
const AWS = require('aws-sdk');
const envVar = require("../config")
const s3 = new AWS.S3({
    accessKeyId: envVar.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVar.AWS_SECRET_ACCESS_KEY
});

function Upload() { }
const uploadFile = (fileData, person) => {
    return new Promise((resolve, reject) => {
        var candidateId = person?._id ? person._id.toString() : "";
        var randomNo = Math.floor(1000 + Math.random() * 9000);
        var buffer = new Buffer.from(fileData.buffer, 'base64');
        var fileKeyName = fileData.originalname.replace(/\s+/g, '-').toLowerCase();
        fileKeyName = `${randomNo}-${fileKeyName}` 
        var filePath = fileKeyName;
        console.log(`Start S3 Bucket File uploaded...`, envVar.AWS_CANDIDATE_S3_BUCKET);
        console.log("Fie name", fileKeyName)
        const params = {
            Bucket: envVar.AWS_CANDIDATE_S3_BUCKET, // bucket name
            Key: filePath, // file will be saved as person_id/contacts.csv
            Body: buffer,
            Metadata: {
                'filename': fileData.originalname,
                'personId': candidateId,
            },
        };
        s3.upload(params, function (s3Err, data) {
            if (s3Err) {
                console.log(`S3 Bucket File uploaded Error at ${s3Err}`);
                resolve({ message: `S3 Bucket File uploaded Error at ${s3Err}`, status : false});
            } else {
                console.log(`S3 Bucket File uploaded successfully at ${data.Location}`);
                const dataToBeReturn = {
                    // location :data.Location,
                    fileName:filePath,
                    message: `S3 Bucket File uploaded successfully at ${data.filePath}`,
                    status : true
                }
                resolve(dataToBeReturn);
            }
        });
    });
}
const uploadFileAIParser = (fileData, person) => {
    return new Promise((resolve, reject) => {
        var candidateId = person._id.toString();
        var randomNo = Math.floor(1000 + Math.random() * 9000);
        var buffer = new Buffer.from(fileData.buffer, 'base64');;
        var fileKeyName = fileData.originalname.replace(/\s+/g, '-').toLowerCase();      
        var filePath =  `${randomNo}-${fileKeyName}`;
        console.log(`Start S3 Bucket Resume File uploaded...`,  envVar.AWS_RESUME_S3_BUCKET);
        const params = {
            Bucket: envVar.AWS_RESUME_S3_BUCKET, // bucket name
            Key: filePath, // file will be saved as staging-resume-parser/contacts.csv
            Body: buffer,
            Metadata: {
                'filename': fileData.originalname,
                'personId': candidateId,
                'email': person.email ? person.email: ''
            },
        };
        s3.upload(params, function (s3Err, data) {
            if (s3Err) {
                console.log(`S3 Bucket Resume File uploaded Error at ${s3Err}`);
                resolve({ message: `S3 Bucket Resume File uploaded Error at ${s3Err}`});
            } else {
                console.log(`S3 Bucket Resume File uploaded successfully at ${data.Location}`);
                const dataToBeReturn = {
                  //  location :data.Location,
                    fileName:filePath,
                    message: `S3 Bucket Resume File uploaded successfully at ${data.Location}`
                }
                resolve(dataToBeReturn);
            }
        });
    });
}
module.exports = Upload;
Upload.uploadFile = uploadFile;
Upload.uploadFileAIParser = uploadFileAIParser;