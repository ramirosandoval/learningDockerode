<template>

  <main>
    <h1>Web terminal</h1>

    <div ref="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';

// import { AttachAddon } from 'xterm-addon-attach';
//   const attachAddon = new AttachAddon(ws);
//   term.loadAddon(attachAddon);

  const ws = new WebSocket('ws://localhost:3000');
  const term = new Terminal();



  ws.onmessage = ({data}) => {
    console.log('21', data);
    term.write(data.toString());
  };

  term.onData((data) => {
    console.log('26', data);
    ws.send(data);
  });

  // term.onKey('ñ', ws.close())

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