# AGENTS.md

本文件适用于整个仓库，作为 AI 编码代理修改本项目时的项目规范。除非用户另有要求，使用中文回复和说明。

## 项目概览

KrelinnBios 是个人主页与 GitHub Profile 展示仓库，页面由原生 HTML、CSS 和 JavaScript 组成，可直接作为静态站点部署。

- `index.html`：页面结构、兴趣档案与静态资源引用。
- `styles.css`：桌面端与通用样式。
- `mobile.css`：移动端响应式样式。
- `scrollbar.css`：页面滚动条主题与跨浏览器样式。
- `script.js`：GitHub 项目读取、兜底数据与页面交互。
- `favicon.svg`：站点图标。

## 开始任务前

- 先读取与任务直接相关的 HTML、CSS 或 JavaScript，确认现有结构和调用关系后再修改。
- 优先做最小、可验证的改动，不顺手重排无关代码、统一整份格式或改变其他页面行为。
- 涉及项目卡片、外部链接或兜底数据时，同时检查 GitHub API 正常返回与 `fallbackRepos` 生效两种路径。

## 修改原则

- 文件统一使用 UTF-8；保留当前 CRLF 换行风格。
- HTML、CSS 和 JavaScript 使用现有 2 空格缩进。
- 除非逻辑复杂到必须解释，否则不添加注释。
- 桌面端与移动端是同一套页面的两种布局；修改结构、固定按钮或间距时同时检查两端表现。
- 动画沿用现有阶跃式视觉语言，优先使用 `steps(2, end)` 等曲线；不要引入脉冲、波纹、呼吸灯等持续闪动效果。
- Git diff 只包含本次任务需要的内容，不混入无关格式化、临时文件或生成物。

## 关键约束

### 静态资源版本号

修改以下任一文件后，必须同步更新 `index.html` 中对应的 `?v=` 版本号：

- `styles.css`
- `mobile.css`
- `script.js`
- `favicon.svg`

四处引用必须使用同一个新版本号，推荐格式为 `YYYYMMDDX`，例如 `202609081`：

```text
./favicon.svg?v=<新版号>
./styles.css?v=<新版号>
./mobile.css?v=<新版号>
./script.js?v=<新版号>
```

`scrollbar.css` 使用独立版本号；修改该文件时，只需同步更新 `index.html` 中 `scrollbar.css?v=` 的版本引用。

只修改 `index.html` 内容本身时，不需要更新版本号。

#### 原因说明

- HTML 已通过缓存控制设置为不缓存，但 CSS、JavaScript 和图片仍可能被浏览器或 CDN 缓存。
- 只有资源 URL 变化时，浏览器才会可靠地重新获取新资源。
- 漏改版本号会造成线上继续加载旧样式或旧脚本，与仓库当前代码不一致。

### 项目 URL 映射

`script.js` 中部分项目的展示链接固定指向部署站点，而不是 GitHub 仓库：

| 项目 | 展示链接 |
| --- | --- |
| PrismSelf | https://prismself.vip/ |
| AceSurvey | https://survey.prismself.vip |
| Toolbox | https://toolbox.krelinnbios.com/ |

- `fallbackRepos` 保存 GitHub API 加载失败时的兜底数据。
- `renderProjects` 中针对项目名称的链接覆盖优先于 GitHub API 返回的 `html_url`。
- 新增或修改同类项目时，两处映射必须保持一致。

## 验证

根据改动范围人工确认：

- 页面可正常打开，控制台无新增脚本错误。
- GitHub 项目正常加载，API 失败时兜底列表仍可显示。
- 项目名称、描述和跳转地址符合预期。
- 桌面宽屏、常见移动端宽度以及移动浏览器“桌面版网站”模式下没有明显错位或异常拉伸。
- 修改共享资源后，`index.html` 中四个版本号已同步更新。
- 修改 `scrollbar.css` 后，其独立版本号已同步更新。

纯文档修改无需额外运行构建或测试；本项目没有构建步骤。

## 文档同步

- `README.md` 面向 GitHub Profile 访客；`AGENTS.md` 只记录编码代理在修改项目时需要遵守的规则，不重复堆叠用户向介绍。
- 修改公开项目名称、定位或主页中与 README 重复的描述时，检查 README 是否需要同步。
- 不为单次临时实现把易变化的版本号、短期状态或调试说明写进长期规范，除非它们构成项目约束。

## 提交约定

- 一个提交聚焦一个明确主题。
- 提交信息简短说明实际结果。
- 不提交本地预览、编辑器状态、临时导出或与任务无关的生成文件。
- 工作区已有其他修改时，只处理并提交本次任务涉及的内容。