<template>
  <div class="home">
    <v-text-field
      v-model="searchTitle"
      label="Nombre de la obra"
      outlined
      clearable
    ></v-text-field>
    <v-btn @click="searchByTitle"></v-btn>
    <ArtworkHorizontal
      style="margin-top:40px;margin-left:40px"
      :art_id="artworks[0].art_id"
      :title="artworks[0].title"
      :author="artworks[0].author"
      :date="artworks[0].date"
      :location="artworks[0].location"
      :type="artworks[0].type"
      :school="artworks[0].school"
      :img_url="artworks[0].img_url"
    />
  </div>
</template>

<script>
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
      searchTitle: "",
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
  methods: {
    searchByTitle: function() {
      axios
        .post("http://localhost:3000/searchTitle", {
          title: this.searchTitle,
        })
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert(
              "No se ha encontrado ninguna obra con ese nombre. Recuerda buscar en inglés"
            );
          } else {
            for (var i = 0; i < response.data.length; i++) {
              this.aw = JSON.stringify(response.data);
              console.log(this.aw);
            }
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
  },
};
</script>
