const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    errorMsg.textContent = "Please fill in both fields.";
    return;
  }

  errorMsg.textContent = "";

  // If username looks like an email, try server-side login first
  const looksLikeEmail = username.includes('@');

  if (looksLikeEmail) {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });

      if (resp.ok) {
        const data = await resp.json();
        // keep compatibility with other pages: store user and password in localStorage
        localStorage.setItem('user', JSON.stringify({ name: data.user.name, email: data.user.email, password }));
        alert('Welcome back, ' + data.user.name + '!');
        window.location.href = 'mainpage.html';
        return;
      } else {
        const err = await resp.json().catch(() => ({}));
        errorMsg.textContent = err.message || 'Invalid email or password.';
        return;
      }
    } catch (e) {
      // Server unreachable; fall through to localStorage check below
      console.warn('Login API not reachable, falling back to localStorage check. Error:', e);
    }
  }

  // Fallback/local check: compare to localStorage user (the site used to keep user there)
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Allow login by username (name) or email
      const matchName = user.name && user.name === username && user.password === password;
      const matchEmail = user.email && user.email === username && user.password === password;
      if (matchName || matchEmail) {
        alert('Welcome back, ' + user.name + '!');
        window.location.href = 'mainpage.html';
        return;
      }
    }
  } catch (err) {
    console.error('Error reading localStorage user:', err);
  }

  errorMsg.textContent = 'Invalid username or password.';
});