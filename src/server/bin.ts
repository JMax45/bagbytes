import Server from './index';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));
new Server(args.port);