<template>
  <div class="home">
    <v-text-field
      v-model="searchId"
      label="Nombre de la obra"
      outlined
      clearable
    ></v-text-field>
    <v-btn @click="searchById"></v-btn>

    <v-container class="fill-height">
      <v-row align="center" justify="center" no-gutters>
        <v-col>
          <div class="text-center">
            <h1
              style="font-family: Montserrat Alternates; font-size: 2em"
              class="mb-8 blue--text"
            >
              Mis gustos
            </h1>
            <v-btn @click="recommend" large color="blue" dark
              >Recomiéndame</v-btn
            >
          </div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <div class="text-center">
            <h1
              style="font-family: Montserrat Alternates; font-size: 2em"
              class="mb-8 blue--text"
            >
              Colaborativo
            </h1>
            <v-btn @click="recommend" large color="blue" dark
              >Recomiéndame</v-btn
            >
          </div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <div class="text-center">
            <h1
              style="font-family: Montserrat Alternates; font-size: 2em"
              class="mb-8 blue--text"
            >
              Mis gustos
            </h1>
            <v-btn @click="recommend" large color="blue" dark
              >Recomiéndame</v-btn
            >
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
      artworks: [
        {
          art_id: 1,
          title: "Vitruvian man",
          author: "LEONARDO da Vinci",
          review_score: null,
          date: "1492",
          location: "Gallerie dell'Accademia, Venice",
          type: "graphics",
          school: "Italian",
          img_url:
            "https://www.wga.hu/detail/l/leonardo/10anatom/1vitruviu.jpg",
        },
      ],
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
          id: this.searchId,
        })
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert(
              "No se ha encontrado ninguna obra con ese nombre. Recuerda buscar en inglés"
            );
          } else {
            //for (var i = 0; i < response.data.length; i++) {
            //this.aw = JSON.stringify(response.data);
            //this.aw = JSON.parse(this.aw);
            this.aw = response.data;
            this.render = true;
            console.log(this.aw);
            //}
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
    recommend: function() {
      const constData = { idUser: this.idUser };
      axios
        .post("http://localhost:3000/recommend1", constData)
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert(
              "     " /////////////////////////////////////////////////////
            );
          } else {
            this.askAW(response.data);
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

    askAW(array) {
      //console.log(array[0].id)
      for (var i = 0; i < array.length; i++) {
        //console.log(array[i].id)
        axios
          .post("http://localhost:3000/searchAWById", {
            id: array[i].id,
          })
          .then((response) => {
            // handle success

            this.aw.push(response.data[0]);
            //console.log(response.data[0]);
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
