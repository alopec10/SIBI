<template>
  <v-card width="1200" elevation="24">
    <v-container>
      <v-row dense>
        <v-col>
          <v-card elevation="0">
            <v-img
              :src="img_url"
              max-height="500"
              max-width="600"
              contain
            >
            </v-img>
          </v-card>
        </v-col>
        <v-col>
          <v-card width="450" elevation="0">
            <v-card-title style="font-size:2.5em; font-weight:bold; margin-top: 10px">{{title}}</v-card-title>
            <v-card-subtitle style="margin-top:10px;font-size:2em">{{author}}</v-card-subtitle>
            <v-card-text style="margin-top:10px;font-size:1em">{{date}}</v-card-text>
            <v-card-text style="margin-top:-20px;font-size:1em">{{location}}</v-card-text>
            <v-card-text style="margin-top:-20px;font-size:1em">{{type}}</v-card-text>
            <v-card-text style="margin-top:-20px;font-size:1em">{{school}}</v-card-text>
              <v-card-text style="font-size:1em">Danos tu opinión</v-card-text>
              <v-rating hover length="5" size="50" color="blue"> </v-rating>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "ArtworkHorizontal",
  props: {
    title: "",
    author: "",
    art_id: "",
    review_score: "",
    img_url: "",
    date:"",
    location:"",
    type:"",
    school:""
  },
};
</script>
