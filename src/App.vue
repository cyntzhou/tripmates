<template>
  <div id="app">
    <header>
      <h1>Fritter</h1>
    </header>

    <main>
      <NavBar
        v-bind:isSignedIn="isSignedIn"
      />
      <section>
        <div class="scrollbox">

          <FreetList
            v-if="state === 'allFreets'"
            v-bind:user="user"
            v-bind:type="'allFreets'"
          />

          <FreetList
            v-if="state === 'freetFeed'"
            v-bind:user="user"
            v-bind:type="'freetFeed'"
          />

          <UserSettings
            v-if="state === 'account'"
            v-bind:isSignedIn="isSignedIn"
            v-bind:user="user"
          />

          <CreateFreet
            v-if="state === 'freet'"
          />

          <Follow
            v-if="state === 'follow'"
            v-bind:user="user"
          />

        </div>
      </section>
    </main>
  </div>
</template>

<script>
import CreateFreet from "./components/CreateFreet.vue";
import Follow from "./components/Follow.vue";
import FreetList from "./components/FreetList.vue";
import NavBar from "./components/NavBar.vue";
import UserSettings from "./components/UserSettings.vue";
import { eventBus } from "./main";

export default {
  name: "app",
  components: {
    CreateFreet,
    Follow,
    FreetList,
    NavBar,
    UserSettings
  },

  data() {
    return {
      isSignedIn: false,
      state: "allFreets",
      user: null
    };
  },

  created: function() {
    eventBus.$on("set-state", (state) => {
      this.state = state;
    });

    eventBus.$on("signin-success", (user) => {
      this.isSignedIn = true;
      this.user = user;
    });

    eventBus.$on("signout-success", () => {
      this.isSignedIn = false;
      this.user = null;
    });

    eventBus.$on("delete-account-success", () => {
      this.isSignedIn = false;
    });
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: lightblue;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}

.component {
  background-color: whitesmoke;
  padding: 1rem;
}
</style>

<style scoped>
#app {
  margin: 0.5rem;
}
</style>
