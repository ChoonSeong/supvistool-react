// sseHandler.js
let clients = [];

function registerClient(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
}

function notifyClients() {
  //console.log('Notifying clients'); // Debugging log
  clients.forEach(client => client.write(`data: updated\n\n`));
}

module.exports = { registerClient, notifyClients };
