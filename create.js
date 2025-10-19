const form = document.getElementById("signupForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!username || !email || !password || !confirmPassword) {
    errorMsg.textContent = "All fields are required.";
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  errorMsg.textContent = "";

  // Try to register with backend API. If backend is unavailable, fall back to localStorage (existing behavior)
  try {
    const resp = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, email, password })
    });

    if (resp.ok) {
      const data = await resp.json();
      // store minimal user info in localStorage so existing login page will work unchanged
      localStorage.setItem('user', JSON.stringify({ name: data.user.name, email: data.user.email, password }));
      alert('Account created successfully! Welcome to CINEMORA, ' + username + '!');
      window.location.href = 'index.html';
      return;
    } else {
      const err = await resp.json().catch(() => ({}));
      // If email already exists or other validation, show message and stop
      errorMsg.textContent = err.message || 'Failed to register. Please try again.';
      return;
    }
  } catch (e) {
    // Backend not reachable - fallback to localStorage behavior
    console.warn('Backend not reachable, falling back to localStorage. Error:', e);
    localStorage.setItem('user', JSON.stringify({ name: username, email, password }));
    alert('Account created successfully! Welcome to CINEMORA, ' + username + '! (offline)');
    window.location.href = 'index.html';
  }
});