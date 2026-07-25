import { createServer } from 'node:http';

const defaultPort = 8080;
let server = null;

const handlers = {};
const filters = [];

export function registerFilter(handler, purpose) {
  console.log(new Date(), 'Registering filter for', purpose ?? 'an unknown purpose');
  filters.push(handler);
}

export function registerHandler(params, handler) {
  const { path } = params;
  console.log(new Date(), 'Registering handler for', path, 'resource');
  handlers[path] = {
    params,
    handler,
  };
}

export async function startServer(port = defaultPort) {
  if (server) {
    return Promise.reject(new Error('Server já foi iniciado'));
  } else {
    return new Promise((resolve, reject) => { // handler da requisição HTTP
      server = createServer(function requestListener(request, response) {
        // process all filters in order
        for (const filter of filters) {
          if (filter(request, response)?.handled) { // if handled, request chain is finished
            return;
          };
        }

        const url = new URL(request.url, `http://localhost:${port}`);
        const requestPath = url.pathname;
        const requestMethod = request.method;
        const requestAccept = request.headers['accept']?.trim().split(',').filter(Boolean);

        // check if there is a handler suitable to process this path
        if (requestPath in handlers) {
          const { handler, params: { method, accept } } = handlers[requestPath];
          // check if the handler supports this method (GET, POST, ...)
          if (requestMethod === method) {
            // check whether the handler responds in this format
            if (requestAccept?.some((res) => accept.includes(res))) {
              handler(request, response);
              return;
            } else {
              // Not Acceptable
              // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/406
              response.writeHead(406);
              response.end();
              return;
            }
          } else {
            // Method Not Allowed
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/405
            response.writeHead(405);
            response.end();
            return;
          }
        } else {
          // Not Found: there is handler registered for that request path
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404
          response.writeHead(404);
          response.end(`The resource ${url.pathname} does not exist.`);
          return;
        }
        // The request flow should never reach up to this point
        // If it does, it means the request was not handled properly,
        // and a Server Error must be thrown.
        response.writeHead(500);
        response.end('The server cannot handle this request. This should not happen :(');
        return;
      }).listen(port, () => {
        resolve(`O servidor foi iniciado na porta ${port}`);
      }).on('error', (error) => {
        reject(error);
      });
    });
  }
}
