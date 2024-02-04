<template>
  <Header />
  <div class="ma-8" align="center">
    <img
      src="https://media2.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif"
      alt="error"
    />
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: "InformacionView",
  components: {
    Header,
  },
  data() {
    return {};
  },
};
</script>
