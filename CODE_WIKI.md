# mynav 项目 Code Wiki

## 1. 项目概述

mynav 是一个基于 **Cloudflare Pages + D1 数据库** 构建的个人导航网站，采用现代化的**玻璃拟态设计风格**。项目提供天气展示、多引擎搜索、股票指数和站点管理等核心功能。

### 1.1 核心特性

| 功能 | 说明 |
|------|------|
| 天气卡片 | 实时显示天气信息、温度、降水概率 |
| 多引擎搜索 | 支持百度、Google、Bing、B站、GitHub 等搜索引擎切换 |
| 导航链接 | 分类展示常用网站链接，支持自定义添加 |
| 股票指数 | 实时显示股票行情，支持添加自定义股票 |
| 管理后台 | 密码保护的后台管理，支持分类、链接、股票的 CRUD 操作 |
| 玻璃拟态设计 | 现代化渐变玻璃拟态 UI 风格，支持暗色模式 |

### 1.2 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | HTML5 + CSS3 + JavaScript (原生) |
| 后端 | Cloudflare Pages Functions |
| 数据库 | Cloudflare D1 (SQLite 兼容) |
| 本地开发 | Python 3.8+ 内置 HTTP 服务器 |
| 部署 | Cloudflare Pages + Wrangler CLI |

---

## 2. 项目架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端浏览器                           │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │   index.html    │    │         admin.html           │   │
│  │   (主页)        │    │     (管理后台)               │   │
│  └────────┬────────┘    └────────────┬─────────────────┘   │
│           │                          │                     │
│           ▼                          ▼                     │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │    js/main.js   │    │         js/admin.js          │   │
│  │   (主页逻辑)    │    │     (管理后台逻辑)           │   │
│  └────────┬────────┘    └────────────┬─────────────────┘   │
└───────────┼──────────────────────────┼─────────────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare Pages                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         functions/api/nav.js                         │   │
│  │   (REST API - 分类/链接/股票/配置的 CRUD)             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Cloudflare D1 Database                   │   │
│  │   (SQLite 兼容 - nav_category/nav_link/nav_stock)     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 项目目录结构

```
mynav/
├── css/                          # 样式文件
│   ├── common.css                # 公共样式和 CSS 变量定义
│   ├── style.css                 # 主页专属样式
│   └── admin.css                 # 管理后台专属样式
├── js/                           # JavaScript 文件
│   ├── main.js                   # 主页逻辑（导航渲染、搜索、天气、股票）
│   └── admin.js                  # 管理后台逻辑（CRUD 操作）
├── functions/                    # Cloudflare Pages Functions
│   └── api/
│       └── nav.js                # REST API 接口（生产环境）
├── index.html                    # 主页 HTML
├── admin.html                    # 管理后台 HTML
├── schema.sql                    # 数据库初始化脚本
├── init-db.py                    # 本地数据库初始化工具
├── server.py                     # 本地开发服务器（模拟 Cloudflare Functions）
├── wrangler.toml                 # Cloudflare Wrangler 配置文件
└── README.md                     # 项目说明文档
```

---

## 3. 核心模块详解

### 3.1 前端模块

#### 3.1.1 主页 (`index.html`)

主页是用户访问的主要入口，包含以下核心区域：

| 区域 | 功能 | DOM 元素 |
|------|------|----------|
| 天气卡片 | 显示实时天气信息 | `#weatherCard` |
| 搜索框 | 多引擎搜索功能 | `.search-container` |
| 导航链接 | 分类展示网站链接 | `#nav-container` |
| 股票指数 | 显示股市行情 | `#stockBox` |

**关键 HTML 结构**：

- 天气卡片：包含城市、日期、温度、天气描述、最高/最低温度、降水概率
- 搜索框：包含搜索引擎选择器、输入框、搜索按钮
- 导航容器：动态渲染分类和链接
- 股票盒子：动态渲染股票列表

#### 3.1.2 管理后台 (`admin.html`)

管理后台提供密码保护的 CRUD 操作界面：

