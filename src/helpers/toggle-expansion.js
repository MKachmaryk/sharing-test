export default {
  data() {
    return {
      isExpanded: false,
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.height = '0';
      el.style.opacity = 0;
    },
    enter(el, extraPadding = 0) {
      el.style.height = `${el.scrollHeight}px`;
      el.style.opacity = 1;
    },
    beforeLeave(el) {
      el.style.height = `${el.scrollHeight}px`;
      el.style.opacity = 1;
    },
    leave(el) {
      el.style.height = '0';
      el.style.opacity = 0;
    },
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
      this.$emit('toggle-list-expansion', { isExpanded: this.isExpanded });
    },
  }
}