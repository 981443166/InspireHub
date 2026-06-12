# InspireHub 开发任务规划

> 基于 `产品需求文档.md`（功能范围）和 `产品技术文档.md`（Spring Boot 4 技术选型）
> 更新日期：2026-06-10 | 当前状态：**MVP 核心已完成，进入优化阶段**

---

## 总览

| 阶段 | 天数 | 内容 | 任务数 | 状态 |
|:---|:---|:---|:---|:---|
| **P1** | 1-2 | 项目初始化 + 基础设施 | 6 | ✅ 完成 |
| **P2** | 2-3 | 后端：认证与用户 | 7 | ✅ 完成 |
| **P3** | 3-5 | 后端：灵感 CRUD | 8 | ✅ 完成 |
| **P4** | 5-7 | 后端：筛选搜索 + 标签云 + 导入导出 + 图片上传 | 9 | ✅ 完成 (7/9, 🔧×2 延后) |
| **P5** | 7-8 | 前端：脚手架 + 布局 | 5 | ✅ 完成 |
| **P6** | 8-9 | 前端：认证页面 | 4 | ✅ 完成 |
| **P7** | 9-11 | 前端：灵感功能 | 8 | ✅ 完成 (6/8, 🔧×2 延后) |
| **P8** | 11-13 | 前端：筛选搜索 + 导入导出 + 移动端适配 | 9 | ✅ 完成 (7/9, 🔧×2 延后) |
| **F-08** | — | 个人设置（修改昵称/密码/删除账号） | 3 | ✅ 完成 |
| **P9** | 13-14 | 联调 + 测试 + Bug 修复 | 7 | 🔜 待开始 |
| **P10** | 14+ | 部署 + CI/CD + 文档 | 5 | 🔜 待开始 |

---

## 实际技术栈版本

> 启动时自动安装了最新稳定版，均向后兼容，比文档规划的版本更新

| 组件 | 文档规划 | 实际安装 |
|:---|:---|:---|
| React | 18.2 | **19.2** |
| TypeScript | 5.3 | **6.0** |
| Vite | 5.0 | **8.0** |
| Tailwind CSS | 3.4 | **4.3** |
| shadcn/ui | Radix-based | **base-ui v4** |
| Zod | 3.22 | **4.4** |
| Zustand | 4.4 | **5.0** |
| React Router DOM | 6.20 | **6.30** |

---

## P1：项目初始化与基础设施 ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P1-1 | 后端项目脚手架 — pom.xml + 主类 + 目录结构 | ✅ |
| P1-2 | 数据库设计与建表 SQL — schema.sql (PG) + schema-h2.sql (H2) | ✅ |
| P1-3 | 后端基础配置 — CorsConfig + MybatisPlusConfig + RedisConfig + AsyncConfig + JacksonConfig + WebMvcConfig + 4 yml | ✅ |
| P1-4 | 后端统一响应结构 — Result\<T\> + ErrorCode(15种) + BusinessException + GlobalExceptionHandler(6类) | ✅ |
| P1-5 | 前端脚手架 — Vite 8 + React 19 + TS 6 + Tailwind 4 + shadcn/ui 17组件 | ✅ |
| P1-6 | 前端基础布局 — AppLayout(顶部栏+侧边栏+主区域+悬浮按钮) + 深色主题 | ✅ |

---

## P2：后端认证与用户模块 ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P2-1 | User Entity + Mapper + DTO（手动编写，无需代码生成器） | ✅ |
| P2-2 | 注册 API `POST /api/auth/register` | ✅ |
| P2-3 | 登录 API `POST /api/auth/login` | ✅ |
| P2-4 | Spring Security 7 Lambda DSL + JwtAuthenticationFilter + JwtUtil(HS384) | ✅ |
| P2-5 | 用户资料 API `GET/PUT /api/user/profile` | ✅ |
| P2-6 | 删除账号 API `DELETE /api/user/account` | ✅ |
| P2-7 | 用户数据隔离 — SecurityContext.getPrincipal() → userId | ✅ |

---

