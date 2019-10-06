<template>
  <v-app>
    <v-content>
      <ShrtenForm />
    </v-content>
  </v-app>
</template>

<script>
import ShrtenForm from "./components/ShrtenForm";

export default {
  name: "App",
  components: {
    ShrtenForm
  },
  data: () => ({
    //
  })
};
</script>
