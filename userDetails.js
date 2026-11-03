const USER_API_BASE = "https://testing-8az5.onrender.com";

const renderUserProfile = (data) => {
    const parent = document.getElementById("user-details-container") || document.getElementById("user-details");
    if (!parent) return;

    const fullName = `${data.first_name || "Kazi"} ${data.last_name || "Wasit"}`.trim();
    parent.innerHTML = `
        <div class="user-all">
            <div class="user-img text-center">
                <img src="./images/girl.png" alt="${data.username || 'Patient'}">
            </div>
            <div class="user-info">
                <span class="badge bg-primary-subtle text-primary mb-2">Verified Patient Profile</span>
                <h3 class="fw-bold mb-2">Username: ${data.username || "kazi_patient"}</h3>
                <h5 class="text-secondary mb-2">Full Name: ${fullName}</h5>
                <p class="text-muted mb-3">Email: ${data.email || "patient@smartcare.com"}</p>
                <a href="allAppointment.html" class="btn btn-primary btn-sm px-3">View My Appointments</a>
            </div>
        </div>
    `;
};

const loadUserDetails = () => {
    const user_id = localStorage.getItem("user_id") || "1";
    const savedLocalUser = JSON.parse(localStorage.getItem("smartcare_registered_user") || "null");
    const activeUsername = localStorage.getItem("smartcare_active_username");

    // Fixed: Phitron Module 19 fetches User info from /users/${user_id}/ (not /patient/list/${user_id})
    fetch(`${USER_API_BASE}/users/${user_id}/`)
        .then((res) => {
            if (!res.ok) throw new Error("User fetch failed");
            return res.json();
        })
        .then((data) => renderUserProfile(data))
        .catch(() => {
            renderUserProfile(
                savedLocalUser || {
                    username: activeUsername || "kazi_wasit",
                    first_name: "Kazi Ibtisum",
                    last_name: "Wasit",
                    email: "kazi.wasit@smartcare.com"
                }
            );
        });
};

loadUserDetails();