## P3：后端灵感 CRUD ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P3-1 | Inspiration Entity + Mapper + DTO(InspirationCreateRequest/UpdateRequest/VO) | ✅ |
| P3-2 | 创建灵感 `POST /api/inspirations` + @ValidType/@ValidDomain | ✅ |
| P3-3 | 分页列表 `GET /api/inspirations`（手动 count+LIMIT/OFFSET） | ✅ |
| P3-4 | 单条详情 `GET /api/inspirations/{id}` + 归属权校验 | ✅ |
| P3-5 | 更新灵感 `PUT /api/inspirations/{id}` | ✅ |
| P3-6 | 删除灵感 `DELETE /api/inspirations/{id}` | ✅ |
| P3-7 | 全文搜索 `GET /api/inspirations/search?q=xxx` | ✅ |
| P3-8 | 自定义校验注解 @ValidType + @ValidDomain | ✅ |

---

## P4：后端筛选搜索 + 标签云 + 导入导出 + 图片上传 ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P4-1 | 多条件筛选 — type/domain/tags 组合（LIKE 近似） | ✅ |
| P4-2 | 标签云 `GET /api/tags` — 聚合统计 + 频次降序 | ✅ |
| P4-3 | 图片上传 `POST /api/upload/image` — 类型校验 + 10MB 限制 + thumbnailator 缩略图 | ✅ |
| P4-4 | FileStorageService 接口 + LocalFileStorageService 实现 | ✅ |
| P4-5 | 导出 `GET /api/export` — JSON 文件下载 | ✅ |
| P4-6 | 导入 `POST /api/import` — JSON 解析 + title 去重合并 | ✅ |
| P4-7 | 静态资源映射 WebMvcConfig — `/uploads/**` → 本地文件 | ✅ |
| P4-8 | 🔧 Redis 缓存 | 🔧 延后 |
| P4-9 | 🔧 限流 | 🔧 延后 |

---

## P5：前端脚手架与布局 ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P5-1 | 路由配置 — BrowserRouter + Routes(login/register//detail/settings) + ProtectedRoute | ✅ |
| P5-2 | Axios 实例 + 拦截器 — client.ts(getData/postData/putData/deleteData) + JWT 附加 + 401 跳转 | ✅ |
| P5-3 | Zustand Store — useAuthStore + useFilterStore + useThemeStore | ✅ |
| P5-4 | AppLayout — 顶部栏+侧边栏+主内容区+移动端 Sheet+悬浮按钮 | ✅ |
| P5-5 | shadcn/ui 17 组件初始化 + Tailwind 4 主题 CSS 变量 | ✅ |

---

## P6：前端认证页面 ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P6-1 | 登录页 — RHF + Zod(email+password) + useLogin + error 提示 | ✅ |
| P6-2 | 注册页 — RHF + Zod(username/email/password/confirmPassword) + useRegister | ✅ |
| P6-3 | 路由守卫 — ProtectedRoute(token → outlet, null → /login) | ✅ |
| P6-4 | TanStack Query hooks — useLogin / useRegister / useProfile | ✅ |

---

## P7：前端灵感功能 ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P7-1 | InspirationForm — RHF+Zod + 类型切换(link/image/code/note) + 领域多选 + 标签输入 + 备注 | ✅ |
| P7-2 | InspirationCard — 4种类型图标 + 内容预览 + 标签 Badge + 悬停效果 | ✅ |
| P7-3 | DashboardPage — 卡片/列表双视图 + useInfiniteQuery 无限滚动 + 空态 + 创建 Drawer | ✅ |
| P7-4 | InspirationDetailPage — 按类型渲染(link/image/code/note) + 编辑 Drawer + 删除 Dialog + 复制 | ✅ |
| P7-5 | useInspirations hooks — useInspirations/useInspiration/useCreateInspiration/useUpdateInspiration/useDeleteInspiration/useTags/useSearch | ✅ |
| P7-6 | 🔧 图片上传前端组件（react-dropzone + react-easy-crop） | 🔧 延后 |
| P7-7 | 🔧 代码编辑器组件（prism-react-renderer 语法高亮） | 🔧 延后 |
| P7-8 | — (Markdown 渲染 react-markdown 延后) | 🔧 延后 |

