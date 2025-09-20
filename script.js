document.addEventListener("DOMContentLoaded", () => {
  // Firebase config
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "https://skillswap-3f096-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();

  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const postForm = document.getElementById("post-form");
  const postBtn = document.getElementById("post-btn");
  const skillInput = document.getElementById("skill-input");
  const descInput = document.getElementById("desc-input");
  const postsContainer = document.getElementById("posts-container");

  // Google login
  loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => console.error(err));
  });

  logoutBtn.addEventListener("click", () => {
    auth.signOut().catch(err => console.error(err));
  });

  // Auth state listener
  auth.onAuthStateChanged(user => {
    if (user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
      postForm.style.display = "flex";
    } else {
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
      postForm.style.display = "none";
    }
  });

  // Post skill
  postBtn.addEventListener("click", () => {
    const skill = skillInput.value.trim();
    const description = descInput.value.trim();
    const user = auth.currentUser;

    if (!skill || !description) return alert("Fill both fields!");
    if (!user) return alert("You must be logged in!");

    db.ref("posts").push({
      skill,
      description,
      userId: user.uid,
      userName: user.displayName,
      timestamp: Date.now()
    });

    skillInput.value = "";
    descInput.value = "";
  });

  // Real-time posts listener
  db.ref("posts").on("value", snapshot => {
    postsContainer.innerHTML = "";
    snapshot.forEach(child => {
      const post = child.val();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `<strong>${post.skill}</strong><br>${post.description}<br><small>by ${post.userName}</small>`;
      postsContainer.appendChild(div);
    });
  });
});
