import { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } from '../config';

var username = encodeURIComponent(`${DB_USER}`);
var password = encodeURIComponent(`${DB_PASSWORD}`);
export const dbConnection = {
  url: `mongodb+srv://${username}:${password}@${DB_HOST}/${DB_DATABASE}?retryWrites=true&w=majority`,
  options: {
    autoIndex: true, // Don't build indexes
    maxPoolSize: 100, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  },
};