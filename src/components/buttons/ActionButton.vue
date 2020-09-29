<template>
  <div :class="['action-btn', `bg-${bgColor}`]" @click="$emit('click')">
    <component :is="`${icon}-icon`" :class="['mdi', `mdi-${iconColor}`]" />
    <div class="text-black text-center">{{ text }}</div>
  </div>
</template>

<script>
import FileDocumentOutlineIcon from 'vue-material-design-icons/FileDocumentOutline.vue';
import FormatQuoteOpenOutlineIcon from 'vue-material-design-icons/FormatQuoteOpenOutline.vue';
import FolderDownloadIcon from 'vue-material-design-icons/FolderDownload.vue';
import HelpIcon from 'vue-material-design-icons/Help.vue';
import ShareIcon from 'vue-material-design-icons/Share.vue';

export default {
  name: 'ActionButton',
  components: {
    FileDocumentOutlineIcon,
    FolderDownloadIcon,
    FormatQuoteOpenOutlineIcon,
    HelpIcon,
    ShareIcon
  },
  props: {
    bgColor: String,
    icon: String,
    iconColor: {
      type: String,
      default: 'black'
    },
    text: String
  }
};
</script>

<style lang="scss" scoped>
.action-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 82px;
  height: 95px;
  padding: 12px;
  font-size: 12px;
  line-height: 15px;
  cursor: pointer;
  @include min-width(420) {
    width: 111px;
    height: 128px;
    padding: 28px 32px 20px;
    font-size: 14px;
    line-height: 16px;
  }
}

.material-design-icon,
.material-design-icon__svg {
  width: 32px;
  height: 40px;
  @include min-width(420) {
    width: 48px;
    height: 48px;
  }
}

.mdi-black > svg {
  fill: black;
}
.mdi-white > svg {
  fill: black;
}
</style>
