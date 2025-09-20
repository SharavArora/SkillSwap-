document.addEventListener("DOMContentLoaded", () => {
  const GEMINI_KEY = "AIzaSyCG1d00zLgBaFGh9J1XB3B3K5OgAM7Ker0"; // Use wisely
  const API_BASE = "https://api.gemini.com/v1"; // Replace with actual Gemini endpoint

  const userInput = document.getElementById("user-input");
  const skillInput = document.getElementById("skill-input");
  const descInput = document.getElementById("desc-input");
  const postBtn = document.getElementById("post-btn");
  const postsContainer = document.getElementById("posts-container");
  const searchInput = document.getElementById("search-input");

  let postsData = [];

  // Fetch posts from Gemini
  async function fetchPosts() {
    try {
      const res = await fetch(`${API_BASE}/posts?apiKey=${GEMINI_KEY}`);
      postsData = await res.json();
      renderPosts(postsData);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }

  // Post a new skill
  postBtn.addEventListener("click", async () => {
    const user = userInput.value.trim();
    const skill = skillInput.value.trim();
    const desc = descInput.value.trim();

    if (!user || !skill || !desc) return alert("Please fill all fields!");

    const newPost = {
      user,
      skill,
      description: desc,
      timestamp: Date.now()
    };

    try {
      await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": GEMINI_KEY
        },
        body: JSON.stringify(newPost)
      });

      // Clear inputs
      userInput.value = "";
      skillInput.value = "";
      descInput.value = "";

      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error("Error posting skill:", err);
    }
  });

  // Render posts in newest-first order
  function renderPosts(posts) {
    postsContainer.innerHTML = "";
    posts
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach(post => {
        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `
          <strong>${post.skill}</strong><br>
          ${post.description}<br>
          <small>by ${post.user}</small>
        `;
        postsContainer.appendChild(div);
      });
  }

  // Search posts dynamically
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = postsData.filter(post =>
      post.skill.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.user.toLowerCase().includes(query)
    );
    renderPosts(filtered);
  });

  // Initial fetch
  fetchPosts();
});
