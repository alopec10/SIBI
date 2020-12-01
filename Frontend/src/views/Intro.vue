<template>
  <v-container>
    <v-row align="center" justify="center" no-gutters>
      <v-col>
        <v-window v-model="step">
          <v-window-item :value="1">
            <ArtworkHorizontal
              :art_id="artworks[0].art_id"
              :title="artworks[0].title"
              :author="artworks[0].author"
              :date="artworks[0].date"
              :location="artworks[0].location"
              :type="artworks[0].type"
              :school="artworks[0].school"
              :img_url="artworks[0].img_url"
            />
            <v-btn
              @click="step = 2"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </v-window-item>
          <v-window-item :value="2">
            <ArtworkHorizontal
              :art_id="artworks[1].art_id"
              :title="artworks[1].title"
              :author="artworks[1].author"
              :date="artworks[1].date"
              :location="artworks[1].location"
              :type="artworks[1].type"
              :school="artworks[1].school"
              :img_url="artworks[1].img_url"
            />
            <v-btn
              @click="step = 3"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </v-window-item>
          <v-window-item :value="3">
            <ArtworkHorizontal
              :art_id="artworks[2].art_id"
              :title="artworks[2].title"
              :author="artworks[2].author"
              :date="artworks[2].date"
              :location="artworks[2].location"
              :type="artworks[2].type"
              :school="artworks[2].school"
              :img_url="artworks[2].img_url"
            />
            <v-btn
              @click="step = 4"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </v-window-item>
          <v-window-item :value="4">
            <ArtworkHorizontal
              :art_id="artworks[3].art_id"
              :title="artworks[3].title"
              :author="artworks[3].author"
              :date="artworks[3].date"
              :location="artworks[3].location"
              :type="artworks[3].type"
              :school="artworks[3].school"
              :img_url="artworks[3].img_url"
            />
            <v-btn
              @click="step = 5"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </v-window-item>
          <v-window-item :value="5">
            <ArtworkHorizontal
              :art_id="artworks[4].art_id"
              :title="artworks[4].title"
              :author="artworks[4].author"
              :date="artworks[4].date"
              :location="artworks[4].location"
              :type="artworks[4].type"
              :school="artworks[4].school"
              :img_url="artworks[4].img_url"
            />
            <v-btn
              @click="submit"
              style="margin-top:50px"
              color="blue"
              class="white--text"
              large
              >Siguiente</v-btn
            >
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArtworkHorizontal from "@/components/ArtworkHorizontal.vue";

export default {
  name: "Intro",
  data() {
    return {
      step: 1,
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
        {
          art_id: 7,
          title: "titulo2",
          author: "author2",
          review_score: 4,
          date: "date",
          location: "location",
          type: "type",
          school: "school",
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },

        {
          art_id: 7,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          date: "date",
          location: "location",
          type: "type",
          school: "school",
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
        {
          art_id: 7,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          date: "date",
          location: "location",
          type: "type",
          school: "school",
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
        {
          art_id: 7,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          date: "date",
          location: "location",
          type: "type",
          school: "school",
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
      ],
    };
  },
  components: { ArtworkHorizontal },
  methods: {
    submit() {
      console.log("hola");
      this.$router.push("/Home");
    },
  },
};
</script>
