const eventsList = document.getElementById("eventsList");
const membersList = document.getElementById("membersList");

function checkAuth() {
  const token = localStorage.getItem("jwt");

  if (!token) {
    // No token, redirect to login
    window.location.href = "auth.html";
    return null;
  }

  return token;
}

// Fetch and display events
const eventCard = (ev) => {
  const date = new Date(ev.date);

  const year = date.getFullYear().toString().slice(-2); // last 2 digits of year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  const formatted = `${year}/${month}/${day}`;

  const container = document.createElement("li");
  container.className = "event-container";
  container.innerHTML = `<h2>${ev.title}</h2>
        <h4>${formatted}</h4>
        <p>${ev.description}</p>
        <img src="https://club-server-25gd.onrender.com${ev.image}"></img>
        <button class="delete" onclick="deleteEvent('${ev._id}')">Delete</button>
    `;
  return container;
};

async function loadEvents() {
  const token = checkAuth();
  if (!token) return;

  const res = await fetch("https://club-server-25gd.onrender.com/events", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    localStorage.removeItem("jwt"); // invalid token
    window.location.href = "auth.html";
    return;
  }

  const events = await res.json();
  console.log(events);

  eventsList.innerHTML = "";
  events.forEach((ev) => {
    eventsList.appendChild(eventCard(ev));
  });
}

async function deleteEvent(id) {
  const token = checkAuth();
  if (!token) return;

  await fetch(`https://club-server-25gd.onrender.com/events/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadEvents();
}

document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = checkAuth(); // your function to get JWT
  if (!token) return;

  const formData = new FormData(e.target); // keeps the file as blob

  await fetch("https://club-server-25gd.onrender.com/events/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // only the auth header
    },
    body: formData, // send FormData directly
  });

  e.target.reset();
  loadEvents();
});

// Fetch and display members
const memberCard = (m) => {
  const container = document.createElement("li");
  container.className = "member-container";
  container.innerHTML = `
    <h2>${m.username}</h2>
    <p><strong>Email:</strong> ${m.email}</p>
    <p><strong>Phone:</strong> ${m.phone}</p>
    <p><strong>Activities:</strong> ${m.activities.join(", ")}</p>
    ${m.message ? `<p><strong>Message:</strong> ${m.message}</p>` : ""}
    <button class="delete" onclick="deleteMember('${m._id}')">Delete</button>
  `;
  return container;
};

async function loadMembers() {
  const token = checkAuth();
  if (!token) return;

  const res = await fetch("https://club-server-25gd.onrender.com/members", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    localStorage.removeItem("jwt");
    window.location.href = "auth.html";
    return;
  }

  const members = await res.json();
  membersList.innerHTML = "";
  members.forEach((m) => {
    membersList.appendChild(memberCard(m));
  });
}

async function deleteMember(id) {
  const token = checkAuth();
  if (!token) return;

  await fetch(`https://club-server-25gd.onrender.com/members/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  loadMembers();
}

document.getElementById("memberForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = checkAuth();
  if (!token) return;

  const formData = new FormData(e.target);
  const activities = formData.getAll("activities");
  console.log(activities);

  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    activities,
    message: formData.get("message"),
  };

  await fetch("https://club-server-25gd.onrender.com/members/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  e.target.reset();
  loadMembers();
});

// Initial load
checkAuth();
loadEvents();
loadMembers();
