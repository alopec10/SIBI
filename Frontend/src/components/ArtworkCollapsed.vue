<template>
  <v-card width="300" max-height="400" elevation="24" outlined>
    <v-img
      :src="img_url"
      ref="imageShow"
      max-height="390"
    >
      <div style="margin-top:280px;background-color:white;opacity:0.85">
        <v-card-title style="padding-top:-10px; font-size:1.15em;font-weight:bold">{{title_after}}</v-card-title>
        <v-card-subtitle>{{author_after}}</v-card-subtitle>
        <v-rating
          hover
          length="5"
          size="25"
          color="blue"
          dense
          style="margin-top:-12px; margin-left: 10px; padding-bottom:8px"
          v-model="rating_after"  
          readonly
        >
        </v-rating>
      </div>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: "ArtworkCollapsed",
  data() {
    return {
      rating_after: 0,
      title_after: "",
      author_after: ""
    };
  },
  props: {
    title: "",
    author: "",
    art_id: "",
    rating: 0,
    img_url: "",
    date: "",
    location: "",
    art_form: "",
    art_type: "",
    school: "",
    avg:""
  },
  mounted: function() {
    this.rating_after = this.rating;
    this.title_after = this.title;
    if (this.title.length >22) {
      this.title_after = this.title.substring(0,22) + "...";
    }
    this.author_after = this.author;
    if (this.author.length >22) {
      this.author_after = this.author.substring(0,31) + "...";
    }
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
