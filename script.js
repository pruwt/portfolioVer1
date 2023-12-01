function toggleMenu(){
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
let contributionsPage = 1; // Initialize page for contributions API pagination

function getOverview() {
    const username = document.getElementById('username').value;

    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.message === "Not Found") {
                alert("User not found. Please enter a valid GitHub username.");
                return;
            }

            document.getElementById('output').style.display = "block";
            document.getElementById('profile').innerHTML = `<img src="${data.avatar_url}" alt="Profile Image" />`;

            const infoElement = document.getElementById('info');
            infoElement.innerHTML = `
                <h2>${data.name || username}</h2>
                <p>${data.bio || 'No bio available'}</p>
                <p>Followers: ${data.followers} | Following: ${data.following}</p>
            `;

            loadContributions(username);
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function loadContributions(username) {
    fetch(`https://api.github.com/users/${username}/events?page=${contributionsPage}&per_page=5`)
        .then(response => response.json())
        .then(eventsData => {
            if (eventsData.length === 0) {
                document.getElementById('info').innerHTML += '<p>No contribution activity found.</p>';
                document.getElementById('loadMoreBtn').style.display = 'none';
                return;
            }

            const contributionsElement = document.getElementById('info');
            contributionsElement.innerHTML += '<h3>Contributions in the Last Year:</h3>';
            
            eventsData.forEach(event => {
                const repoName = event.repo.name;
                const eventType = event.type;

                contributionsElement.innerHTML += `<p>${eventType} in ${repoName}</p>`;
            });

            document.getElementById('loadMoreBtn').style.display = 'block';
        })
        .catch(error => console.error('Error fetching contributions:', error));
}

function loadMoreActivity() {
    contributionsPage++;
    const username = document.getElementById('username').value;
    loadContributions(username);
}


document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
  
    // Check if user has a dark mode preference stored
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  
    // Set initial dark mode state
    if (isDarkMode) {
      body.classList.add('dark-mode');
    }
  
    // Toggle dark mode when the button is clicked
    darkModeToggle.addEventListener('click', function () {
      body.classList.toggle('dark-mode');
      // Update user preference in localStorage
      const darkModeEnabled = body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
    });
  });
  