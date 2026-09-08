# KrelinnBios 项目维护指南

本文档面向仓库维护者与自动化编码代理，记录 KrelinnBios 项目特有的修改流程、代码风格与发布规范。

---

## 一、缓存与静态资源版本号更新流程（重要）

由于 GitHub Pages 等静态托管平台和浏览器会强缓存本地资源，**每次修改以下任一文件后都必须同步更新 index.html 中的版本号**：

- `styles.css`
- `mobile.css`
- `script.js`
- `favicon.svg`

### 操作步骤

1. 完成代码改动后，打开 `index.html` 的 `<head>` 区块。
2. 查找并修改以下 4 处 `?v=` 后面的字符串，改为同一个新的版本号：
   - `./favicon.svg?v=<新版号>`
   - `./styles.css?v=<新版号>`
   - `./mobile.css?v=<新版号>`
   - `./script.js?v=<新版号>`
3. 新版号推荐格式：`YYYYMMDDX`（日期 + 序号，例如 `202609081`）。
4. 4 处必须保持一致。
5. 再执行 `git commit / push`。

> 只改动 HTML 不需要更新版本号。

### 原因说明

- HTML 通过 `<meta http-equiv="Cache-Control">` 已设为不缓存，但 CSS / JS / 图片仍会被浏览器缓存。
- 只有资源 URL 发生变化（即 query string `?v=` 取值不同）时，浏览器才会强制重新下载对应资源。
- 漏改版本号会导致用户访问站点时仍加载旧的 CSS / JS 效果，出现与本地修改后线上不一致的问题。

---

## 二、项目 URL 特殊映射

`script.js` 中 `fallbackRepos` 数组和 `renderProjects` 函数里，有**部分项目的展示链接固定指向部署站点**而非 GitHub 仓库。修改这些项目名称或新增同类项目时请注意同步更新：

| 项目名称 | 展示链接（用户点击跳转） |
|---|---|
| PrismSelf | https://prismself.vip/ |
| AceSurvey | https://survey.prismself.vip |
| Toolbox | https://toolbox.krelinnbios.com/ |

- `fallbackRepos` 是 GitHub API 加载失败时的兜底数据。
- `renderProjects` 中针对项目名称的三元判断是强制覆盖，优先级高于 GitHub API 返回的 `html_url`。
- 新增需要跳转到部署站点的项目，请在两个地方都加上同样的映射。

---

## 三、代码风格

- 文件编码 UTF-8，换行符 CRLF（Windows 项目）。
- HTML / CSS / JS 不添加注释，除非逻辑复杂到必须解释。
- 排版对齐保持现有 2 空格缩进风格。
- 动画使用 `steps(2, end)` 等阶跃曲线，**避免脉冲 / 波纹 / 呼吸灯等闪动效果**。
- 固定功能按钮在桌面端和移动端保持位置一致，参考现有页脚布局。
