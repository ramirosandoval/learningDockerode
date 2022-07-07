const Docker =  require('dockerode');
const { createWebSocketStream, WebSocketServer } = require('ws');

const webSocketServer = new WebSocketServer({ port: 3000 });

webSocketServer.on('connection', (ws) => {
    console.log('new connection');
    const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

    const dockerInstance = new Docker();
    const myContainer = dockerInstance.getContainer('e0136fcadd52');

    function runTerminalOn(container, terminal = 'sh'){
        const params = {
            tty: true,
            Cmd: [`${terminal}`],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        }
          
        container.exec(params,(error, exec) => {
            if(error){
                ws.send(error.toString());
                console.error(error);
            }
    
            exec.start({stdin: true, stdout: true, stderr: true },
                function(error, stream){

                    ws.onmessage = ({data}) =>{
                        console.log(data);
                        stream.write(data);
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

    runTerminalOn(myContainer);
});
