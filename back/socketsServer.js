const pty =  require('node-pty');
const Docker =  require('dockerode');
const { createWebSocketStream, WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('new connection');
    const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

    const dockerInstance = new Docker();
    const myContainer = dockerInstance.getContainer('e0136fcadd52');

    // const stream = myContainer.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {myContainer.modem.demuxStream(stream, process.stdout, process.stderr);});
    // const onData = myContainer.onData((data) => duplex.write(data));

    // duplex.pipe(process.stdout); 

    let params = {
        Cmd: ['sh','-c','ls /'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
    }
      
      myContainer.exec(params,(err, exec) => {
          err && console.error(err);

          exec.start({ hijack: true, stdin: true, stdout: true, stderr: true }, 
            function(err, stream) {

                if(err) return console.log(err)

                stream.setEncoding('utf8');
                myContainer.attach({stream: true, stdin: true, stdout: true, stderr: true}, function (err, stream) {
                    if(err) return console.log(err)

                    myContainer.modem.demuxStream(stream, process.stdin, process.stdout, process.stderr);
                    stream.setEncoding('utf8');
                    stream.pipe(duplex).pipe(process.stdout);

                });
                // ws.send(process.stdout.write());
                // stream.pipe(process.stdin);
            });
        },
      );



    ws.on('close', function () {
        console.log('stream closed');
        duplex.destroy();
    });
});
