<template>
  <div class="myreviews">
    <v-container grid-list-md text-xs-center fluid>
      <v-layout align-start justify-start row wrap>
        <v-flex v-for="artwork in artworks" v-bind:key="artwork.id" mt-10 ml-10 sm="4" md="3" lg="2">
          <ArtworkCollapsed
            :art_id="artwork.art_id"
            :title="artwork.title"
            :author="artwork.author"
            :review_score="artwork.review_score"
            :img_url="artwork.img_url"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import ArtworkCollapsed from "@/components/ArtworkCollapsed.vue";
import ArtworkHorizontal from "@/components/ArtworkHorizontal.vue";
export default {
  name: "MyReviews",
  components: { ArtworkCollapsed, ArtworkHorizontal },
  data() {
    return {
      artworks: [
        {
          art_id: 1,
          title: "Mona Lisa",
          author: "LEONARDO Da Vinci",
          review_score: 4,
          img_url:
            "https://www.wga.hu/detail/l/leonardo/04/0monalis.jpg",
        },
        {
          art_id: 2,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
        {
          art_id: 3,
          title: "titulo6",
          author: "author1",
          review_score: 4,
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
        {
          art_id: 4,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
        {
          art_id: 5,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
        {
          art_id: 6,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
        {
          art_id: 7,
          title: "titulo1",
          author: "author1",
          review_score: 4,
          img_url:
            "https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg",
        },
      ],
    };
  },
};
</script>
