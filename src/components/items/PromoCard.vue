<template>
  <div v-if="types[type]" class="relative promo-card p-3 flex flex-col items-start justify-between bg-dark-200">
    <div class="h5 mb-2">{{ types[type].title }}</div>
    <div class="body text-dark-500 mb-2">{{ types[type].description }}</div>
    <Button
      bg-color="blue-light"
      class="self-end"
      :text="types[type].button"
      @click="handleMailTo"
    />
    <Button bg-color="dark-100" class="absolute btn-pos" icon="close" @click="hideCard" />
  </div>
</template>

<script>
import Button from '@/components/buttons/Button.vue';
import { mapState } from 'vuex';

export default {
  name: 'PromoCard',
  components: { Button },
  props: {
    type: String
  },
  data() {
    return {
      types: {
        motive: null,
        alpha: null
      }
    };
  },
  computed: {
    ...mapState(['copy']),
  },
  watch: {
    copy: function (newVal) {
      this.parseData();
    },
  },
  mounted() {
    this.parseData();
  },
  methods: {
    parseData() {
      this.types.motive = this.parseMotiveCardData();
      this.types.alpha = this.parseAlphaCardData();
    },
    parseMotiveCardData() {
      const { copy } = this.$store.state;
      let copyKeys = Object.keys(copy);
      copyKeys = copyKeys.filter(key => key.includes('index_card') && key.includes('0'));
      const picked = this.$_.pick(copy, copyKeys);
      let obj = {}
      Object.keys(picked).forEach(key => {
        const trimmed = key.split('_')[2];
        obj[trimmed] = picked[key];
      });
      return obj;
    },
    parseAlphaCardData() {
      const { copy } = this.$store.state;
      let copyKeys = Object.keys(copy);
      copyKeys = copyKeys.filter(key => key.includes('index_card') && key.includes('1'));
      console.log({ copyKeys })
      const picked = this.$_.pick(copy, copyKeys);
      let obj = {}
      Object.keys(picked).forEach(key => {
        const trimmed = key.split('_')[2];
        obj[trimmed] = picked[key];
      });
      return obj;
    },
    handleMailTo() {
      const link = document.createElement('a');
      link.href = 'mailto: we.be@motive.fm';
      document.body.appendChild(link);
      link.click();
      return;
    },
    async hideCard() {
      localStorage.setItem(this.type, 'hide');
      await this.$emit('filter-promo-cards');
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-pos {
  top: 4px;
  right: 4px;
}
</style>
