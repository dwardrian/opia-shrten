<template>
  <v-container fluid class="text-center">
    <v-layout text-center wrap>
      <v-flex xs12>
        <img :src="require('../assets/opia-logo.svg')" class="img" />
      </v-flex>

      <v-flex mb-4>
        <div class="display-1 font-weight-bold mb-3">
          Welcome to Opia-Shrten
        </div>

        <v-form>
          <v-text-field
            v-model="url"
            label="Long URL..."
            required
            :rules="urlRules"
          />

          <v-btn
            ref="shrten-button"
            :loading="loading"
            :disabled="loading || !url.length"
            color="blue-grey"
            class="ma-2 white--text"
            @click="shrten"
          >
            Shrten!
            <v-icon right dark>mdi-send-outline</v-icon>
          </v-btn>
        </v-form>

        <v-tooltip v-model="showCopiedTip" bottom>
          <template v-slot:activator="{ on }">
            <div v-on="showCopiedTip">
              <v-chip
                v-if="shrtened && !loading"
                class="mt-4 url-chip"
                @click="copyToClipboard"
              >
                {{ shrtened }}
                <v-icon right>mdi-content-copy</v-icon>
              </v-chip>
            </div>
          </template>
          <span>Copied!</span>
        </v-tooltip>

        <v-chip v-if="error" class="mt-4 error-chip">
          Oops... are you sure the URL is valid?
          <v-icon right>mdi-error-outline</v-icon>
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
    loading: false,
    error: false,
    urlRules: [v => !!v || "Url is required"],
    showCopiedTip: false
  }),
  methods: {
    shrten: async function() {
      this.resetForm();
      try {
        const response = await axios.get(
          `https://api.shrtco.de/v2/shorten?url=${this.url}`
        );
        this.loading = false;
        this.shrtened = response.data.result.short_link;
      } catch (err) {
        this.loading = false;
        this.error = true;
      }
    },
    copyToClipboard: function() {
      try {
        this.$copyText(this.shrtened);
        this.showCopiedTimeout();
      } catch (err) {
        console.error(err);
      }
    },
    resetForm: function() {
      this.showCopiedTip = false;
      this.shrtened = null;
      this.loading = true;
      this.error = false;
    },
    showCopiedTimeout: function() {
      this.showCopiedTip = true;
      setTimeout(() => {
        this.showCopiedTip = false;
      }, 1500);
    }
  }
};
</script>

<style scoped>
.img {
  background-position: center center;
  width: 100%;
  height: 200px;
}
</style>
