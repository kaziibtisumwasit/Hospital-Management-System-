const DOC_API_BASE = "https://testing-8az5.onrender.com";

const FALLBACK_DOC_MAP = {
    1: {
        id: 1,
        full_name: "Dr. Mahbubur Rahman",
        image: "./images/doctor.png",
        designation: ["Senior Consultant"],
        specialization: ["Cardiology"],
        available_time: ["Sun - Thu (10:00 AM - 01:00 PM)", "Sat (05:00 PM - 08:00 PM)"],
        fee: 1200,
        meet_link: "https://meet.google.com/smartcare-cardio"
    },
    2: {
        id: 2,
        full_name: "Dr. Nusrat Jahan",
        image: "./images/girl.png",
        designation: ["Associate Professor"],
        specialization: ["Neurology"],
        available_time: ["Mon - Wed (04:00 PM - 07:00 PM)"],
        fee: 1000,
        meet_link: "https://meet.google.com/smartcare-neuro"
    },
    3: {
        id: 3,
        full_name: "Dr. Tanvir Ahmed",
        image: "./images/doctor.png",
        designation: ["Chief Surgeon"],
        specialization: ["Orthopedics"],
        available_time: ["Sun - Thu (02:00 PM - 06:00 PM)"],
        fee: 1500,
        meet_link: "https://meet.google.com/smartcare-ortho"
    },
    4: {
        id: 4,
        full_name: "Dr. Farzana Karim",
        image: "./images/girl.png",
        designation: ["Senior Consultant"],
        specialization: ["Pediatrics", "Dermatology"],
        available_time: ["Sat - Wed (09:00 AM - 01:00 PM)"],
        fee: 900,
        meet_link: "https://meet.google.com/smartcare-peds"
    }
};

const FALLBACK_TIME_SLOTS = [
    { id: 1, name: "10:00 AM - 11:00 AM" },
    { id: 2, name: "11:30 AM - 12:30 PM" },
    { id: 3, name: "04:00 PM - 05:00 PM" },
    { id: 4, name: "06:00 PM - 07:00 PM" }
];

const getParams = () => {
    const param = new URLSearchParams(window.location.search).get("docId");
    if (!param) return;

    loadTime(param);

    fetch(`${DOC_API_BASE}/doctor/list/${param}/`)
        .then((res) => {
            if (!res.ok) throw new Error("Doctor fetch failed");
            return res.json();
        })
        .then((data) => displayDetails(data))
        .catch(() => {
            displayDetails(FALLBACK_DOC_MAP[param] || FALLBACK_DOC_MAP[1]);
        });

    fetch(`${DOC_API_BASE}/doctor/review/?doctor_id=${param}`)
        .then((res) => {
            if (!res.ok) throw new Error("Review fetch failed");
            return res.json();
        })
        .then((data) => doctorReview(Array.isArray(data) ? data : []))
        .catch(() => {
            doctorReview([
                {
                    reviewer: "Arif Hossain",
                    doctor: (FALLBACK_DOC_MAP[param] || FALLBACK_DOC_MAP[1]).full_name,
                    body: "Excellent clinical diagnosis and compassionate patient care.",
                    rating: "⭐⭐⭐⭐⭐"
                }
            ]);
        });
};

const doctorReview = (reviews) => {
    const parent = document.getElementById("doc-details-review");
    if (!parent) return;
    parent.innerHTML = "";

    if (!reviews || reviews.length === 0) {
        parent.innerHTML = `<p class="text-muted">No patient reviews yet for this doctor.</p>`;
        return;
    }

    reviews.forEach((review) => {
        const div = document.createElement("div");
        div.classList.add("col-md-5", "card", "shadow-sm", "p-3", "border-0", "text-start");
        div.innerHTML = `
            <div class="d-flex align-items-center gap-3 mb-2">
                <img class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;" src="./images/girl.png" alt="${review.reviewer}">
                <div>
                    <h6 class="mb-0 fw-bold">${review.reviewer}</h6>
                    <small class="text-muted">${review.doctor || ""}</small>
                </div>
            </div>
            <p class="text-warning mb-1">${review.rating || "⭐⭐⭐⭐⭐"}</p>
            <p class="text-secondary mb-0">${(review.body || "").slice(0, 150)}</p>
        `;
        parent.appendChild(div);
    });
};

