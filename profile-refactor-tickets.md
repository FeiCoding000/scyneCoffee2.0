# Profile Refactor Tickets

## 背景

当前业务目标是把 customer profile 的创建、查看、编辑、下单逻辑统一整理。

核心思路：

- 不再拆成 create page 和 edit page 两套完全独立页面。
- 使用同一个 `ProfilePage` 作为入口。
- 页面根据是否拿到 `customer` 实例决定当前是 create mode 还是 edit mode。
- Profile 页面内部组件化：
  - `CustomerProfile`：个人 profile 容器组件
  - `CustomerForm`：负责新建/编辑客户信息
  - `CoffeeOptionItem`：负责展示单个饮品 option，后续支持点击下单

---

## Ticket 1: 重构 ProfilePage 为 create/edit 共用入口

### 目标

`ProfilePage` 根据是否存在 `customerId` / customer 实例决定是新建还是编辑。

### 路由设计

```txt
/profile              新建 customer
/profile/:customerId  编辑已有 customer
```

### 任务

- 支持 `/profile` 和 `/profile/:customerId` 两种场景。
- 如果 URL 中有 `customerId`：
  - 优先从 Redux customer store 查找 customer。
  - 如果 store 没有，再尝试从 localStorage 的 selected customer 获取。
  - 必要时重新从 Firestore 拉取 customers。
- 如果没有 `customerId`：
  - 进入 create mode。
- 将 customer 作为 props 传给 `CustomerProfile`。

### 验收标准

- `/profile` 显示新建 customer 表单。
- `/profile/:customerId` 显示该 customer 的编辑/profile 页面。
- 不再需要单独维护一个 create page 和 edit page。

---

## Ticket 2: 创建 CustomerProfile 组件

### 目标

封装个人 profile 页面的整体展示逻辑。

### 建议路径

```txt
src/components/profile/CustomerProfile.tsx
```

### Props 设计

```ts
type CustomerProfileProps = {
  customer?: CustomerEntity | null;
};
```

### 任务

- 根据是否有 customer 判断模式：
  - 无 customer：create mode
  - 有 customer：edit mode
- create mode：
  - 只显示 `CustomerForm`
- edit mode：
  - 显示 customer 基本信息
  - 显示 saved options
  - 显示可编辑的 `CustomerForm`

### 验收标准

- 新建和编辑页面结构统一。
- `ProfilePage` 不再堆大量表单和展示逻辑。
- `CustomerProfile` 成为 profile 页面主要容器。

---

## Ticket 3: 抽离 CustomerForm 组件

### 目标

把新建/编辑 customer 的表单独立出来。

### 建议路径

```txt
src/components/profile/CustomerForm.tsx
```

### Props 设计

```ts
type CustomerFormProps = {
  customer?: CustomerEntity | null;
  onSaved?: (customer: CustomerEntity) => void;
};
```

### 表单字段

- firstName
- lastName
- options

### 行为

- 如果没有 customer：
  - submit 调用 `addCustomer`
- 如果有 customer：
  - submit 调用 `updateCustomer`
- 初始值：

```ts
const [firstName, setFirstName] = useState(customer?.firstName ?? "");
const [lastName, setLastName] = useState(customer?.lastName ?? "");
const [options, setOptions] = useState(customer?.options ?? []);
```

### 验收标准

- 新建 customer 正常保存。
- 编辑 customer 时表单默认填入已有资料。
- 保存后刷新 customer store。
- 保存后同步 localStorage。

---

## Ticket 4: 增加 updateCustomer service

### 目标

支持修改已有 customer profile。

### 文件

```txt
src/services/customerService.ts
```

### 新增方法

```ts
updateCustomer(customerId: string, customer: CreateCustomerDto)
```

### 更新字段

- firstName
- lastName
- options
- updatedAt
- normalizedFullName

### 注意事项

重名校验需要排除自己。

例如：

