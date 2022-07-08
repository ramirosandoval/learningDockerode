<template>

  <main>
    <h1>Web terminal</h1>

    <div ref="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';

import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

  const ws = new WebSocket('ws://localhost:3000');
  const term = new Terminal();


  const attachAddon = new AttachAddon(ws);
  const fitAddon = new FitAddon();

  term.loadAddon(attachAddon);
  term.loadAddon(fitAddon);
  fitAddon.fit();




  ws.onmessage = (socket) => {
    console.log('data from line 21 (onMessage)', socket);
  };

  term.onData((data) => {
    console.log('data from line 26 (onData)', data.toString());
  });

  export default {
    name: "DockerInfo",
    mounted(){
      term.open(this.$refs.mainDiv)
      // Object.freeze(term);  
    }
  };
  
</script>

<style scoped>

</style>