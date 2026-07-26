const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {

    const full_name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!full_name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {

        const response = await fetch("http://127.0.0.1:8000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                full_name,
                email,
                password
            })

        });

        const data = await response.json();

        alert(data.message);

        if (data.status === "success") {

            window.location.href = "login.html";

        }

    } catch (error) {

        alert("Unable to connect to server.");

        console.log(error);

    }

});