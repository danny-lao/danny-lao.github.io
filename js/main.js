// main.js
// Renders the "Skills", "Experience", and "Projects" sections from the JSON
// files in /data. To add/remove/edit content in any of those sections, edit
// the matching file in /data — index.html never needs to change.

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.json();
}

function renderAboutMe(aboutMe) {
  const container = document.getElementById("aboutme-text");
  if (!container) return;

  const tldrParagraphs = aboutMe.tldr.map((paragraph) => `<p>${paragraph}</p>`).join("");
  const fullParagraphs = aboutMe.full.map((paragraph) => `<p>${paragraph}</p>`).join("");

  container.innerHTML = `
    <p class="intro">${aboutMe.intro}</p>
    <details class="tldr">
      <summary>TLDR</summary>
      <div class="tldr-content">${tldrParagraphs}</div>
    </details>
    ${fullParagraphs}
  `;
}

function renderSkills(skills) {
  const container = document.getElementById("skills-list");
  if (!container) return;

  container.innerHTML = skills
    .map(
      (skill) => `
      <div class="cell">
        <img src="${skill.img}" alt="${skill.alt}">
        <span>${skill.label}</span>
      </div>`
    )
    .join("");
}

function renderExperience(experience) {
  const container = document.getElementById("experience-timeline");
  if (!container) return;

  // Stagger the entrance animation a bit per item, capped so a long
  // timeline doesn't take forever to finish animating in.
  const STAGGER_SECONDS = 0.2;
  const MAX_DELAY_SECONDS = 1.6;

  container.innerHTML = experience
    .map((job, index) => {
      const side = index % 2 === 0 ? "left" : "right";
      const delay = Math.min(index * STAGGER_SECONDS, MAX_DELAY_SECONDS);
      const bullets = job.bullets
        .map((bullet) => `- ${bullet}`)
        .join(" <br>\n              ");

      return `
        <div class="container ${side}-container" style="animation-delay: ${delay}s">
          <img src="${job.logo}" alt="${job.alt || ""}">
          <div class="text-box">
            <h3>${job.title}</h3>
            <small>${job.date}</small>
            <p>${bullets}</p>
            <span class="${side}-container-arrow"></span>
          </div>
        </div>`;
    })
    .join("");
}

function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  if (!container) return;

  container.innerHTML = projects
    .map((project) => {
      const link = project.link
        ? `<a href="${project.link.url}" class="btn" target="_blank" rel="noopener noreferrer">${project.link.text}</a>`
        : "";

      return `
        <div class="box">
          <div class="box-content">
            <img src="${project.img}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
          ${link}
        </div>`;
    })
    .join("");
}

async function init() {
  const sections = [
    { path: "data/aboutme.json", render: renderAboutMe, id: "aboutme-text" },
    { path: "data/skills.json", render: renderSkills, id: "skills-list" },
    { path: "data/experience.json", render: renderExperience, id: "experience-timeline" },
    { path: "data/projects.json", render: renderProjects, id: "projects-list" },
  ];

  await Promise.all(
    sections.map(async ({ path, render, id }) => {
      try {
        const data = await loadJSON(path);
        render(data);
      } catch (error) {
        console.error(error);
        const container = document.getElementById(id);
        if (container) {
          container.innerHTML = `<p>Couldn't load this section right now.</p>`;
        }
      }
    })
  );
}

document.addEventListener("DOMContentLoaded", init);