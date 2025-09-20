document.addEventListener("DOMContentLoaded", () => {
  const GEMINI_KEY = "AIzaSyCG1d00zLgBaFGh9J1XB3B3K5OgAM7Ker0";
  const API_BASE = "https://api.gemini.com/v1";

  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const postForm = document.getElementById("post-form");
  const postBtn = document.getElementById("post-btn");
  const skillInput = document.getElementById("skill-input");
  const descInput = document.getElementById("desc-input");
  const postsContainer = document.getElementById("posts-container");
  const allSkillsTitle = document.getElementById("all-skills-title");

  let currentUser = null;
  let postsData = [];

  async function signup(username, password){
    try{
      const res = await fetch(`${API_BASE}/users`,{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":GEMINI_KEY},
        body: JSON.stringify({username,password})
      });
      const data = await res.json();
      if(data.success) alert("Sign-up complete, login now");
      else alert("Error signing up");
    }catch(err){ console.error(err); alert("Sign-up error"); }
  }

  async function login(username,password){
    try{
      const res = await fetch(`${API_BASE}/users/auth`,{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":GEMINI_KEY},
        body: JSON.stringify({username,password})
      });
      const data = await res.json();
      if(data.success){
        currentUser=username;
        document.getElementById("auth-container").classList.add("hidden");
        postForm.classList.remove("hidden");
        allSkillsTitle.classList.remove("hidden");
        fetchPosts();
      }else alert("Login failed");
    }catch(err){ console.error(err); alert("Login error"); }
  }

  signupBtn.addEventListener("click",()=>{ const u=usernameInput.value.trim(),p=passwordInput.value.trim(); if(!u||!p)return alert("Fill all fields"); signup(u,p); });
  loginBtn.addEventListener("click",()=>{ const u=usernameInput.value.trim(),p=passwordInput.value.trim(); if(!u||!p)return alert("Fill all fields"); login(u,p); });

  async function fetchPosts(){
    try{
      const res = await fetch(`${API_BASE}/posts?apiKey=${GEMINI_KEY}`);
      postsData = await res.json();
      renderPosts(postsData);
    }catch(err){ console.error(err); }
  }

  postBtn.addEventListener("click", async ()=>{
    const skill=skillInput.value.trim(),desc=descInput.value.trim();
    if(!skill||!desc) return alert("Fill all fields!");
    if(!currentUser) return alert("Login first");
    try{
      await fetch(`${API_BASE}/posts`,{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":GEMINI_KEY},
        body:JSON.stringify({user:currentUser,skill,description:desc,timestamp:Date.now()})
      });
      skillInput.value=""; descInput.value="";
      fetchPosts();
    }catch(err){ console.error(err); alert("Error posting"); }
  });

  function renderPosts(posts){
    postsContainer.innerHTML="";
    posts.sort((a,b)=>b.timestamp-a.timestamp).forEach(p=>{
      const div=document.createElement("div"); div.className="post";
      div.innerHTML=`<strong>${p.skill}</strong><br>${p.description}<br><small>by ${p.user}</small>`;
      postsContainer.appendChild(div);
    });
  }
});
