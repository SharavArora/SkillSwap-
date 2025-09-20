// Add a post (must include userId)
db.ref("posts").push({
  skill: skill,
  description: description,
  userId: firebase.auth().currentUser.uid,
  userName: firebase.auth().currentUser.displayName,
  timestamp: Date.now()
});

// Listen for posts in real-time
db.ref("posts").on("value", snapshot => {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";
  snapshot.forEach(child => {
    const post = child.val();
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<strong>${post.skill}</strong><br>${post.description}<br><small>by ${post.userName}</small>`;
    postsContainer.appendChild(div);
  });
});
