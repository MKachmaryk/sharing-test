<template>
  <div class="bars no-swipe">
    <div
      v-for="i in 200"
      :key="'rando-background-color-' + i"
      class="rando no-swipe"
      :style="{ backgroundColor: colors[i] }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'AudioTrackBackground',
  props: {
    songData: {
      type: String
    },
    songColors: {
      type: [String, Array]
    }
  },
  computed: {
    parsedData() {
      if (!this.songData) return null;
      return JSON.parse(this.songData);
    },
    parsedColors() {
      if (!this.songColors) return null;
      return this.songColors || JSON.parse(this.songColors);
    },
    vals() {
      const is = Array.from(Array(201).keys());
      return is.map(i => Number((Math.random() * (3 + 1) - 1).toFixed(3)));
    },
    colorsFromVals() {
      return this.vals.map(val => {
        let luma = '45%';
        let sat = '55%';
        if (val > 0) {
          if (val > 1) {
            luma = '35%';
            sat = '65%';
            if (val > 2) {
              sat = '20%';
              luma = '80%';
            }
          }
        } else if (val < -2) {
          luma = '20%';
          sat = '80%';
          if (val < -3) {
            sat = '90%';
            luma = '10%';
          }
        }
        if (val >= -1 && val <= 1) {
          if (val > 0) {
            if (val > 0.5) {
              val += 80;
            } else {
              val += 5;
            }
          } else if (val < 0.5) {
            val += 5;
          } else {
            val += 25;
          }
        }
        const mappedVal = Math.round(val * 360);
        const orientation = 1 * mappedVal;

        const absorient = Math.abs(orientation % 360);
        if (absorient >= 350 && absorient <= 360) {
          luma = `${(360 - absorient) * 5}%`;
        }
        if (absorient <= 10 && absorient >= 0) {
          luma = `${absorient * 5}%`;
        }
        const col = `hsl(${orientation},${sat},${luma})`;
        return col;
      });
    },
    colors() {
      return this.parsedColors || this.colorsFromVals;
    }
  },
  methods: {
    setSongColors(i) {
      // let val;
      // if (!this.songData[i]) {
      //   val = (Math.random() * (5 - 0.020) + 0.020).toFixed(3);
      // } else {
      //   val = parseFloat(this.songData[i][1]).toFixed(3); // Y
      // }
      // const data = this.song.data || this.song.contextData;
      let val = parseFloat(this.parsedData[i][1]).toFixed(3);

      let luma = '45%';
      let sat = '55%';
      if (val > 0) {
        if (val > 1) {
          luma = '35%';
          sat = '65%';
          if (val > 2) {
            sat = '20%';
            luma = '80%';
          }
        }
      } else if (val < -2) {
        luma = '20%';
        sat = '80%';
        if (val < -3) {
          sat = '90%';
          luma = '10%';
        }
      }
      if (val >= -1 && val <= 1) {
        if (val > 0) {
          if (val > 0.5) {
            val += 80;
          } else {
            val += 5;
          }
        } else if (val < 0.5) {
          val += 5;
        } else {
          val += 25;
        }
      }
      const mappedVal = Math.round(val * 360);
      const orientation = 1 * mappedVal;

      const absorient = Math.abs(orientation % 360);
      if (absorient >= 350 && absorient <= 360) {
        luma = `${(360 - absorient) * 5}%`;
      }
      if (absorient <= 10 && absorient >= 0) {
        luma = `${absorient * 5}%`;
      }
      const col = `hsl(${orientation},${sat},${luma})`;
      return col;
    }
  }
};
</script>

<style scoped lang="scss">
* {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
.bars {
  display: flex;
  flex-wrap: nowrap;
  align-content: stretch;
  position: absolute;
  z-index: 2;
  content: '';
  width: 100%;
  height: 14px;
  top: 0;
  left: 0;
  .rando {
    content: '';
    height: 100%;
    width: 1%;
    flex: 1;
  }
}
</style>

