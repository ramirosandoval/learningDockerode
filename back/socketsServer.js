const Docker =  require('dockerode');
const { createWebSocketStream, WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('new connection');
    const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

    const dockerInstance = new Docker();
    const myContainer = dockerInstance.getContainer('e0136fcadd52');

    function attachTo(container){    
        container.attach({stream: true, stdin:true, stdout: true, stderr: true}, function(err, stream) {
            ws.onmessage = ({data}) =>{
                ws.send(data)
            }

            stream.setEncoding('utf8');

            stream.on('data', (chunk) => {
                ws.send(chunk.toString())
            });
        });
    }

    function listDirectoriesOn(container){
        let params = {
            tty: true,
            // interactive: true,
            Cmd: ['sh'],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        }
          
        container.exec(params,(err, exec) => {
            if(err) throw err
    
            exec.start({stdin: true, stdout: true, stderr: true },
                function(err, stream){

                    ws.onmessage = ({data}) =>{
                        console.log(data);
                        ws.send(data);
                    }
                    stream.on('data', (chunk) => {
                        ws.send(chunk.toString());
                    })
                }
            );
        });
    }

    ws.on('close', function () {
        console.log('stream closed');
        duplex.destroy();
    });


    listDirectoriesOn(myContainer);
    // attachTo(myContainer);
});
