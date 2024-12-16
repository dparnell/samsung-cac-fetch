import forge from 'node-forge';
import * as net from 'net';
import { Duplex } from 'stream';

import { Connection } from 'samsung-cac';

class NodeTLSSocket extends Duplex {

    private socket: net.Socket;
    private client: forge.tls.Connection;

    public constructor(host: string, port: number) {
	super();

	this.socket = new net.Socket();

	this.client = forge.tls.createConnection({
	    server: false,

	    verify: () => {
		return true;
	    },

	    connected: () => {
		this.emit('open');
	    },

	    tlsDataReady: (conn: forge.tls.Connection) => {
		const data = conn.tlsData.getBytes();
		this.socket.write(data, 'binary');
	    },

	    dataReady: (conn: forge.tls.Connection) => {
		const data = conn.data.getBytes();
		console.log("data = %o", data);
		this.emit('data', data);
	    },

	    closed: () => {
		this.emit('close');
	    },

	    error: (conn: forge.tls.Connection, error: forge.tls.TLSError) => {
		this.emit('error', error);
	    },
	});

	this.socket.on('data', (bytes) => {
	    this.client.process(bytes.toString('binary'));
	});

	this.socket.connect({host, port}, () => {
	    this.client.handshake();
	});

    }

    write(chunk: string | Uint8Array | Buffer): boolean {
	this.client.prepare(chunk.toString('binary'));

	return true;
    }
}

let args = process.argv.slice(2);
let host_ip: string = args.shift()!;

console.info("Connecting to " + host_ip + "...");

let c = new Connection(host_ip);

c.connect((host: string, port: number) => {
    return new NodeTLSSocket(host, port);
}).then((conn) => {
    console.info("Connected! Requesting token...");
    return conn.getToken().then((obj) => console.info(JSON.stringify(obj)));
}).catch(e => {
    console.error("FAILED!: %o", e);
});
