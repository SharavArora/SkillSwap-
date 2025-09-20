class SkillSwapApp {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('skillswap_users') || '{}');
        this.posts = JSON.parse(localStorage.getItem('skillswap_posts') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('skillswap_current_user') || 'null');
        this.bannedWords = ['spam','scam','fake','illegal','drugs','weapon','violence'];
        this.init();
    }

    init() {
        this.bindEvents();
        if(this.currentUser) this.showApp();
        else this.showAuth();
    }

    bindEvents() {
        document.getElementById('showSignup').addEventListener('click', ()=>this.toggleAuthForm('signup'));
        document.getElementById('showLogin').addEventListener('click', ()=>this.toggleAuthForm('login'));
        document.getElementById('loginForm').querySelector('form').addEventListener('submit', e=>{e.preventDefault(); this.handleLogin()});
        document.getElementById('signupForm').querySelector('form').addEventListener('submit', e=>{e.preventDefault(); this.handleSignup()});
        document.getElementById('logoutBtn').addEventListener('click', ()=>this.handleLogout());
        document.getElementById('postForm').addEventListener('submit', e=>{e.preventDefault(); this.handleCreatePost()});
    }

    toggleAuthForm(form){
        document.getElementById('loginForm').classList.toggle('hidden', form==='signup');
        document.getElementById('signupForm').classList.toggle('hidden', form==='login');
        this.clearMessages();
    }

    handleLogin(){
        const email=document.getElementById('loginEmail').value.trim();
        const password=document.getElementById('loginPassword').value;
        if(!email||!password){this.showMessage('Please fill all fields','error'); return;}
        const user=this.users[email];
        if(!user){this.showMessage('No account with this email','error'); return;}
        if(this.hashPassword(password)!==user.hashedPassword){this.showMessage('Password incorrect','error'); return;}
        this.currentUser={email:email, signupDate:user.signupDate};
        localStorage.setItem('skillswap_current_user', JSON.stringify(this.currentUser));
        this.showApp();
        document.getElementById('loginEmail').value='';
        document.getElementById('loginPassword').value='';
    }

    handleSignup(){
        const email=document.getElementById('signupEmail').value.trim();
        const password=document.getElementById('signupPassword').value;
        const confirm=document.getElementById('confirmPassword').value;
        if(!email||!password||!confirm){this.showMessage('Please fill all fields','error'); return;}
        if(password!==confirm){this.showMessage('Passwords do not match','error'); return;}
        if(password.length<6){this.showMessage('Password must be 6+ chars','error'); return;}
        if(this.users[email]){this.showMessage('Account already exists','error'); return;}
        const signupDate=new Date().toISOString();
        this.users[email]={hashedPassword:this.hashPassword(password), signupDate:signupDate};
        localStorage.setItem('skillswap_users', JSON.stringify(this.users));
        this.currentUser={email:email,signupDate:signupDate};
        localStorage.setItem('skillswap_current_user', JSON.stringify(this.currentUser));
        this.showApp();
        this.clearMessages();
        document.getElementById('signupEmail').value='';
        document.getElementById('signupPassword').value='';
        document.getElementById('confirmPassword').value='';
    }

    handleLogout(){
        this.currentUser=null;
        localStorage.removeItem('skillswap_current_user');
        this.showAuth();
    }

    handleCreatePost(){
        const offered=document.getElementById('skillOffered').value.trim();
        const wanted=document.getElementById('skillWanted').value.trim();
        const contact=document.getElementById('contactInfo').value.trim();
        if(!offered||!wanted||!contact){this.showMessage('Fill all fields','error'); return;}
        if(this.containsBannedWords(offered+' '+wanted+' '+contact)){this.showMessage('Prohibited content','error'); return;}
        const today=new Date().toDateString();
        const userPostsToday=this.posts.filter(p=>p.userEmail===this.currentUser.email && new Date(p.timestamp).toDateString()===today).length;
        if(userPostsToday>=100){this.showMessage('Reached daily limit 100 posts','error'); return;}
        const post={id:Date.now()+Math.random(), skillOffered:offered, skillWanted:wanted, contactInfo:contact, userEmail:this.currentUser.email, timestamp:new Date().toISOString()};
        this.posts.unshift(post);
        localStorage.setItem('skillswap_posts', JSON.stringify(this.posts));
        document.getElementById('postForm').reset();
        this.showMessage('Post created successfully!','success');
        this.renderPosts();
        this.updatePostCount();
    }

    showAuth(){document.getElementById('authContainer').classList.remove('hidden'); document.getElementById('appContainer').classList.add('hidden');}
    showApp(){document.getElementById('authContainer').classList.add('hidden'); document.getElementById('appContainer').classList.remove('hidden'); document.getElementById('userEmail').textContent=this.currentUser.email; this.updatePostCount(); this.renderPosts();}
    updatePostCount(){const today=new Date().toDateString(); const userPostsToday=this.posts.filter(p=>p.userEmail===this.currentUser.email && new Date(p.timestamp).toDateString()===today).length; document.getElementById('postCount').textContent=userPostsToday;}
    renderPosts(){const c=document.getElementById('postsContainer'); if(this.posts.length===0){c.innerHTML='<div class="loading">No posts yet. Be the first!</div>'; return;} c.innerHTML=this.posts.map(p=>`<div class="post-card"><div class="post-header"><div class="post-date">${new Date(p.timestamp).toLocaleDateString()} at ${new Date(p.timestamp).toLocaleTimeString()}</div></div><div class="skill-exchange"><div class="skill-box skill-offered"><div><strong>Can Offer:</strong></div><div>${this.escapeHtml(p.skillOffered)}</div></div><div class="exchange-arrow">⇄</div><div class="skill-box skill-wanted"><div><strong>Looking For:</strong></div><div>${this.escapeHtml(p.skillWanted)}</div></div></div><div class="contact-info"><strong>Contact:</strong> ${this.escapeHtml(p.contactInfo)}</div></div>`).join('');}
    showMessage(msg,type){const c=document.getElementById('messageContainer');const d=document.createElement('div');d.className=type==='error'?'error-message':'success-message';d.textContent=msg;c.innerHTML='';c.appendChild(d);setTimeout(()=>d.remove(),5000);}
    clearMessages(){document.getElementById('messageContainer').innerHTML='';}
    hashPassword(p){let h=0;for(let i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h=h&h;} return h.toString();}
    containsBannedWords(t){const l=t.toLowerCase(); return this.bannedWords.some(w=>l.includes(w));}
    escapeHtml(t){const d=document.createElement('div'); d.textContent=t; return d.innerHTML;}
}

document.addEventListener('DOMContentLoaded', ()=>{new SkillSwapApp();});
