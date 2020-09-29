<template>
  <svg
    :class="size"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g style="mix-blend-mode:multiply">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.76538 17.25L2.73413 12L8.79663 12L11.8279 17.25L5.76538 17.25Z" fill="#97FFC7"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8279 17.25L8.79663 12L11.8279 6.75001L14.8591 12L11.8279 17.25Z" fill="#3FD27D"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.79663 12L11.8279 6.75L5.76538 6.75L2.73413 12L8.79663 12Z" fill="#14A846"/>
    </g>
    <g style="mix-blend-mode:multiply">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8279 17.25L8.79663 12L14.8591 12L17.8904 17.25L11.8279 17.25Z" fill="#C8EEFF"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8904 17.25L14.8591 12L17.8904 6.75001L20.9216 12L17.8904 17.25Z" fill="#488AAD"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8591 12L17.8904 6.75L11.8279 6.75L8.79663 12L14.8591 12Z" fill="#156395"/>
    </g>
    <g style="mix-blend-mode:multiply">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.79663 22.5L5.76538 17.25L11.8279 17.25L14.8591 22.5L8.79663 22.5Z" fill="#C8EEFF"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8591 22.5L11.8279 17.25L14.8591 12L17.8904 17.25L14.8591 22.5Z" fill="#488AAD"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8279 17.25L14.8591 12L8.79663 12L5.76538 17.25L11.8279 17.25Z" fill="#156395"/>
    </g>
    <g style="mix-blend-mode:multiply">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.76563 6.74986L11.8279 6.74972L8.79663 12L2.73438 12.0001L5.76563 6.74986Z" fill="#C8EEFF"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.73439 12.0001L8.79664 12L11.8276 17.2501L5.76539 17.2503L2.73439 12.0001Z" fill="#488AAD"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.79664 12L11.8276 17.2501L14.8589 11.9999L11.8279 6.74972L8.79664 12Z" fill="#156395"/>
    </g>
    <g style="mix-blend-mode:multiply">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.79663 12L5.76538 6.75L11.8279 6.75L14.8591 12L8.79663 12Z" fill="#EDD0FB"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8591 12L11.8279 6.75L14.8591 1.50001L17.8904 6.75L14.8591 12Z" fill="#AB73CA"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8279 6.75L14.8591 1.5L8.79663 1.5L5.76538 6.75L11.8279 6.75Z" fill="#873FA9"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'MotiveLogoIcon',
  props: {
    small: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    size() {
      return this.small ? 'small' : 'default';
    }
  }
};
</script>

<style lang="scss" scoped>
.small {
  width: 32px;
  height: 32px;
}

.default {
  width: 72px;
  height: 72px;
}
</style>
