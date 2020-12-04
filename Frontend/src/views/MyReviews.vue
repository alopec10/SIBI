<template>
  <div class="myreviews">
    <v-container  grid-list-md text-xs-center fluid v-if="render">
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
              :rating="artwork.rating.low"
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
          :rating="aw[i].rating.low"
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
const axios = require("axios");
// @ is an alias to /src
import ArtworkCollapsed from "@/components/ArtworkCollapsed.vue";
import ArtworkHorizontal from "@/components/ArtworkHorizontal.vue";
export default {
  name: "MyReviews",
  components: { ArtworkCollapsed, ArtworkHorizontal },
  data() {
    return {
      artworks: [],
      render: true,
      render2: false,
      i: 0,
      aw: [],     
    };
  },
  computed: {
    ...mapState(["idUser"]),
  },
  mounted: function() {
    this.searchMyRatings();
  },
  methods: {
    searchMyRatings: function() {
      const constData = { idUser: this.idUser };
      axios
        .post("http://localhost:3000/searchMyRatings", constData)
        .then((response) => {
          // handle success
          var json = { msg: "Error" };
          if (JSON.stringify(response.data) == JSON.stringify(json)) {
            alert("No has valorado ninguna obra todavía");
          } else {
            //for (var i = 0; i < response.data.length; i++) {
            //this.aw = JSON.stringify(response.data);
            //this.aw = JSON.parse(this.aw);
            this.aw = response.data;
            //this.render = true;
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
