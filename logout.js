const handleLogout = (event) => {
    if (event) event.preventDefault();
    const token = localStorage.getItem("token");

    const clearSessionAndRedirect = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("patient_id");
        window.location.href = "login.html";
    };

    if (!token) {
        clearSessionAndRedirect();
        return;
    }

    fetch("https://testing-8az5.onrender.com/patient/logout/", {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "content-type": "application/json"
        }
    })
        .then(() => clearSessionAndRedirect())
        .catch(() => clearSessionAndRedirect());
};
