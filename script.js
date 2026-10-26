
document.addEventListener("DOMContentLoaded", function () {
    const main = document.querySelector("main.container");

    if (!main) {
        console.error("Elemen main.container tidak ditemukan.");
        return;
    }

    // Menyimpan tampilan awal beranda
    const kontenBeranda = main.innerHTML;
    let permintaanAktif = 0;

    // Membaca data dengan aman dari localStorage
    function bacaData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Data localStorage tidak valid:", error);
            return null;
        }
    }

    // Menampilkan data profil yang tersimpan
    function tampilkanProfil() {
        const profil = bacaData("smartfinderProfil");
        if (!profil) return;

        const nama = document.getElementById("lihatNama");
        if (!nama) return;

        const kampus = document.getElementById("lihatKampus");
        const prodi = document.getElementById("lihatProdi");
        const semester = document.getElementById("lihatSemester");

        if (kampus) kampus.textContent = profil.kampus || "";
        if (prodi) prodi.textContent = profil.prodi || "";
        if (semester) semester.textContent = profil.semester || "";
        nama.textContent = profil.nama || "";
    }

    // Menampilkan pilihan skill yang tersimpan
    function tampilkanPilihanSkill() {
        const pilihan = bacaData("smartfinderPilihan");
        const form = document.getElementById("skillForm");

        if (!pilihan || !form) return;

        form.querySelectorAll('input[name="skill"]').forEach(function (input) {
            input.checked = Array.isArray(pilihan.skills) &&
                pilihan.skills.includes(input.value);
        });

        if (form.elements["topik"]) {
            form.elements["topik"].value = pilihan.topik || "";
        }
    }

    function tampilkanData() {
        tampilkanProfil();
        tampilkanPilihanSkill();
    }

    function halamanDariURL() {
        if (window.location.hash === "#profil") return "profil";
        if (window.location.hash === "#skill") return "skill";
        return "beranda";
    }

    // Memuat halaman menggunakan AJAX
    async function bukaHalaman(halaman, ubahRiwayat = true) {
        const idPermintaan = ++permintaanAktif;

        if (halaman === "beranda") {
            main.innerHTML = kontenBeranda;

            if (ubahRiwayat) {
                history.pushState({ halaman: "beranda" }, "", "#beranda");
            }

            tampilkanData();
            window.scrollTo(0, 0);
            return;
        }

        const alamat = halaman === "profil"
            ? "pages/profil.html"
            : "pages/skill-topik.html";

        try {
            const response = await fetch(alamat);

            if (!response.ok) {
                throw new Error("Halaman gagal dimuat.");
            }

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const konten = doc.querySelector("main.container");

            if (!konten) {
                throw new Error("Elemen main.container tidak ditemukan.");
            }

            // Abaikan respons lama jika pengguna sudah memilih halaman lain
            if (idPermintaan !== permintaanAktif) return;

            main.innerHTML = konten.innerHTML;

            if (ubahRiwayat) {
                history.pushState(
                    { halaman: halaman },
                    "",
                    halaman === "profil" ? "#profil" : "#skill"
                );
            }

            tampilkanData();
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            alert(
                "Halaman gagal dimuat. Jalankan website melalui server lokal."
            );
        }
    }

    // Navigasi Beranda, Profil, dan Skill & Topik
    document.addEventListener("click", function (event) {
        const link = event.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        let halaman = null;

        if (href === "#profil" || href.endsWith("pages/profil.html")) {
            halaman = "profil";
        } else if (
            href === "#skill" ||
            href.endsWith("pages/skill-topik.html")
        ) {
            halaman = "skill";
        } else if (
            href === "#beranda" ||
            href === "../index.html" ||
            href === "index.html" ||
            href === "/"
        ) {
            halaman = "beranda";
        }

        if (!halaman) return;

        event.preventDefault();
        bukaHalaman(halaman);
    });

    // Validasi dan pengiriman formulir
    main.addEventListener("submit", async function (event) {
        const form = event.target;

        if (form.id === "profilForm") {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const profil = {
                nama: form.elements["nama"].value.trim(),
                kampus: form.elements["kampus"].value.trim(),
                prodi: form.elements["prodi"].value.trim(),
                semester: form.elements["semester"].value
            };

            if (!profil.nama || !profil.kampus || !profil.prodi) {
                document.getElementById("profilMessage").textContent =
                    "Semua data profil wajib diisi.";
                return;
            }

            const pesan = document.getElementById("profilMessage");
            pesan.textContent = "Mengirim data ke server...";

            try {
                const response = await fetch("/api/profil", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(profil)
                });

                const hasil = await response.json();

                if (!response.ok || !hasil.success) {
                    pesan.textContent =
                        hasil.message || "Pengiriman profil gagal.";
                    return;
                }

                // Simpan ke browser setelah server merespons sukses
                localStorage.setItem(
                    "smartfinderProfil",
                    JSON.stringify(profil)
                );

                tampilkanProfil();

                pesan.textContent =
                    "Profil berhasil dikirim ke server dan disimpan di browser.";
            } catch (error) {
                console.error(error);
                pesan.textContent =
                    "Server tidak dapat dihubungi. Jalankan server.py terlebih dahulu.";
            }
        }

        if (form.id === "skillForm") {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const skills = form.querySelectorAll(
                'input[name="skill"]:checked'
            );

            const pesan = document.getElementById("skillMessage");

            if (skills.length === 0) {
                pesan.textContent = "Pilih minimal satu skill.";
                return;
            }

            const pilihan = {
                skills: Array.from(skills).map(function (skill) {
                    return skill.value;
                }),
                topik: form.elements["topik"].value
            };

            localStorage.setItem(
                "smartfinderPilihan",
                JSON.stringify(pilihan)
            );

            pesan.textContent = "Skill dan topik berhasil disimpan!";
        }
    });

    // Mendukung tombol Back dan Forward browser
    window.addEventListener("popstate", function () {
        bukaHalaman(halamanDariURL(), false);
    });

    // Memulihkan tampilan sesuai URL saat halaman dibuka
    tampilkanData();

    const halamanAwal = halamanDariURL();
    if (halamanAwal !== "beranda") {
        bukaHalaman(halamanAwal, false);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const main = document.querySelector("main.container");

    if (!main) {
        console.error("Elemen main.container tidak ditemukan.");
        return;
    }

    // Menyimpan tampilan awal beranda
    const kontenBeranda = main.innerHTML;
    let permintaanAktif = 0;

    // Membaca data dengan aman dari localStorage
    function bacaData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Data localStorage tidak valid:", error);
            return null;
        }
    }

    // Menampilkan data profil yang tersimpan
    function tampilkanProfil() {
        const profil = bacaData("smartfinderProfil");
        if (!profil) return;

        const nama = document.getElementById("lihatNama");
        if (!nama) return;

        const kampus = document.getElementById("lihatKampus");
        const prodi = document.getElementById("lihatProdi");
        const semester = document.getElementById("lihatSemester");

        if (kampus) kampus.textContent = profil.kampus || "";
        if (prodi) prodi.textContent = profil.prodi || "";
        if (semester) semester.textContent = profil.semester || "";
        nama.textContent = profil.nama || "";
    }

    // Menampilkan pilihan skill yang tersimpan
    function tampilkanPilihanSkill() {
        const pilihan = bacaData("smartfinderPilihan");
        const form = document.getElementById("skillForm");

        if (!pilihan || !form) return;

        form.querySelectorAll('input[name="skill"]').forEach(function (input) {
            input.checked = Array.isArray(pilihan.skills) &&
                pilihan.skills.includes(input.value);
        });

        if (form.elements["topik"]) {
            form.elements["topik"].value = pilihan.topik || "";
        }
    }

    function tampilkanData() {
        tampilkanProfil();
        tampilkanPilihanSkill();
    }

    function halamanDariURL() {
        if (window.location.hash === "#profil") return "profil";
        if (window.location.hash === "#skill") return "skill";
        return "beranda";
    }

    // Memuat halaman menggunakan AJAX
    async function bukaHalaman(halaman, ubahRiwayat = true) {
        const idPermintaan = ++permintaanAktif;

        if (halaman === "beranda") {
            main.innerHTML = kontenBeranda;

            if (ubahRiwayat) {
                history.pushState({ halaman: "beranda" }, "", "#beranda");
            }

            tampilkanData();
            window.scrollTo(0, 0);
            return;
        }

        const alamat = halaman === "profil"
            ? "pages/profil.html"
            : "pages/skill-topik.html";

        try {
            const response = await fetch(alamat);

            if (!response.ok) {
                throw new Error("Halaman gagal dimuat.");
            }

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const konten = doc.querySelector("main.container");

            if (!konten) {
                throw new Error("Elemen main.container tidak ditemukan.");
            }

            // Abaikan respons lama jika pengguna sudah memilih halaman lain
            if (idPermintaan !== permintaanAktif) return;

            main.innerHTML = konten.innerHTML;

            if (ubahRiwayat) {
                history.pushState(
                    { halaman: halaman },
                    "",
                    halaman === "profil" ? "#profil" : "#skill"
                );
            }

            tampilkanData();
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            alert(
                "Halaman gagal dimuat. Jalankan website melalui server lokal."
            );
        }
    }

    // Navigasi Beranda, Profil, dan Skill & Topik
    document.addEventListener("click", function (event) {
        const link = event.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href) return;

        let halaman = null;

        if (href === "#profil" || href.endsWith("pages/profil.html")) {
            halaman = "profil";
        } else if (
            href === "#skill" ||
            href.endsWith("pages/skill-topik.html")
        ) {
            halaman = "skill";
        } else if (
            href === "#beranda" ||
            href === "../index.html" ||
            href === "index.html" ||
            href === "/"
        ) {
            halaman = "beranda";
        }

        if (!halaman) return;

        event.preventDefault();
        bukaHalaman(halaman);
    });

    // Validasi dan pengiriman formulir
    main.addEventListener("submit", async function (event) {
        const form = event.target;

        if (form.id === "profilForm") {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const profil = {
                nama: form.elements["nama"].value.trim(),
                kampus: form.elements["kampus"].value.trim(),
                prodi: form.elements["prodi"].value.trim(),
                semester: form.elements["semester"].value
            };

            if (!profil.nama || !profil.kampus || !profil.prodi) {
                document.getElementById("profilMessage").textContent =
                    "Semua data profil wajib diisi.";
                return;
            }

            const pesan = document.getElementById("profilMessage");
            pesan.textContent = "Mengirim data ke server...";

            try {
                const response = await fetch("/api/profil", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(profil)
                });

                const hasil = await response.json();

                if (!response.ok || !hasil.success) {
                    pesan.textContent =
                        hasil.message || "Pengiriman profil gagal.";
                    return;
                }

                // Simpan ke browser setelah server merespons sukses
                localStorage.setItem(
                    "smartfinderProfil",
                    JSON.stringify(profil)
                );

                tampilkanProfil();

                pesan.textContent =
                    "Profil berhasil dikirim ke server dan disimpan di browser.";
            } catch (error) {
                console.error(error);
                pesan.textContent =
                    "Server tidak dapat dihubungi. Jalankan server.py terlebih dahulu.";
            }
        }

        if (form.id === "skillForm") {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const skills = form.querySelectorAll(
                'input[name="skill"]:checked'
            );

            const pesan = document.getElementById("skillMessage");

            if (skills.length === 0) {
                pesan.textContent = "Pilih minimal satu skill.";
                return;
            }

            const pilihan = {
                skills: Array.from(skills).map(function (skill) {
                    return skill.value;
                }),
                topik: form.elements["topik"].value
            };

            localStorage.setItem(
                "smartfinderPilihan",
                JSON.stringify(pilihan)
            );

            pesan.textContent = "Skill dan topik berhasil disimpan!";
        }
    });

    // Mendukung tombol Back dan Forward browser
    window.addEventListener("popstate", function () {
        bukaHalaman(halamanDariURL(), false);
    });

    // Memulihkan tampilan sesuai URL saat halaman dibuka
    tampilkanData();

    const halamanAwal = halamanDariURL();
    if (halamanAwal !== "beranda") {
        bukaHalaman(halamanAwal, false);
    }
});
