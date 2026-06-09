# InspireHub 开发任务规划

> 基于 `产品需求文档.md`（功能范围）和 `产品技术文档.md`（Spring Boot 4 技术选型）
> MVP 预计 **14 天**（单人），总任务数 **52 项**

---

## 总览

| 阶段 | 天数 | 内容 | 任务数 |
| :--- | :--- | :--- | :--- |
| **P1** | 1-2 | 项目初始化 + 基础设施 | 6 |
| **P2** | 2-3 | 后端：认证与用户 | 7 |
| **P3** | 3-5 | 后端：灵感 CRUD | 8 |
| **P4** | 5-7 | 后端：筛选搜索 + 标签云 + 导入导出 + 图片上传 | 9 |
| **P5** | 7-8 | 前端：脚手架 + 布局 | 5 |
| **P6** | 8-9 | 前端：认证页面 | 4 |
| **P7** | 9-11 | 前端：灵感功能 | 8 |
| **P8** | 11-13 | 前端：筛选搜索 + 导入导出 + 移动端适配 | 9 |
| **P9** | 13-14 | 联调 + 测试 + Bug 修复 | 7 |
| **P10** | 14+ | 部署 + CI/CD + 文档 | 5 |

---

## P1：项目初始化与基础设施（1-2 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P1-1 | 后端项目脚手架 | **Spring Boot 4.0.6** + **JDK 25** + Maven 3.9+，配置 pom.xml：`mybatis-plus-spring-boot4-starter` 3.5.15+、PostgreSQL Driver 42.7、Spring Security 7.0、JJWT 0.12.3、MapStruct 1.5.5、Hutool 5.8、Knife4j 4.3、thumbnailator、**Jackson 3**（tools.jackson，SB 4 默认）、内嵌 **Tomcat 11**（⚠️ 不使用 Undertow，SB 4 已移除） | ⬜ 待开始 |
| P1-2 | 数据库设计与建表 | PostgreSQL 14+：`users` 表 + `inspirations` 表（含数组类型 domain/tags），按 PRD §6 字段；`inspirations` 表添加 `tsv` 列（tsvector 类型）用于全文搜索 | ⬜ 待开始 |
| P1-3 | 后端基础配置 | `application.yml`（数据源、Redis、JWT 7 天、文件上传 10MB、存储类型）；CORS 配置；MyBatis-Plus 分页插件；Knife4j 文档；⚠️ SB 4 配置属性可能重命名（引入 `spring-boot-properties-migrator` 检测） | ⬜ 待开始 |
| P1-4 | 后端统一响应结构 | `Result<T>` 类：`{ code, message, data }`，全局异常处理器 `@RestControllerAdvice` | ⬜ 待开始 |
| P1-5 | 前端脚手架 | `npm create vite@latest`（React 18 + TypeScript 5.3），安装 Tailwind CSS 3.4、shadcn/ui 初始化、Axios、React Router DOM 6.20、Zustand 4.4、TanStack Query 5.12、React Hook Form 7.48 + Zod 3.22 | ⬜ 待开始 |
| P1-6 | 前端基础布局 | 顶部栏 + 左侧边栏 + 主区域 + 右下角悬浮按钮（按 PRD §8 布局），深色主题默认（`#1A1B26`），Tailwind 配置主题色 `#7AA2F7` | ⬜ 待开始 |

---

## P2：后端认证与用户模块（1-2 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P2-1 | MyBatis-Plus 代码生成 | 用 `mybatis-plus-generator` 3.5.15+ 生成 User Entity/Mapper/Service/Controller 骨架 | ⬜ 待开始 |
| P2-2 | User 实体 + Mapper | Entity 与 PRD §6.1 一致，Mapper 继承 `BaseMapper<User>` | ⬜ 待开始 |
| P2-3 | 注册 API `POST /api/auth/register` | 校验 username/email 唯一、密码 6-20 位，BCrypt 加密存储 | ⬜ 待开始 |
| P2-4 | 登录 API `POST /api/auth/login` | 邮箱+密码 → JWT（7 天过期），返回 `{ token, user }` | ⬜ 待开始 |
| P2-5 | Spring Security 7 + JWT Filter | ⚠️ **必须使用 Lambda DSL**（`and()` / `authorizeRequests` / `AntPathRequestMatcher` 已移除）；`SecurityFilterChain` 仅用 `authorizeHttpRequests` + `PathPatternRequestMatcher`；CSRF 使用 `csrf.spa()`（SB 4 新增 SPA CSRF）；`JwtAuthenticationFilter` 从 Header 提取 token 验证；放行 `/api/auth/**`，其余需认证 | ⬜ 待开始 |
| P2-6 | 用户资料 API | `GET /api/user/profile` 获取当前用户信息，`PUT /api/user/profile` 更新昵称、修改密码 | ⬜ 待开始 |
| P2-7 | 用户数据隔离 | Service 层通过 `SecurityContextHolder` 获取当前 user_id，强制过滤（PRD §4.3） | ⬜ 待开始 |

