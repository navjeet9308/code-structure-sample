/**
 * Service Methods
 */

import { Service } from "typedi";
import IsgSyncService from '../services/isg-sync.service';
import AIParserSyncService from '../services/ai-parser-sqs-sync.service';
import { Consumer } from "sqs-consumer";
import { SQSClient } from "@aws-sdk/client-sqs";
import { Container  } from "typedi";
import {SQS_QUEUEURL, SQS_REGION, SQS_ACCESSKEY, SQS_SECRETKEY, AWS_RESUME_RESPONSE_SQS } from "./../config"
const isgService = Container.get(IsgSyncService);
const aiParserService = Container.get(AIParserSyncService);

@Service()
class SqsComsumerService {
  constructor() { 
    
  }
  
  subscribeIsgSync() {                                                                                                                             
   this.isgSyncService()   
   this.resumeParserSqsSyncService(); 
  }

  async isgSyncService() {
    console.log("------------------------ISG to Talent SQS Runing...............................")
    const sqsConsumerConfig = {  
        queueUrl: `${SQS_QUEUEURL}`,
        handleMessage: async (message:any) => {
          console.log("----------New Message ISG to talent Sqs---------")
            await isgService.SyncIsg(message)
        },
        sqs: new SQSClient({
          region: `${SQS_REGION}`,
          credentials: {
            accessKeyId: `${SQS_ACCESSKEY}`,
            secretAccessKey: `${SQS_SECRETKEY}`
          }
        })
    }
    const sqsApp = Consumer.create(sqsConsumerConfig);
    sqsApp.start();
  }

  resumeParserSqsSyncService() {
    console.log("------------------------Resume Parser Sqs Runing............................... ")
    const sqsConsumerConfig = {
        queueUrl: `${AWS_RESUME_RESPONSE_SQS}`,
        handleMessage: async (message:any) => {
            console.log("----------New Message AI Parser Sqs---------")
            await aiParserService.SyncToTalent(message)
        },
        sqs: new SQSClient({
          region: `${SQS_REGION}`,
          credentials: {
            accessKeyId: `${SQS_ACCESSKEY}`,
            secretAccessKey: `${SQS_SECRETKEY}`
          }
        })
    }
    const sqsApp = Consumer.create(sqsConsumerConfig);
    sqsApp.start();
  }

}

export default SqsComsumerService;

