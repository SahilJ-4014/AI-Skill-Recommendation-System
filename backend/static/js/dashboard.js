const userId = sessionStorage.getItem("userId");
const userName = sessionStorage.getItem("userName");

if (!userId) {
    window.location.href = "login.html";
}

document.getElementById("welcomeText").textContent =
    `Welcome, ${userName}`;

const generateBtn = document.getElementById("generateBtn");
const historyBtn = document.getElementById("historyBtn");
const logoutBtn = document.getElementById("logoutBtn");

const result = document.getElementById("result");
const loading = document.getElementById("loading");

generateBtn.addEventListener("click", async () => {

    const skills = document.getElementById("skills").value.trim();
    const experience = document.getElementById("experience").value;
    const goal = document.getElementById("goal").value.trim();

    if (!skills || !experience || !goal) {
        alert("Please fill all fields.");
        return;
    }

    loading.style.display = "block";
    result.innerHTML = "";

    try {

        const response = await fetch("/recommend", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_id: Number(userId),
                skills: skills,
                experience: experience,
                goal: goal
            })

        });

        const data = await response.json();

        loading.style.display = "none";

        result.innerHTML = `

            <div class="card-box">

                <h2>Missing Skills</h2>

                <ul>
                    ${data.missing_skills.map(skill => `<li>${skill}</li>`).join("")}
                </ul>

            </div>

            <div class="card-box">

                <h2>Learning Roadmap</h2>

                <ol>
                    ${data.learning_roadmap.map(step => `<li>${step}</li>`).join("")}
                </ol>

            </div>

            <div class="card-box">

                <h2>Projects</h2>

                <ul>
                    ${data.projects.map(project => `<li>${project}</li>`).join("")}
                </ul>

            </div>

            <div class="card-box">

                <h2>Resources</h2>

                <ul>
                    ${data.resources.map(resource => `<li>${resource}</li>`).join("")}
                </ul>

            </div>

            <div class="card-box">

                <h2>Estimated Time</h2>

                <p>${data.estimated_time}</p>

            </div>

            <div class="card-box">

                <h2>Readiness Score</h2>

                <progress value="${data.readiness_score}" max="100"></progress>

                <p>${data.readiness_score}%</p>

            </div>

        `;

    } catch (error) {

        loading.style.display = "none";

        alert("Unable to connect backend.");

        console.log(error);

    }

});

historyBtn.addEventListener("click", () => {

    window.location.href = "history.html";

});

logoutBtn.addEventListener("click", () => {

    sessionStorage.clear();

    window.location.href = "login.html";

});