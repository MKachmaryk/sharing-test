<template>
  <div>
    <div
      class="progress no-swipe"
      v-bind:class="{'progress-animation-running': isPlaying, 'active-track':isCurrentTrack }"
      :style="{'width': setWidth,'background':color}"
    >
      <div class="time" v-if="isCurrentTrack">
        <div>
          <span>{{time[0]}}</span>:
          <span>{{time[1]}}</span>
        </div>
      </div>
    </div>
    <div v-if="isCurrentTrack" class="buffer" :style="{'width':percentSeekable}"></div>
  </div>
</template>

<script>
export default {
  name: 'AudioProgressBar',
  props: {
    time: Array,
    isPlaying: Boolean,
    percentElapsed: String,
    percentSeekable: String,
    color: {
      type: String,
      default: '#bbb'
    },
    isCurrentTrack: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    setWidth: function() {
      return this.isCurrentTrack ? this.percentElapsed : '100%';
    },
    setBufferWidth: function() {
      return this.percentSeekable;
    }
  }
};
</script>

<style scoped lang="scss">
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

/*    @keyframes gradientBoi {
        0%{background-position:0% 51%}
        50%{background-position:100% 50%}
        100%{background-position:0% 51%}
    }
    .progress.progress-animation-running{
      animation-play-state: running;
    }*/

.progress {
  /*    background: linear-gradient(270deg, #a4d6db, #b6aabd, #b3d2b4, #e1ddc8, #c7d0d2, #81aab7, #326d96);
        background-size: 665% 667%;
        animation: gradientBoi 12s ease-in-out infinite;
        animation-play-state: paused;
    */
  z-index: 3;
  display: block;
  height: 14px;
  width: 100%;
  position: absolute;
  right: 0;
  flex: none;
  overflow: visible;
  opacity: 1;
  pointer-events: none;
  opacity: 0.7;
  .time {
    position: relative;
    top: 26px;
    left: 0;
    margin-left: -11px;
    overflow: visible;
    font-size: 10px;
    color: black;
    width: 100px;
    div {
      text-align: center;
      overflow: visible;
      white-space: nowrap;
      width: 50px;
    }
  }
  &.active-track {
    &:after {
      content: '';
      display: block;
      top: 0;
      left: -1px;
      position: absolute;
      width: 2px;
      background-color: lightgray;
      height: 18px;
    }
    &:before {
      display: block;
      top: 18px;
      left: -4px;
      position: absolute;
      width: 8px;
      background-color: lightgray;
      height: 8px;
      border-radius: 5px;
      content: '';
    }
  }
}
.buffer {
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+100&0+0,0.9+14 */
  background: rgba(0, 0, 0, 0.8);
  transition: width 0.4s ease-in-out;
  z-index: 3;
  width: 0;
  display: block;
  height: 14px;
  right: 0;
  position: absolute;
  overflow: visible;
}
</style>
