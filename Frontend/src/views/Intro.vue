<template>
  <v-container v-if="display" fluid class="fill-height">
    <v-layout align-start justify-center>
      <v-window v-model="step">
        <v-window-item :value="1">
          <ArtworkHorizontal
            :art_id="aw[0].art_id"
            :title="aw[0].title"
            :author="aw[0].author"
            :date="aw[0].date"
            :location="aw[0].location"
            :art_form="aw[0].art_form"
            :art_type="aw[0].art_type"
            :school="aw[0].school"
            :img_url="aw[0].img_url"
            :rating="aw[0].rating"
            :avg="aw[0].avg"
            elevation="0"
          />
          <div class="text-center">
            <v-btn
              @click="step = 2"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="2">
          <ArtworkHorizontal
            :art_id="aw[1].art_id"
            :title="aw[1].title"
            :author="aw[1].author"
            :date="aw[1].date"
            :location="aw[1].location"
            :art_form="aw[1].art_form"
            :art_type="aw[1].art_type"
            :school="aw[1].school"
            :img_url="aw[1].img_url"
            :rating="aw[1].rating"
            :avg="aw[1].avg"
          />
          <div class="text-center">
            <v-btn
              @click="step = 3"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="3">
          <ArtworkHorizontal
            :art_id="aw[2].art_id"
            :title="aw[2].title"
            :author="aw[2].author"
            :date="aw[2].date"
            :location="aw[2].location"
            :art_form="aw[2].art_form"
            :art_type="aw[2].art_type"
            :school="aw[2].school"
            :img_url="aw[2].img_url"
            :rating="aw[2].rating"
            :avg="aw[2].avg"
          />
          <div class="text-center">
            <v-btn
              @click="step = 4"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="4">
          <ArtworkHorizontal
            :art_id="aw[3].art_id"
            :title="aw[3].title"
            :author="aw[3].author"
            :date="aw[3].date"
            :location="aw[3].location"
            :art_form="aw[3].art_form"
            :art_type="aw[3].art_type"
            :school="aw[3].school"
            :img_url="aw[3].img_url"
            :rating="aw[3].rating"
            :avg="aw[3].avg"
          />
          <div class="text-center">
            <v-btn
              @click="step = 5"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="5">
          <ArtworkHorizontal
            :art_id="aw[4].art_id"
            :title="aw[4].title"
            :author="aw[4].author"
            :date="aw[4].date"
            :location="aw[4].location"
            :art_form="aw[4].art_form"
            :art_type="aw[4].art_type"
            :school="aw[4].school"
            :img_url="aw[4].img_url"
            :rating="aw[4].rating"
            :avg="aw[4].avg"
          />
          <div class="text-center">
            <v-btn
              @click="step = 6"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="6">
          <ArtworkHorizontal
            :art_id="aw[5].art_id"
            :title="aw[5].title"
            :author="aw[5].author"
            :date="aw[5].date"
            :location="aw[5].location"
            :art_form="aw[5].art_form"
            :art_type="aw[5].art_type"
            :school="aw[5].school"
            :img_url="aw[5].img_url"
            :rating="aw[5].rating"
            :avg="aw[5].avg"
          />
          <div class="text-center">
            <v-btn
              @click="step = 7"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </div>
        </v-window-item>
        <v-window-item :value="7">
          <ArtworkHorizontal
            :art_id="aw[6].art_id"
            :title="aw[6].title"
            :author="aw[6].author"
            :date="aw[6].date"
            :location="aw[6].location"
            :art_form="aw[6].art_form"
            :art_type="aw[6].art_type"
            :school="aw[6].school"
            :img_url="aw[6].img_url"
            :rating="aw[6].rating"
            :avg="aw[6].avg"
          />
          <div class="text-center">
            <v-btn
              @click="submit"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Finalizar</v-btn
            >
          </div>
        </v-window-item>
      </v-window>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import ArtworkHorizontal from "@/components/ArtworkHorizontal.vue";
const axios = require("axios");
export default {
  name: "Intro",
  data() {
    return {
      step: 1,
      aw: [],
      display: false,
    };
  },
  components: { ArtworkHorizontal },
  mounted: function() {
    this.searchFiveAW();
  },
  computed: { ...mapState(["idUser"]) },
  methods: {
    submit() {
      this.$router.push("/Home");
    },
    changeStep(index) {
      if (index != 7) {
        this.step = index;
      } else {
        submit();
      }
    },
    searchFiveAW() {
      var titles = [
        "Starry Night",
        "Vitruvian Man",
        "Mona Lisa",
        "The Yellow Christ",
        "Creation of Adam",
        "The School of Athens",
        "Girl with a Pearl Earring",
      ];

      for (var i = 0; i < titles.length; i++) {
        const constData = { title: titles[i], idUser: this.idUser };
        axios
          .post("http://localhost:3000/searchAWByTitle", constData)
          .then((response) => {
            // handle success
            var json = { msg: "Error" };
            if (JSON.stringify(response.data) == JSON.stringify(json)) {
              alert(
                "No se ha encontrado ninguna obra con ese nombre. Recuerda buscar en inglés. " +
                  i
              );
            } else {
              this.aw.push(response.data[0]);
              console.log(response.data[0].art_id);

              //this.render = true;
            }
          })
          .catch((error) => {
            // handle error
            console.log(error);
          })
          .then(function() {
            // always executed
          });
      }
      this.display = true;
    },
  },
};
</script>
