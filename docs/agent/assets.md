# 版本、图标与静态资源缓存

此文件是项目内部的专项维护规则。根目录 [AGENTS.md](../../AGENTS.md) 仍然适用。

### 静态资源版本号

修改以下任一文件后，必须同步更新 `index.html` 中对应的 `?v=` 版本号：

- `styles.css`
- `script.js`
- `favicon.svg`

所有版本引用必须使用同一个新版本号（`favicon.svg` 的两条 link 使用同一个值），推荐格式为 `YYYYMMDDX`，例如 `202609081`：

```text
./favicon.svg?v=<新版号>
./styles.css?v=<新版号>
./script.js?v=<新版号>
```

只修改 `index.html` 内容本身时，不需要更新版本号。

#### 原因说明

- HTML 已通过缓存控制设置为不缓存，但 CSS、JavaScript 和图片仍可能被浏览器或 CDN 缓存。
- 只有资源 URL 变化时，浏览器才会可靠地重新获取新资源。
- 漏改版本号会造成线上继续加载旧样式或旧脚本，与仓库当前代码不一致。