---

## P8：前端筛选搜索 + 导入导出 + 移动端适配 ✅

| # | 任务 | 状态 |
|:---|:---|:---|
| P8-1 | 领域/类型筛选 — 侧边栏 Badge 切换 + Zustand filter store | ✅ |
| P8-2 | 标签云 — useTags 频次降序 + Badge 点击筛选(AND) + 清除按钮 | ✅ |
| P8-3 | 搜索框 — 顶部栏 Input + useDebounce(300ms) → filter.search | ✅ |
| P8-4 | 搜索/筛选组合 — filter store 多条件 AND 联动 useInfiniteQuery | ✅ |
| P8-5 | 导出 — useExport blob 下载 + Download 按钮 | ✅ |
| P8-6 | 导入 — useImport + FileReader + Upload 按钮 + file input | ✅ |
| P8-7 | 移动端响应式 — Sheet 侧边栏 + 悬浮按钮 + 单列卡片 | ✅ |
| P8-8 | 🔧 PWA | 🔧 延后 |
| P8-9 | 🔧 虚拟滚动 | 🔧 延后 |

---

## F-08：个人设置 ✅

| # | 任务 | 详情 | 状态 |
|:---|:---|:---|:---|
| F-1 | 查看基本信息 | 邮箱、用户名、注册时间 | ✅ |
| F-2 | 修改昵称 | RHF+Zod + 唯一性校验 + Zustand 同步更新 | ✅ |
| F-3 | 修改密码 | RHF+Zod(当前密码+新密码+确认) | ✅ |
| F-4 | 删除账号 | 密码验证 + 确认 Dialog → DELETE /api/user/account | ✅ |

---

## P9：联调 + 测试 + Bug 修复 🔜

| # | 任务 | 详情 | 状态 |
|:---|:---|:---|:---|
| P9-1 | 前后端联调 | 逐个接口验证，修复字段不匹配、类型错误 | ✅ 已基本完成 |
| P9-2 | 后端单元测试 | JUnit 5 + Mockito + @MockitoBean（SB 4），覆盖 Service 层 | ⬜ |
| P9-3 | 后端集成测试 | @SpringBootTest + Testcontainers (PG + Redis 容器) | ⬜ |
| P9-4 | 前端关键路径测试 | Vitest + React Testing Library (登录/创建/删除) | ⬜ |
| P9-5 | 跨浏览器验证 | Chrome、Firefox、Safari | ⬜ |
| P9-6 | 安全验证 | 401/403 + 跨用户隔离 + 图片类型校验 + XSS | ✅ 已验证 |
| P9-7 | 性能检查 | 列表 <500ms、搜索 <800ms、首屏 <2s | ⬜ |

---

## P10：部署 + CI/CD + 文档 🔜

| # | 任务 | 详情 | 状态 |
|:---|:---|:---|:---|
| P10-1 | Dockerfile | 后端多阶段构建(Maven+JDK 25→JRE 25) + 前端 Nginx | ⬜ |
| P10-2 | docker-compose.yml | PostgreSQL 14 + Redis 7 + 后端 + 前端 | ⬜ |
| P10-3 | GitHub Actions CI | push main → JDK 25 + Maven test + npm test → build | ⬜ |
| P10-4 | API 文档 | Knife4j 所有接口加描述 + 示例 | ⬜ |
| P10-5 | README + AGENTS.md | 启动步骤、环境要求、API 速查 | ⬜ (AGENTS.md 已有) |

---

## 升级项（🔧）