| 区域 | 功能 |
|------|------|
| 登录框 | 密码验证进入管理后台 |
| 新增站点 | 添加新的导航链接 |
| 新增分类 | 添加链接分类 |
| 新增股票 | 添加股票指数 |
| 分类列表 | 展示和管理分类（编辑/删除） |
| 站点列表 | 展示和管理站点（编辑/删除） |
| 股票列表 | 展示和管理股票（编辑/删除） |
| 修改密码 | 修改管理员密码 |

### 3.2 JavaScript 模块

#### 3.2.1 主页逻辑 (`js/main.js`)

**全局变量**：

| 变量 | 类型 | 用途 |
|------|------|------|
| `currentEngineUrl` | String | 当前选中的搜索引擎 URL |
| `allLinks` | Array | 所有导航链接数据 |
| `categories` | Array | 所有分类数据 |
| `stocks` | Array | 所有股票数据 |

**核心函数**：

| 函数 | 功能 | 参数 | 返回值 |
|------|------|------|--------|
| `loadNavData()` | 加载导航数据 | 无 | Promise |
| `renderNav(filterLinks)` | 渲染导航链接 | `filterLinks`: 过滤后的链接数组 | 无 |
| `renderStocks()` | 渲染股票列表 | 无 | 无 |
| `fetchWeather()` | 获取天气数据 | 无 | Promise |
| `getWeatherIcon(code)` | 根据天气代码返回 emoji 图标 | `code`: 天气代码 | String (emoji) |
| `fetchStockData()` | 获取股票实时数据 | 无 | 无 |
| `toggleDropdown()` | 切换搜索引擎下拉菜单 | 无 | 无 |
| `selectEngine(element)` | 选择搜索引擎 | `element`: DOM 元素 | 无 |
| `performSearch()` | 执行搜索 | 无 | 无 |
| `handleKeyPress(event)` | 处理键盘事件 | `event`: 键盘事件 | 无 |
| `setBingBackground()` | 设置 Bing 随机背景图 | 无 | 无 |

**数据流向**：

```
DOMContentLoaded
    │
    ├── setBingBackground() → 设置背景图
    ├── fetchWeather() → 获取天气（wttr.in API）
    ├── loadNavData() → 获取导航数据（/api/nav/list）
    │       │
    │       ├── renderNav() → 渲染分类和链接
    │       ├── renderStocks() → 渲染股票列表框架
    │       └── fetchStockData() → 获取股票实时数据（腾讯 API）
    │
    └── setInterval(fetchStockData, 60000) → 每分钟刷新股票数据
```

**外部 API 依赖**：

| API | 用途 | URL |
|-----|------|-----|
| wttr.in | 获取天气数据 | `https://wttr.in/?format=j1&lang=zh` |
| 腾讯股票 API | 获取股票实时行情 | `https://qt.gtimg.cn/q={codes}` |
| Bing 随机壁纸 | 设置背景图 | `https://bing.img.run/rand.php` |

#### 3.2.2 管理后台逻辑 (`js/admin.js`)

**全局变量**：

| 变量 | 类型 | 用途 |
|------|------|------|
| `token` | String | 管理员密码（用于认证） |
| `categories` | Array | 分类数据缓存 |
| `links` | Array | 链接数据缓存 |
| `stocks` | Array | 股票数据缓存 |

**核心函数**：

| 函数 | 功能 | 参数 | 返回值 |
|------|------|------|--------|
| `apiRequest(path, method, body)` | 封装 API 请求 | `path`: 接口路径, `method`: HTTP 方法, `body`: 请求体 | Promise |
| `login()` | 管理员登录 | 无 | Promise |
| `loadAll()` | 加载所有数据 | 无 | Promise |
| `renderCatSelect()` | 渲染分类下拉选择器 | 无 | 无 |
| `renderCategories()` | 渲染分类列表 | 无 | 无 |
| `renderLinks()` | 渲染链接列表 | 无 | 无 |
| `renderStocks()` | 渲染股票列表 | 无 | 无 |
| `addLink()` | 添加链接 | 无 | Promise |
| `addCategory()` | 添加分类 | 无 | Promise |
| `addStock()` | 添加股票 | 无 | Promise |
| `delLink(id)` | 删除链接 | `id`: 链接 ID | Promise |
| `delCat(id)` | 删除分类（级联删除链接） | `id`: 分类 ID | Promise |
| `delStock(id)` | 删除股票 | `id`: 股票 ID | Promise |
| `editLink(id)` | 编辑链接（进入编辑模式） | `id`: 链接 ID | 无 |
| `saveLink(id)` | 保存链接修改 | `id`: 链接 ID | Promise |
| `editCat(id)` | 编辑分类（进入编辑模式） | `id`: 分类 ID | 无 |
| `saveCat(id)` | 保存分类修改 | `id`: 分类 ID | Promise |
| `editStock(id)` | 编辑股票（进入编辑模式） | `id`: 股票 ID | 无 |
| `saveStock(id)` | 保存股票修改 | `id`: 股票 ID | Promise |
| `changePwd()` | 修改管理员密码 | 无 | Promise |

