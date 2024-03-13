<script setup>
import { showNotify } from "vant";
import {ref} from "vue";
import * as bip39 from "bip39";
import { hdkey } from "@ethereumjs/wallet";
import store2 from 'store2';
import {WALLETINFO_KEY} from '@/contants';


const createWalletDialogVisible = ref(false);
const password = ref("");
let storeWalletInfo = store2.get(WALLETINFO_KEY);

const createWalletEvent = () => {
  createWalletDialogVisible.value = true
};

const confirmPassword = () => {
  if (password.value === '') {
    showNotify({ type: 'danger', message: "密码不能为空"});
    return false;
  }
  if (storeWalletInfo) {
    mnemonicDisable.value = false;
    mnemonic.value = storeWalletInfo[0]['mnemonic']
    createWallet();
  } else {
    mnemonicDisable.value= true;
    mnemonic.value = bip39.generateMnemonic();
  }
  return true;
}

let mnemonic = ref("");
const mnemonicDisable = ref(false);
const confirmSaveMnemonic = () => {
  confirmMnemonicVisible.value = true;
}

let confirmMnemonicVisible = ref(false);
let inputMnemonic = ref("");

const confirmMnemonic = () => {
  if (inputMnemonic.value == mnemonic.value) {
    confirmMnemonicVisible.value = false;
    mnemonicDisable.value = false;
    createWallet();
    return true
  }
  showNotify({ type: 'danger', message: "助记词错误"});
  return false
}

const closeConfirmMnemonicDialog = () => {
  confirmMnemonicVisible.value = false;
}

const createWallet = async () => {
  const hdWallet = hdkey.EthereumHDKey.fromMnemonic(mnemonic.value);
  let walletInfo = storeWalletInfo || [];
  const addressIndex = walletInfo.length === 0 ? 0 : walletInfo.length;
  const keyPair = hdWallet.derivePath(`m/44'/60'/0'/0/${addressIndex}`);
  const wallet = keyPair.getWallet();

  const lowerCaseAddress = wallet.getAddressString();
  // const CheckSumAddress = wallet.getChecksumAddressString();
  const privateKey = wallet.getPrivateKeyString();
  const keyStore = await wallet.toV3(password.value);

  const walletObj = {
      id: addressIndex,
      address: lowerCaseAddress,
      privateKey,
      keyStore,
      mnemonic: mnemonic.value,
      balance: 0,
    };
  walletInfo.push(walletObj);
  console.log(walletInfo);
  store2(WALLETINFO_KEY, walletInfo);
  storeWalletInfo = store2.get(WALLETINFO_KEY);
  
}

</script>

<template>
  <van-space>
    <van-button type="primary" @click="createWalletEvent">创建钱包</van-button>
    <van-button type="primary">导入钱包</van-button>
    <van-dialog
      v-model:show="createWalletDialogVisible"
      title="请输入密码"
      show-cancel-button
      :before-close="confirmPassword"
    >
      <van-field 
        v-model="password"
        label="密码："
        placeholder="请输入用户名"
        type="password"
      />
    </van-dialog>
  </van-space>
  <template v-if="mnemonicDisable">
      <div>
      <p>{{ mnemonic }}</p>
      <van-button type="primary" @click="confirmSaveMnemonic">我已保存</van-button>
    </div>
    <van-dialog
      v-model:show="confirmMnemonicVisible"
      title="请输入助记词"
      show-cancel-button
      :before-close="confirmMnemonic"
      @cancel="closeConfirmMnemonicDialog"
    >
      <van-field 
        v-model="inputMnemonic"
        label="助记词："
        placeholder="助记词"
      />
    </van-dialog>
  </template>

</template>

<style lang="less">
body {
  padding: 10px;
  p {
    user-select: all;
  }
}
</style>./contants.js@/contants
