<template>
  <main>
    <el-input v-model="input1" style="width: 240px" placeholder="请输入测试内容" />
    <el-button type="primary" @click="captureHandledError">手动上报到 Sentry</el-button>
    <el-button type="danger" @click="triggerUnhandledError">抛出异常</el-button>
    <el-button type="warning" @click="triggerSystemLikeError">模拟系统报错</el-button>
    <el-button @click="triggerCaughtError">try/catch 捕获异常</el-button>
    <br />
    最近一次测试内容：{{ input1 || '未填写' }}
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as Sentry from '@sentry/vue'

const input1 = ref('')

const captureHandledError = () => {
  Sentry.captureException(new Error(`HomeView 手动测试异常: ${input1.value || '未填写测试内容'}`))
}

const triggerUnhandledError = () => {
  throw new Error(`HomeView 未捕获测试异常: ${input1.value || '未填写测试内容'}`)
}

const triggerSystemLikeError = () => {
  const response: any = null
  // 模拟真实业务里接口数据结构异常导致的运行时错误
  return response.data.user.profile.name
}

/**
 * 这种写法不会主动上报Sentry，因为已经在 catch 里把错误接住了。
 * 这里发生的是：
 * 1.错误被 throw
 * 2.但马上被 catch 捕获
 * 3.你只做了 console.error(...)
 * 4.没有 Sentry.captureException(error)
 * 5.也没有重新 throw error
 *
 * 想让它上报，有两种常见写法
 * 1.captureException(error)：你自己明确告诉 Sentry 上报
 * 2.throw error：把错误重新丢出去，让它变成未处理异常，Sentry 可能自动捕获
 */
const triggerCaughtError = () => {
  try {
    throw new Error(`HomeView try/catch 测试异常: ${input1.value || '未填写测试内容'}`)
  } catch (error) {
    console.error('try/catch 捕获到异常:', error)
    throw new Error(`HomeView try/catch 测试异常: ${input1.value || '未填写测试内容'}`)
  }
}
</script>
