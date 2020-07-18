import Vue from 'vue';
import Vuetify, {
   VCard,
   VRating,
   VToolbar,
} from 'vuetify/lib';


import { Ripple } from 'vuetify/lib/directives'


Vue.use(Vuetify, {
   components: { VCard, VRating, VToolbar },
   directives: { Ripple }
});

import colors from 'vuetify/lib/util/colors'

export default new Vuetify({
   icons: {
      iconfont: 'mdiSvg'
   },
  
});

