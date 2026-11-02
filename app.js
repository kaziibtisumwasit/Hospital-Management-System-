const loadServices = () => {
    fetch("https://testing-8az5.onrender.com/services/")
        .then((res) => res.json())
        .then((data) => displayService(data))
        .catch((err) => console.log(err));
};


// arrow full array recive kore ther oi array er upor loop through kore
const displayService = (services) => {
    // console.log(services);
    services.forEach((service) => {
        // console.log(service)
        const parent = document.getElementById("service-container")
        const li = document.createElement("li")
        li.innerHTML = `
        <div class="card shadow h-100" bis_skin_checked="1">
                <div class="ratio ratio-16x9" bis_skin_checked="1">
                    <img src=${service.image} class="card-img-top" loading="lazy" alt="...">
                </div>
                <div class="card-body p-3 p-xl-5" bis_skin_checked="1">
                    <h3 class="card-title h5">${service.name}</h3>
                    <p class="card-text">${service.description.slice(0, 100)}</p>
                    <div bis_skin_checked="1"><a href="#" class="btn btn-primary">Details</a>
                    </div>
                </div>
            </div>
        `;

        parent.appendChild(li);
    });
};











const loadDoctors = (searchVal) => {
    const doctorsContainer = document.getElementById("doctors");
    const spinner = document.getElementById("spinner");
    const nodata = document.getElementById("nodata");

    // Exit early if this page doesn't have the doctors container
    if (!doctorsContainer) return;

    doctorsContainer.innerHTML = "";
    if (spinner) spinner.style.display = "block";

    fetch(`https://testing-8az5.onrender.com/doctor/list/?search=${searchVal ? searchVal : ""}`)
        .then((res) => res.json())
        .then((data) => {
            if (data?.results?.length > 0) {
                displayDoctors(data.results);
                if (spinner) spinner.style.display = "none";
                if (nodata) nodata.style.display = "none";
            } else {
                doctorsContainer.innerHTML = "";
                if (nodata) nodata.style.display = "block";
                if (spinner) spinner.style.display = "none";
            }
        })
        .catch((err) => {
            console.log(err);
            if (spinner) spinner.style.display = "none";
        });
};




const displayDoctors = (doctors) => {
    doctors?.forEach((doctor) => {
        // console.log(doctor);
        const parent = document.getElementById('doctors');
        const div = document.createElement('div');
        div.classList.add("doc-card");
        div.innerHTML = `
        <img class="doc-img" src="${doctor.image}" alt="">
            <h4>${doctor?.full_name}</h4>
            <h6>${doctor?.designation}</h6>
            <p>
            ${doctor?.specialization?.map((item) => {
            return `<button>${item}</button>`
        })}
            </p>
            <button><a target="_blank" href="docDetails.html?doctorId=${doctor.id}">Details</a></button>
        `;


        parent.appendChild(div);

    });

}











const loadDesignations = () => {
    fetch("https://testing-8az5.onrender.com/doctor/designation/")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((item) => {
                // console.log(item)
                const parent = document.getElementById("drop-deg");
                const li = document.createElement("li");
                li.classList.add("dropdown-item");
                li.innerText = item.name;
                parent.appendChild(li);
            })
        })
        .catch((err) => console.log(err))
};




const loadSpecilization = () => {
    fetch("https://testing-8az5.onrender.com/doctor/specialization/")
        .then((res) => res.json())
        .then((data) => {
            data?.forEach((item) => {
                // console.log(item.name)
                const parent = document.getElementById("drop-spe");
                const li = document.createElement("li");
                li.classList.add("dropdown-item")
                // li.innerHTML = item.name;
                li.innerHTML =`
                <li onclick="loadDoctors('${item.name}')" >${item.name}</li>

                `;
                parent.appendChild(li);
            });


        })
};





const handleSearch = () => {
    const inputVal = document.getElementById("doc-search").value;
    // console.log(inputVal)
    loadDoctors(inputVal)

};




const loadReview = () => {
    fetch("https://test-thto.onrender.com/doctor/review/")
    .then((res) => res.json())
    .then((data) => displayReview(data))
    .catch((err) => console.log(err))

};






const displayReview = (reviews) =>{
    reviews.forEach((review) => {
        console.log(review)
        const parent = document.getElementById('review-container');
        const div = document.createElement("div");
        div.classList.add("review-card")
        div.innerHTML =`
         
        <img src="/images/doctor.png" alt="">
        <h4>${review.reviewer}</h4>
        <p>${review.body.slice(0,100)}</p>
        <h6>${review.rating}</h6>
        
        `;

        parent.appendChild(div)
    });
     
}






loadServices();
loadDoctors();
loadDesignations();
loadSpecilization();
loadReview()


