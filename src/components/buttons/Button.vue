<template>
  <button
    :class="[
      'button',
      ...padding,
      'flex',
      'items-center',
      'justify-center',
      disabled ? 'cursor-default' : 'cursor-pointer',
      `bg-${bgColor}`,
      hoverColor,
      { 'rounded-full': round },
      { 'opacity-50': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <component
      v-if="icon"
      :is="`${icon}-icon`"
      :class="[color, { 'mr-1': text }]"
      :fill-color="color"
      :size="small ? 14 : 18"
    />
    <div
      v-if="text"
      :class="[
        `text-${color}`,
        `text-${textSize}`,
        'leading-tight',
        'uppercase',
        { 'mr-1': trailingIcon }
      ]"
    >{{ text }}</div>
    <component v-if="trailingIcon" :is="`${trailingIcon}-icon`" :fill-color="color" :size="18" />
  </button>
</template>

<script>
import CartIcon from 'vue-material-design-icons/Cart.vue';
import CartPlusIcon from 'vue-material-design-icons/CartPlus.vue';
import CartRemoveIcon from 'vue-material-design-icons/CartRemove.vue';
import CheckIcon from 'vue-material-design-icons/Check.vue';
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown.vue';
import ChevronUpIcon from 'vue-material-design-icons/ChevronUp.vue';
import CloseIcon from 'vue-material-design-icons/Close.vue';
import CogIcon from 'vue-material-design-icons/Cog.vue';
import CogOutlineIcon from 'vue-material-design-icons/CogOutline.vue';
import FacebookIcon from 'vue-material-design-icons/Facebook.vue';
import FolderDownloadIcon from 'vue-material-design-icons/FolderDownload.vue';
import LogoutIcon from 'vue-material-design-icons/Logout.vue';
import MovieIcon from 'vue-material-design-icons/Movie.vue';
import MusicIcon from 'vue-material-design-icons/Music.vue';
import PackageIcon from 'vue-material-design-icons/Package.vue';
import PauseIcon from 'vue-material-design-icons/Pause.vue';
import PencilIcon from 'vue-material-design-icons/Pencil.vue';
import PlayIcon from 'vue-material-design-icons/Play.vue';
import PlusIcon from 'vue-material-design-icons/Plus.vue';
import ShareIcon from 'vue-material-design-icons/Share.vue';
import TwitterIcon from 'vue-material-design-icons/Twitter.vue';
import VideoIcon from 'vue-material-design-icons/Video.vue';

export default {
  name: 'Button',
  components: {
    CartIcon,
    CartPlusIcon,
    CartRemoveIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CloseIcon,
    CogIcon,
    CogOutlineIcon,
    FacebookIcon,
    FolderDownloadIcon,
    LogoutIcon,
    MovieIcon,
    MusicIcon,
    PackageIcon,
    PencilIcon,
    PlayIcon,
    PlusIcon,
    PauseIcon,
    ShareIcon,
    TwitterIcon,
    VideoIcon
  },
  props: {
    bgColor: String,
    color: { type: String, default: 'black' },
    disabled: { type: Boolean, default: false },
    icon: String,
    text: String,
    round: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    textSize: { type: String, default: 'button' },
    trailingIcon: String
  },
  computed: {
    hoverColor() {
      return `hover:bg-${this.bgColor.split('-')[0]}-500`;
    },
    padding() {
      if (this.small & !this.text) {
        return ['py-1', 'px-1'];
      } else if (this.small) {
        return ['py-2', 'px-2'];
      } else if (!this.text) {
        return ['py-base', 'px-base'];
      } else {
        return ['py-base', 'px-base-plus'];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.material-design-icon,
.material-design-icon svg {
  width: 18px;
  height: 18px;
}

.material-design-icon svg {
  top: 0;
}

.material-design-icon.white > .material-design-icon__svg {
  fill: white;
}

.material-design-icon.black > .material-design-icon__svg {
  fill: black;
}

.material-design-icon.green-500 > .material-design-icon__svg {
  fill: #48bb78;
}

.material-design-icon.red-500 > .material-design-icon__svg {
  fill: #f56565;
}

.material-design-icon.blue-500 > .material-design-icon__svg {
  fill: #4299e1;
}
</style>
