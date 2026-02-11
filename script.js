/*********************************
 PROMISEDLAND ENTERPRISE SCRIPT
**********************************/

const API = "https://promisedland-realestate.onrender.com";

/* =====================
   DISTRICTS (38)
=====================*/
const districts = [
"Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore",
"Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram",
"Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam",
"Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram",
"Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur",
"Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupattur",
"Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore",
"Viluppuram","Virudhunagar","Kanyakumari"
];

function loadDistricts(){
  const searchDistrict = document.getElementById("sDistrict");
  const postDistrict = document.getElementById("pDistrict");

  districts.forEach(d=>{
    searchDistrict.innerHTML += `<option>${d}</option>`;
    postDistrict.innerHTML += `<option>${d}</option>`;
  });
}

/* =====================
   SEARCH PROPERTY
=====================*/
async function searchProperty(){
  const type = document.getElementById("sType").value;
  const category = document.getElementById("sCategory").value;
  const district = document.getElementById("sDistrict").value;

  let url = `${API}/properties?approved=true`;

  if(type) url += `&type=${type}`;
  if(category) url += `&category=${category}`;
  if(district) url += `&district=${district}`;

  const res = await fetch(url);
  const data = await res.json();

  const container = document.getElementById("results");
  container.innerHTML = "";

  data.forEach(p=>{
    container.innerHTML += `
      <div class="property-card">
        ${p.premium ? "<span class='badge'>⭐ Premium</span>" : ""}
        <div class="slider">
          ${p.imageUrls ? p.imageUrls.map(img=>`<img src="${img}" class="slideImg">`).join("") : ""}
        </div>
        <h3>${p.title}</h3>
        <p>${p.category} | ${p.type}</p>
        <p>${p.district} - ${p.village}</p>
        <p>₹ ${p.price}</p>
        <span class="status ${p.status}">${p.status}</span>
        <p>👁 ${p.views || 0} Views</p>
        <a href="https://wa.me/91${p.mobile}" target="_blank">
          <button class="primary">WhatsApp</button>
        </a>
      </div>
    `;
  });
}

/* =====================
   POST PROPERTY
=====================*/
async function postProperty(){
  const formData = new FormData();

  formData.append("name", document.getElementById("pName").value);
  formData.append("mobile", document.getElementById("pMobile").value);
  formData.append("title", document.getElementById("pArea").value);
  formData.append("type", document.getElementById("pType").value);
  formData.append("category", document.getElementById("pCategory").value);
  formData.append("district", document.getElementById("pDistrict").value);
  formData.append("village", document.getElementById("pVillage").value);
  formData.append("price", document.getElementById("pPrice").value);
  formData.append("description", document.getElementById("pDesc").value);

  const file = document.getElementById("pImage").files[0];
  if(file) formData.append("image", file);

  const res = await fetch(API + "/properties", {
    method:"POST",
    body: formData
  });

  const data = await res.json();
  alert("Property submitted. Await admin approval.");
}

/* =====================
   ADMIN LOGIN
=====================*/
async function adminLogin(){
  const pass = document.getElementById("adminPass").value;

  if(pass !== "Vs5002190"){
    alert("Wrong password");
    return;
  }

  loadPending();
}

async function loadPending(){
  const res = await fetch(API+"/admin/pending");
  const data = await res.json();

  const container = document.getElementById("adminPanel");
  container.innerHTML = "";

  data.forEach(p=>{
    container.innerHTML += `
      <div class="property-card">
        <h4>${p.title}</h4>
        <p>${p.district}</p>
        <button onclick="approve('${p.id}')" class="primary">Approve</button>
      </div>
    `;
  });
}

async function approve(id){
  await fetch(API+"/admin/approve/"+id,{
    method:"POST"
  });
  alert("Approved");
  loadPending();
}

/* =====================
   LOAD INIT
=====================*/
window.onload = function(){
  loadDistricts();
};
