<template>
  <v-app>
    <v-app-bar app color="#367acf" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.png"
          transition="scale-transition"
          width="40"
        />
        <h1 style="font-family: Montserrat Alternates">FIBONART</h1>
      </div>
      <v-btn href="/Home" text style="margin-left:20px" large>
        Inicio
      </v-btn>
      <v-btn href="/MyReviews" text large>
        Mis Reviews
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="logout" text>
        <span class="mr-2">Cerrar sesión</span>
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat");
#app {
  font-family: Montserrat, "Montserrat Alternates";
}
</style>

<script>
import { mapState, mapMutations } from "vuex";
import ArtworkHorizontal from "./components/ArtworkHorizontal";
import Home from "./views/Home";

export default {
  name: "App",

  components: {
    Home,
    ArtworkHorizontal,
  },

  data: () => ({
    
  }),
  methods: {
    logout() {
      this.deslogearse();
      this.$router.push("/SignIn");
    },
    ...mapMutations(["deslogearse"]),
  },
  computed: {
    ...mapState(["logged", "emailUsuario", "nombre"]),
  },
};
</script>
