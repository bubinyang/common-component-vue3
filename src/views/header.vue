<template>
  <section>
    <p>{{ title }}</p>
    <p>{{ info }}</p>
    <p>{{ author }}</p>
  </section>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
  title: String,
  info: String,
  author: String
}); // 对象形式声明 props
// 等价于以 字符串数组声明 props
//const props = defineProps(['title', 'info', 'author']);
// 如果在setup中使用则直接 props.title
</script>
<style></style>
