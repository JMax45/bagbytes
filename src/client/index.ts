import WebSocket from 'ws';
import cliProgress from 'cli-progress';
import File from '../lib/File';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
const address = `${args.host || 'ws://localhost'}:${args.port || 8080}`;
console.log(address);
const ws = new WebSocket(address);
let progress = 0;
let progressUnit = 0;
let isStarted = false;

process.title = 'bagbytes-client';

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const file = new File(args.o || './file');

function doProgress(amount: number) {
    if(!isStarted) {
        bar1.start(100, 0);
        isStarted = true;
    }
    progress += amount;
    bar1.update(progress);
}

let current_chunk = 0;
let allChunks: number[][] = [];

ws.on('message', async function incoming(data) {
    if(typeof data === 'string') {
        const incoming: [string, any] = JSON.parse(data);
        switch(incoming[0]) {
          case 'role:specify':
            ws.send(JSON.stringify(['role:specify', { role: 'client', id: args.code }]));
            break;
          case 'role:confirmed':
              console.log('Connected!');
              ws.send(JSON.stringify(['get:file:stats', { id: args.code }]));
              break;
          case 'post:file:stats':
              if(incoming[1] === null) {
                    console.log('Distributor not found');
                    process.exit(1);
              } else {
                    allChunks = file.splitInChunks(5242880, incoming[1].size);
                    ws.send(JSON.stringify(['get:chunk', { id: args.code, start: allChunks[current_chunk][0], end: allChunks[current_chunk][1] }]));
                    current_chunk++;
                    progressUnit = 100 / allChunks.length;
                    doProgress(progressUnit);
              }
              break;
          case 'chunk':
                await file.appendChunk(incoming[1].chunk);
                if(current_chunk < allChunks.length) {
                    ws.send(JSON.stringify(['get:chunk', { id: args.code, start: allChunks[current_chunk][0], end: allChunks[current_chunk][1] }]));
                    current_chunk++;
                    doProgress(progressUnit);
                } else {
                    console.log('\nFile download completed!');
                    console.log('Running file integrity check...');
                    ws.send(JSON.stringify(['get:file:hash', { id: args.code }]));
                }
                break;
            case 'post:file:hash':
                const localHash = file.getHash();
                const remoteHash = incoming[1].hash;

                if(localHash === remoteHash) {
                    console.log('File integrity confirmed');
                } else {
                    console.log('The integrity of the file cannot be confirmed');
                }
                process.exit(0);
                break;
        }
    }
});