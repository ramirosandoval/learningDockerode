<template>

  <main>
    <h1>Web terminal</h1>

    <div ref="mainDiv"></div>
  </main>
</template>

<script>
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';

  const ws = new WebSocket('ws://localhost:3000');
  const term = new Terminal();
  const attachAddon = new AttachAddon(ws);

  term.loadAddon(attachAddon);

  // ws.onmessage = ({ data }) => {
  //   if(data.stream){
  //     data.stream.getReader();
  //   }

    // term.onData((data) => {
    //   console.log(data)
    //   ws.send(data)
    // });
  // };

  export default {
    name: "DockerInfo",
    mounted(){
      term.open(this.$refs.mainDiv)
      Object.freeze(term);  
    }
  };
  
</script>

<style scoped>

</style>