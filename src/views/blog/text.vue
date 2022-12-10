<template>
<div class="">
  <!-- <EditorMarkdown v-model="markdownContent"></EditorMarkdown> -->
  <EditorHtml v-model="markdownContent"></EditorHtml>
  {{markdownContent}}
</div>
</template>

<script setup>
import { 
  defineComponent, 
  getCurrentInstance, 
  reactive, 
  ref 
} from 'vue';
import EditorMarkdown from '../../components/EditorMarkdown.vue';
import EditorHtml from '../../components/EditorHtml.vue';
const markdownContent=ref('#text')
</script>

<style lang="scss" scoped></style>