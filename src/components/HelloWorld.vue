<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>

        <v-form v-model="valid">
          <v-text-field
            v-model="url"
            :rules="urlRules"
            label="Url to shorten..."
            required
          ></v-text-field>

          <v-btn
            :loading="loading"
            :disabled="loading"
            color="blue-grey"
            class="ma-2 white--text"
            @click="shrten"
          >
            Shrten!
            <v-icon right dark>mdi-send-outline</v-icon>
          </v-btn>
        </v-form>

        <v-chip v-if="shrtened" class="mr-2" @click="copyToClipboard">
          {{ shrtened }}
          <v-icon right>mdi-content-copy</v-icon>
        </v-chip>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    url: "",
    shrtened: null,
    valid: false,
    loading: false,
    error: false,
    urlRules: [v => !!v || "Url is required"]
  }),
  methods: {
    shrten: async function() {
      console.log("URL", this.url);
      try {
        const response = await axios.get(
          `https://api.shrtco.de/v2/shorten?url=${this.url}`
        );
        this.shrtened = response.data.result.short_link;
      } catch (err) {
        this.error = true;
        console.error("ERROR", err);
      }
    },
    copyToClipboard: async function() {
      try {
        await this.$copyText(this.shrtened);
      } catch (err) {
        console.error("ERROR", err);
      }
    }
  }
};
</script>