**认证机制**：

```
1. 用户输入密码 → login()
2. 调用 POST /api/nav/login 验证密码
3. 验证成功后，token = 密码（明文存储）
4. 后续请求在 Header 中添加 Authorization: Bearer {token}
5. 后端验证 Authorization 是否匹配数据库中的 admin_pwd
```

> **安全注意**：当前实现中密码以明文形式存储在客户端和数据库中，生产环境建议使用加密存储。

### 3.3 后端模块

#### 3.3.1 Cloudflare Functions (`functions/api/nav.js`)

这是生产环境的 API 实现，运行在 Cloudflare Pages 上。

**函数签名**：

```javascript
export default async function onRequest(context)
```

**context 参数**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `request` | Request | HTTP 请求对象 |
| `env` | Object | 环境变量（包含 D1 数据库绑定） |

**认证函数**：

```javascript
const checkAuth = () => {
  const auth = request.headers.get("Authorization");
  if (!auth || auth !== `Bearer ${adminPwd}`) {
    return new Response(JSON.stringify({ code: 403, msg: "密码错误" }), { status: 403, headers });
  }
};
```

**API 接口列表**：

| 接口 | 方法 | 认证 | 功能 |
|------|------|------|------|
| `/api/nav/login` | POST | 否 | 验证管理员密码 |
| `/api/nav/list` | GET | 否 | 获取所有分类、链接、股票数据 |
| `/api/nav/link` | POST | 是 | 新增网站链接 |
| `/api/nav/link` | PUT | 是 | 修改网站链接 |
| `/api/nav/link?id=` | DELETE | 是 | 删除网站链接 |
| `/api/nav/category` | POST | 是 | 新增分类 |
| `/api/nav/category` | PUT | 是 | 修改分类 |
| `/api/nav/category?id=` | DELETE | 是 | 删除分类（级联删除链接） |
| `/api/nav/stock` | POST | 是 | 新增股票 |
| `/api/nav/stock` | PUT | 是 | 修改股票 |
| `/api/nav/stock?id=` | DELETE | 是 | 删除股票 |
| `/api/nav/pwd` | POST | 是 | 修改管理员密码 |

**响应格式**：

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": { ... }
}
```

| code 值 | 含义 |
|---------|------|
| 0 | 成功 |
| 403 | 认证失败（密码错误） |
| 404 | 接口不存在 |
| 500 | 服务器错误 |

#### 3.3.2 本地开发服务器 (`server.py`)

本地开发服务器使用 Python 内置的 `http.server` 模块，模拟 Cloudflare Functions 的行为。

**核心组件**：

| 组件 | 说明 |
|------|------|
| `get_db()` | 获取 SQLite 数据库连接 |
| `check_auth(auth_header)` | 验证 Authorization Header |
| `MyHandler` | HTTP 请求处理器类 |

**MyHandler 方法**：

| 方法 | 处理的请求类型 |
|------|---------------|
| `send_json_response(content, status)` | 发送 JSON 响应 |
| `do_GET()` | 处理 GET 请求 |
| `do_POST()` | 处理 POST 请求 |
| `do_PUT()` | 处理 PUT 请求 |
| `do_DELETE()` | 处理 DELETE 请求 |
| `do_OPTIONS()` | 处理 CORS 预检请求 |

**处理流程**：

```
请求到达
    │
    ├── 判断路径是否以 /api/ 开头
    │       │
    │       ├── GET 请求 → 处理 /api/nav/list
    │       ├── POST 请求 → 验证认证 → 处理对应接口
    │       ├── PUT 请求 → 验证认证 → 处理对应接口
    │       └── DELETE 请求 → 验证认证 → 处理对应接口
    │
    └── 其他路径 → 返回静态文件
