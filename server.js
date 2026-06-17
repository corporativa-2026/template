import { createServer } from 'node:http';

const defaultPort = 11111;
let server = null;

export async function startServer(port = defaultPort) {
  if (server) {
    return Promise.reject(new Error('Server já foi iniciado'));
  } else {
    return new Promise((resolve, reject) => {
      server = createServer(requestListener)
        .listen(port, () => {
          resolve(`O servidor foi iniciado na porta ${port}`);
        }).on('error', (error) => {
          reject(error);
        });
    });
  }
}

// handler da requisição HTTP
function requestListener(request, response) {
  // mínimo obrigatório para formar uma resposta HTTP válida
  response.setHeader('content-type', 'text/plain; charset=utf8'); // tipo de conteúdo
  response.writeHead(200, 'OK'); // status code e status message
  response.end(); // body da resposta
}
