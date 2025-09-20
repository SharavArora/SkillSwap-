document.addEventListener("DOMContentLoaded", () => {
  const pages = {
    login: document.getElementById("login-page"),
    signup: document.getElementById("signup-page"),
    app: document.getElementById("app-page"),
    about: document.getElementById("about-page"),
    settings: document.getElementById("settings-page")
  };

  const usersKey = "skillswap-users";
  const postsKey = "skillswap-posts";
  let currentUser = localStorage.getItem("skillswap-currentUser") || null;

  // Toggle Pages
  function showPage(name){
    for(const p in pages) pages[p].classList.add("hidden");
    pages[name].classList.remove("hidden");
  }

  if(currentUser) {
    showPage("app");
    document.getElementById("current-user").innerText=currentUser;
    renderPosts();
  } else showPage("login");

  // Login
  document.getElementById("login-btn").addEventListener("click",()=>{
    const u=document.getElementById("login-username").value.trim();
    const p=document.getElementById("login-password").value.trim();
    const users=JSON.parse(localStorage.getItem(usersKey)||"{}");
    if(users[u] && users[u]===p){
      currentUser=u;
      localStorage.setItem("skillswap-currentUser",u);
      document.getElementById("current-user").innerText=currentUser;
      showPage("app"); renderPosts();
    } else alert("Login failed!");
  });

  // Signup
  document.getElementById("signup-btn").addEventListener("click",()=>{
    const u=document.getElementById("signup-username").value.trim();
    const p=document.getElementById("signup-password").value.trim();
    if(!u||!p)return alert("Fill all fields!");
    const users=JSON.parse(localStorage.getItem(usersKey)||"{}");
    if(users[u]) return alert("Username exists!");
    users[u]=p;
    localStorage.setItem(usersKey,JSON.stringify(users));
    alert("Sign-up successful! Login now.");
    showPage("login");
  });

  // Switch pages
  document.getElementById("show-signup").addEventListener("click",()=>showPage("signup"));
  document.getElementById("show-login").addEventListener("click",()=>showPage("login"));
  document.getElementById("back-to-app").addEventListener("click",()=>showPage("app"));
  document.getElementById("goto-settings").addEventListener("click",()=>showPage("settings"));
  document.getElementById("back-to-app-settings").addEventListener("click",()=>showPage("app"));

  // Logout
  document.getElementById("logout-btn").addEventListener("click",logout);
  document.getElementById("logout-settings-btn").addEventListener("click",logout);
  function logout(){ localStorage.removeItem("skillswap-currentUser"); currentUser=null; showPage("login"); }

  // Posts
  const postBtn=document.getElementById("post-btn");
  postBtn.addEventListener("click",()=>{
    const skill=document.getElementById("skill-input").value.trim();
    const desc=document.getElementById("desc-input").value.trim();
    if(!skill||!desc) return alert("Fill all fields!");
    const posts=JSON.parse(localStorage.getItem(postsKey)||"[]");
    posts.push({user:currentUser, skill, description:desc, timestamp:Date.now()});
    localStorage.setItem(postsKey,JSON.stringify(posts));
    document.getElementById("skill-input").value="";
    document.getElementById("desc-input").value="";
    renderPosts();
  });

  function renderPosts(){
    const container=document.getElementById("posts-container");
    const posts=JSON.parse(localStorage.getItem(postsKey)||"[]");
    container.innerHTML="";
    posts.sort((a,b)=>b.timestamp-a.timestamp).forEach(p=>{
      const div=document.createElement("div");
      div.className="post";
      div.innerHTML=`<strong>${p.skill}</strong><br>${p.description}<br><small>by ${p.user}</small>`;
      container.appendChild(div);
    });
  }
});
