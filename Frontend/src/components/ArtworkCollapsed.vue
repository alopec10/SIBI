<template>
  <v-card width="300" max-height="400" elevation="24" outlined>
    <v-img
      :src="img_url"
      ref="imageShow"
      max-height="415"
    >
      <div style="margin-top:307px;background-color:white;opacity:0.85">
        <v-card-title style="padding-top:-10px">{{title}}</v-card-title>
        <v-card-subtitle>{{author}}</v-card-subtitle>
        <v-rating
          hover
          length="5"
          size="25"
          color="blue"
          dense
          style="margin-top:-12px; margin-left: 10px; padding-bottom:8px"
          v-model="review_score"
        >
        </v-rating>
      </div>
    </v-img>
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
    img_url: ""
  },
  methods: {
  },
  computed: {
    calcHeight() {
      const { naturalHeight, naturalWidth } = this.$refs.imageShow.image;
      console.log(naturalHeight);
      if (naturalHeight > naturalWidth) {
        return "height='400'";
      } else {
        return "height='200'";
      }
    },
  },
};
</script>
