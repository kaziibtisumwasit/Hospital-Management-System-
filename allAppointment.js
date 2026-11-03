const APPT_API_BASE = "https://testing-8az5.onrender.com";

const DEFAULT_SAMPLE_APPOINTMENTS = [
    {
        id: 101,
        symptom: "Chest tightness and routine ECG follow-up",
        doctor: "Dr. Mahbubur Rahman",
        appointment_type: "Offline",
        appointment_status: "Pending",
        cancel: false,
        fee: 1200
    },
    {
        id: 102,
        symptom: "Recurring migraine & sleep evaluation",
        doctor: "Dr. Nusrat Jahan",
        appointment_type: "Online",
        appointment_status: "Completed",
        cancel: false,
        fee: 1000
    }
];

const renderAppointments = (appointments) => {
    const parent = document.getElementById("table-body");
    if (!parent) return;
    parent.innerHTML = "";

    appointments.forEach((item) => {
        const tr = document.createElement("tr");
        const isPending = item.appointment_status === "Pending" && !item.cancel;
        tr.innerHTML = `
            <td>#${item.id}</td>
            <td>${item.symptom || "General Consultation"}</td>
            <td>${item.doctor || "Dr. Mahbubur Rahman"}</td>
            <td><span class="badge bg-secondary-subtle text-secondary-emphasis">${item.appointment_type || "Offline"}</span></td>
            <td>
                <span class="badge ${item.cancel ? 'bg-danger-subtle text-danger' : isPending ? 'bg-warning-subtle text-warning-emphasis' : 'bg-success-subtle text-success'}">
                    ${item.cancel ? "Cancelled" : (item.appointment_status || "Pending")}
                </span>
            </td>
            <td>
                ${
                    isPending
                        ? `<button onclick="cancelAppointment(${item.id})" class="btn btn-sm btn-outline-danger">X</button>`
                        : `<span class="text-muted">X</span>`
                }
            </td>
            <td>${item.fee || 1200} BDT</td>
            <td>
                <a href="pdf.html?appointment_id=${item.id}&docId=1" class="btn btn-sm btn-info text-white">PDF</a>
            </td>
        `;
        parent.appendChild(tr);
    });
};

const cancelAppointment = (id) => {
    const localList = JSON.parse(localStorage.getItem("smartcare_appointments") || "[]");
    const updated = localList.map((a) => (a.id === id ? { ...a, cancel: true, appointment_status: "Cancelled" } : a));
    localStorage.setItem("smartcare_appointments", JSON.stringify(updated));
    loadAllAppointment();
};

const loadAllAppointment = () => {
    const patient_id = localStorage.getItem("patient_id") || localStorage.getItem("user_id") || "1";
    const localSaved = JSON.parse(localStorage.getItem("smartcare_appointments") || "[]");

    fetch(`${APPT_API_BASE}/appointment/?patient_id=${patient_id}`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed");
            return res.json();
        })
        .then((data) => {
            const combined = Array.isArray(data) && data.length > 0 ? [...localSaved, ...data] : (localSaved.length > 0 ? localSaved : DEFAULT_SAMPLE_APPOINTMENTS);
            renderAppointments(combined);
        })
        .catch(() => {
            renderAppointments(localSaved.length > 0 ? localSaved : DEFAULT_SAMPLE_APPOINTMENTS);
        });
};

loadAllAppointment();
