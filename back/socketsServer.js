const Docker =  require('dockerode');
const { createWebSocketStream, WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    console.log('new connection');
    const duplex = createWebSocketStream(ws, { encoding: 'utf8' });

    const dockerInstance = new Docker();
    const myContainer = dockerInstance.getContainer('e0136fcadd52');

    // myContainer.attach({stream: true, stdout: true, stderr: true}, function(err, stream) {
        
    //     stream.setEncoding('utf8');
    //     stream.pipe(process.stdout).pipe(duplex);
        
    //   });



    /// 

    let params = {
        Cmd: ['sh'], //,'-c','ls /'
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
    }
      
    myContainer.exec(params,(err, exec) => {
        if(err) throw err

        exec.start({ hijack: true, stdin: true, stdout: true, stderr: true },function(err, stream) {

            if(err){
                ws.close();
                throw err;
            }
            stream.setEncoding('utf8');

            duplex.pipe(process.stdout);
            
            stream.pipe(duplex);
        });
    });


    ws.onmessage = ({data}) => {
        ws.send(data.toString());
    };

    ws.on('close', function () {
        console.log('stream closed');
        duplex.destroy();
    });
});
