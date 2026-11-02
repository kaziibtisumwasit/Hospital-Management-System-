const getparams = () =>{
    const param = new URLSearchParams(window.location.search).get("doctorId")

    // console.log(param)
    loadTime(param)
    fetch(`https://test-thto.onrender.com/doctor/list/${param}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data))
    .catch((err) => console.log(err))



    fetch(`https://testing-8az5.onrender.com/doctor/review/?doctor_id=${param}`)
    .then((res) => res.json())
    .then((data) => displayDocReview(data))
    .catch((err) => console.log(err))

}


const displayDetails = (doctor) =>{
    console.log(doctor);
const parent = document.getElementById("doc-container");
const div = document.createElement("div");
div.classList.add("doc-details-container")
div.innerHTML = `
<div class="doctor-img">
    <img src=${doctor.image} alt="">
   </div>
    <div class="doc-info">
    <h1>${doctor.full_name}</h1>
    ${
        doctor.specialization.map((item) => 
        {
        return `<button class="doc-spe-btn"> ${item} </button>`;
    })
    }

    ${
        doctor.designation.map((item) =>
        {
        return `<h4 class="">${item}</h4>`;
        })
    }
    <p class="w-50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quis obcaecati delectus nobis ipsa odit quisquam cumque alias dolor incidunt.</p>
    <h4>Fees : ${doctor.fee}</h4>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Take Appointment 
</button>

`;
parent.appendChild(div);


};



const displayDocReview = (reviews) =>{
  reviews.forEach((review)=>
{

    parent = document.getElementById("doc-details-review")
    const div = document.createElement("div")
    div.classList.add("review-card")
    div.innerHTML = `
    <img src="/images/doctor.png" alt="">
        <h4>${review.reviewer}</h4>
        <p>${review.body.slice(0,100)}</p>
        <h6>${review.rating}</h6>
    
    `;
    parent.appendChild(div)

});
};

const loadTime =(doc_id) => {
    fetch(`https://test-thto.onrender.com/doctor/availabletime/?doctor_id=${doc_id}`)
    .then((res) => res.json())
    .then((data) => {
        data.forEach((single_item) =>{
            console.log(single_item);
        const parent = document.getElementById("time-container")
        const option = document.createElement("option")
        option.value = single_item.id;
        option.innerText = single_item.name;
        parent.appendChild(option);




        })
    })
    .catch((err) => console.log(err))
}





const handleAppointment = () =>{
    const param = new URLSearchParams(window.location.search).get("doctorId")
    const status = document.getElementsByName("status");
    // getElement by tag ba name diye dhori tokhon amra node list pai
    const selected = Array.from(status).find((item) => 
        item.checked);
        // console.log(selected.value);

    //  ## because symptom is a input field  thats why we access value symptom.value
    const symptom = document.getElementById("symptom").value;
    const time = document.getElementById("time-container");
    const selected_time = time.options[time.selectedIndex];
    // console.log(selected.value,symptom,selected_time.value);
    const patient_id = localStorage.getItem("patient_id")
     const info = {
    appointment_type: selected.value,
    appointment_status: "Pending",
    time : selected_time.value,
    symptom : symptom,
    cancel: false,
    patient: patient_id,
    doctor: param,
  };

  fetch("https://testing-8az5.onrender.com/appointment/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(info),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = `pdf.html?doctorId=${param}`
    });

    };


 const loadPatientId = () => {
  const user_id = localStorage.getItem("user_id");

  fetch(`https://testing-8az5.onrender.com/patient/list/?user_id=${user_id}`)
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("patient_id", data[0].id);
    });
};



	
	


loadPatientId();




getparams();

loadTime()




