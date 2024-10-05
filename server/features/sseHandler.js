let clients = [];

// Registers a client for SSE updates
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

// Notifies all connected clients about data updates
function notifyClients() {
  clients.forEach(client => client.write(`data: updated\n\n`));
}

module.exports = { registerClient, notifyClients };
