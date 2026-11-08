# GitHub 数据同步、项目分类与 URL 映射

此文件是项目内部的专项维护规则。根目录 [AGENTS.md](../../AGENTS.md) 仍然适用。

### 项目数据来源

项目列表数据**不直接从 GitHub API 拉取**。匿名请求限额是每个 IP 每小时 60 次，共享出口 IP 的访客会把额度互相耗光，导致页面长期显示过期兜底数据。

数据流是构建时生成、运行时读静态文件：

```text
GitHub API ─┐
            ├─→ .github/workflows/update-repos-data.yml ─→ repos.json ─→ script.js
repos-private.json ─┘
```

- `repos.json` 每天由 workflow 重新生成并提交，内容有变化才提交。
- `repos-private.json` 是手写源，记录 API 拿不到的私有仓库（Which Me）。新增此类项目时改这里。
- workflow 的 `GITHUB_TOKEN` 按安装范围授权，**不能假定**它能读到账号下所有私有仓库，所以私有项目一律走 `repos-private.json`。
- `repos.json` 是仓库内静态文件，GitHub Pages 对非 HTML 资源给 10 分钟缓存，脚本不额外加版本号。

需要改项目数据时，先确认改哪一层。`orderProjects` 先把 `repos.json` 和 `fallbackRepos` 合并（**`repos.json` 优先**，`fallbackRepos` 只填补 `repos.json` 里没有的项目），再按 `projectOrder` 排序、剔除 `excludedProjects` 和 fork，最后追加不在 `projectOrder` 里的新仓库。

- 改公开仓库的描述或星标 → 改 GitHub 上的仓库描述，等 workflow 自动同步。只改 `fallbackRepos` 不会影响线上。
- 改展示顺序 → 改 `script.js` 的 `fallbackRepos` 数组顺序（`projectOrder` 由它推导）。`fallbackRepos` 里的项目排在前面，新项目按 `repos.json` 的字母序接在末尾。
- 改私有项目（Which Me）的描述、链接、语言 → 改 `repos-private.json`。
- 改展示链接指向部署站点 → 改 `renderProjects` 里的链接覆盖表，同时同步 `fallbackRepos` 与 `repos-private.json` 的 `html_url`。
- 只想立刻刷新线上数据 → 手动触发 `Update project data` workflow，不要手改 `repos.json`。
- 新增公开项目 → **不需要任何改动**，下次 workflow 同步后自动出现在列表末尾。
- 不想让某个仓库出现在主页 → 把仓库名加进 `script.js` 的 `excludedProjects`。当前排除 `KrelinnBios`（主页仓库自己）和两个图表生成器。

### 项目 URL 映射

`script.js` 中部分项目的展示链接固定指向部署站点，而不是 GitHub 仓库：

| 项目 | 展示链接 |
| --- | --- |
| PrismSelf | <https://prismself.vip/> |
| AceSurvey | <https://survey.prismself.vip> |
| Toolbox | <https://toolbox.krelinnbios.com/> |

- `fallbackRepos` 保存 `repos.json` 加载失败时的兜底数据。
- `renderProjects` 中针对项目名称的链接覆盖优先于 `repos.json` 中的 `html_url`。
- 新增或修改同类项目时，两处映射必须保持一致。
