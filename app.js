const API_BASE = "https://testing-8az5.onrender.com";

// Fallback data used if the free Render backend is sleeping or unreachable
const FALLBACK_SERVICES = [
    {
        id: 1,
        name: "Cardiology & Heart Care",
        description: "24/7 cardiac diagnostics, echocardiography, angiography, and preventive heart consultations with senior cardiologists.",
        image: "./images/hospital.png"
    },
    {
        id: 2,
        name: "Neurology & Brain Center",
        description: "Comprehensive stroke management, EEG diagnostics, migraine clinics, and neurological rehabilitation.",
        image: "./images/hospital.png"
    },
    {
        id: 3,
        name: "Orthopedics & Trauma",
        description: "Joint replacement, sports injury recovery, arthroscopy, and fracture management with modern physiotherapy.",
        image: "./images/hospital.png"
    },
    {
        id: 4,
        name: "Pediatrics & Neonatal Care",
        description: "Dedicated child wellness clinics, immunizations, and specialized pediatric intensive care.",
        image: "./images/hospital.png"
    }
];

const FALLBACK_DESIGNATIONS = [
    { id: 1, name: "Senior Consultant", slug: "senior-consultant" },
    { id: 2, name: "Associate Professor", slug: "associate-professor" },
    { id: 3, name: "Resident Physician", slug: "resident-physician" },
    { id: 4, name: "Chief Surgeon", slug: "chief-surgeon" }
];

const FALLBACK_SPECIALIZATIONS = [
    { id: 1, name: "Cardiology", slug: "cardiology" },
    { id: 2, name: "Neurology", slug: "neurology" },
    { id: 3, name: "Orthopedics", slug: "orthopedics" },
    { id: 4, name: "Pediatrics", slug: "pediatrics" },
    { id: 5, name: "Dermatology", slug: "dermatology" }
];

const FALLBACK_DOCTORS = [
    {
        id: 1,
        full_name: "Dr. Mahbubur Rahman",
        image: "./images/doctor.png",
        designation: ["Senior Consultant"],
        specialization: ["Cardiology"],
        available_time: ["Sun - Thu (10:00 AM - 01:00 PM)", "Sat (05:00 PM - 08:00 PM)"],
        fee: 1200,
        meet_link: "https://meet.google.com/smartcare-cardio"
    },
    {
        id: 2,
        full_name: "Dr. Nusrat Jahan",
        image: "./images/girl.png",
        designation: ["Associate Professor"],
        specialization: ["Neurology"],
        available_time: ["Mon - Wed (04:00 PM - 07:00 PM)"],
        fee: 1000,
        meet_link: "https://meet.google.com/smartcare-neuro"
    },
    {
        id: 3,
        full_name: "Dr. Tanvir Ahmed",
        image: "./images/doctor.png",
        designation: ["Chief Surgeon"],
        specialization: ["Orthopedics"],
        available_time: ["Sun - Thu (02:00 PM - 06:00 PM)"],
        fee: 1500,
        meet_link: "https://meet.google.com/smartcare-ortho"
    },
    {
        id: 4,
        full_name: "Dr. Farzana Karim",
        image: "./images/girl.png",
        designation: ["Senior Consultant"],
        specialization: ["Pediatrics", "Dermatology"],
        available_time: ["Sat - Wed (09:00 AM - 01:00 PM)"],
        fee: 900,
        meet_link: "https://meet.google.com/smartcare-peds"
    }
];

const FALLBACK_REVIEWS = [
    {
        id: 1,
        reviewer: "Arif Hossain",
        doctor: "Dr. Mahbubur Rahman",
        body: "Very attentive and thorough cardiac checkup. The appointment booking and follow-up process was effortless.",
        created_on: "2026-10-18",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 2,
        reviewer: "Sadia Islam",
        doctor: "Dr. Nusrat Jahan",
        body: "Dr. Nusrat explained the neurological reports clearly and adjusted my treatment plan with great care.",
        created_on: "2026-10-22",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        id: 3,
        reviewer: "Tanmoy Chowdhury",
        doctor: "Dr. Tanvir Ahmed",
        body: "Recovered quickly after my knee injury thanks to the orthopedic team at SmartCare Hospital.",
        created_on: "2026-10-25",
        rating: "⭐⭐⭐⭐"
    }
];

