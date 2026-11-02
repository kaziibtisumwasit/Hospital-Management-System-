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
      console.log(data);
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



	const handlePdf = () => {
	  const doctor_id = new URLSearchParams(window.location.search).get("doctorId");
	  console.log(doctor_id);
	  const user_id = localStorage.getItem("user_id");
	  console.log(`https://testing-8az5.onrender.com/users/${user_id}`);
	  fetch(`https://testing-8az5.onrender.com/doctor/list/${doctor_id}`)
	    .then((res) => res.json())
	    .then((data) => {
	      fetch(`https://testing-8az5.onrender.com/users/${user_id}`)
	        .then((res) => res.json())
	        .then((pdData) => {
	          const newData = [data, pdData];
	          console.log(newData);
	          const parent = document.getElementById("pdf-container");
	          const div = document.createElement("div");
	          div.innerHTML = `
	              <div class="pd d-flex justify-content-around align-items-center p-5">
	              <div class="patient doctor p-5">
	               
	                <h1>${newData[1].username}</h1>
	                <h1>${newData[1].first_name} ${newData[1].last_name}</h1>
	                <h4>${newData[1].email}</h4>
	              
	              </div>
	              <div class="doctor p-5">
	              <img class="w-25" src=${newData[0].image}/>
	                <h2 class="doc-name">${newData[0].full_name}</h2>
	                <h3>designation: designation</h3>
	                <h5>specialization: specialization</h5>
	              </div>
	            </div>
	            <input id="pdf-symtom" class="symtom" type="text" />
	            <h1 id="pdf-fees" class="text-center p-2 mt-3">Fees: ${newData[0].fee}BDT</h1>
	              `;
	
	            parent.appendChild(div);
	            donwloadPdf();
	        });
	      
	    });
	};
	
	const donwloadPdf = () => {
	  const element = document.getElementById("pdf-container");
	
	  // Define the options for html2pdf
	  const options = {
	    margin: 10,
	    filename: "appt.pdf",
	    image: { type: "jpeg", quality: 0.98 },
	    html2canvas: { scale: 2 },
	    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
	  };
	
	  // Use html2pdf to generate and download the PDF
	    html2pdf(element, options);
	    
	};
	handlePdf();
	

    
loadPatientId();




getparams();

loadTime()




