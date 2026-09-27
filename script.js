const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const joki = [
  ["Joki Kontak 3 Hari","Rp2.000","Akses joki kontak 3 hari"],
  ["Joki Kontak 6 Hari","Rp4.000","Akses joki kontak 6 hari"],
  ["Joki Kontak 8 Hari","Rp5.000","Akses joki kontak 8 hari"],
  ["Joki Kontak 10 Hari","Rp7.000","Akses joki kontak 10 hari"],
  ["Joki Kontak PERMANEN","Rp10.000","Paket permanen"]
];

const digital = [
  ["APK GOJO CRASHER V2","Rp2.000","Demo/non-malicious. Tidak termasuk RAT atau fungsi pengendalian perangkat."],
  ["APK AUTO SV","Rp2.000","Produk digital / demo"],
  ["PANEL UNLI","Rp10.000","Produk panel digital"],
  ["FILE AUTO HS 70%","Rp70.000","File digital"],
  ["JASA EDIT SPEK","Rp1.000","Jasa edit sesuai kebutuhan"],
  ["JASA BUAT LOGO JB","Rp2.000","Jasa desain logo"],
  ["MURPUSH","Rp1.000","Layanan digital"],
  ["NOKOS INDO","Rp6.000","Layanan nomor"],
  ["FF KIPAS","Rp3.000","Produk digital/game service"],
  ["RESLLER GOJO","Rp70.000","Paket reseller"],
  ["NOKOS INDO","Rp7.000","Paket alternatif"]
];

function card(item){
  return `<article class="card">
    <div class="card-top"><h3>${item[0]}</h3><div class="price">${item[1]}</div></div>
    <p class="desc">${item[2]}</p>
    <button class="primary orderBtn" data-product="${item[0]}" data-price="${item[1]}">ORDER SEKARANG</button>
  </article>`;
}
$("#jokiList").innerHTML = joki.map(card).join("");
$("#digitalList").innerHTML = digital.map(card).join("");

function showPage(id){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  $$(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.go===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-go]").forEach(btn=>btn.addEventListener("click",()=>showPage(btn.dataset.go)));

let selected = null;
function openPayment(product,price){
  selected={product,price};
  $("#payTitle").textContent = "Metode Pembayaran";
  $("#payProduct").textContent = product;
  $("#payPrice").textContent = price;
  $("#proofInput").value="";
  $("#proofName").textContent="Belum ada bukti dipilih.";
  $("#paymentModal").classList.remove("hidden");
}
document.addEventListener("click",e=>{
  const btn=e.target.closest(".orderBtn");
  if(btn) openPayment(btn.dataset.product,btn.dataset.price);
});
$("#closePayment").onclick=()=>$("#paymentModal").classList.add("hidden");
$("#copyDana").onclick=async()=>{
  await navigator.clipboard?.writeText("083867468118");
  toast("Nomor DANA berhasil disalin.");
};
$("#proofInput").onchange=e=>{
  const f=e.target.files[0];
  $("#proofName").textContent=f ? `Bukti dipilih: ${f.name}` : "Belum ada bukti dipilih.";
};

$("#confirmPayment").onclick=()=>{
  if(!selected)return;
  const proof=$("#proofInput").files[0];
  const history=JSON.parse(localStorage.getItem("raffHistory")||"[]");
  history.unshift({product:selected.product,price:selected.price,time:new Date().toLocaleString("id-ID"),proof:proof?.name||"-"});
  localStorage.setItem("raffHistory",JSON.stringify(history.slice(0,30)));
  $("#paymentModal").classList.add("hidden");
  renderHistory();
  showPage("joki");
  toast("Order tersimpan. Silahkan hubungi admin untuk verifikasi.");
  setTimeout(()=>{
    const msg=`Halo Admin CEO RAFFSTR, saya sudah transfer untuk ${selected.product} (${selected.price}). Mohon cek dan ACC order saya.`;
    window.open(`https://wa.me/6283817546555?text=${encodeURIComponent(msg)}`,"_blank");
  },500);
};

function renderHistory(){
  const h=JSON.parse(localStorage.getItem("raffHistory")||"[]");
  $("#historyList").innerHTML=h.length?h.map(x=>`<div class="history-row"><b>${x.product}</b> — ${x.price}<span>${x.time} • Bukti: ${x.proof}</span></div>`).join(""):"<p class='muted'>Belum ada pembelian.</p>";
}
$("#historyBtn").onclick=()=>{renderHistory();$("#historyBox").classList.toggle("hidden")};
$("#clearHistory").onclick=()=>{localStorage.removeItem("raffHistory");renderHistory();toast("Riwayat dihapus.")};

let name=localStorage.getItem("raffName")||"RAFFSTR USER";
$("#profileName").textContent=name;
$("#changeName").onclick=()=>{
  const n=prompt("Masukkan nama profil:",name);
  if(n?.trim()){name=n.trim();localStorage.setItem("raffName",name);$("#profileName").textContent=name;toast("Nama profil diperbarui.")}
};
const defaultAvatar="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#141421"/><circle cx="150" cy="115" r="58" fill="#8d4cff"/><circle cx="150" cy="300" r="105" fill="#53228e"/><text x="150" y="175" fill="white" font-size="42" font-family="Arial" text-anchor="middle" font-weight="700">R</text></svg>`);
$("#avatar").src=localStorage.getItem("raffAvatar")||defaultAvatar;
$("#avatarInput").onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  const reader=new FileReader();
  reader.onload=()=>{localStorage.setItem("raffAvatar",reader.result);$("#avatar").src=reader.result;toast("Foto profil disimpan.")};
  reader.readAsDataURL(f);
};
$("#editPhotoBtn").onclick=()=>$("#avatarInput").click();
$("#logoutBtn").onclick=()=>{localStorage.removeItem("raffName");toast("Sesi profil lokal dihapus.");setTimeout(()=>location.reload(),700)};

$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("raffTheme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("raffTheme")==="light")document.body.classList.add("light");

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2500)}
const toastStyle=document.createElement("style");
toastStyle.textContent=".toast{position:fixed;z-index:120;left:50%;bottom:95px;transform:translate(-50%,20px);opacity:0;pointer-events:none;background:#151522;color:#fff;border:1px solid #ffffff16;padding:12px 16px;border-radius:14px;box-shadow:0 10px 35px #0008;transition:.25s;font-size:12px;max-width:90%;text-align:center}.toast.show{opacity:1;transform:translate(-50%,0)}";
document.head.appendChild(toastStyle);

setTimeout(()=>{$("#splash").classList.add("hidden");$("#app").classList.remove("hidden")},1200);
