<template>
  <div>
    <iframe id="frameId1" src="appFrame.html" style="width:100%;"/>
    <button @click="handleClick">Add from parent</button>
    <button @click="handleClick2">Add from parent</button>
    {{$store.state.count}}
    /////
    {{$store.state.userInfo.uid}}
    <input v-model.number="increasement" style="margin-left:24px;"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      increasement: 1,
      iframe2Visible: false
    }
  },
  methods: {
    handleClick () {
      this.$store.commit('add_count', this.increasement)
    },
    handleClick2() {
      this.$store.dispatch('set_user_main')
    }
  },
  mounted () {
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
  width: 100%;
}
</style>
