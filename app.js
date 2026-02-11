const API = "https://promisedland-realestate.onrender.com";

/* =========================
   LOAD APPROVED PROPERTIES
========================= */
async function loadProperties(){
  const res = await fetch(API + "/properties?approved=true");
  const data = await res.json();

  const container = document.getElementById("propertyList");
  container.innerHTML = "";

  data.forEach(p=>{
    container.innerHTML += `
      <div class="property-card">
        ${p.imageUrls ? `
          <div class="slider">
            ${p.imageUrls.map(img=>`<img src="${img}" class="slideImg">`).join("")}
          </div>` : ""}

        <h3>${p.title}</h3>
        <p><b>District:</b> ${p.district}</p>
        <p><b>Village:</b> ${p.village}</p>
        <p><b>Area:</b> ${p.area || "-"}</p>
        <p><b>Price:</b> ₹${p.price}</p>

        ${p.premium ? "<span class='badge'>⭐ Premium</span>" : ""}
        <span class="status ${p.status || 'available'}">${p.status || 'available'}</span>

        <br><br>
        <button class="btn" onclick="whatsappEnquiry('${p.mobile}','${p.title}')">
        WhatsApp
        </button>
      </div>
    `;
  });
}

/* =========================
   SEARCH
========================= */
async function searchProperty(){
  const type = document.getElementById("searchType").value;
  const category = document.getElementById("searchCategory").value;
  const district = document.getElementById("searchDistrict").value;

  const res = await fetch(
    `${API}/properties?approved=true&type=${type}&category=${category}&district=${district}`
  );
  const data = await res.json();

  const container = document.getElementById("propertyList");
  container.innerHTML = "";
  data.forEach(p=>{
    container.innerHTML += `
      <div class="property-card">
        <h3>${p.title}</h3>
        <p>${p.district} - ${p.village}</p>
        <p>₹${p.price}</p>
      </div>
    `;
  });
}

/* =========================
   SUBMIT PROPERTY
========================= */
async function submitProperty(){
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

  const imageFile = document.getElementById("pImage").files[0];
  if(imageFile) formData.append("image", imageFile);

  await fetch(API + "/properties",{
    method:"POST",
    body:formData
  });

  alert("Property submitted. Await admin approval.");
}

/* =========================
   WHATSAPP
========================= */
function whatsappEnquiry(mobile,title){
  const url = `https://wa.me/91${mobile}?text=I am interested in ${title}`;
  window.open(url,"_blank");
}

/* =========================
   ADMIN LOGIN
========================= */
async function adminLogin(){
  const pass = document.getElementById("adminPass").value;
  if(pass !== "Vs5002190"){
    alert("Wrong password");
    return;
  }

  const res = await fetch(API + "/admin/pending");
  const data = await res.json();

  const panel = document.getElementById("adminPanel");
  panel.innerHTML = "";

  data.forEach(p=>{
    panel.innerHTML += `
      <div class="admin-card">
        <h4>${p.title}</h4>
        <p>${p.district}</p>
        <button class="btn" onclick="approveProperty('${p.id}')">Approve</button>
      </div>
    `;
  });
}

/* =========================
   APPROVE
========================= */
async function approveProperty(id){
  await fetch(API + "/admin/approve/" + id,{
    method:"POST"
  });
  alert("Approved");
  adminLogin();
}

/* =========================
   LOAD ON START
========================= */
window.onload = loadProperties;
