<template>
  <div class="home">
    <!-- <v-text-field
      v-model="searchId"
      label="Nombre de la obra"
      outlined
      clearable
    ></v-text-field>
    <v-btn @click="searchById"></v-btn> -->
    <h1
      style="font-family: Montserrat Alternates; margin-top: 70px; margin-bottom: 50px;font-size: 4.3em"
      class="text-center blue--text"
    >
      RECOMENDACIÓN
    </h1>
    <v-container
      class="fill-height"
      fluid
      style
      mt-16
      mb-13
      v-if="displayOpciones"
    >
      <v-row align="center" justify="center" no-gutters>
        <v-col>
          <div class="text-center">
            <h1
              style="font-family: Montserrat Alternates; font-size: 3.2em"
              class="mb-8 blue--text"
            >
              Mis gustos
            </h1>
            <p
              style="font-family: Montserrat Alternates; font-size: 1.3em"
              class="mb-10 #4c4f4d--text"
            >
              Mostrar las obras más parecidas <br />a las que te han gustado
            </p>
            <v-btn @click="recommendContentBased" x-large color="blue" dark
              >Recomiéndame</v-btn
            >
          </div>
        </v-col>
        <v-divider vertical color="#367acf"></v-divider>
        <v-col>
          <div class="text-center">
            <h1
              style="font-family: Montserrat Alternates; font-size: 3.2em"
              class="mb-8 blue--text"
            >
              Colaborativo
            </h1>
            <p
              style="font-family: Montserrat Alternates; font-size: 1.3em"
              class="mb-10 #4c4f4d--text"
            >
              Mostrar las obras que le hayan gustado<br />a usuarios muy
              parecidos a tí
            </p>
            <v-btn @click="recommendCollaborative" x-large color="blue" dark
              >Recomiéndame</v-btn
            >
          </div>
        </v-col>
        <v-divider vertical color="#367acf"></v-divider>
        <v-col>
          <div class="text-center">
            <h1
              style="font-family: Montserrat Alternates; font-size: 3.2em"
              class="mb-8 blue--text"
            >
              Mejor valoradas
            </h1>
            <p
              style="font-family: Montserrat Alternates; font-size: 1.3em"
              class="mb-10 #4c4f4d--text"
            >
              Mostrar las obras con mejor <br />valoración de entre todos los
              usuarios
            </p>
            <v-btn @click="bestRated" x-large color="blue" dark>MOSTRAR</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="fill-height" v-if="displayTitle != 0" fluid>
      <v-layout align-center justify-center>
        <h1
          style="font-family: Montserrat Alternates; font-size: 3.5em"
          class="mb-8 blue--text"
        >
          <div v-if="displayTitle == 1">Mis gustos</div>
          <div v-if="displayTitle == 2">Colaborativo</div>
          <div v-if="displayTitle == 3">Mejor valoradas</div>
        </h1>
      </v-layout>
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

<script>
import { mapState } from "vuex";
// @ is an alias to /src
import ArtworkCollapsed from "@/components/ArtworkCollapsed.vue";
import ArtworkHorizontal from "@/components/ArtworkHorizontal.vue";

const axios = require("axios");

export default {
  name: "Home",
  components: { ArtworkCollapsed, ArtworkHorizontal },
  data() {
    return {
      step: 1,
      searchId: "",
      render: false,
      render2: false,
      displayOpciones: true,
      displayTitle: 0,
      i: 0,
      aw: [],
    };
  },
  computed: {
    ...mapState(["idUser"]),
  },
  methods: {
    searchById: function() {
      axios
        .post("http://localhost:3000/searchAWById", {
          idAW: this.searchId, idUser: this.idUser
        })
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
    recommendContentBased: function() {
      this.displayOpciones = false;
      this.displayTitle = 1;
      const constData = { idUser: this.idUser };
      axios
        .post("http://localhost:3000/recommendContentBased", constData)
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert("Se ha producido un error. Inténtalo de nuevo más tarde.");
          } else {
            this.askAW(response.data);
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    recommendCollaborative: function() {
      this.displayOpciones = false;
      this.displayTitle = 2;
      const constData = { idUser: this.idUser };
      axios
        .post("http://localhost:3000/recommendCollaborative", constData)
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert("Se ha producido un error. Inténtalo de nuevo más tarde.");
          } else {
            this.askAW(response.data);
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    bestRated: function() {
      this.displayOpciones = false;
      this.displayTitle = 3;
      const constData = { idUser: this.idUser };
      axios
        .post("http://localhost:3000/bestRated", constData)
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert("Se ha producido un error. Inténtalo de nuevo más tarde.");
          } else {
            this.aw = response.data;
            this.render = true;
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    },

    askAW(array) {
      //console.log(array[0].id)
      for (var i = 0; i < array.length; i++) {
        //console.log(array[i].id)
        axios
          .post("http://localhost:3000/searchAWById", {
            idAW: array[i].id,
            idUser: this.idUser
          })
          .then((response) => {
            this.aw.push(response.data[0]);
          })
          .catch((error) => {
            // handle error
            console.log(error);
          });
      }
      this.render = true;
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
