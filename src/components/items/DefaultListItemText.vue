<template>
  <div class="list-item-text">
    <div class="text-title"> 
      {{title}} 
    </div>
    <div class="text-description"> 
      {{description}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListItemText',
  props: {
    title: String,
    description: String,
  }
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@100&display=swap');

.list-item-text { 
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  position: static;
  flex: none;
  }

.text-title {
  position: static;
  font-family: 'Space Mono';
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
  flex: none;
  order: 0;
}

.text-description {
  position: static;
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #000000;
  flex: none;
  order: 1;
  padding-top: 5px;
}
</style>