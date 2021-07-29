import WebSocket from 'ws';
import File from '../lib/File';
import Server from '../server';
import getIP from 'external-ip';
import minimist from 'minimist';
import localtunnel from 'localtunnel';

(async() => {
  process.title = 'bagbytes-distributor';
  const args = minimist(process.argv.slice(2));
  
  let server: Server;
  if(args.direct) {
    server = new Server(args.port || 8080);
  }
  const log = (text: string) => {
    if(process.argv[3] === '--direct' && process.argv[4] === '--tunnel') {
      server.dashboard.log(text);
    } else {
      console.log(text);
    }
  }
  if(args.direct) {
    getIP((err: any, ip: any) => {
      if (err) {
          log('Distribution not available to the internet');
          return;
      }
      log(`Connection string: ${ip}:${server.wss.options.port}`);
    });
  }

  if(args.tunnel) {
    const tunnel = await localtunnel({ port: args.port || 8080 });
    log(`Tunnel: ${tunnel.url}`);
  }

  const ws = new WebSocket(`ws://localhost:${args.port || 8080}`);
  const file = new File(process.argv[2], ws);
  let room_id: string | null = null;
    
  ws.on('message', async function incoming(data) {
    if(typeof data === 'string') {
      const incoming: [string, any] = JSON.parse(data);
      switch(incoming[0]) {
        case 'role:specify':
          ws.send(JSON.stringify(['role:specify', { role: 'distributor' }]));
          break;
        case 'role:confirmed':
          log('Your distribution id: '+incoming[1].id);
          room_id = incoming[1].id;
          break;
        case 'file:stats':
          log('Retrieving file hash');
          const hash = await file.getHashUncached();
          ws.send(JSON.stringify(['file:stats', { size: file.size, filename: file.filename, id: room_id, hash: hash }]));
          log('Distribution started');
          break;
        case 'get:chunk':
          const chunk = await file.getChunk(incoming[1].start, incoming[1].end);
          ws.send(JSON.stringify(['chunk', { 
            chunk: chunk, 
            start: incoming[1].start, 
            end: incoming[1].end,
            subject_id: incoming[1].subject_id
          }]));
          break;
        case 'get:file:hash':
          log('nice');
          ws.send(JSON.stringify(['post:file:hash', {
            hash: 'sussy',
            subject_id: incoming[1].subject_id
          }]))
          break;
      }
    }
  });
})()