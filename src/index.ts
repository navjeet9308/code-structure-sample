import * as dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import helmet from "helmet";
import { connect, set } from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { join } from 'path';
import { Container  } from "typedi";
import { Routes } from '@my-app/common/src/routes/routes.interface';
import errorMiddleware from './middlewares/error-middleware';
import { logger, stream } from './utils/logger';
import AppRoute from './routes/app.routes';
import { NODE_ENV, APP_PORT, ENABLED_SQS_CONSUMER } from './config';
import { dbConnection } from './databases/index';
import SqsComsumerService from './services/sqs-consumer.service';

const sqsConsumerService = Container.get(SqsComsumerService);
const sqsConsumerService2 = Container.get(SqsComsumerService);

const App_Name = 'Talent App'
const YAML = require('yamljs');
// const openApiDocumentation = YAML.load(join(__dirname, "/utils/swagger/openApiDocumentation.yaml"));

dotenv.config();
// logger.debug(SyncISGRecords)
const clientPath = '../../client/build';
const app = express();
const env = NODE_ENV || 'development';

//initializeMiddlewares
app.use(helmet());
app.use(cors());
app.use(express.json({limit:500000}));

const routes: Routes[] = [new AppRoute()];

const port = APP_PORT || 8080; // default port to listen

if (env !== 'production') {
    set('debug', true);
}

try {
    connect(dbConnection.url, dbConnection.options);
    logger.info("Database connected successfully!")
} catch (error) {
    logger.error(error);
}

app.get('/', function (req, res) {   
    res.send(`Welcome To Serviceo Talent Portal! http://localhost:${port}`);
});

routes.forEach(route => {
    app.use('/talent/api/v1/', route.router);
});

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use(errorMiddleware);

// start the Express server
app.listen(port, () => {
    logger.info(`app ${App_Name} started at http://localhost:${port}` );
});

// ----------------SQS Consumer-------------------------
sqsConsumerService.subscribeIsgSync()
