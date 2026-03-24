# 配置Sentry

```javascript
pnpm add @sentry/vue
```

```javascript
import { createApp } from "vue";
import { createRouter } from "vue-router";
import router from "./router";

import * as Sentry from "@sentry/vue";

const app = createApp({
  // ...
});

Sentry.init({
  app,
  dsn: "https://3147bf2f9671f799dda27fabe4dd1b90@o4511097411796992.ingest.us.sentry.io/4511097883721728",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

app.use(router);
app.mount("#app");
```





# 疑问

<span style="color:red;font-size:18px;font-weight:bold">系统里的所有报错Sentry都可以取到是吗？</span>

不是“所有报错都一定能取到”，更准确地说是：

Sentry 能抓到很多前端运行时错误，但不是 100%。

通常比较容易抓到的是：

- 未捕获的 JavaScript 异常，比如 throw new Error(...)
- 运行时错误，比如 Cannot read properties of null
- Promise 未处理异常
- 你手动调用的 Sentry.captureException(...)
- Vue 组件生命周期里的部分错误，前提是 SDK 初始化正常

但下面这些不一定能自动抓到：

- 你自己 try...catch 以后吞掉了，没再上报
- 接口返回 500 这种“业务失败”，如果代码没抛错，Sentry不会自动当异常收集
- 表单校验失败、提示文案这种正常业务分支
- 某些跨域脚本错误，浏览器只给 Script error
- 用户断网、请求超时这类情况，如果没接入性能监控或没手动上报，不一定进异常列表
- 构建前就被 TypeScript / ESLint 拦住的错误
- 页面崩掉前 SDK 还没来得及发送，或者被广告拦截器/网络策略拦掉

你可以把它理解成：

Sentry 主要抓“运行时发生、并且有机会被 SDK 观察到”的错误，不等于系统里所有问题都自动覆盖。

如果你想更接近“系统里的报错都尽量收集到”，一般要一起做这几件事：

- 保留自动异常采集
- 对 try...catch 里的错误手动 captureException
- 对接口失败、业务异常主动 captureMessage 或 captureException
- 打开路由、性能、用户操作相关监控
- 给关键请求和关键业务流程加上下文信息

如果你愿意，我可以下一步直接帮你把这个项目补成一个“更接近真实项目”的 Sentry 示例：

- 自动抓 Vue 错误
- 手动上报业务异常
- 上报接口失败
- 给事件带上用户输入和页面信息





<span style="color:red;font-size:18px;font-weight:bold">*已经接住了的错误是不会上报的，未处理异常才上报*</span>

比如说：

~~~javascript
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
  }
}
~~~