| # | 任务 | 优先级 | 预计 |
|:---|:---|:---|:---|
| U-1 | 代码高亮 — prism-react-renderer | 🟡 中 | 1h |
| U-2 | Markdown 渲染 — react-markdown | 🟡 中 | 0.5h |
| U-3 | 图片上传前端 — react-dropzone + react-easy-crop | 🟡 中 | 2h |
| U-4 | Redis 缓存 — Spring Cache + @Cacheable | 🟡 中 | 3h |
| U-5 | 限流 — Bucket4j / Resilience4j | 🟢 低 | 2h |
| U-6 | Docker + docker-compose | 🟡 中 | 2h |
| U-7 | GitHub Actions CI/CD | 🟢 低 | 2h |
| U-8 | PWA — vite-plugin-pwa | 🟢 低 | 3h |
| U-9 | 虚拟滚动 — react-window | 🟢 低 | 3h |
| U-10 | 浅色主题 — useThemeStore CSS 变量切换 | 🟢 低 | 2h |
| U-11 | OSS 对象存储 — OssFileStorageService | 🟢 低 | 3h |
| U-12 | OpenTelemetry 链路追踪 | 🟢 低 | 2h |
| U-13 | PostgreSQL 迁移 — 恢复 tsvector + TEXT[] | 🟢 低 | 4h |

---

## Spring Boot 4 踩坑记录

| # | 问题 | 解决方案 |
|:---|:---|:---|
| 1 | MyBatis-Plus `PaginationInnerInterceptor` 在 3.5.14+ 被移除 | 改用手动分页：先 `selectCount`，再 `last("LIMIT n OFFSET m")` |
| 2 | `GenericJackson3JsonRedisSerializer` 在 spring-data-redis 不可用 | 改用 `RedisSerializer.java()` 默认 JDK 序列化 |
| 3 | Jackson 3 与 SB 4 — `ObjectMapper` 不自动注入 | 手动添加 `JacksonConfig` @Bean |
| 4 | `GenericJackson2JsonRedisSerializer` 引入 Jackson 2 冲突 | 避免使用，改用 JDK 序列化 |
| 5 | H2 不支持 `TEXT[]` 数组 | domain/tags 存为逗号分隔字符串，VO 层 split 转 List |
| 6 | `file.getInputStream()` 二次消费抛出 IOException | 改用 `file.getBytes()` 转 `ByteArrayInputStream` 复用 |
| 7 | shadcn/ui v4 `DropdownMenuLabel` 必须包在 `<DropdownMenuGroup>` 内 | 添加 Group 包裹，修复 `MenuGroupContext is missing` 错误 |
| 8 | TS 6 弃用 `baseUrl` 路径映射 | 加 `"ignoreDeprecations": "6.0"` |
| 9 | shadcn/ui v4 生成文件在 `@/` 目录 | 手动移动到 `src/components/ui/` |
| 10 | Tailwind v4 CSS-first 配置 | 无需 `tailwind.config.js`，主题通过 CSS `@theme` 定义 |

---

## 优先级说明

| 标记 | 含义 |
|:---|:---|
| ✅ | 已完成 |
| 🔜 | 待开始 |
| 🔧 | 升级项，MVP 后可迭代 |

---

## 验收标准（PRD §10）

- [x] 用户可以注册/登录，且不同用户的数据相互隔离
- [x] 用户可以添加四种类型的灵感，并能上传本地图片
- [x] 灵感列表正确展示，支持分页
- [x] 按领域、类型、标签筛选功能正常，多条件组合正确
- [x] 全文搜索能命中标题/备忘/代码内容
- [x] 用户能编辑、删除自己的灵感
- [x] 导出为 JSON，导入后数据完整
- [x] 所有 API 均有 JWT 保护，未授权访问返回 401
- [ ] 前端页面在 Chrome、Firefox、Safari 最新版无明显样式错乱
- [ ] 手机端（宽度 375px）可正常浏览和添加灵感

---

## 项目文件索引

| 文件 | 说明 |
|:---|:---|
| `DEVELOPMENT_PLAN.md` | 本文档 |
| `产品需求文档.md` | PRD 功能范围 |
| `产品技术文档.md` | Spring Boot 4 技术栈 |
| `AGENTS.md` | AI 协作指南 |
| `OPTIMIZATION_SCHEDULE.md` | 优化日程 |
| `backend/` | Spring Boot 4 后端（49 源文件） |
| `frontend/` | Vite + React 前端（~25 源文件） |