```

---

## 4. 数据库设计

### 4.1 数据表结构

#### 4.1.1 nav_category（分类表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | 主键，自增 |
| `name` | TEXT | NOT NULL | 分类名称 |
| `sort` | INTEGER | DEFAULT 0 | 排序序号（数字越小越靠前） |

#### 4.1.2 nav_link（链接表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | 主键，自增 |
| `category_id` | INTEGER | FOREIGN KEY | 所属分类 ID |
| `title` | TEXT | NOT NULL | 网站名称 |
| `url` | TEXT | NOT NULL | 网站地址 |
| `icon` | TEXT | - | 图标（SVG 代码） |
| `desc` | TEXT | - | 描述/简介 |
| `sort` | INTEGER | DEFAULT 0 | 排序序号 |

#### 4.1.3 nav_stock（股票表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | 主键，自增 |
| `code` | TEXT | NOT NULL | 股票代码（如 sh000001） |
| `name` | TEXT | NOT NULL | 股票名称 |
| `sort` | INTEGER | DEFAULT 0 | 排序序号 |

#### 4.1.4 nav_config（配置表）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `key` | TEXT | PRIMARY KEY | 配置键 |
| `value` | TEXT | - | 配置值 |

**默认配置**：

| key | value | 说明 |
|-----|-------|------|
| `admin_pwd` | `123456` | 管理员密码 |

### 4.2 表关系图

```
nav_category          nav_link              nav_stock           nav_config
┌─────────┐          ┌─────────┐           ┌─────────┐         ┌─────────┐
│ id (PK) │◄─────────│category_id (FK)     │ id (PK) │         │ key (PK)│
│ name    │          │ id (PK) │           │ code    │         │ value   │
│ sort    │          │ title   │           │ name    │         └─────────┘
└─────────┘          │ url     │           │ sort    │
                     │ icon    │           └─────────┘
                     │ desc    │
                     │ sort    │
                     └─────────┘
```

---

## 5. 依赖关系

### 5.1 外部服务依赖

| 服务 | 用途 | 依赖方式 |
|------|------|----------|
| wttr.in | 天气数据获取 | HTTP GET 请求 |
| 腾讯股票 API | 股票实时行情 | JSONP 跨域请求 |
| Bing 壁纸 API | 背景图片 | 直接引用 URL |

### 5.2 本地开发依赖

| 工具 | 版本要求 | 用途 |
|------|----------|------|
| Python | 3.8+ | 本地开发服务器、数据库初始化 |
| Node.js | 18+ | Cloudflare Wrangler CLI |
| Wrangler CLI | latest | Cloudflare 部署工具 |

### 5.3 文件依赖关系

```
index.html
    ├── css/common.css
    ├── css/style.css
    └── js/main.js
            ├── /api/nav/list (数据加载)
            ├── wttr.in API (天气)
            └── 腾讯股票 API (股票行情)

admin.html
    ├── css/common.css
    ├── css/admin.css
    └── js/admin.js
            ├── /api/nav/login (登录)
            ├── /api/nav/list (数据加载)
            ├── /api/nav/link (CRUD)
            ├── /api/nav/category (CRUD)
            ├── /api/nav/stock (CRUD)
            └── /api/nav/pwd (修改密码)

server.py (本地)
    └── nav.db (SQLite 数据库)

functions/api/nav.js (生产)
    └── Cloudflare D1 Database
```

---

## 6. 项目运行方式

### 6.1 本地开发

**环境要求**：Python 3.8+

**步骤**：

```bash
# 1. 初始化数据库（首次运行）
python init-db.py

# 2. 启动本地服务器
python server.py
```

**访问地址**：

| 页面 | URL |
|------|-----|
| 主页 | http://localhost:8080/index.html |
| 管理后台 | http://localhost:8080/admin.html |

**默认密码**：`123456`

### 6.2 Cloudflare 部署

**环境要求**：Node.js 18+、Wrangler CLI

**步骤**：

```bash
# 1. 安装 Wrangler CLI
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 创建 D1 数据库
wrangler d1 create nav-db

