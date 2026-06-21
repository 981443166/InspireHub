# InspireHub 开发任务规划

> 基于 `产品需求文档.md`（功能范围）和 `产品技术文档.md`（Spring Boot 4 技术选型）
> 更新日期：2026-06-11 | 当前状态：**v1.0.0 已发布，全部 MVP + 增强功能已完成**

---

## 总览

| 阶段 | 天数 | 内容 | 任务数 | 状态 |
|:---|:---|:---|:---|:---|
| **P1** | 1-2 | 项目初始化 + 基础设施 | 6 | ✅ 完成 |
| **P2** | 2-3 | 后端：认证与用户 | 7 | ✅ 完成 |
| **P3** | 3-5 | 后端：灵感 CRUD | 8 | ✅ 完成 |
| **P4** | 5-7 | 后端：筛选搜索 + 标签云 + 导入导出 + 图片上传 | 9 | ✅ 完成 |
| **P5** | 7-8 | 前端：脚手架 + 布局 | 5 | ✅ 完成 |
| **P6** | 8-9 | 前端：认证页面 | 4 | ✅ 完成 |
| **P7** | 9-11 | 前端：灵感功能 | 8 | ✅ 完成 |
| **P8** | 11-13 | 前端：筛选搜索 + 导入导出 + 移动端适配 | 9 | ✅ 完成 |
| **F-08** | — | 个人设置（修改昵称/密码/删除账号） | 4 | ✅ 完成 |
| **Phase 1** | — | 测试 + 安全验证 | 2 | ✅ 完成 |
| **Phase 2** | — | 生产就绪（缓存/限流/代码高亮/Markdown/图片上传/日志） | 6 | ✅ 完成 |
| **Phase 3** | — | 部署 + CI/CD + 文档 | 4 | ✅ 完成 |
| **Phase 4** | — | 增强体验（PWA/浅色主题/OSS/API文档/快捷键/玻璃态UI） | 8 | ✅ 完成 |
| **P9** | — | 联调 + 测试 + Bug 修复 | 7 | ✅ 基本完成 |
| **P10** | — | 部署 + CI/CD + 文档 | 5 | ✅ 完成 |

---

## 实际技术栈

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
| Spring Boot | 4.0.6 | **4.0.6** |
| JDK | 25 | **25** |
| Node.js | 18+ | **24** |

---

## P1-P4：后端全部完成 ✅

| 端点 | 方法 | 路径 | 状态 |
|:---|:---|:---|:---|
| 注册 | POST | `/api/auth/register` | ✅ |
| 登录 | POST | `/api/auth/login` | ✅ |
| 用户资料 | GET/PUT | `/api/user/profile` | ✅ |
| 删除账号 | DELETE | `/api/user/account` | ✅ |
| 创建灵感 | POST | `/api/inspirations` | ✅ |
| 分页列表 | GET | `/api/inspirations?page&size&type&domain&tags` | ✅ |
| 全文搜索 | GET | `/api/inspirations/search?q=` | ✅ |
| 灵感详情 | GET | `/api/inspirations/{id}` | ✅ |
| 更新灵感 | PUT | `/api/inspirations/{id}` | ✅ |
| 删除灵感 | DELETE | `/api/inspirations/{id}` | ✅ |
| 标签云 | GET | `/api/tags` | ✅ |
| 图片上传 | POST | `/api/upload/image` | ✅ |
| 导出 | GET | `/api/export` | ✅ |
| 导入 | POST | `/api/import` | ✅ |

53 源文件，6 个 `@Tag` 分组，全部 `@Operation` 注解。15 个集成测试全绿。

---

## P5-P8：前端全部完成 ✅

| 页面 | 路由 | 功能 |
|:---|:---|:---|
| 登录 | `/login` | RHF+Zod + 渐变背景 + 图标输入框 |
| 注册 | `/register` | RHF+Zod + confirmPassword |
| 仪表盘 | `/` | 4 列卡片网格 + 无限滚动 + 交错入场动画 + 玻璃态按钮 |
| 灵感详情 | `/inspirations/:id` | 左右分屏 HTML 预览 + 源码 Tab 切换 |
| 个人设置 | `/settings` | 基本资料 + 修改昵称/密码 + 删除账号 |
| 快速预览 | 弹窗 | 方向键切换 + Tab 源码面板 + 复制按钮 |

---

## 增强功能（Phase 1-4）✅

