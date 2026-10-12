# Angular 手写练习（2 个项目版）

把之前 5 道题的考点合并成 2 个项目。**关掉所有 AI 补全**，计时手写，写完跑测试。

| 项目 | 文件夹 | 覆盖考点 | 时间 |
|---|---|---|---|
| P1 Shop | `src/app/p1-shop` | Service + HttpClient、loading/error/retry、搜索/筛选/排序/分页、`@Input`/`@Output` 子组件、心愿单、a11y | 45 分钟 |
| P2 Cart + Checkout | `src/app/p2-cart-checkout` | 购物车增删改、总价、Reactive Forms 校验、提交和重置、a11y | 40 分钟 |

## 命令

```bash
npm install
npm start          # http://localhost:4200 （P1 在浏览器里会显示错误状态，因为没有真实后端，正常）
npm run test:p1    # 只跑 P1
npm run test:p2    # 只跑 P2
npm run reset:p1   # 把 P1 恢复成起始代码，重写一遍
npm run reset:p2
```

## 两天计划

**周日晚（30 分钟）**：只读两个 README 和 `solutions/README.md`，不写代码。把自己不确定的语法圈出来。

**周一**
1. P1 计时写一遍 → 跑测试 → 对照答案找差距
2. P2 计时写一遍 → 同上
3. 晚上 `reset` 后两个各重写一遍，目标：不看答案、时间内全绿

**周二面试前（30 分钟）**：P1 快速再写一遍热身，只看 `solutions/README.md` 的"必须默写"清单。

## 规则
1. 先读 README 和 `.spec.ts`，记下 `data-test-id`
2. 写一小块就跑一次测试
3. 边写边用英文讲思路
4. 卡住超过 5 分钟再看 `solutions/`，看完关掉，自己重写那一块

## 环境提醒
本项目是 Angular 20 standalone。HackerRank 可能是旧版 `NgModule`：
- 组件不在自己的 `imports` 里导入模块，而是在 `app.module.ts` 的 `imports` 里加 `FormsModule` / `ReactiveFormsModule` / `HttpClientModule`
- 新组件要加进 `declarations`
- 拿到题第一件事：打开 `app.module.ts` 看一眼
