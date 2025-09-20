document.addEventListener("DOMContentLoaded", () => {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCG1d00zLgBaFGh9J1XB3B3K5OgAM7Ker0",
    authDomain: "skillswap-3f096.firebaseapp.com",
    databaseURL: "https://skillswap-3f096-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "skillswap-3f096",
    storageBucket: "skillswap-3f096.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();

  // DOM elements
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const postForm = document.getElementById("post-form");
  const postBtn = document.getElementById("post-btn");
  const skillInput = document.getElementById("skill-input");
  const descInput = document.getElementById("desc-input");
  const postsContainer = document.getElementById("posts-container");

  // Google sign-in
  loginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => alert(err.message));
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    auth.signOut().catch(err => alert(err.message));
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

    if (!skill || !description) return alert("Please fill both fields.");
    if (!user) return alert("You must be signed in!");

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
  db.ref("posts").orderByChild("timestamp").on("value", snapshot => {
    postsContainer.innerHTML = "";
    snapshot.forEach(child => {
      const post = child.val();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `<strong>${post.skill}</strong><br>${post.description}<br><small>by ${post.userName}</small>`;
      postsContainer.prepend(div); // newest first
    });
  });
});

