# InspireHub 优化日程

> 更新日期：2026-06-10 | 当前状态：MVP 核心功能已完成（P1-P8 + F-08）

---

## 已完成总览

| 阶段 | 内容 | 状态 |
|:---|:---|:---|
| P1 | 项目初始化 + 基础设施 | ✅ |
| P2 | 用户注册/登录 + JWT + Spring Security 7 | ✅ |
| P3 | 灵感 CRUD + 筛选 + 搜索 | ✅ |
| P4 | 标签云 + 图片上传 + 导入导出 | ✅ |
| P5-P8 | 前端全部页面（登录/注册/仪表盘/详情/设置/筛选/搜索/导入导出） | ✅ |
| F-08 | 个人设置（修改昵称/密码/删除账号） | ✅ |

---

## 优化日程（按优先级排序）

### 🔴 第一阶段：稳定性 & 测试（1-2 天）

| # | 任务 | 详情 | 预计 |
|:---|:---|:---|:---|
| 1.1 | **后端单元测试** | JUnit 5 + Mockito + `@MockitoBean`（SB 4 已移除 `@MockBean`）覆盖 UserService / InspirationService / TagService / UploadService 核心逻辑 | 4h |
| 1.2 | **后端集成测试** | Testcontainers 启动 PostgreSQL + Redis 容器，测试完整 API 链路 | 3h |
| 1.3 | **前端关键路径测试** | Vitest + React Testing Library 验证登录、注册、创建灵感、筛选、删除流程 | 3h |
| 1.4 | **安全验证** | 未授权 API 返回 401/403、跨用户数据不可见、图片上传类型校验、XSS 基础防护、Spring Security 7 Lambda DSL 配置审计 | 2h |
| 1.5 | **Bug 集中修复** | 前后端联调中发现的边界问题、移动端 375px 适配修复、浏览器兼容性 | 3h |

### 🟡 第二阶段：生产就绪（2-3 天）

| # | 任务 | 详情 | 预计 |
|:---|:---|:---|:---|
| 2.1 | **Redis 缓存** | `@Cacheable` 缓存标签云结果（30min TTL），灵感列表按筛选条件缓存，配置 RedisCacheManager 序列化 | 3h |
| 2.2 | **限流保护** | Bucket4j 或拦截器限制 `/api/upload/image` 和 `/api/import` 的 QPS（10/分钟），防恶意上传 | 2h |
| 2.3 | **图片上传增强** | 前端集成 `react-dropzone` 拖拽上传 + `react-easy-crop` 裁剪，后端 thumbnailator 已在位 | 3h |
| 2.4 | **代码高亮** | 详情页代码类型集成 `prism-react-renderer`，行号 + 语法着色 + 一键复制 | 2h |
| 2.5 | **Markdown 渲染** | 详情页备注/笔记类型集成 `react-markdown` | 1h |
| 2.6 | **错误监控** | 后端 MDC traceId 链路日志 + 前端 Sentry 错误追踪 | 2h |

### 🟢 第三阶段：部署 & DevOps（1-2 天）

| # | 任务 | 详情 | 预计 |
|:---|:---|:---|:---|
| 3.1 | **Dockerfile** | 后端多阶段构建（Maven + JDK 25 → JRE 25）+ 前端 Nginx 静态资源 + API 反向代理 | 2h |
| 3.2 | **docker-compose.yml** | PostgreSQL 14 + Redis 7 + 后端 + 前端，Docker Compose V2 格式，环境变量管理 | 1h |
| 3.3 | **GitHub Actions CI** | `push main` → JDK 25 + Maven 测试 + npm 测试 → 构建 → 可选自动部署 | 2h |
| 3.4 | **API 文档完善** | Knife4j 所有接口加描述 + 示例，确认 `/doc.html` 可访问 | 1h |
| 3.5 | **README 完善** | 项目说明、本地启动步骤（JDK 25 + H2）、环境要求、API 速查表 | 1h |

### 🔵 第四阶段：增强体验（3-5 天）

| # | 任务 | 详情 | 预计 |
|:---|:---|:---|:---|
| 4.1 | **PWA 离线支持** | `vite-plugin-pwa` 配置 Service Worker + manifest，可安装到桌面离线访问 | 3h |
| 4.2 | **虚拟滚动** | 灵感列表 > 500 条时用 `react-window` 替代无限滚动，减少 DOM 节点数 | 3h |
| 4.3 | **对象存储 OSS** | 实现 `OssFileStorageService`（阿里云 OSS / MinIO），`application.yml` 切换 `storage.type=oss` | 3h |
| 4.4 | **浅色主题** | 配合 `useThemeStore` 实现 CSS 变量切换，深色/浅色双主题 | 2h |
| 4.5 | **灵感卡片预览增强** | 图片缩略图 + 链接 iframe 内嵌预览 + 代码片段语法高亮 | 2h |
| 4.6 | **OpenTelemetry** | `spring-boot-starter-opentelemetry`（SB 4 内置）分布式链路追踪 | 2h |

### ⚪ 第五阶段：远期规划（后续版本）

| # | 任务 | 详情 |
|:---|:---|:---|
| 5.1 | **浏览器扩展** | Chrome Extension 一键剪藏页面标题/URL/截图，弹出小窗选择类型添加标签 |
| 5.2 | **每日推送** | 定时任务随机推送一条收藏灵感到邮箱 |
| 5.3 | **团队协作** | 灵感板（Board）+ 邀请成员 + 共享收藏夹 + 评论与点赞 |
| 5.4 | **迁移 PostgreSQL** | 从 H2 切换到 PostgreSQL 14+，恢复 tsvector 全文搜索 + TEXT[] 数组字段 |
| 5.5 | **Elasticsearch 搜索** | 数据量 > 5000 条时从 PostgreSQL 全文检索迁移到 ES |
| 5.6 | **Prometheus + Grafana** | JVM 指标、接口 QPS、Redis 命中率监控面板 |

---

## 推荐执行顺序

```
第一周:  [1.1→1.4→1.5] → [2.1→2.2] → [3.1→3.2→3.4→3.5]
第二周:  [2.3→2.4→2.5] → [3.3] → [4.1→4.4]
第三周:  [1.2→1.3] → [4.2→4.3→4.5] → [5.4]
```

**现在可以立即开始的"高价值低风险"项**：
- 2.4 代码高亮（5 分钟，纯前端）
- 2.5 Markdown 渲染（5 分钟，纯前端）
- 3.5 README 完善（10 分钟）
- 3.1 Dockerfile（15 分钟）

---

## 当前服务状态

| 服务 | 地址 | 状态 |
|:---|:---|:---|
| 前端 Vite | `http://localhost:3000` | 🟢 |
| 后端 API | `http://localhost:8080` | 🟢 |
| H2 Console | `http://localhost:8080/h2-console` | 🟢 |
| Swagger UI | `http://localhost:8080/swagger-ui.html` | 🟢 |
