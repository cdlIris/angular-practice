# 参考答案要点

## 必须默写（面试前最后看这一节）

```ts
// 双向绑定（需要 FormsModule）
<input [(ngModel)]="searchText" (ngModelChange)="onCriteriaChange()" />

// 列表、条件
<li *ngFor="let p of items; trackBy: trackById">...</li>
<p *ngIf="items.length === 0">Empty</p>

// 属性绑定 vs attribute 绑定（aria-* 要用 attr.）
[disabled]="page === 1"     [attr.aria-pressed]="wishlisted"

// 子组件
@Input({ required: true }) product!: Product;
@Output() wishlistToggle = new EventEmitter<Product>();
// 父组件模板
<app-product-card [product]="p" (wishlistToggle)="toggle($event)"></app-product-card>

// Service + HTTP
private http = inject(HttpClient);
getProducts() { return this.http.get<Product[]>('/api/products'); }
this.service.getProducts().subscribe({ next: d => {...}, error: () => {...} });

// Reactive Forms（需要 ReactiveFormsModule）
form = inject(FormBuilder).group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
});
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="name" />
  <div *ngIf="form.get('name')?.hasError('minlength')">...</div>   // 注意小写 minlength
```

## P1 Shop
- 状态分两类：**数据状态**（products、loading、error）和 **UI 状态**（search、category、sort、page、wishlist）
- `load()` 开始先 `loading = true; error = ''`，next 和 error 两个分支都要关掉 loading
- 流水线：filter → sort → slice。`sort()` 原地修改，先 `[...result]`
- 分类去重：`[...new Set(products.map(p => p.category))]`
- 总页数 `Math.max(1, Math.ceil(n / pageSize))`
- 心愿单状态在父组件，卡片只展示和发事件（单向数据流）。用 `Set<number>` 存 id
- **追问准备**：
  - getter 每次变更检测都重算 → 数据大时在输入变化时算一次存字段，或用 `computed()`；搜索加防抖
  - 重复点 Retry → `switchMap` 取消上一次请求
  - 要上线还缺什么 → 心愿单持久化到后端、搜索/筛选的 telemetry、错误日志

## P2 Cart + Checkout
- `find` 按 id 找现有行，有就 `quantity++`，没有就 `push`
- count / total 用 `reduce`；模板里用 `currency` 管道，TS 里用 `toLocaleString('en-US', { style: 'currency', currency: 'USD' })`
- 错误只在 `touched || dirty` 后显示
- 提交按钮 `[disabled]="!canSubmit"`，`canSubmit = form.valid && lines.length > 0`
- `form.reset()` 会清掉 touched/dirty，所以重置后错误不会冒出来
- **追问准备**：
  - 购物车跨页面保留 → 抽到 `CartService`（`providedIn: 'root'`），再考虑 localStorage 或后端
  - 为什么 Reactive 而不是 Template-driven → 校验逻辑在 TS 里，好测、好复用
  - 重复提交 → 提交中禁用按钮，后端用幂等 key

## a11y（JD 点名，写的时候顺手做）
- 每个 input 有 `<label for>`
- 交互元素用 `<button type="button">`，不要用 `div (click)`
- 图标按钮加 `aria-label`，开关状态用 `aria-pressed`
- 错误用 `role="alert"`，加载/成功用 `role="status"`
