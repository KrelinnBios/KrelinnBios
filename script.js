const fallbackRepos = [
  {
    name: "Outvalue",
    html_url: "https://outvalue.lol/",
    description: "按公开支持金额实时排序的排名站点。",
    language: "TypeScript",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
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
    html_url: "https://survey.prismself.vip",
    description: "面向无性恋社群的问卷与卡片生成工具。",
    language: "HTML",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
  {
    name: "Toolbox",
    html_url: "https://toolbox.krelinnbios.com/",
    description: "代替浏览器收藏夹的个人工具导航站。",
    language: "HTML",
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
    name: "Which Me",
    html_url: "https://whichme.xyz",
    description: "面向中英文用户的结构化自我探索测评网站。",
    language: "JavaScript",
    stargazers_count: 0,
    archived: false,
    fork: false,
  },
];

const projectOrder = fallbackRepos.map((repo) => repo.name);

const languageColors = {
  Kotlin: "#a97bff",
  HTML: "#f06545",
  TypeScript: "#4f86e8",
  JavaScript: "#f1e05a",
};

const projectList = document.querySelector("#project-list");
const repoCount = document.querySelector("#repo-count");
const welcomePopup = document.querySelector("#welcome-popup");
const contactEmail = document.querySelector(".contact-email");
const copyToast = document.querySelector("#copy-toast");

let copyToastTimer = 0;

function showCopyToast(message) {
  if (!copyToast) return;
  copyToast.textContent = message;
  copyToast.classList.add("is-visible");
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => {
    copyToast.classList.remove("is-visible");
  }, 1800);
}

if (welcomePopup) {
  window.setTimeout(() => {
    welcomePopup.classList.add("is-closing");
    window.setTimeout(() => {
      welcomePopup.hidden = true;
    }, 160);
  }, 2000);
}

if (contactEmail) {
  contactEmail.addEventListener("click", async (event) => {
    event.preventDefault();
    const address = contactEmail.getAttribute("href").replace(/^mailto:/i, "");
    try {
      await navigator.clipboard.writeText(address);
    } catch (error) {
      const tempInput = document.createElement("input");
      tempInput.value = address;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
    contactEmail.classList.add("is-copied");
    contactEmail.setAttribute("aria-label", `已复制 ${address} 到剪贴板`);
    showCopyToast(`已复制邮箱到剪贴板：${address}`);
    window.clearTimeout(contactEmail._copyTimer);
    contactEmail._copyTimer = window.setTimeout(() => {
      contactEmail.classList.remove("is-copied");
      contactEmail.setAttribute("aria-label", `复制邮箱地址 ${address}`);
    }, 1400);
  });
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function cleanDescription(description) {
  return (description || "GitHub 公开仓库").replace(/^(?:可复用的\s*)?GitHub Action[:：]?\s*/u, "");
}

function orderProjects(repos) {
  const repoMap = new Map(repos.map((repo) => [repo.name, repo]));
  const fallbackMap = new Map(fallbackRepos.map((repo) => [repo.name, repo]));
  const ordered = projectOrder
    .map((name) => repoMap.get(name) || fallbackMap.get(name))
    .filter((repo) => repo && !repo.fork && repo.name !== "KrelinnBios");

  return ordered.length > 0 ? ordered : fallbackRepos.slice();
}

function renderProjects(repos) {
  const projects = orderProjects(repos);

  repoCount.textContent = projects.length;
  projectList.innerHTML = projects
    .map((repo, index) => {
      const language = repo.language || "Profile";
      const color = languageColors[repo.language] || "#8b949e";
      const archiveLabel = repo.archived ? '<span class="archived">ARCHIVED</span>' : "";
      const description = cleanDescription(repo.description);
      const projectUrl =
        repo.name === "PrismSelf"
          ? "https://prismself.vip/"
          : repo.name === "AceSurvey"
            ? "https://survey.prismself.vip"
            : repo.name === "Toolbox"
              ? "https://toolbox.krelinnbios.com/"
              : repo.html_url;

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

const footerYear = document.querySelector("#footer-year");
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

function initializeScrollbar() {
  if (!window.ResizeObserver || !window.PointerEvent) return;

  const root = document.documentElement;
  const thumb = document.createElement("div");
  thumb.className = "page-scrollbar";
  thumb.tabIndex = 0;
  thumb.setAttribute("role", "scrollbar");
  thumb.setAttribute("aria-label", "页面滚动条");
  thumb.setAttribute("aria-controls", "main");
  thumb.setAttribute("aria-orientation", "vertical");
  thumb.setAttribute("aria-valuemin", "0");
  document.body.appendChild(thumb);

  let frame = 0;
  let drag = null;

  function measure() {
    const height = root.clientHeight;
    const range = Math.max(0, root.scrollHeight - height);
    const size = Math.min(height, Math.max(32, height * height / root.scrollHeight));
    return { range, size, travel: height - size };
  }

  function update() {
    frame = 0;
    const { range, size, travel } = measure();
    const position = Math.max(0, Math.min(range, window.scrollY));
    thumb.hidden = range === 0;
    thumb.style.height = `${size}px`;
    thumb.style.transform = `translateY(${range ? position / range * travel : 0}px)`;
    thumb.setAttribute("aria-valuemax", String(Math.round(range)));
    thumb.setAttribute("aria-valuenow", String(Math.round(position)));
  }

  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    thumb.setPointerCapture(event.pointerId);
    drag = { pointerId: event.pointerId, offset: event.clientY - thumb.getBoundingClientRect().top };
    thumb.classList.add("is-dragging");
  });

  thumb.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const { range, travel } = measure();
    const position = Math.max(0, Math.min(travel, event.clientY - drag.offset));
    window.scrollTo({ top: travel ? position / travel * range : 0, behavior: "instant" });
  });

  function stopDragging() {
    drag = null;
    thumb.classList.remove("is-dragging");
  }

  thumb.addEventListener("pointerup", stopDragging);
  thumb.addEventListener("pointercancel", stopDragging);
  thumb.addEventListener("lostpointercapture", stopDragging);
  thumb.addEventListener("keydown", (event) => {
    const { range } = measure();
    const targets = {
      ArrowUp: window.scrollY - 40,
      ArrowDown: window.scrollY + 40,
      PageUp: window.scrollY - root.clientHeight,
      PageDown: window.scrollY + root.clientHeight,
      Home: 0,
      End: range,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    window.scrollTo({ top: Math.max(0, Math.min(range, targets[event.key])), behavior: "instant" });
  });

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  new ResizeObserver(scheduleUpdate).observe(document.body);
  root.classList.add("has-page-scrollbar");
  update();
}

function installMobileScrollbarAutoHide() {
  // 检测是否为触控设备
  const isTouchDevice = window.matchMedia && (
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches
  );

  if (!isTouchDevice) return;

  let scrollTimer = null;
  let isScrolling = false;

  function showScrollbar() {
    if (!isScrolling) {
      isScrolling = true;
      document.documentElement.classList.add('is-scrolling');
    }

    if (scrollTimer) clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {
      isScrolling = false;
      document.documentElement.classList.remove('is-scrolling');
    }, 1500);
  }

  window.addEventListener('scroll', showScrollbar, { passive: true });
  window.addEventListener('touchmove', showScrollbar, { passive: true });
}

initializeScrollbar();
installMobileScrollbarAutoHide();
