<template>
  <div :class="reverse === false ? 'list-item-container' : 'list-item-container-reverse'">
    <div>
      <img
        class="list-item-image" 
        v-bind:src="imageUrl" 
      />
    </div>
    <div :class="reverse === false ? 'list-item-text' : 'list-item-text-reverse'">
      <ListItemText 
        :title="title" 
        :description="description" 
      />
    </div>
  </div>
</template>

<script>
  import ListItemText from '@/components/items/DefaultListItemText.vue'

  export default {
    name: 'ListItem',
    props: {
      imageUrl: String,
      title: String,
      description: String,
      reverse: {
        type: Boolean,
        default: false,
      } 
    },
    components: {
      ListItemText,
    },
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@100&display=swap');

  .list-item-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    flex: none;
  }

  .list-item-container-reverse{
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    height: 100%;
    flex: none;
  }

  .list-item-image {
    position: static;
    width: 60px;
    height: 100%;
    flex: none;
    order: 0;
  }

  .list-item-text {
    display: flex;
    flex-direction: column;
    position: static;
    height: 100%;
    flex: none;
    order: 1;
    padding-top: 5px;
    margin-left: 10px
  }

  .list-item-text-reverse {
    display: flex;
    flex-direction: column;
    position: static;
    height: 100%;
    flex: none;
    order: 1;
    padding-top: 5px;
    margin-right: 80px
  }

</style>