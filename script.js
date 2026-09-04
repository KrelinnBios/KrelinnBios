const fallbackRepos = [
  {
    name: "PrismSelf",
    html_url: "https://prismself.vip/",
    description: "面向性别理论、心理概念与人际关系议题的中文知识库。",
    language: "HTML",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
  {
    name: "NeoDBLite",
    html_url: "https://github.com/KrelinnBios/NeoDBLite",
    description: "面向 NeoDB 与兼容实例的非官方 Android 标记客户端。",
    language: "Kotlin",
    stargazers_count: 6,
    archived: false,
    fork: false,
  },
  {
    name: "YamiboPlus",
    html_url: "https://github.com/KrelinnBios/YamiboPlus",
    description: "面向百合会论坛的非官方原生 Android 客户端。",
    language: "Kotlin",
    stargazers_count: 4,
    archived: false,
    fork: false,
  },
  {
    name: "AceSurvey",
    html_url: "https://github.com/KrelinnBios/AceSurvey",
    description: "面向无性恋社群的问卷与卡片生成工具。",
    language: "HTML",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
  {
    name: "GitHubProfileContributionFocus",
    html_url: "https://github.com/KrelinnBios/GitHubProfileContributionFocus",
    description: "按仓库和月份展示 GitHub 近一年贡献重心的可复用 Action。",
    language: "Python",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
  {
    name: "GitHubProfileLanguageDonut",
    html_url: "https://github.com/KrelinnBios/GitHubProfileLanguageDonut",
    description: "为个人主页生成自动更新、深浅色适配语言占比图的 GitHub Action。",
    language: "Python",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
  {
    name: "YamiboReaderLite",
    html_url: "https://github.com/KrelinnBios/YamiboReaderLite",
    description: "面向百合会论坛的非官方 Android 阅读客户端。",
    language: "Kotlin",
    stargazers_count: 25,
    archived: true,
    fork: false,
  },
  {
    name: "Outvalue",
    html_url: "https://outvalue.lol/",
    description: "按公开支持金额实时排序的排名站点。",
    language: "TypeScript",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
];

const languageColors = {
  Kotlin: "#a97bff",
  HTML: "#f06545",
  JavaScript: "#f7df1e",
  TypeScript: "#4f86e8",
  Python: "#55b981",
  CSS: "#49c3dd",
  Web: "#e9ff38",
};

const outvalueProject = fallbackRepos.find((repo) => repo.name === "Outvalue");

const projectList = document.querySelector("#project-list");
const repoCount = document.querySelector("#repo-count");
const welcomePopup = document.querySelector("#welcome-popup");

if (welcomePopup) {
  window.setTimeout(() => {
    welcomePopup.classList.add("is-closing");
    window.setTimeout(() => {
      welcomePopup.hidden = true;
    }, 160);
  }, 2000);
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function cleanDescription(description) {
  return (description || "GitHub 公开仓库").replace(/^(?:可复用的\s*)?GitHub Action[:：]?\s*/u, "");
}

function renderProjects(repos) {
  const projects = repos.filter((repo) => !repo.fork && repo.name !== "KrelinnBios");
  if (!projects.some((repo) => repo.name === "Outvalue")) projects.push(outvalueProject);
  projects.sort((first, second) =>
    first.name.localeCompare(second.name, "en", { sensitivity: "base" }),
  );

  repoCount.textContent = projects.length;
  projectList.innerHTML = projects
    .map((repo, index) => {
      const language = repo.language || "Profile";
      const color = languageColors[repo.language] || "#8b949e";
      const archiveLabel = repo.archived ? '<span class="archived">ARCHIVED</span>' : "";
      const description = cleanDescription(repo.description);
      const projectUrl = repo.name === "PrismSelf" ? "https://prismself.vip/" : repo.html_url;

      return `
        <a class="project-row" href="${escapeHtml(projectUrl)}" target="_blank" rel="noreferrer">
          <span class="project-index">${String(index + 1).padStart(2, "0")}</span>
          <h3 class="project-title">${escapeHtml(repo.name)}</h3>
          <p class="project-description">${escapeHtml(description)}</p>
          <span class="project-meta">
            <span class="language">
              <span class="language-dot" style="--language-color: ${color}"></span>
              ${escapeHtml(language)}
            </span>
            <span class="stars" aria-label="${repo.stargazers_count} 个星标">
              <span aria-hidden="true">★</span>
              <span>${repo.stargazers_count}</span>
            </span>
            ${archiveLabel}
          </span>
        </a>
      `;
    })
    .join("");
}

async function loadProjects() {
  renderProjects(fallbackRepos);

  try {
    const response = await fetch(
      "https://api.github.com/users/KrelinnBios/repos?per_page=100&sort=updated",
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!response.ok) throw new Error(`GitHub API ${response.status}`);

    const repos = await response.json();
    renderProjects(repos);
  } catch (error) {
    console.warn("Could not refresh GitHub repositories:", error);
  }
}

loadProjects();
