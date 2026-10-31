// Utility function to safely retrieve the value of an input element by its ID
const getValue = (id) => {
    const element = document.getElementById(id);
    return element ? element.value : "";
};

const handleRegistration = (event) => {
    // Prevent the default form submission behavior (stops the page from reloading)
    event.preventDefault();
    console.log("called No1 Function")

    // Extract input values using their element IDs
    const username = getValue("username");
    const first_name = getValue("first_name");
    const last_name = getValue("last_name");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");

    // Reference to the error display container
    const errorElement = document.getElementById("error");

    // Construct the payload object required by the registration API
    const info = {
        username,
        password,
        confirm_password,
        first_name,
        last_name,
        email,
    };

    // Validate if the password and confirm password fields match
    if (password !== confirm_password) {
        if (errorElement) {
            errorElement.innerText = "Password & Confirm Password do not match!";
        }
        return;
    }

    // Regular expression for strong password validation:
    // Requires minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
        if (errorElement) {
            errorElement.innerText = 
                "Password must contain minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character (@$!%*?&)!";
        }
        return;
    }

    // Clear previous error messages if validation passes
    if (errorElement) {
        errorElement.innerText = "";
    }
    
    console.log("Submitting Info:", info);

    // Send a POST request to the patient registration endpoint
    fetch("https://testing-8az5.onrender.com/patient/register/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Server Response:", data);

            // Handle successful registration or display errors returned by the server
            if (data === "Registration Successful" || data.token) {
                alert("Registration Successful! Please check your email to verify.");
                // Redirect user to the login page upon success
                // window.location.href = "login.html";
            } else {
                // Render validation/error messages from the server
                if (errorElement) {
                    errorElement.innerText = JSON.stringify(data);
                }
            }
        })
        .catch((err) => {
            // Log network errors or server connection failures
            console.log("Fetch Error:", err);
        });
};




const handleLogin = (event) =>{
    // For Prevent Reload use preventDefault
    event.preventDefault();
    
    const username = getValue("login-username");
    const password = getValue("login-password");
    if (password && username ) {
         fetch("https://testing-8az5.onrender.com/patient/login/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if ( data.token && data.user_id){
            // Local storage e session token save
        localStorage.setItem("token",data.token);
        localStorage.setItem("user_id",data.user_id);
        window.location.href = "index.html";
        }

        

    })
    
    }

}