---

## P3：后端灵感 CRUD（2-3 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P3-1 | MyBatis-Plus 代码生成 | 生成 Inspiration Entity/Mapper/Service/Controller 骨架 | ⬜ 待开始 |
| P3-2 | Inspiration 实体 + Mapper + DTO | 字段与 PRD §6.2 一致，MapStruct 创建 DTO（`InspirationCreateDTO`、`InspirationUpdateDTO`、`InspirationVO`）；⚠️ MapStruct 需确认 Jackson 3 兼容性 | ⬜ 待开始 |
| P3-3 | 创建灵感 `POST /api/inspirations` | 校验标题必填 ≤200 字符、类型必填为 link/image/code/note、domain 为数组子集，自动绑定 user_id | ⬜ 待开始 |
| P3-4 | 分页列表 `GET /api/inspirations` | MyBatis-Plus `Page` + Lambda 查询，默认 20/页，按 created_at 倒序，支持 `page`、`size`、`sort` 参数 | ⬜ 待开始 |
| P3-5 | 单条详情 `GET /api/inspirations/{id}` | 校验归属权（user_id），返回完整字段 | ⬜ 待开始 |
| P3-6 | 更新灵感 `PUT /api/inspirations/{id}` | 校验归属权，部分字段可更新，自动刷新 `updated_at` | ⬜ 待开始 |
| P3-7 | 删除灵感 `DELETE /api/inspirations/{id}` | 校验归属权，物理删除（MVP） | ⬜ 待开始 |
| P3-8 | 自定义校验注解 | `@ValidDomain` 校验 domain 值在 design/dev/product 内，`@ValidType` 校验 type 枚举 | ⬜ 待开始 |

---

## P4：后端筛选搜索 + 标签 + 导入导出 + 图片上传（2-3 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P4-1 | 多条件筛选 | `GET /api/inspirations` 支持 `type`、`domain`、`tags` 参数组合筛选（tags AND 逻辑），使用 PostgreSQL 数组操作符 `@>` | ⬜ 待开始 |
| P4-2 | 全文搜索 `GET /api/inspirations/search` | 基于 PostgreSQL `tsvector` / `tsquery`，检索 title + notes + content，利用 P1-2 创建的 `tsv` 列和 GIN 索引加速 | ⬜ 待开始 |
| P4-3 | 标签云 `GET /api/tags` | 聚合当前用户所有 tags，按使用频次降序返回 `[{ name, count }]` | ⬜ 待开始 |
| P4-4 | 图片上传 `POST /api/upload/image` | Multipart 接收，校验类型（仅 image/jpeg,image/png,image/webp,image/gif），限制 ≤10MB，thumbnailator 生成缩略图，返回 URL | ⬜ 待开始 |
| P4-5 | FileStorageService 接口 | 定义 `upload(File, path)` / `getUrl(path)` / `delete(path)`，提供 LocalFileStorage 实现（本地文件系统），预留 OSS 实现接口（技术栈 §3.4） | ⬜ 待开始 |
| P4-6 | 导出 `GET /api/export` | 导出当前用户所有灵感为 JSON，支持 `ids` 参数筛选导出 | ⬜ 待开始 |
| P4-7 | 导入 `POST /api/import` | 接收 JSON 数组，校验字段合并导入（跳过重复 title） | ⬜ 待开始 |
| P4-8 | 🔧 Redis 缓存（升级项） | `@Cacheable` 缓存标签云结果，灵感列表缓存（按需），配置 RedisConfig + Spring Cache | ⬜ 待开始 |
| P4-9 | 🔧 限流（升级项） | Bucket4j 或 Resilience4j 限制上传/导入接口 QPS | ⬜ 待开始 |

---

## P5：前端脚手架与布局（1 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P5-1 | 路由配置 | React Router：`/login`、`/register`、`/`（仪表盘）、`/inspirations/:id`（详情）、`/settings` | ⬜ 待开始 |
| P5-2 | Axios 实例 + 拦截器 | 请求拦截：自动附加 `Authorization: Bearer <token>`；响应拦截：401 → 清除 token 跳登录页 | ⬜ 待开始 |
| P5-3 | Zustand Store | `useAuthStore`（token/user/login/logout）、`useFilterStore`（type/domain/tags/search 筛选条件）、`useThemeStore`（深色/浅色） | ⬜ 待开始 |
| P5-4 | 布局组件 | `AppLayout`：顶部栏（Logo + 搜索框 + 添加按钮 + 用户头像下拉菜单）、左侧边栏（可折叠）、右侧主内容区 `Outlet` | ⬜ 待开始 |
| P5-5 | shadcn/ui 初始化组件 | 引入 Button、Input、Dialog/Drawer、Card、DropdownMenu、Select、Badge、Toast 等 | ⬜ 待开始 |