- 当前 customer 是 `John Smith`
- 用户没改名字直接保存，不应该报重复
- 用户改成另一个已经存在的名字，应该报重复

### 验收标准

- 编辑后 Firestore 数据更新。
- Redux/localStorage 重新同步。
- 重名校验仍然有效。
- 重名校验排除当前 customer 自己。

---

## Ticket 5: 完善 CoffeeOptionItem 展示

### 目标

把 customer 的 drink option 美观完整展示出来。

### 文件

```txt
src/components/CoffeeOptionItem.tsx
```

### 需要展示的字段

- reference
- title
- milk
- strength，仅 coffee 显示
- teaBags，仅 tea 显示
- sugar
- sweetner
- iced
- extra hot
- decaf，仅 coffee 显示

### Props 建议

```ts
type CoffeeOptionItemProps = {
  option: CreateOrderItemDto;
  onClick?: () => void;
  editable?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};
```

### 展示规则

- coffee 不显示 teaBags。
- tea 不显示 strength。
- tea 不显示 decaf。
- other drinks 不显示 strength / teaBags / decaf。

### 验收标准

- option card 可以完整展示配置。
- 页面网格排布良好。
- 可点击时有 hover 效果。

---

## Ticket 6: Edit mode 下点击 option 直接下单

### 目标

老用户在自己的 profile 页面点击 saved option，直接加入 cart。

### 任务

在 `CustomerProfile` 中实现：

```ts
handleOrderOption(option)
```

将 customer option 转换为 `OrderItem`。

### 自动带入信息

- customer name
- drink title
- milk
- strength / teaBags
- sugar
- sweetner
- iced
- extra hot
- decaf
- quantity 默认 1

### 建议逻辑

```ts
addToCart(orderItem, `${customer.firstName} ${customer.lastName}`);
```

或者将 customerName 存入 cart context。

### 验收标准

- 点击 option card 后 cart 自动打开。
- cart 中已有对应饮品。
- customer name 自动填入。
- 用户可以直接 place order。

---

## Ticket 7: 客户搜索使用真实数据库和本地持久化

### 目标

`ProfileOrderPage` 不再使用 mocked name list。

### 任务

- 页面加载时拉取 customers。
- customers 存入 Redux。
- Redux 同步 localStorage。
- 搜索时过滤真实 customer name。
- 点击 name 后：
  - 保存 selected customer 到 localStorage。
  - 跳转 `/profile/:customerId`。

### localStorage 建议 key

```ts
scyneCoffee.customers
scyneCoffee.selectedCustomer
```

### 验收标准

- 刷新页面后仍有 customer list。
- 搜索结果来自数据库。
- 点击用户进入 edit mode profile。
- selected customer 本地持久化成功。

---

## 建议今日完成顺序

优先完成：

1. Ticket 1: 重构 ProfilePage 为 create/edit 共用入口
2. Ticket 2: 创建 CustomerProfile 组件
3. Ticket 3: 抽离 CustomerForm 组件
4. Ticket 7: 客户搜索使用真实数据库和本地持久化

如果还有时间，再做：

5. Ticket 4: 增加 updateCustomer service
6. Ticket 5: 完善 CoffeeOptionItem 展示
7. Ticket 6: Edit mode 下点击 option 直接下单

---

## 最终目标体验

### 新用户

从 ProfileOrderPage 点击：

```txt
Can't find your name? Add your profile
```

进入：

```txt
/profile
```

页面显示：

```txt
Create Customer Form
```

保存后：

- 写入数据库
- 更新 Redux customer store
- 同步 localStorage
- 可以跳转到自己的 profile/edit 状态

---

### 老用户

在 ProfileOrderPage 搜索名字，点击名字后进入：

```txt
/profile/:customerId
```

页面显示：

- customer summary
- saved options
- edit profile form

点击 option card：

- 直接加入 cart
- 自动带 customer name
- 自动带 drink info
- 打开 cart modal
