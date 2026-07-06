# mynav

一个基于 Cloudflare Pages + D1 数据库构建的私人导航网站。

## 功能特性

- **网站导航**：分类展示常用网站，支持自定义链接
- **天气查询**：实时显示天气信息
- **搜索功能**：支持多搜索引擎快速搜索
- **股市指数**：展示股票指数，支持自定义添加股票
- **管理后台**：密码保护的后台管理，支持分类、链接、股票的 CRUD 操作

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6+)
- **后端**：Cloudflare Pages Functions / Worker
- **数据库**：Cloudflare D1 (SQLite)
- **本地开发**：Python 内置 HTTP 服务器

## 项目结构

```
mynav/
├── css/                 # 样式文件
│   ├── admin.css        # 管理后台样式
│   └── style.css        # 主页样式
├── functions/           # Cloudflare Pages Functions
│   └── api/nav.js       # API 接口
├── js/                  # JavaScript 文件
│   ├── admin.js         # 管理后台脚本
│   └── main.js          # 主页脚本
├── admin.html           # 管理后台页面
├── index.html           # 主页
├── init-db.py           # 数据库初始化脚本
├── nav.db               # SQLite 数据库文件（本地开发）
├── schema.sql           # 数据库表结构定义
├── server.py            # 本地开发服务器
├── wrangler.toml        # Cloudflare 配置文件
├── .gitignore           # Git 忽略文件
└── README.md            # 项目说明
```

## 本地开发

### 环境要求

- Python 3.x

### 启动开发服务器

```bash
# 初始化数据库（首次运行）
python init-db.py

# 启动本地服务器
python server.py
```

服务器将在 http://localhost:8080 运行。

### 访问地址

- **主页**：http://localhost:8080/index.html
- **管理后台**：http://localhost:8080/admin.html（默认密码：123456）

## Cloudflare 部署

### 环境要求

- Node.js 18+
- Wrangler CLI

### 部署步骤

```bash
# 安装依赖
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 初始化 D1 数据库
wrangler d1 create nav-db

# 更新 wrangler.toml 中的 database_id

# 部署到 Cloudflare Pages
wrangler pages deploy .
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/nav/list` | GET | 获取所有分类、链接和股票数据 |
| `/api/nav/link` | POST | 新增网站链接（需认证） |
| `/api/nav/link` | PUT | 修改网站链接（需认证） |
| `/api/nav/link?id=` | DELETE | 删除网站链接（需认证） |
| `/api/nav/category` | POST | 新增分类（需认证） |
| `/api/nav/category` | PUT | 修改分类（需认证） |
| `/api/nav/category?id=` | DELETE | 删除分类（需认证） |
| `/api/nav/stock` | POST | 新增股票（需认证） |
| `/api/nav/stock` | PUT | 修改股票（需认证） |
| `/api/nav/stock?id=` | DELETE | 删除股票（需认证） |
| `/api/nav/pwd` | POST | 修改管理密码（需认证） |

### 认证方式

在请求头中添加 `Authorization: Bearer <密码>`。

## 数据库结构

### nav_category（分类表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| name | TEXT | 分类名称 |
| sort | INTEGER | 排序序号 |

### nav_link（链接表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| category_id | INTEGER | 所属分类 ID |
| title | TEXT | 网站名称 |
| url | TEXT | 网站地址 |
| icon | TEXT | 图标（SVG） |
| desc | TEXT | 描述 |
| sort | INTEGER | 排序序号 |

### nav_stock（股票表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| code | TEXT | 股票代码 |
| name | TEXT | 股票名称 |
| sort | INTEGER | 排序序号 |

### nav_config（配置表）

| 字段 | 类型 | 说明 |
|------|------|------|
| key | TEXT | 配置键 |
| value | TEXT | 配置值 |

## 许可证

MIT License