---

## P6：前端认证页面（1 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P6-1 | 登录页 | React Hook Form + Zod 校验 email/password，调用 `POST /api/auth/login`，成功后存 token + 跳转 | ⬜ 待开始 |
| P6-2 | 注册页 | RHF + Zod 校验 username(2-50)/email/password(6-20)/confirmPassword，调用 `/api/auth/register` | ⬜ 待开始 |
| P6-3 | 路由守卫 | `ProtectedRoute` 组件：无 token → 重定向 `/login`；有 token → 渲染子路由 | ⬜ 待开始 |
| P6-4 | TanStack Query 封装 | `useLogin`、`useRegister`、`useProfile` hooks，自动管理 loading/error 状态 | ⬜ 待开始 |

---

## P7：前端灵感功能（2-3 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P7-1 | 添加灵感 Drawer/Modal | 侧滑抽屉表单：标题、类型（4 个 tab）、内容（按类型切换：URL 输入/图片上传+拖拽/代码编辑器/富文本）、领域 checkbox、标签输入（自动补全）、备注 Markdown、来源 URL | ⬜ 待开始 |
| P7-2 | 图片上传组件 | `react-dropzone` 拖拽上传 + `react-easy-crop` 裁剪，预览缩略图，调用 `POST /api/upload/image` | ⬜ 待开始 |
| P7-3 | 代码编辑器组件 | `prism-react-renderer` 实现语法高亮 + 行号 + 一键复制 | ⬜ 待开始 |
| P7-4 | 灵感卡片组件 | 深色卡片（`#2A2B36`），类型图标、标题、领域标签 Badge、内容预览（图片缩略图/代码前 2 行/文本前 100 字），悬停上浮+阴影 | ⬜ 待开始 |
| P7-5 | 灵感网格列表 | `GET /api/inspirations` + TanStack Query `useInfiniteQuery`，响应式网格（最小 280px 列宽），无限滚动加载更多 | ⬜ 待开始 |
| P7-6 | 列表视图切换 | 卡片/列表视图 toggle | ⬜ 待开始 |
| P7-7 | 灵感详情页 | `/inspirations/:id`，按类型渲染：链接 iframe 预览、图片灯箱（`yet-another-react-lightbox`）、代码高亮+复制、Markdown 渲染（`react-markdown`），显示完整元信息 | ⬜ 待开始 |
| P7-8 | 编辑与删除 | 编辑：预填充表单 Drawer → `PUT`；删除：确认 Dialog + Toast + 5 秒撤销（可选） | ⬜ 待开始 |

---

## P8：前端筛选搜索 + 导入导出 + 移动端适配（2 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P8-1 | 领域/类型快速筛选 | 侧边栏按钮组，点击切换，多选，联动 TanStack Query 重新请求 | ⬜ 待开始 |
| P8-2 | 标签云组件 | `GET /api/tags` → 渲染标签列表（按频次排序），点击即筛选（AND 逻辑），高亮选中态 | ⬜ 待开始 |
| P8-3 | 全文搜索框 | 顶部栏搜索框，`useDebounce`(300ms) → 调用 `GET /api/inspirations/search` → 渲染结果（关键词高亮） | ⬜ 待开始 |
| P8-4 | 搜索/筛选组合 | 筛选条件 + 搜索词 AND 组合查询 | ⬜ 待开始 |
| P8-5 | 导出功能 | 顶部菜单"导出为 JSON"，调用 `GET /api/export` → 触发浏览器下载 | ⬜ 待开始 |
| P8-6 | 导入功能 | 拖拽 JSON 文件（`react-dropzone`）或选择文件 → `POST /api/import` → Toast 提示结果数量 | ⬜ 待开始 |
| P8-7 | 移动端响应式 | 侧边栏变为底部 Sheet/Drawer，卡片单列布局，375px 可用，适配核心操作 | ⬜ 待开始 |
| P8-8 | 🔧 PWA（升级项） | `vite-plugin-pwa` 配置 Service Worker，生成 manifest，支持离线访问 | ⬜ 待开始 |
| P8-9 | 🔧 虚拟滚动（升级项） | 数据 >500 条时卡片列表改用 `react-window` | ⬜ 待开始 |

---

