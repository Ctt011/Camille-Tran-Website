import { fetchJSON } from './global.js';

// Fetch project data and display the latest 3
const projects = await fetchJSON('./projects/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

// Render latest projects on home page
function renderLatestProjects(projectsList) {
  projectsContainer.innerHTML = '';
  projectsList.forEach((project) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h2>${project.title}</h2>
      <img src="${project.image}" alt="${project.title}">
      <div>
        <p>${project.description}</p>
        <p class="year">${project.year}</p>
      </div>
    `;

    // Add click handler to navigate to project detail page
    article.style.cursor = 'pointer';
    article.addEventListener('click', () => {
      const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        ? "/"
        : "/Camille-Tran-Website/";
      window.location.href = BASE_PATH + 'projects/#' + project.slug;
    });

    projectsContainer.appendChild(article);
  });
}

renderLatestProjects(latestProjects);
