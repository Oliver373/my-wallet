<script setup>
import { ref,defineProps,computed } from 'vue'


const props = defineProps(["wallet-info"]);
console.log('props', props.walletInfo);

const test = computed(() => {
  return props.walletInfo.push({x: 100})
});

</script>

<template>
  <van-cell
    :title="item.address"
    icon="user-o"
    v-for="item in test"
  >
  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
    <template #right-icon>
      <van-icon name="search" class="search-icon" />
    </template>
  </van-cell> 
</template>

<style lang="less">
  
</style>
