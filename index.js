import { startServer } from './server.js';

startServer(8080).then(() => { // resolve
  console.log('Servidor de boas na porta 8080');
}).catch((error) => { // reject
  console.error('Servidor não iniciou: ', error);
});
