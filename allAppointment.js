const loadAllAppointment = () =>{
    const user_id = localStorage.getItem("user_id");
    fetch(`https://testing-8az5.onrender.com/appointment/?patient_id=${patient_id}`)
    .then((res) => res.json())
    .then((data) => console.log(data))
};
loadAllAppointment();