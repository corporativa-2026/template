import { createServer } from 'node:http';

const defaultPort = 8080;
let server = null;

export async function startServer(port = defaultPort) {
  if (server) {
    return Promise.reject(new Error('Server já foi iniciado'));
  } else {
    return new Promise((resolve, reject) => { // handler da requisição HTTP
      server = createServer(function requestListener(request, response) {
        // mínimo obrigatório para formar uma resposta HTTP válida
        response.setHeader('content-type', 'text/plain; charset=utf8'); // tipo de conteúdo
        response.writeHead(200, 'Ok'); // status code e status message
        response.end('Alive and Kicking'); // body da resposta
      }).listen(port, () => {
        resolve(`O servidor foi iniciado na porta ${port}`);
      }).on('error', (error) => {
        reject(error);
      });
    });
  }
}

