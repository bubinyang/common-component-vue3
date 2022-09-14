<template>
  <div>
    <Article :title="AriticeItem.title" :info="AriticeItem.info" :author="AriticeItem.author">
      <!-- v-bind ( : ) ，父组件将值绑定到子组件上 -->
    </Article>
  </div>
</template>
<script setup>
import { reactive } from "vue";
import Article from "@/views/header.vue";

const AriticeItem = reactive({
  title: "文章标题",
  info: "文章内容",
  author: "X"
});
</script>
