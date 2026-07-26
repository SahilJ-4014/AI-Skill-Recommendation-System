const button = document.getElementById("generateBtn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const historyBtn = document.getElementById("historyBtn");

button.addEventListener("click", async function () {

    const skills = document.getElementById("skills").value.trim();
    const experience = document.getElementById("experience").value;
    const goal = document.getElementById("goal").value;

    if (skills === "" || experience === "" || goal === "") {
        alert("Please fill all fields.");
        return;
    }

    loading.style.display = "block";
    result.style.display = "none";

    try {

        const response = await fetch("http://127.0.0.1:8000/recommend", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                skills: skills,
                experience: experience,
                goal: goal
            })

        });

        const data = await response.json();

        loading.style.display = "none";

        result.style.display = "block";

        // result.innerHTML = `
        //     <h2>AI Recommendation</h2>

        //     <pre>${data.recommendation}</pre>
        //     `;

        result.innerHTML = `
<h2>AI Recommendation</h2>

<div class="card-box">
<h3>Missing Skills</h3>
<ul>
${data.missing_skills.map(skill=>`<li>${skill}</li>`).join("")}
</ul>
</div>

<div class="card-box">
<h3>Learning Roadmap</h3>
<ol>
${data.learning_roadmap.map(step=>`<li>${step}</li>`).join("")}
</ol>
</div>

<div class="card-box">
<h3>Projects</h3>
<ul>
${data.projects.map(project=>`<li>${project}</li>`).join("")}
</ul>
</div>

<div class="card-box">
<h3>Resources</h3>
<ul>
${data.resources.map(resource=>`<li>${resource}</li>`).join("")}
</ul>
</div>

<div class="card-box">
<h3>Estimated Time</h3>
<p>${data.estimated_time}</p>
</div>

<div class="card-box">
<h3>Readiness Score</h3>
<p>${data.readiness_score}%</p>
<progress value="${data.readiness_score}" max="100"></progress>
</div>
`;

    }
    catch(error){

        loading.style.display = "none";

        alert("Unable to connect to backend.");

        console.log(error);

    }

});


historyBtn.addEventListener("click", async function () {

    loading.style.display = "block";

    result.style.display = "none";

    try {

        const response = await fetch("http://127.0.0.1:8000/history");

        const history = await response.json();

        loading.style.display = "none";

        result.style.display = "block";

        if(history.length === 0){

            result.innerHTML = `
                <h2>No Recommendation History Found</h2>
            `;

            return;
        }

        let output = "<h2>Recommendation History</h2>";

        history.forEach(item => {

            output += `

            <div class="history-card">

                <h3>${item.goal}</h3>

                <p><strong>Skills:</strong> ${item.skills}</p>

                <p><strong>Experience:</strong> ${item.experience}</p>

                <p><strong>Date:</strong> ${item.created_at}</p>

                <details>

                    <summary>View AI Recommendation</summary>

                    <pre>${item.recommendation}</pre>

                </details>

            </div>

            `;

        });

        result.innerHTML = output;

    }

    catch(error){

        loading.style.display = "none";

        alert("Unable to load recommendation history.");

        console.log(error);

    }

});