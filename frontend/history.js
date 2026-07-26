const userId = sessionStorage.getItem("userId");

if (!userId) {
    window.location.href = "login.html";
}

async function loadHistory() {

    try {

        const response = await fetch(`http://127.0.0.1:8000/history/${userId}`);

        const history = await response.json();

        const container = document.getElementById("historyContainer");

        if (history.length === 0) {

            container.innerHTML = "<h3>No recommendations found.</h3>";

            return;

        }

        let html = "";

        history.forEach(item => {

            html += `

<div class="history-card">

    <h3>${item.goal}</h3>

    <p><strong>Skills:</strong> ${item.skills}</p>

    <p><strong>Experience:</strong> ${item.experience}</p>

    <p><strong>Date:</strong> ${item.created_at}</p>

    <details>

        <summary>View AI Recommendation</summary>

        <div class="recommendation-section">

            <h4>📌 Missing Skills</h4>
            <ul>
                ${item.recommendation.missing_skills.map(skill => `<li>${skill}</li>`).join("")}
            </ul>

            <h4>🛣️ Learning Roadmap</h4>
            <ol>
                ${item.recommendation.learning_roadmap.map(step => `<li>${step}</li>`).join("")}
            </ol>

            <h4>💻 Projects</h4>
            <ul>
                ${item.recommendation.projects.map(project => `<li>${project}</li>`).join("")}
            </ul>

            <h4>📚 Resources</h4>
            <ul>
                ${item.recommendation.resources.map(resource => `<li>${resource}</li>`).join("")}
            </ul>

            <h4>⏳ Estimated Time</h4>
            <p>${item.recommendation.estimated_time}</p>

            <h4>📈 Readiness Score</h4>

            <progress value="${item.recommendation.readiness_score}" max="100"></progress>

            <p>${item.recommendation.readiness_score}%</p>

        </div>

    </details>

</div>

`;

        });

        container.innerHTML = html;

    } catch (error) {

        alert("Unable to load history.");

        console.log(error);

    }

}

loadHistory();