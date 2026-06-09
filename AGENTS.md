# InspireHub — 灵感收集与管理工具

> 沉淀灵感，连接设计与开发。通用灵感收集平台，支持链接/图片/代码/文本笔记四种类型。

## Project

- **定位**：设计师与开发者的灵感收藏工具，前后端分离 SPA
- **前端**：Vite 5 + React 18 + TypeScript 5.3，Tailwind CSS 3.4 + shadcn/ui，Zustand + TanStack Query + React Router DOM 6.20
- **后端**：Spring Boot 4.0.6 + JDK 25 + MyBatis-Plus 3.5.15（`mybatis-plus-spring-boot4-starter`）+ Spring Security 7 + PostgreSQL 14 + Redis 7
- **入口**：后端 `com.inspirehub.InspireHubApplication`，前端 `src/main.tsx`

## Commands

> 以下为计划命令，项目初始化后确认。

```bash
# 后端
cd backend
mvn spring-boot:run          # 启动（http://localhost:8080）
mvn test                      # 运行测试
mvn clean package             # 构建 jar

# 前端
cd frontend
npm install                   # 安装依赖
npm run dev                   # 启动开发服务器
npm run build                 # 生产构建
npm run lint                  # ESLint
npm test                      # Vitest
```

## Architecture

```
InspireHub/
├── backend/                   # Spring Boot 4 后端
│   └── com.inspirehub
│       ├── config/            # SecurityConfig（Lambda DSL）、CORS、MyBatis、Redis、Async、Knife4j
│       ├── controller/        # AuthController, InspirationController, TagController, UploadController
│       ├── service/impl/      # 业务逻辑，强制按 user_id 隔离数据
│       ├── service/fileStorage/ # FileStorageService 接口 + Local/OSS 实现
│       ├── mapper/            # MyBatis-Plus BaseMapper
│       ├── entity/            # User, Inspiration（含 PostgreSQL TEXT[] 数组字段）
│       ├── dto/               # MapStruct Entity ↔ DTO
│       └── common/            # Result<T>, 全局异常处理器
├── frontend/                  # Vite + React SPA
│   └── src/
│       ├── api/               # Axios 实例 + API 函数
│       ├── components/ui/     # shadcn/ui 组件
│       ├── components/forms/  # RHF + Zod 表单
│       ├── components/inspiration/ # 卡片、详情渲染器
│       ├── hooks/             # useAuth, useInspirations, useDebounce
│       ├── lib/               # cn() 样式合并
│       ├── pages/             # Login, Register, Dashboard, InspirationDetail, Settings
│       ├── stores/            # Zustand: auth, filter, theme
│       └── types/             # TS 类型定义
├── AGENTS.md
├── DEVELOPMENT_PLAN.md        # 52 项任务，10 阶段
├── 产品需求文档.md
└── 产品技术文档.md
```

**数据模型**：`users` (id, username, email, password_hash) → `inspirations` (id, user_id FK, title, type, content, domain TEXT[], tags TEXT[], notes, language, source_url, created_at, updated_at)。每用户数据隔离，Service 层通过 SecurityContextHolder 获取 user_id 强制过滤。

**API 认证**：JWT（7 天），Header `Authorization: Bearer <token>`。放行 `/api/auth/**`，其余需认证。响应格式 `{ code, message, data }`。

## Conventions

### Spring Security 7（关键）

- **必须使用 Lambda DSL**——`and()` / `authorizeRequests` / `AntPathRequestMatcher` 已移除
- `SecurityFilterChain` 仅用 `authorizeHttpRequests` + `PathPatternRequestMatcher`
- CSRF 用 `csrf.spa()`（SB 4 新增）
- 示例见 `产品技术文档.md` §3.5

### 后端

- 严格按 user_id 隔离数据：Service 层从 `SecurityContextHolder` 取当前用户，拼入查询条件
- JSON 序列化用 **Jackson 3**（`tools.jackson`，非 `com.fasterxml`）
- 测试用 `@MockitoBean` / `@MockitoSpyBean`（`@MockBean` / `@SpyBean` 在 SB 4 已移除）
- 内嵌容器仅 **Tomcat 11**（Undertow 在 SB 4 已移除）
- 上传图片校验类型 + 限制 10MB，thumbnailator 生成缩略图
- 全文搜索用 PostgreSQL `tsvector` + GIN 索引，MVp 阶段限制 5000 条/用户

### 前端

- 默认深色主题（`#1A1B26` 背景，`#2A2B36` 卡片，`#7AA2F7` 主色）
- 搜索框输入 300ms 防抖
- 表单用 React Hook Form + Zod schema 校验
- API 调用用 TanStack Query（`useQuery` / `useInfiniteQuery`），Axios 实例统一拦截器
- 移动端 375px 可用，侧边栏折叠为底部 Sheet

### 通用

- 用户只能操作自己的数据
- 灵感 type 枚举：`link` | `image` | `code` | `note`
- 领域 domain 枚举：`design` | `dev` | `product`（PostgreSQL TEXT[]）
- 标签 AND 逻辑筛选，用 PostgreSQL `@>` 数组操作符

## Notes

- MVP 14 天 52 项任务，详细计划在 `DEVELOPMENT_PLAN.md`
- 升级项（🔧）：Redis 缓存、限流、PWA、虚拟滚动、OSS 存储
- 需求文档在 `产品需求文档.md`，技术栈在 `产品技术文档.md`
- 
