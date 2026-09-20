const starterProjects = [
    { id: 1, name: "AI Study Assistant", owner: "Jiten Sancheti", category: "Technology", status: "Live", description: "A calm, adaptive study companion that helps students plan revision around their actual energy and schedule." },
    { id: 2, name: "Campus Cycle", owner: "Jiten Sancheti", category: "Sustainability", status: "Building", description: "A community-powered map for sharing bikes, repair points, and safer routes between campus buildings." },
    { id: 3, name: "Open Notes", owner: "Jiten Sancheti", category: "Education", status: "Review", description: "A searchable library where students turn their best course notes into useful, accessible learning resources." },
    { id: 4, name: "Pocket Portfolio", owner: "Jiten Sancheti", category: "Design", status: "Live", description: "A tiny portfolio builder for students who want to show the thinking behind their finished work." },
    { id: 5, name: "Lab Lens", owner: "Jiten Sancheti", category: "Technology", status: "Building", description: "A visual dashboard that makes environmental sensor readings understandable at a glance." },
    { id: 6, name: "Food Loop", owner: "Jiten Sancheti", category: "Sustainability", status: "Review", description: "A campus food-sharing network that helps surplus meals find hungry students before they become waste." }
];

const savedProjects = JSON.parse(localStorage.getItem("projecthub-projects") || "null");
let projects = savedProjects || starterProjects;
const grid = document.getElementById("projectGrid");
const emptyState = document.getElementById("emptyState");

function renderProjects() {
    const search = document.getElementById("searchInput").value.toLowerCase().trim();
    const category = document.getElementById("categoryFilter").value;
    const status = document.getElementById("statusFilter").value;
    const filtered = projects.filter(project => {
        const matchesSearch = `${project.name} ${project.owner} ${project.description}`.toLowerCase().includes(search);
        return matchesSearch && (category === "all" || project.category === category) && (status === "all" || project.status === status);
    });
    grid.innerHTML = filtered.map(project => `
        <article class="project-card">
            <div class="card-top"><span class="category">${project.category}</span><span class="status">${project.status}</span></div>
            <h3>${project.name}</h3><p>${project.description}</p>
            <div class="card-footer"><span class="owner">By ${project.owner}</span><div class="card-actions"><button data-view="${project.id}">View</button>${project.userCreated ? `<button data-delete="${project.id}" aria-label="Delete ${project.name}">Delete</button>` : ""}</div></div>
        </article>`).join("");
    emptyState.hidden = filtered.length > 0;
    document.getElementById("projectCount").textContent = projects.length.toString().padStart(2, "0");
    document.getElementById("studentCount").textContent = new Set(projects.map(project => project.owner)).size.toString().padStart(2, "0");
}

function openProject(project) {
    document.getElementById("dialogContent").innerHTML = `<p class="dialog-meta">${project.category} / ${project.status}</p><h2 class="dialog-title">${project.name}</h2><p class="dialog-description">${project.description}</p><p class="dialog-owner">Project by ${project.owner}</p>`;
    document.getElementById("projectDialog").showModal();
}

grid.addEventListener("click", event => {
    const viewId = event.target.dataset.view;
    const deleteId = event.target.dataset.delete;
    if (viewId) openProject(projects.find(project => project.id === Number(viewId)));
    if (deleteId) { projects = projects.filter(project => project.id !== Number(deleteId)); localStorage.setItem("projecthub-projects", JSON.stringify(projects)); renderProjects(); }
});
["searchInput", "categoryFilter", "statusFilter"].forEach(id => document.getElementById(id).addEventListener("input", renderProjects));
document.getElementById("closeDialog").addEventListener("click", () => document.getElementById("projectDialog").close());
document.getElementById("projectForm").addEventListener("submit", event => {
    event.preventDefault();
    const project = { id: Date.now(), name: document.getElementById("projectName").value.trim(), owner: document.getElementById("studentName").value.trim(), category: document.getElementById("projectCategory").value, status: document.getElementById("projectStatus").value, description: document.getElementById("projectDescription").value.trim(), userCreated: true };
    projects = [project, ...projects];
    localStorage.setItem("projecthub-projects", JSON.stringify(projects));
    event.target.reset();
    document.getElementById("formMessage").textContent = `${project.name} is now in your project library.`;
    renderProjects();
    document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
});
renderProjects();