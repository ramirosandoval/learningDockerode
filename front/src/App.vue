<template>
  <div id="app">
    <web-terminal/>
  </div>
</template>

<script>
import WebTerminal from './components/WebTerminal.vue'

export default {
  name: 'App',
  components: {WebTerminal},
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

@import '../../node_modules/xterm/css/xterm.css';

</style>
