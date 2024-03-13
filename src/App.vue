<script setup>
import { ref, onMounted } from 'vue'
import ButtonVue from './components/ButtonVue.vue'
import AccountList from './components/AccountList.vue'
import store2 from 'store2'
import {WALLETINFO_KEY} from '@/contants';


const walletInfo = ref([])

onMounted(() => {
  walletInfo.value = store2.get(WALLETINFO_KEY) || []
  console.log(walletInfo);
});

</script>

<template>
  <header>
  </header>
  <main>
    <ButtonVue />
    <AccountList :wallet-info="walletInfo" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
./components/ButtonVue.vue