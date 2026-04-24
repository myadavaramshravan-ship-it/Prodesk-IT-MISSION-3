
const input = document.getElementById("username");
const card = document.getElementById("card");
const reposContainer = document.getElementById("repos");

const message = document.createElement("p");
document.body.appendChild(message);

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    fetchUser(input.value);
  }
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function fetchUser(username) {

  card.style.display = "none";
  reposContainer.innerHTML = "";
  message.innerText = "spinning...";

  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then(data => {

      message.innerText = "";
      card.style.display = "block";

      
      document.getElementById("avatar").src = data.avatar_url;
      document.getElementById("name").innerText = data.name || data.login;
      document.getElementById("bio").innerText = data.bio || "No bio available";

      let date = new Date(data.created_at);
      document.getElementById("date").innerText = formatDate(date);

      const blogElement = document.getElementById("blog");

if (data.blog && data.blog.trim() !== "") {

  let url = data.blog.trim();

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  blogElement.href = url;
  blogElement.innerText = "Visit Portfolio";

} else {
  blogElement.href = data.html_url;
  blogElement.innerText = "View GitHub Profile";
}
    
      return fetch(data.repos_url);
    })
    .then(res => res.json())
    .then(repos => {

      
      repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      const top5 = repos.slice(0, 5);

      reposContainer.innerHTML = "<h3>Latest Repositories</h3>";

      top5.forEach(repo => {
        const div = document.createElement("div");

        div.innerHTML = `
          <p>
            <a href="${repo.html_url}" target="_blank">
              ${repo.name}
            </a><br>
             Date:${formatDate(repo.updated_at)}
          </p>
        `;
        reposContainer.appendChild(div);
      });
    })
    .catch(err => {
      card.style.display = "none";
      reposContainer.innerHTML = "";
      message.innerText = "❌ User Not Found";
      message.style.color = "red";
    });
}