const updateAuthNavbar = () => {
    const token = localStorage.getItem("token");
    const loginNav = document.getElementById("login-nav-item");
    const registerNav = document.getElementById("register-nav-item");
    const profileDropdown = document.getElementById("profile-dropdown");

    if (token) {
        if (loginNav) loginNav.style.display = "none";
        if (registerNav) registerNav.style.display = "none";
        if (profileDropdown) profileDropdown.style.display = "block";
    } else {
        if (loginNav) loginNav.style.display = "block";
        if (registerNav) registerNav.style.display = "block";
        if (profileDropdown) profileDropdown.style.display = "block";
    }
};

const loadServices = () => {
    const parent = document.getElementById("service-container") || document.getElementById("services-container");
    if (!parent) return;

    fetch(`${API_BASE}/services/`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch services");
            return res.json();
        })
        .then((data) => displayService(Array.isArray(data) && data.length ? data : FALLBACK_SERVICES))
        .catch(() => displayService(FALLBACK_SERVICES));
};

const displayService = (services) => {
    const parent = document.getElementById("service-container") || document.getElementById("services-container");
    if (!parent) return;
    parent.innerHTML = "";

    services.forEach((service) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="card shadow-sm h-100 border-0 mx-2">
                <div class="ratio ratio-16x9">
                    <img src="${service.image || './images/hospital.png'}" class="card-img-top object-fit-cover rounded-top" loading="lazy" alt="${service.name}" onerror="this.src='./images/hospital.png'">
                </div>
                <div class="card-body p-4 text-start">
                    <h3 class="card-title h5 fw-bold">${service.name}</h3>
                    <p class="card-text text-secondary">${(service.description || "").slice(0, 140)}...</p>
                    <a href="#doctors-section" class="btn btn-primary btn-sm">Book Specialist</a>
                </div>
            </div>
        `;
        parent.appendChild(li);
    });

    if (window.swiffyslider && typeof window.swiffyslider.init === "function") {
        window.swiffyslider.init();
    }
};

const loadDoctors = (search = "") => {
    const doctorsContainer = document.getElementById("doctors");
    const nodata = document.getElementById("nodata");
    const spinner = document.getElementById("spinner");
    if (!doctorsContainer) return;

    doctorsContainer.innerHTML = "";
    if (nodata) nodata.style.display = "none";
    if (spinner) spinner.style.display = "block";

    fetch(`${API_BASE}/doctor/list/?search=${encodeURIComponent(search || "")}`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch doctors");
            return res.json();
        })
        .then((data) => {
            if (spinner) spinner.style.display = "none";
            const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
            if (list.length > 0) {
                displayDoctors(list);
            } else {
                if (nodata) nodata.style.display = "block";
            }
        })
        .catch(() => {
            if (spinner) spinner.style.display = "none";
            const q = (search || "").toLowerCase().trim();
            const filtered = FALLBACK_DOCTORS.filter((doc) => {
                if (!q) return true;
                return (
                    doc.full_name.toLowerCase().includes(q) ||
                    doc.designation.some((d) => d.toLowerCase().includes(q)) ||
                    doc.specialization.some((s) => s.toLowerCase().includes(q))
                );
            });
            if (filtered.length > 0) {
                displayDoctors(filtered);
            } else if (nodata) {
                nodata.style.display = "block";
            }
        });
};

const displayDoctors = (doctors) => {
    const parent = document.getElementById("doctors");
    if (!parent) return;
    parent.innerHTML = "";

    doctors.forEach((doctor) => {
        const div = document.createElement("div");
        div.classList.add("doctor-card", "col-md-3", "card", "p-3", "shadow-sm");
        const specializations = (doctor.specialization || []).map((item) => item?.name || item);
        const designations = (doctor.designation || []).map((item) => item?.name || item);

        div.innerHTML = `
            <img class="card-img-top" src="${doctor.image || './images/doctor.png'}" alt="${doctor.full_name}" onerror="this.src='./images/doctor.png'">
            <div class="card-body text-center">
                <h5 class="card-title fw-bold mb-1">${doctor.full_name}</h5>
                <p class="text-muted small mb-2">${designations.join(", ")}</p>
                <div class="mb-3">
                    ${specializations.map((spec) => `<span class="badge bg-info-subtle text-info-emphasis me-1">${spec}</span>`).join("")}
                </div>
                <p class="fw-semibold text-primary mb-3">Fee: ${doctor.fee ?? 1000} BDT</p>
                <a class="btn btn-outline-primary btn-sm px-4" href="docDetails.html?docId=${doctor.id}">Details</a>
            </div>
        `;
        parent.appendChild(div);
    });
};

const loadDesignation = () => {
    const parent = document.getElementById("drop-deg");
    if (!parent) return;

    const renderList = (items) => {
        parent.innerHTML = `<li><a class="dropdown-item" href="#" onclick="loadDoctors(''); return false;">All Designations</a></li>`;
        items.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("dropdown-item");
            li.style.cursor = "pointer";
            li.innerText = item.name;
            li.onclick = () => loadDoctors(item.name);
            parent.appendChild(li);
        });
    };

    fetch(`${API_BASE}/doctor/designation/`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed");
            return res.json();
        })
        .then((data) => renderList(Array.isArray(data) && data.length ? data : FALLBACK_DESIGNATIONS))
        .catch(() => renderList(FALLBACK_DESIGNATIONS));
};

const loadSpecialization = () => {
    const parent = document.getElementById("drop-spe");
    if (!parent) return;

    const renderList = (items) => {
        parent.innerHTML = `<li><a class="dropdown-item" href="#" onclick="loadDoctors(''); return false;">All Specializations</a></li>`;
        items.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("dropdown-item");
            li.style.cursor = "pointer";
            li.innerText = item.name;
            li.onclick = () => loadDoctors(item.name);
            parent.appendChild(li);
        });
    };

    fetch(`${API_BASE}/doctor/specialization/`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed");
            return res.json();
        })
        .then((data) => renderList(Array.isArray(data) && data.length ? data : FALLBACK_SPECIALIZATIONS))
        .catch(() => renderList(FALLBACK_SPECIALIZATIONS));
};

const handleSearch = () => {
    const searchInput = document.getElementById("search") || document.getElementById("search-input");
    const value = searchInput ? searchInput.value : "";
    loadDoctors(value);
};

const loadReview = () => {
    const parent = document.getElementById("review-container") || document.getElementById("reviews-container");
    if (!parent) return;

    fetch(`${API_BASE}/doctor/review/`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed");
            return res.json();
        })
        .then((data) => displayReview(Array.isArray(data) && data.length ? data : FALLBACK_REVIEWS))
        .catch(() => displayReview(FALLBACK_REVIEWS));
};

const formatStars = (rating) => {
    if (typeof rating === "number") {
        return "⭐".repeat(Math.max(1, Math.min(5, rating)));
    }
    return rating || "⭐⭐⭐⭐⭐";
};

const displayReview = (reviews) => {
    const parent = document.getElementById("review-container") || document.getElementById("reviews-container");
    if (!parent) return;
    parent.innerHTML = "";

    reviews.forEach((review) => {
        const div = document.createElement("li");
        div.innerHTML = `
            <div class="review-card card shadow-sm p-4 h-100 border-0 mx-2 text-start">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <img class="rounded-circle" style="width: 56px; height: 56px; object-fit: cover;" src="./images/girl.png" alt="${review.reviewer}">
                    <div>
                        <h5 class="card-title mb-0 fw-bold">${review.reviewer}</h5>
                        <small class="text-muted">Doctor: ${review.doctor || "SmartCare Specialist"}</small>
                    </div>
                </div>
                <p class="text-warning mb-2">${formatStars(review.rating)}</p>
                <p class="card-text text-secondary mb-0">${(review.body || "").slice(0, 160)}</p>
            </div>
        `;
        parent.appendChild(div);
    });

    if (window.swiffyslider && typeof window.swiffyslider.init === "function") {
        window.swiffyslider.init();
    }
};

updateAuthNavbar();
loadServices();
loadDoctors();
loadDesignation();
loadSpecialization();
loadReview();