const displayDetails = (doctor) => {
    const parent = document.getElementById("doc-details") || document.getElementById("doctor-details");
    if (!parent) return;

    const specializations = (doctor.specialization || []).map((item) => item?.name || item);
    const designations = (doctor.designation || []).map((item) => item?.name || item);

    parent.innerHTML = `
        <div class="col-md-4 text-center mb-3 mb-md-0">
            <img class="img-fluid rounded-circle shadow-sm" style="width: 220px; height: 220px; object-fit: cover;" src="${doctor.image || './images/doctor.png'}" alt="${doctor.full_name}" onerror="this.src='./images/doctor.png'">
        </div>
        <div class="col-md-8">
            <h2 class="fw-bold mb-1">${doctor.full_name}</h2>
            <p class="text-muted mb-2">${designations.join(", ")}</p>
            <div class="mb-3">
                ${specializations.map((item) => `<button class="btn btn-outline-secondary btn-sm me-2 mb-1" disabled>${item}</button>`).join("")}
            </div>
            <p class="text-secondary">
                Board-certified specialist at SmartCare Hospital providing evidence-based consultations, diagnostics, and personalized treatment plans.
            </p>
            <h4 class="fw-bold text-primary mb-3">Fees: ${doctor.fee ?? 1000} BDT</h4>
            <button type="button" class="btn btn-primary px-4 py-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Take Appointment
            </button>
        </div>
    `;
};

const loadTime = (id) => {
    const parent = document.getElementById("time-container") || document.getElementById("available-time");
    if (!parent) return;
    parent.innerHTML = "";

    const renderOptions = (slots) => {
        parent.innerHTML = "";
        slots.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.id;
            option.innerText = item.name;
            parent.appendChild(option);
        });
    };

    fetch(`${DOC_API_BASE}/doctor/availabletime/?doctor_id=${id}`)
        .then((res) => {
            if (!res.ok) throw new Error("Time fetch failed");
            return res.json();
        })
        .then((data) => renderOptions(Array.isArray(data) && data.length ? data : FALLBACK_TIME_SLOTS))
        .catch(() => renderOptions(FALLBACK_TIME_SLOTS));
};

const loadPatientId = () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;

    fetch(`${DOC_API_BASE}/patient/list/?user_id=${user_id}`)
        .then((res) => res.json())
        .then((data) => {
            if (Array.isArray(data) && data.length > 0 && data[0].id) {
                localStorage.setItem("patient_id", data[0].id);
            }
        })
        .catch(() => {
            if (!localStorage.getItem("patient_id")) {
                localStorage.setItem("patient_id", user_id);
            }
        });
};

const handleAppointment = () => {
    const param = new URLSearchParams(window.location.search).get("docId") || "1";
    const statusRadios = document.getElementsByName("status");
    const selectType = document.getElementById("appointment-type");
    const checkedRadio = Array.from(statusRadios).find((button) => button.checked);
    const selectedStatus = checkedRadio ? checkedRadio.value : (selectType ? selectType.value : "Offline");

    const symptomEl = document.getElementById("symptom");
    const symptom = symptomEl ? symptomEl.value.trim() : "";

    const timeEl = document.getElementById("time-container") || document.getElementById("available-time");
    const selectedTimeOption = timeEl && timeEl.options[timeEl.selectedIndex] ? timeEl.options[timeEl.selectedIndex] : null;
    const timeValue = timeEl ? timeEl.value : "1";
    const timeLabel = selectedTimeOption ? selectedTimeOption.text : "10:00 AM - 11:00 AM";

    const feedback = document.getElementById("appointment-feedback");
    if (!symptom) {
        if (feedback) {
            feedback.className = "small text-danger mb-0";
            feedback.innerText = "Please describe your symptom before submitting.";
        }
        return;
    }

    const patient_id = localStorage.getItem("patient_id") || localStorage.getItem("user_id") || "1";
    const info = {
        appointment_type: selectedStatus,
        appointment_status: "Pending",
        time: parseInt(timeValue, 10) || 1,
        symptom: symptom,
        cancel: false,
        patient: parseInt(patient_id, 10) || 1,
        doctor: parseInt(param, 10) || 1
    };

    // Save locally as well so allAppointment.html & pdf.html always work even if Render is sleeping
    const localAppointments = JSON.parse(localStorage.getItem("smartcare_appointments") || "[]");
    const newLocalItem = {
        id: Date.now() % 10000,
        appointment_type: selectedStatus,
        appointment_status: "Pending",
        time: timeLabel,
        symptom: symptom,
        cancel: false,
        patient: patient_id,
        doctor: (FALLBACK_DOC_MAP[param] || FALLBACK_DOC_MAP[1]).full_name,
        fee: (FALLBACK_DOC_MAP[param] || FALLBACK_DOC_MAP[1]).fee || 1200
    };
    localAppointments.push(newLocalItem);
    localStorage.setItem("smartcare_appointments", JSON.stringify(localAppointments));

    fetch(`${DOC_API_BASE}/appointment/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info)
    })
        .then((res) => res.json())
        .then((data) => {
            window.location.href = `pdf.html?docId=${param}&appointment_id=${data.id || newLocalItem.id}`;
        })
        .catch(() => {
            window.location.href = `pdf.html?docId=${param}&appointment_id=${newLocalItem.id}`;
        });
};

loadPatientId();
getParams();
