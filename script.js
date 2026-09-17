var API_URL = "https://script.google.com/macros/s/AKfycbwIxrFwhGsGV2OAaX0Vesxz9mAUwBFHQsKUo758x6vDSsSdCT-ySDHVx2HQDgiimI0AYA/exec";

function jsonp(action, data, selesai) {
var namaCallback =
"itamPay_" +
Date.now() +
"_" +
Math.floor(Math.random() * 10000);

var script = document.createElement("script");

var url =
API_URL +
"?action=" +
encodeURIComponent(action) +
"&callback=" +
encodeURIComponent(namaCallback);

if (data) {
for (var key in data) {
url +=
"&" +
encodeURIComponent(key) +
"=" +
encodeURIComponent(data[key]);
}
}

window[namaCallback] = function(hasil) {
selesai(null, hasil);

```
delete window[namaCallback];

if (script.parentNode) {
  script.parentNode.removeChild(script);
}
```

};

script.onerror = function() {
selesai(
new Error("Gagal menghubungi Apps Script."),
null
);

```
delete window[namaCallback];

if (script.parentNode) {
  script.parentNode.removeChild(script);
}
```

};

script.src = url;
document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", function() {

loadMaster();
loadDashboard();
loadRiwayat();

var nominal = document.getElementById("nominal");

if (nominal) {
nominal.addEventListener("input", function() {

```
  var angka = this.value.replace(/\D/g, "");

  if (angka === "") {
    this.value = "";
    return;
  }

  this.value = Number(angka).toLocaleString("id-ID");
});
```

}

});

function loadMaster() {

jsonp("master", null, function(error, data) {

```
if (error) {
  console.error("Master:", error);
  return;
}

var jenis = document.getElementById("jenis");
var via = document.getElementById("via");

if (!jenis || !via) {
  console.error("Dropdown tidak ditemukan.");
  return;
}

jenis.innerHTML =
  '<option value="">Pilih Transaksi</option>';

via.innerHTML =
  '<option value="">Pilih Via</option>';

if (data && Array.isArray(data.transaksi)) {

  data.transaksi.forEach(function(item) {

    var option = document.createElement("option");

    option.value = item;
    option.textContent = item;

    jenis.appendChild(option);
  });
}

if (data && Array.isArray(data.via)) {

  data.via.forEach(function(item) {

    var option = document.createElement("option");

    option.value = item;
    option.textContent = item;

    via.appendChild(option);
  });
}
```

});

}

function loadDashboard() {

jsonp("dashboard", null, function(error, data) {

```
if (error) {
  console.error("Dashboard:", error);
  return;
}

var jumlah = document.getElementById("jumlahTransaksi");
var admin = document.getElementById("totalAdmin");

if (jumlah) {
  jumlah.textContent = data.transaksi || 0;
}

if (admin) {
  admin.textContent = formatRupiah(data.admin || 0);
}
```

});

}

function formatRupiah(angka) {

return "Rp " +
Number(angka || 0).toLocaleString("id-ID");

}

function simpan() {

var jenis = document.getElementById("jenis").value;
var via = document.getElementById("via").value;

var nominal =
document.getElementById("nominal")
.value
.replace(/\D/g, "");

if (
jenis === "" ||
via === "" ||
nominal === ""
) {

```
alert("Lengkapi semua data.");
return;
```

}

var tombol =
document.querySelector(".btnSave");

tombol.disabled = true;
tombol.textContent = "MENYIMPAN...";

jsonp(
"simpan",
{
jenis: jenis,
via: via,
nominal: nominal
},
function(error, hasil) {

```
  if (error) {

    alert("Error: " + error.message);

    tombol.disabled = false;
    tombol.textContent = "SIMPAN";

    return;
  }

  if (!hasil || !hasil.success) {

    alert("Gagal menyimpan transaksi.");

    tombol.disabled = false;
    tombol.textContent = "SIMPAN";

    return;
  }

  alert("Transaksi berhasil disimpan.");

  resetForm();

  loadDashboard();
  loadRiwayat();

  tombol.disabled = false;
  tombol.textContent = "SIMPAN";

}
```

);

}

function resetForm() {

document.getElementById("jenis").selectedIndex = 0;

document.getElementById("via").selectedIndex = 0;

document.getElementById("nominal").value = "";

}

function loadRiwayat() {

jsonp("riwayat", null, function(error, data) {

```
var history =
  document.getElementById("historyList");

if (!history) {
  return;
}

if (error) {

  history.innerHTML =
    "Gagal memuat riwayat.";

  console.error("Riwayat:", error);

  return;
}

if (!data || data.length === 0) {

  history.innerHTML =
    "<div style='text-align:center;padding:20px'>" +
    "Belum ada transaksi" +
    "</div>";

  return;
}

var html = "";

data.forEach(function(r) {

  html +=
    '<div class="itemRiwayat">' +

      '<div>' +
        '<b>' + r.transaksi + '</b><br>' +
        '<small>' + r.via + '</small>' +
      '</div>' +

      '<div style="text-align:right">' +
        '<b>' + r.nominal + '</b><br>' +
        '<small>' + r.tanggal + '</small>' +
      '</div>' +

      '<button ' +
        'class="btnDelete" ' +
        'onclick="hapusRiwayat(' + r.row + ')" ' +
        'title="Hapus transaksi">' +
        '🗑' +
      '</button>' +

    '</div>';

});

history.innerHTML = html;
```

});

}

function hapusRiwayat(row) {

var yakin = confirm(
"Hapus transaksi ini?\n\n" +
"Data yang dihapus tidak dapat dikembalikan."
);

if (!yakin) {
return;
}

jsonp(
"hapus",
{
row: row
},
function(error, hasil) {

```
  if (error) {

    alert(
      "Gagal menghapus transaksi: " +
      error.message
    );

    return;
  }

  if (!hasil || !hasil.success) {

    alert("Gagal menghapus transaksi.");

    return;
  }

  loadDashboard();
  loadRiwayat();

}
```

);

}