| 功能 | 状态 |
|:---|:---|
| 🎨 玻璃态 UI（全按钮/侧栏/卡片） | ✅ |
| ⌨️ 键盘快捷键（Ctrl+N/K/E/Shift+D/?） | ✅ |
| 📚 Swagger API 文档（6 分组 15 端点） | ✅ |
| 🌓 浅色/深色主题切换 | ✅ |
| 💻 代码高亮（prism-react-renderer）+ 行号 | ✅ |
| 📝 Markdown 渲染（react-markdown） | ✅ |
| 🖼️ 图片拖拽上传（react-dropzone） | ✅ |
| 🔗 链接 og:image 自动抓取 | ✅ |
| 🧩 Chrome 浏览器扩展（Manifest V3） | ✅ |
| 🐳 Docker ×2 + docker-compose + GitHub Actions CI | ✅ |
| 🔒 限流保护（上传 10/min, 导入 5/min） | ✅ |
| 📊 MDC traceId 链路日志 | ✅ |
| 🔑 Redis 缓存（@Cacheable 标签云） | ✅ |
| 🤖 MinIO OSS 存储支持（@ConditionalOnProperty） | ✅ |
| 📱 PWA 离线支持（vite-plugin-pwa） | ✅ |
| 🏷️ HTML 实时预览（iframe + notes 作为 CSS） | ✅ |
| 🎬 卡片交错入场动画 | ✅ |
| 📐 领域纵向布局 + 类型 2 列网格 | ✅ |
| 🔢 4 列卡片紧凑布局 | ✅ |
| 🏷️ 右下角版本号 `v1.0.0` | ✅ |

---

## 升级项状态

| # | 任务 | 状态 |
|:---|:---|:---|
| U-1 | 代码高亮 — prism-react-renderer | ✅ |
| U-2 | Markdown 渲染 — react-markdown | ✅ |
| U-3 | 图片上传前端 — react-dropzone | ✅ |
| U-4 | Redis 缓存 — Spring Cache + @Cacheable | ✅ |
| U-5 | 限流 — RateLimiterConfig | ✅ |
| U-6 | Docker + docker-compose | ✅ |
| U-7 | GitHub Actions CI/CD | ✅ |
| U-8 | PWA — vite-plugin-pwa | ✅ |
| U-10 | 浅色主题 | ✅ |
| U-11 | OSS 对象存储 — OssFileStorageService | ✅ |
| U-12 | OpenTelemetry 链路追踪 | ⬜ |
| U-13 | PostgreSQL 迁移 | ⬜ |

---

## Spring Boot 4 踩坑记录

| # | 问题 | 解决方案 |
|:---|:---|:---|
| 1 | MyBatis-Plus `PaginationInnerInterceptor` 在 3.5.14+ 被移除 | 改用手动分页：先 `selectCount`，再 `last("LIMIT n OFFSET m")` |
| 2 | `GenericJackson3JsonRedisSerializer` 不可用 | 改用 JDK 序列化 |
| 3 | Jackson 3 ObjectMapper 不自动注入 | 手动 `JacksonConfig` @Bean |
| 4 | H2 不支持 `TEXT[]` | domain/tags 存逗号分隔，VO 层 split |
| 5 | `file.getInputStream()` 二次消费 | 改用 `file.getBytes()` |
| 6 | shadcn/ui v4 `DropdownMenuLabel` 需 `<Group>` | 包裹 Group |
| 7 | TS 6 弃用 `baseUrl` | `"ignoreDeprecations": "6.0"` |
| 8 | shadcn v4 生成文件在 `@/` 目录 | 移动到 `src/components/ui/` |
| 9 | Tailwind v4 CSS-first | `@theme` + CSS 变量架构 |
| 10 | `SELECT COUNT(*)` + `ORDER BY` → H2 报错 | count wrapper 不带 ORDER BY |
| 11 | react-window v2 API 不兼容 | 回退 InfiniteQuery + IntersectionObserver |
| 12 | PWA SW 缓存旧 JS | 开发模式 `injectRegister: false` + 启动时清理 SW |

---

## 验收标准

- [x] 用户可以注册/登录，且不同用户的数据相互隔离
- [x] 用户可以添加六种类型的灵感（link/image/code/note/html/css）
- [x] 灵感列表正确展示，支持分页 + 4 列卡片
- [x] 按领域、类型、标签筛选功能正常
- [x] 全文搜索能命中标题/备忘/代码内容
- [x] 用户能编辑、删除自己的灵感
- [x] 导出为 JSON，导入后数据完整
- [x] 所有 API 均有 JWT 保护
- [x] 15 个集成测试全绿
- [x] Docker 一键部署 + CI 流水线
- [x] Chrome 浏览器扩展
- [x] 键盘快捷键 + API 文档

---

## 项目文件索引

| 文件 | 说明 |
|:---|:---|
| `DEVELOPMENT_PLAN.md` | 本文档 |
| `产品需求文档.md` | PRD 功能范围 |
| `产品技术文档.md` | Spring Boot 4 技术栈 |
| `AGENTS.md` | AI 协作指南 |
| `OPTIMIZATION_SCHEDULE.md` | 优化日程 |
| `README.md` | 项目说明 |
| `backend/` | Spring Boot 4（53 源文件） |
| `frontend/` | Vite + React（~30 源文件） |
| `extension/` | Chrome 扩展 |
| `docker-compose.yml` | 一键部署 |
| `.github/workflows/ci.yml` | CI 流水线 |
