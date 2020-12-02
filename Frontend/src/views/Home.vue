<template>
  <div class="home">
    <v-text-field
      v-model="searchTitle"
      label="Nombre de la obra"
      outlined
      clearable
    ></v-text-field>
    <v-btn @click="searchByTitle"></v-btn>
    <ArtworkCollapsed v-if="render"
            :art_id="aw[0].art_id"
            :title="aw[0].title"
            :author="aw[0].author"
            :img_url="aw[0].img_url"
            :rating = 3
          />
    <ArtworkHorizontal v-if="render"
      style="margin-top:40px;margin-left:40px"
      :art_id="aw[0].art_id"
      :title="aw[0].title"
      :author="aw[0].author"
      :date="aw[0].date"
      :location="aw[0].location"
      :art_form="aw[0].art_form"
      :art_type="aw[0].art_type"
      :school="aw[0].school"
      :img_url="aw[0].img_url"
      :rating = 3
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
      render: false,
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
        .post("http://localhost:3000/searchAWById", {
          id: this.searchTitle,
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
              console.log(this.aw)
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
  },
};
</script>
