<script setup>
import { ref,defineProps,computed } from 'vue'
import Web3 from 'web3'
import { showNotify } from "vant";
import { Wallet } from "@ethereumjs/wallet"
import { TransactionFactory } from "@ethereumjs/tx"



const web3 = new Web3(
  Web3.givenProvider || "https://goerli.infura.io/v3/6c5b80df990a47ddad9e92ac7abe3841"
);

const props = defineProps(["wallet-info"]);
console.log('props', props.walletInfo);

const test = computed(() => {
  props.walletInfo.forEach(async (item, index) => {
    const allAddress = item.address;
    item.showAddress = item.address.slice(0, 8) + "..." + item.address.substr(item.address.length - 8);
    const result = await web3.eth.getBalance(allAddress)
    item.balance = web3.utils.fromWei(result, "ether");
  })

  return props.walletInfo;
});

const createWalletDialogVisible = ref(false);
const password = ref("");
const toaddress= ref("");
const number = ref(0);

console.log(Wallet);

const send = async (keystore, pass, address) => {
  console.log("send",keystore, pass, address);
  let walletobj = "";
  try {
    walletobj = await Wallet.fromV3(keystore, pass);
  } catch (error) {
    alert("密码错误");
    console.error(error);
    return false;
  }
  let key = walletobj.getPrivateKeyString();
  const fromaddress = address;
  let nonce = await web3.eth.getTransactionCount(fromaddress);
  let gasPrice = await web3.eth.getGasPrice();

  let balance = Web3.utils.toWei(number.value, "ether");

  var rawTx = {
    from: fromaddress,
    nonce,
    gasPrice,
    to: toaddress.value,
    value: balance,
    data: "0x00",
  }

  console.log("rawTx", rawTx);

  let gas = await web3.eth.estimateGas(rawTx);
  rawTx.gas = gas;

  const tx = TransactionFactory.fromTxData(rawTx);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();

  web3.eth
    .sendSignedTransaction("0x"+serializedTx.toString("hex"))
    .on("transactionHash", (txid) => {
      console.log("交易成功，请在区块链浏览器查看");
      console.log("交易id", txid);
      console.log(`https://goerli.etherscan.io/tx${txid}`);
    })
    .on("error", (err) => {
      console.log("error:" + err);
    })
};

const keystore = ref("");
const address = ref("");

const getPassword = (keyStore, addr) => {
  createWalletDialogVisible.value = true;

  keystore.value = keyStore;
  address.value = addr;
}

const confirmPassword = () => {
  if (password.value === '') {
    showNotify({ type: 'danger', message: "密码不能为空"});
    return false;
  }
  // console.log("解密");
  // Wallet.fromV3(keystore.value, password.value).then((res) => {
  //   console.log("解密成功",res)
  // }).catch((err) => {
  //   console.log("error", err)

  // })
  send(keystore.value, password.value, address.value)
  password.value = "";
  return true;
}

</script>

<template>
  <van-cell
    :title="item.showAddress"
    icon="user-o"
    v-for="item in test"
  >
    <template #right-icon>
      <van-button size="small" @click="getPassword(item.keyStore, item.address)">{{ item.balance }}</van-button>
    </template>
  </van-cell>
  <van-dialog
      v-model:show="createWalletDialogVisible"
      title="请输入密码"
      show-cancel-button
      :before-close="confirmPassword"
    >
      <van-field 
        v-model="toaddress"
        label="转入账户："
        placeholder="请输入转入账户"
      />
      <van-field 
        v-model="password"
        label="密码："
        placeholder="请输入密码"
        type="password"
      />
      <van-field 
        v-model="number"
        label="金额："
        placeholder="请输入金额(eth)"
      />
    </van-dialog>
</template>

<style lang="less">
  
</style>
