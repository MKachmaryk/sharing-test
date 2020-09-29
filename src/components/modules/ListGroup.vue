<template>
  <div :class="listClasses">
    <!-- <div class="list-item" :style="listItemStyleObject"> -->
      <slot></slot>
    <!-- </div> -->
  </div>
</template>

<script>
  export default {
    name: 'ListGroup',
    props: {
      cols: { type: Boolean, default: false },
      gutter: { type: Number, default: 10 },
      numCols: { type: Number, default: 1 },
      align: { type: String, default: 'center' },
    },
    computed: {
      listClasses() {
        return `list-group w-full overflow-x-scroll`;
      },
      listItemStyleObject() {
        const basis = this.numCols > 1
          ? `${parseInt(100/this.numCols)}%`
          : 'auto';
        const flex = `0 1 ${basis}`;
        return { flex, margin: `${this.gutter}px` }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>