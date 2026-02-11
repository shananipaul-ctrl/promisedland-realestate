/*************************************************
 PROMISEDLAND REAL ESTATE – ENTERPRISE MASTER JS
 Compatible with Render + Firebase Backend
*************************************************/

const API = "https://promisedland-realestate.onrender.com";

/* ===================================================
   38 TAMIL NADU DISTRICTS
===================================================*/
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

/* ===================================================
   LOAD DISTRICT DROPDOWNS
===================================================*/
function loadDistricts() {
  const sDistrict = document.getElementById("sDistrict");
  const pDistrict = document.getElementById("pDistrict");

  if (!sDistrict || !pDistrict) return;

  districts.forEach(d => {
    sDistrict.innerHTML += `<option value="${d}">${d}</option>`;
    pDistrict.innerHTML += `<option value="${d}">${d}</option>`;
  });
}

/* ===================================================
   SEARCH PROPERTIES
===================================================*/
async function searchProperty() {
  try {
    const type = document.getElementById("sType")?.value || "";
    const category = document.getElementById("sCategory")?.value || "";
    const district = document.getElementById("sDistrict")?.value || "";

    let url = `${API}/properties?approved=true`;

    if (type) url += `&type=${type}`;
    if (category) url += `&category=${category}`;
    if (district) url += `&district=${district}`;

    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("results");
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No properties found.</p>";
      return;
    }

    data.forEach(p => {
      container.innerHTML += `
        <div class="property-card">

          ${p.premium ? `<span class="badge">⭐ Premium</span>` : ""}

          ${
            p.imageUrls && p.imageUrls.length
              ? `<div class="slider">
                  ${p.imageUrls.map(img =>
                    `<img src="${img}" class="slideImg">`
                  ).join("")}
                 </div>`
              : ""
          }

          <h3>${p.title || ""}</h3>
          <p><b>${p.category || ""}</b> | ${p.type || ""}</p>
          <p>${p.district || ""} - ${p.village || ""}</p>
          <p><b>₹ ${p.price || 0}</b></p>

          ${
            p.status
              ? `<span class="status ${p.status}">
                   ${p.status}
                 </span>`
              : ""
          }

          <p>👁 ${p.views || 0} Views</p>

          ${
            p.mobile
              ? `<a href="https://wa.me/91${p.mobile}" target="_blank">
                  <button class="primary">WhatsApp</button>
                 </a>`
              : ""
          }

        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Error loading properties");
  }
}

/* ===================================================
   POST PROPERTY
===================================================*/
async function postProperty() {
  try {
    const formData = new FormData();

    formData.append("name", document.getElementById("pName")?.value || "");
    formData.append("mobile", document.getElementById("pMobile")?.value || "");
    formData.append("title", document.getElementById("pArea")?.value || "");
    formData.append("type", document.getElementById("pType")?.value || "");
    formData.append("category", document.getElementById("pCategory")?.value || "");
    formData.append("district", document.getElementById("pDistrict")?.value || "");
    formData.append("village", document.getElementById("pVillage")?.value || "");
    formData.append("price", document.getElementById("pPrice")?.value || "");
    formData.append("description", document.getElementById("pDesc")?.value || "");

    const files = document.getElementById("pImage")?.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
    }

    const res = await fetch(API + "/properties", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      alert("Property submitted. Await admin approval.");
      document.getElementById("postForm")?.reset();
    } else {
      alert(data.error || "Submission failed");
    }

  } catch (err) {
    console.error(err);
    alert("Error submitting property");
  }
}

/* ===================================================
   ADMIN LOGIN
===================================================*/
function adminLogin() {
  const pass = document.getElementById("adminPass")?.value;

  if (pass !== "Vs5002190") {
    alert("Wrong password");
    return;
  }

  document.getElementById("adminSection").style.display = "block";
  loadPending();
}

/* ===================================================
   LOAD PENDING PROPERTIES
===================================================*/
async function loadPending() {
  try {
    const res = await fetch(API + "/admin/pending");
    const data = await res.json();

    const container = document.getElementById("adminPanel");
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No pending properties.</p>";
      return;
    }

    data.forEach(p => {
      container.innerHTML += `
        <div class="property-card">
          <h4>${p.title}</h4>
          <p>${p.district} - ${p.village}</p>
          <p>₹ ${p.price}</p>

          <button onclick="approveProperty('${p.id}')" class="primary">
            Approve
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    alert("Error loading pending properties");
  }
}

/* ===================================================
   APPROVE PROPERTY
===================================================*/
async function approveProperty(id) {
  try {
    await fetch(API + "/admin/approve/" + id, {
      method: "POST"
    });

    alert("Property Approved");
    loadPending();

  } catch (err) {
    console.error(err);
    alert("Error approving property");
  }
}

/* ===================================================
   PAGE LOAD INIT
===================================================*/
window.onload = function () {
  loadDistricts();
};
function switchLang(){
if(langSwitch.value==="ta"){
document.querySelector(".tagline").innerText="உங்கள் கனவு நிலத்தின் முகவரி";
}
else{
document.querySelector(".tagline").innerText="Where Your Vision Meets Its Address";
}
}