## P9：联调 + 测试 + Bug 修复（2 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P9-1 | 前后端联调 | 逐个接口验证，修复字段不匹配、类型错误；⚠️ 注意 Jackson 3 序列化差异 | ⬜ 待开始 |
| P9-2 | 后端单元测试 | JUnit 5 + Mockito + **`@MockitoBean`**（⚠️ SB 4 已移除 `@MockBean`/`@SpyBean`），覆盖 Service 层核心逻辑（CRUD、筛选、搜索） | ⬜ 待开始 |
| P9-3 | 后端集成测试 | @SpringBootTest + Testcontainers 启动 PostgreSQL + Redis 容器，测试完整 API 链路 | ⬜ 待开始 |
| P9-4 | 前端关键路径测试 | Vitest + React Testing Library 验证登录、添加灵感流程 | ⬜ 待开始 |
| P9-5 | 跨浏览器验证 | Chrome、Firefox、Safari 最新版基础样式检查 | ⬜ 待开始 |
| P9-6 | 安全验证 | 未授权 API 返回 401、跨用户数据不可见、图片上传类型校验、XSS 基础防护；⚠️ Spring Security 7 Lambda DSL 配置正确性 | ⬜ 待开始 |
| P9-7 | 性能检查 | 列表查询 <500ms、搜索 <800ms、首屏加载 <2s | ⬜ 待开始 |

---

## P10：部署 + CI/CD + 文档（1-2 天）

| # | 任务 | 详情 | 状态 |
| :--- | :--- | :--- | :--- |
| P10-1 | Dockerfile | 后端：多阶段构建（Maven + **JDK 25** → JRE 25）；前端：Nginx 静态资源 + API 反向代理 | ⬜ 待开始 |
| P10-2 | docker-compose.yml | PostgreSQL 14 + Redis 7 + 后端 + 前端，环境变量管理；⚠️ Docker Compose V2 格式（无需 `version` 字段） | ⬜ 待开始 |
| P10-3 | GitHub Actions CI | `push main` → JDK 25 + 跑后端测试（Maven） + 前端测试（npm） → 构建 → 可选自动部署 | ⬜ 待开始 |
| P10-4 | API 文档 | Knife4j（Swagger UI 增强版），所有接口带描述 + 示例 | ⬜ 待开始 |
| P10-5 | README + AGENTS.md | 项目说明、本地启动步骤（JDK 25）、环境要求 | ⬜ 待开始 |

---

## Spring Boot 4 关键注意事项

| # | 注意点 | 影响范围 |
| :--- | :--- | :--- |
| 1 | **MyBatis-Plus Starter** 必须用 `mybatis-plus-spring-boot4-starter` 3.5.15+ | P1-1 |
| 2 | **Spring Security 7** — 强制 Lambda DSL，无 `and()` / `authorizeRequests` / `AntPathRequestMatcher` | P2-5 |
| 3 | **Jackson 3** — `com.fasterxml` → `tools.jackson`，与 MapStruct/Hutool 等确认兼容 | P1-1、P3-2、P9-1 |
| 4 | **Undertow 已移除** — 内嵌容器仅支持 Tomcat 11 | P1-1 |
| 5 | **@MockBean / @SpyBean 已移除** — 替换为 `@MockitoBean` / `@MockitoSpyBean` | P9-2 |
| 6 | **嵌入式启动脚本已移除** — 用 `java -jar` 运行 | P10-1 |
| 7 | **SB 4 模块化** — 检查所有 starter 依赖是否完整（如 Flyway 需显式引入） | P1-1 |
| 8 | **配置属性迁移** — 引入 `spring-boot-properties-migrator` 检测重命名 | P1-3 |

---

## 优先级说明

| 标记 | 含义 |
| :--- | :--- |
| 无标记 | MVP 必须完成 |
| 🔧 | 升级项：MVP 后可迭代（Redis 缓存、限流、PWA、虚拟滚动等） |

---

## 验收标准（来自 PRD §10）

- [ ] 用户可以注册/登录，且不同用户的数据相互隔离
- [ ] 用户可以添加四种类型的灵感，并能上传本地图片
- [ ] 灵感列表正确展示，支持分页
- [ ] 按领域、类型、标签筛选功能正常，多条件组合正确
- [ ] 全文搜索能命中标题/备注/代码内容
- [ ] 用户能编辑、删除自己的灵感
- [ ] 导出为 JSON，导入后数据完整
- [ ] 所有 API 均有 JWT 保护，未授权访问返回 401
- [ ] 前端页面在 Chrome、Firefox、Safari 最新版无明显样式错乱
- [ ] 手机端（宽度 375px）可正常浏览和添加灵感
