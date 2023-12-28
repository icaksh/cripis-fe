<script>
import Vertical from "./vertical.vue";
import {mapGetters} from "vuex";

export default {
    components: {
        Vertical,
    },
    data() {
        return {};
    },
    computed: {
      ...mapGetters('layout', ['changeLayoutType', 'changeLayoutWidth', 'changeLeftSidebarType', 'changeTopbar', 'changeLoaderValue'])
    },
    methods: {},
    mounted() {
        // document.querySelector("html").setAttribute('dir', 'rtl');
    }
};
</script>

<template>
<div>
    <Vertical>
        <slot />
    </Vertical>
</div>
</template>
