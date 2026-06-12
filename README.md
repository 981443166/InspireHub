# InspireHub — 灵感收集与管理平台

> 沉淀灵感，连接设计与开发。

为设计师和开发者打造的通用灵感收集工具。支持**链接** / **图片** / **代码** / **笔记**四种类型，提供标签、领域筛选和全文搜索。

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-brightgreen)
![JDK](https://img.shields.io/badge/JDK-25-orange)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.3-38bdf8)

---

## 功能

| 功能 | 说明 |
|:---|:---|
| 🔐 用户认证 | JWT 注册/登录，BCrypt 加密，数据隔离 |
| 📝 灵感 CRUD | 链接/图片/代码/笔记四种类型，卡片 + 列表双视图 |
| 🔍 筛选搜索 | 领域/类型/标签多条件 AND 组合 + 全文搜索 |
| 🏷️ 标签云 | 按使用频次降序，点击即筛选 |
| 📤 导入导出 | JSON 格式导入（去重合并）/ 导出下载 |
| 🖼️ 图片上传 | 拖拽上传 + 自动缩略图，10MB 限制 |
| ⚡ 快速预览 | 卡片点击弹窗，方向键 ← → 切换，Esc 关闭 |
| 🧩 Chrome 扩展 | 一键剪藏页面标题/URL 到 InspireHub |
| 🧪 测试 | 15 个集成测试 + 单元测试，BUILD SUCCESS |
| 🐳 Docker | 多阶段构建 + docker-compose 一键部署 |

---

## 技术栈

| 层级 | 技术 |
|:---|:---|
| **前端** | Vite 8 · React 19 · TypeScript 6 · Tailwind CSS 4 · shadcn/ui v4 · Zustand · TanStack Query · React Router · React Hook Form + Zod |
| **后端** | Spring Boot 4.0.6 · JDK 25 · MyBatis-Plus 3.5.16 · Spring Security 7 (Lambda DSL) · JJWT · Jackson 3 · Tomcat 11 |
| **数据库** | PostgreSQL 14+ (生产) / H2 (开发) · Redis 7 |
| **部署** | Docker · docker-compose · GitHub Actions CI |

---

## 快速启动

### 环境要求

- **JDK 25**（[Adoptium](https://adoptium.net/) 推荐）
- **Node.js 24+**
- **Maven 3.9+**
- **Redis 7+**（可选，H2 模式不需要）

### 1. 启动后端

```bash
cd backend
mvn spring-boot:run
# 启动在 http://localhost:8080
# 默认使用 H2 内嵌数据库（零配置）
# 切换到 PostgreSQL: mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
# 启动在 http://localhost:3000
# API 请求通过 Vite proxy 转发到 :8080
```

### 3. 访问

打开 `http://localhost:3000`，注册账号即可使用。

---

## Docker 部署

```bash
docker-compose up -d
# 前端: http://localhost:80
# 后端: http://localhost:8080
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

---

## API 速查

### 认证

| 方法 | 路径 | 说明 |
|:---|:---|:---|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录，返回 JWT |
| GET | `/api/user/profile` | 获取当前用户信息 |
| PUT | `/api/user/profile` | 更新昵称/密码 |
| DELETE | `/api/user/account` | 删除账号（需密码确认） |

### 灵感

| 方法 | 路径 | 说明 |
|:---|:---|:---|
| POST | `/api/inspirations` | 创建灵感 |
| GET | `/api/inspirations?page&size&type&domain&tags` | 分页 + 筛选列表 |
| GET | `/api/inspirations/search?q=keyword` | 全文搜索 |
| GET | `/api/inspirations/{id}` | 获取详情 |
| PUT | `/api/inspirations/{id}` | 更新灵感 |
| DELETE | `/api/inspirations/{id}` | 删除灵感 |

### 其他

| 方法 | 路径 | 说明 |
|:---|:---|:---|
| GET | `/api/tags` | 标签云（按频次降序） |
| POST | `/api/upload/image` | 图片上传（multipart） |
| GET | `/api/export` | 导出所有灵感为 JSON |
| POST | `/api/import` | 导入 JSON（去重合并） |

所有 API 需要 `Authorization: Bearer <token>` 头部（auth 端点除外）。

响应格式：`{ "code": 200, "message": "success", "data": {...} }`

---

## 项目结构

```
InspireHub/
├── backend/                   # Spring Boot 4
│   ├── src/main/java/com/inspirehub/
│   │   ├── config/            # Security + JWT + CORS + Redis + Async
│   │   ├── controller/        # Auth/User/Inspiration/Tag/Upload
│   │   ├── service/           # 业务逻辑 + FileStorage
│   │   ├── mapper/            # MyBatis-Plus Mapper
│   │   ├── entity/            # User, Inspiration
│   │   ├── dto/               # Request/Response DTO
│   │   └── common/            # Result, ErrorCode, Exception
│   └── Dockerfile
├── frontend/                  # Vite + React
│   ├── src/
│   │   ├── api/               # Axios client
│   │   ├── components/        # UI + forms + inspiration
│   │   ├── hooks/             # useAuth/useInspirations/useDebounce
│   │   ├── pages/             # Login/Register/Dashboard/Detail/Settings
│   │   └── stores/            # Zustand (auth/filter/theme)
│   ├── nginx.conf
│   └── Dockerfile
├── extension/                 # Chrome 扩展（剪藏插件）
├── docker-compose.yml
├── DEVELOPMENT_PLAN.md        # 开发任务规划
├── OPTIMIZATION_SCHEDULE.md   # 优化日程
└── README.md
```

---

## 文档

| 文件 | 说明 |
|:---|:---|
| `产品需求文档.md` | PRD 功能范围 |
| `产品技术文档.md` | Spring Boot 4 技术栈详细说明 |
| `DEVELOPMENT_PLAN.md` | 52 项开发任务 + 实际完成状态 |
| `OPTIMIZATION_SCHEDULE.md` | 五阶段优化日程 |
| `AGENTS.md` | AI 协作指南 |
