// Utility selector shortcut
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Page navigation setup
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "https://github.com/Ctt011", title: "GitHub" },
];

// Base path for GitHub Pages or localhost
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/Camille-Tran-Website/";

// Create <nav>
let nav = document.createElement("nav");
document.body.prepend(nav);

// Add links
for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

// Color scheme switcher
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

// Load preference
const select = document.querySelector(".color-scheme select");
function setColorScheme(scheme) {
  document.documentElement.style.setProperty("color-scheme", scheme);
  localStorage.colorScheme = scheme;
}
if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}
select.addEventListener("input", (e) => {
  setColorScheme(e.target.value);
});

//  Helper function to fetch JSON
export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

// Render projects into given container
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach((project) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div>
        <p>${project.description}</p>
        <p class="year">${project.year}</p>
      </div>
    `;

    // Add click handler to navigate to project detail
    article.style.cursor = 'pointer';
    article.addEventListener('click', () => {
      // If we're on the projects page, use hash navigation
      if (window.location.pathname.includes('/projects/')) {
        window.location.hash = project.slug;
      } else {
        // If we're on another page (like home), navigate to projects page with hash
        window.location.href = BASE_PATH + 'projects/#' + project.slug;
      }
    });

    containerElement.appendChild(article);
  });
}

// ✅ GitHub data fetch wrapper
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
