document.addEventListener("DOMContentLoaded", () => {
  const GEMINI_KEY = "AIzaSyCG1d00zLgBaFGh9J1XB3B3K5OgAM7Ker0";
  const API_BASE = "https://api.gemini.com/v1"; // replace with your actual endpoint

  const usernameInput = document.getElementById("username-input");
  const loginBtn = document.getElementById("login-btn");
  const postForm = document.getElementById("post-form");
  const searchContainer = document.getElementById("search-container");
  const allSkillsTitle = document.getElementById("all-skills-title");

  const skillInput = document.getElementById("skill-input");
  const descInput = document.getElementById("desc-input");
  const postBtn = document.getElementById("post-btn");
  const postsContainer = document.getElementById("posts-container");
  const searchInput = document.getElementById("search-input");

  let currentUser = null;
  let postsData = [];

  // Login function
  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (!username) return alert("Enter your name or handle!");
    currentUser = username;

    // Hide auth, show post/search
    document.querySelector(".auth-container").classList.add("hidden");
    postForm.classList.remove("hidden");
    searchContainer.classList.remove("hidden");
    allSkillsTitle.classList.remove("hidden");

    fetchPosts();
  });

  // Fetch posts
  async function fetchPosts() {
    try {
      const res = await fetch(`${API_BASE}/posts?apiKey=${GEMINI_KEY}`);
      postsData = await res.json();
      renderPosts(postsData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // Post skill
  postBtn.addEventListener("click", async () => {
    const skill = skillInput.value.trim();
    const desc = descInput.value.trim();
    if (!skill || !desc) return alert("Fill all fields!");
    if (!currentUser) return alert("You must login!");

    const newPost = { user: currentUser, skill, description: desc, timestamp: Date.now() };

    try {
      await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": GEMINI_KEY
        },
        body: JSON.stringify(newPost)
      });

      skillInput.value = "";
      descInput.value = "";
      fetchPosts(); // Refresh
    } catch (err) {
      console.error("Post error:", err);
    }
  });

  // Render posts
  function renderPosts(posts) {
    postsContainer.innerHTML = "";
    posts.sort((a,b) => b.timestamp - a.timestamp).forEach(post => {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `<strong>${post.skill}</strong><br>${post.description}<br><small>by ${post.user}</small>`;
      postsContainer.appendChild(div);
    });
  }

  // Search posts
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = postsData.filter(post =>
      post.skill.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.user.toLowerCase().includes(query)
    );
    renderPosts(filtered);
  });
});
