<template>
  <main>
    <el-input v-model="input1" style="width: 240px" placeholder="请输入第一个数字" />
    <el-input v-model="input2" style="width: 240px" placeholder="请输入第二个数字" />
    <el-button type="primary" @click="calculate">结果</el-button>
    <br />
    我的计算结果{{ result }}
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const input1 = ref(0)
const input2 = ref(0)
const result = ref(0)
const calculate = () => {
  result.value = input1.value / input2.value
}
</script>
