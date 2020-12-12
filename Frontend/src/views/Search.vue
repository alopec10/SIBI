<template>
  <div class="search">
    <v-container class="fill-height">
      <v-row align="center" justify="center" no-gutters>
        <v-col cols="12" sm="8" md="8" class="">
          <h1
            style="font-family: Montserrat Alternates; margin-top: 40px; font-size: 3.7em"
            class="text-center mb-4 blue--text"
          >
            BÚSQUEDA DE OBRAS
          </h1>
          <v-container fill-height>
            <v-layout align-center justify-center>
              <v-text-field
                v-model="searchTitle"
                label="Nombre de la obra"
                outlined
                style="max-width:750px"
                center
                color="blue"
                class="centered_text"
              ></v-text-field>
            </v-layout>
          </v-container>

          <div class="text-center">
            <v-btn @click="searchByTitle" x-large color="blue" dark>Buscar</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container grid-list-md text-xs-center fluid v-if="render">
      <v-layout align-start justify-start row wrap>
        <v-flex
          v-for="(artwork, index) in aw"
          v-bind:key="artwork.id"
          mt-10
          ml-10
          sm="4"
          md="3"
          lg="2"
        >
          <v-hover>
            <ArtworkCollapsed
              v-if="render"
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 24 : 2}`"
              :art_id="artwork.art_id"
              :title="artwork.title"
              :author="artwork.author"
              :rating="artwork.rating"
              :img_url="artwork.img_url"
              @click.native="changeDisplay(index)"
            />
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid v-if="render2">
      <v-layout align-start justify-center>
        <ArtworkHorizontal
          v-if="render2"
          style="margin-top:40px;margin-left:40px"
          :art_id="aw[i].art_id"
          :title="aw[i].title"
          :author="aw[i].author"
          :date="aw[i].date"
          :location="aw[i].location"
          :art_form="aw[i].art_form"
          :art_type="aw[i].art_type"
          :school="aw[i].school"
          :img_url="aw[i].img_url"
          :rating="aw[i].rating"
          :avg="aw[i].avg"
        />
        <div @click="changeBack">
          <v-icon large style="margin-left:30px">close</v-icon>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat+Alternates");

.search {
  font-family: Montserrat, "Montserrat Alternates";
}

.centered_text input {
  text-align: center;
}
</style>

<script>
// @ is an alias to /src
import ArtworkCollapsed from "@/components/ArtworkCollapsed.vue";
import ArtworkHorizontal from "@/components/ArtworkHorizontal.vue";
import { mapState } from "vuex";
const axios = require("axios");

export default {
  name: "Home",
  components: { ArtworkCollapsed, ArtworkHorizontal },
  data() {
    return {
      step: 1,
      searchTitle: "",
      render: false,
      render2: false,
      i: 0,
      aw: [],
    };
  },
  computed: {
    ...mapState(["idUser"]),
  },
  methods: {
    searchByTitle: function() {
      const constData = { title: this.searchTitle, idUser: this.idUser };
      axios
        .post("http://localhost:3000/searchAWByTitle", constData)
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert(
              "No se ha encontrado ninguna obra con ese nombre. Recuerda buscar en inglés"
            );
          } else {
            this.aw = response.data;
            this.render = true;
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        })
        .then(function() {
          // always executed
        });
    },
    changeDisplay(index) {
      this.render = false;
      this.render2 = true;
      this.i = index;
    },
    changeBack() {
      this.render = true;
      this.render2 = false;
    },
  },
};
</script>