# 4. 更新 wrangler.toml 中的 database_id
# 将 database_id 设置为上一步创建的数据库 ID

# 5. 部署到 Cloudflare Pages
wrangler pages deploy .
```

### 6.3 数据库初始化

**方式一**：使用 `init-db.py`（本地开发）

```bash
python init-db.py
```

**方式二**：使用 `schema.sql`（生产环境）

```bash
wrangler d1 execute nav-db --file=schema.sql
```

---

## 7. 关键设计模式与技术要点

### 7.1 玻璃拟态设计

项目采用现代化的玻璃拟态（Glassmorphism）设计风格：

```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.18);
```

**核心 CSS 属性**：

| 属性 | 作用 |
|------|------|
| `backdrop-filter: blur()` | 背景模糊效果 |
| `rgba()` 背景色 | 半透明背景 |
| `border` | 细边框增强层次感 |
| `box-shadow` | 阴影增强立体感 |

### 7.2 暗色模式支持

通过 CSS `@media (prefers-color-scheme: dark)` 实现暗色模式适配：

```css
@media (prefers-color-scheme: dark) {
    /* 暗色模式样式覆盖 */
}
```

### 7.3 响应式设计

项目支持移动端和桌面端自适应：

| 断点 | 宽度 | 适配策略 |
|------|------|----------|
| 移动端 | ≤ 600px | 单列布局、简化卡片 |
| 桌面端 | > 600px | 多列网格布局 |

### 7.4 数据同步策略

**导航数据**：页面加载时一次性获取，缓存到内存

**股票数据**：初始加载后，每分钟自动刷新一次

```javascript
setInterval(fetchStockData, 60000); // 每分钟刷新
```

**天气数据**：页面加载时获取一次，失败时可点击刷新

### 7.5 CORS 处理

本地服务器和 Cloudflare Functions 都配置了 CORS 支持：

```javascript
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
"Access-Control-Allow-Headers": "Content-Type,Authorization"
```

---

## 8. 安全注意事项

### 8.1 当前安全风险

| 风险点 | 描述 | 影响 |
|--------|------|------|
| 密码明文存储 | 密码以明文形式存储在数据库中 | 数据泄露风险 |
| 密码明文传输 | 认证使用 Bearer {密码} 方式 | 中间人攻击风险 |
| 无请求频率限制 | API 无防刷机制 | 可能被恶意请求 |
| 无 SQL 注入防护 | 本地服务器直接拼接 SQL | SQL 注入风险 |

### 8.2 建议改进措施

1. **密码加密存储**：使用 bcrypt 等算法加密密码
2. **使用 JWT Token**：登录成功后发放 Token，代替直接传输密码
3. **添加请求限流**：使用 Cloudflare 限流规则或代码实现
4. **参数化查询**：确保所有 SQL 查询使用参数化语句

---

## 9. 扩展建议

### 9.1 功能扩展

- [ ] 添加用户系统，支持多用户使用
- [ ] 增加书签导入/导出功能
- [ ] 添加链接点击统计
- [ ] 支持自定义主题颜色
- [ ] 添加 RSS 订阅功能
- [ ] 支持拖拽排序

### 9.2 性能优化

- [ ] 实现数据缓存策略
- [ ] 添加图片懒加载
- [ ] 压缩静态资源
- [ ] 实现 Service Worker 离线支持

### 9.3 安全加固

- [ ] 实现密码加密
- [ ] 添加 JWT 认证
- [ ] 实现 API 访问日志
- [ ] 添加操作审计功能

---

## 附录：股票代码格式

| 市场 | 前缀 | 示例 |
|------|------|------|
| 上海证券交易所 | `sh` | sh000001（上证指数） |
| 深圳证券交易所 | `sz` | sz399001（深证成指） |

**默认股票列表**：

| 代码 | 名称 |
|------|------|
| sh000001 | 上证指数 |
| sz399001 | 深证成指 |
| sz399006 | 创业板指 |
| sh000300 | 沪深300 |
| sh000016 | 上证50 |
| sh000688 | 科创50 |
