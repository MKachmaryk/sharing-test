export default {
  data() {
    return {
    }
  },
  mounted() {
    this.calculateDocumentVariables();
    window.addEventListener('resize', this.$_.debounce(this.calculateDocumentVariables, 200, {
      leading: false,
      trailing: true,
    }));
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateDocumentVariables);
  },
  computed: {
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    windowHeight() {
      return this.$store.state.windowHeight;
    },
  },
  methods: {
    calculateDocumentVariables() {
      if (!this.windowHeight || this.windowHeight !== window.innerHeight || this.windowWidth !== window.innerWidth ) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        this.$store.commit('setWindowWidth', { windowWidth });
        this.$store.commit('setWindowHeight', { windowHeight });
        let vh = windowHeight * 0.01;
        let vw = windowWidth * 0.01;
        const ms = (windowHeight - 224) / windowHeight;
        const ts = (windowHeight - 336) / windowHeight;
        const ds = 336 / windowHeight;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}`);
        document.documentElement.style.setProperty('--ms', `${ms}`);
        document.documentElement.style.setProperty('--ts', `${ts}`);
        document.documentElement.style.setProperty('--ds', `${ds}`);
      }
    },
  }
}