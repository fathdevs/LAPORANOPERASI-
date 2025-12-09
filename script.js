// Storage key untuk localStorage
const STORAGE_KEY = 'laporan_operasi';

// Fungsi untuk mendapatkan semua laporan
function getAllLaporan() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Fungsi untuk menyimpan semua laporan
function saveAllLaporan(laporanArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(laporanArray));
}

// Fungsi untuk mendapatkan laporan by ID
function getLaporanById(id) {
    const allLaporan = getAllLaporan();
    return allLaporan.find(l => l.id === id);
}

// Fungsi untuk generate ID unik
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Fungsi untuk mengisi form dengan data dummy
function fillDummyData() {
    if (!confirm('Apakah Anda yakin ingin mengisi form dengan data dummy? Data yang sudah diisi akan diganti.')) {
        return;
    }

    // Set tanggal untuk dummy data
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 45, 5, 15); // 45 tahun lalu
    const operationDate = new Date();
    
    // Format tanggal untuk input date (YYYY-MM-DD)
    const formatDateInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format waktu untuk input time (HH:MM)
    const formatTimeInput = (hours, minutes) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    // Informasi Pasien
    document.getElementById('namaPasien').value = 'Budi Santoso';
    document.getElementById('tglLahir').value = formatDateInput(birthDate);
    document.getElementById('noRM').value = 'RM.2024.001234';

    // Rencana Pre Operasi
    document.getElementById('anamnesis').value = 'Pasien mengeluh nyeri perut kanan bawah sejak 2 hari yang lalu, disertai mual dan muntah. Nyeri bersifat kolik, menjalar ke daerah epigastrium.';
    document.querySelector('input[name="alergi"][value="iya"]').checked = true;
    document.getElementById('alergiDetail').value = 'Penisilin';
    document.getElementById('alergiDetail').style.display = 'inline-block';
    document.getElementById('pemeriksaanFisik').value = 'Keadaan umum tampak sakit sedang, kesadaran compos mentis. TD: 120/80 mmHg, Nadi: 88x/menit, RR: 20x/menit, Suhu: 37.5°C. Abdomen: distensi ringan, nyeri tekan di regio McBurney (+), tanda Rovsing (+), tanda Blumberg (+).';
    document.getElementById('diagnosisPreOperasi').value = 'Appendisitis Akut';
    document.getElementById('namaOperasi').value = 'Appendektomi Laparoskopi';
    document.querySelector('input[name="alatKhusus"][value="iya"]').checked = true;
    document.getElementById('alatKhususDetail').value = 'Laparoskopi set, trocar, insufflator';
    document.getElementById('alatKhususDetail').style.display = 'inline-block';

    // Laporan Operasi Tindakan
    document.getElementById('tanggalOperasi').value = formatDateInput(operationDate);
    document.getElementById('jamMulai').value = formatTimeInput(10, 30);
    document.getElementById('jamSelesai').value = formatTimeInput(11, 45);
    document.getElementById('dokterBedah').value = 'Dr. Ahmad Wijaya, Sp.B';
    document.getElementById('asisten1').value = 'Dr. Siti Nurhaliza, Sp.B';
    document.getElementById('asisten2').value = 'Dr. Muhammad Rizki, Sp.B';
    document.getElementById('dokterAnestesi').value = 'Dr. Indah Permata, Sp.An';
    document.getElementById('perawatInstrumen').value = 'Nurse Ratna Dewi, S.Kep';
    document.querySelector('input[name="tiperOperasi"][value="darurat"]').checked = true;
    document.getElementById('diagnosaPascaBedah').value = 'Appendisitis Akut dengan Perforasi';
    document.getElementById('operasiTindakan').value = 'Dilakukan appendektomi laparoskopi. Insisi dibuat di umbilikus untuk trocar kamera, dan 2 insisi tambahan di kuadran kanan bawah dan kiri bawah untuk trocar kerja. Appendiks terlihat inflamasi dengan perforasi di bagian distal. Appendiks diangkat dengan stapler endo-GIA. Hemostasis baik. Tidak ada komplikasi intraoperatif.';

    // Tipe Anestesi
    document.querySelector('input[name="tipeAnestesi"][value="GA"]').checked = true;

    // Spesimen
    document.querySelector('input[name="spesimen"][value="ya"]').checked = true;
    document.getElementById('spesimenDetail').style.display = 'block';
    document.querySelector('input[name="jenisSpesimen"][value="Jaringan"]').checked = true;
    document.getElementById('asalSpesimen').value = 'Appendiks';

    // Kultur
    document.querySelector('input[name="kultur"][value="tidak"]').checked = true;

    // Perdarahan dan Transfusi
    document.getElementById('perkiraanPerdarahan').value = '50';
    document.getElementById('transfusiWB').value = '0';
    document.getElementById('transfusiPRC').value = '0';
    document.getElementById('transfusiFFP').value = '0';
    document.getElementById('transfusiCryo').value = '0';

    alert('Data dummy berhasil diisi!');
}

// Fungsi untuk format tanggal Indonesia
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function formatDateShort(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('id-ID', options);
}

function formatTime(timeString) {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
}

// Fungsi untuk menyimpan laporan (Create/Update)
function saveLaporan() {
    const form = document.getElementById('laporanForm');
    if (!form) return;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Ambil data dari form
    const laporan = {
        id: id || generateId(),
        namaPasien: formData.get('namaPasien'),
        tglLahir: formData.get('tglLahir'),
        noRM: formData.get('noRM'),
        anamnesis: formData.get('anamnesis'),
        alergi: formData.get('alergi'),
        alergiDetail: formData.get('alergiDetail') || '',
        pemeriksaanFisik: formData.get('pemeriksaanFisik'),
        diagnosisPreOperasi: formData.get('diagnosisPreOperasi'),
        namaOperasi: formData.get('namaOperasi'),
        alatKhusus: formData.get('alatKhusus'),
        alatKhususDetail: formData.get('alatKhususDetail') || '',
        tanggalOperasi: formData.get('tanggalOperasi'),
        jamMulai: formData.get('jamMulai'),
        jamSelesai: formData.get('jamSelesai'),
        dokterBedah: formData.get('dokterBedah'),
        asisten1: formData.get('asisten1') || '',
        asisten2: formData.get('asisten2') || '',
        dokterAnestesi: formData.get('dokterAnestesi'),
        perawatInstrumen: formData.get('perawatInstrumen') || '',
        tiperOperasi: formData.get('tiperOperasi'),
        diagnosaPascaBedah: formData.get('diagnosaPascaBedah'),
        operasiTindakan: formData.get('operasiTindakan'),
        tipeAnestesi: Array.from(form.querySelectorAll('input[name="tipeAnestesi"]:checked')).map(cb => cb.value),
        spesimen: formData.get('spesimen'),
        jenisSpesimen: Array.from(form.querySelectorAll('input[name="jenisSpesimen"]:checked')).map(cb => cb.value),
        asalSpesimen: formData.get('asalSpesimen') || '',
        kultur: formData.get('kultur'),
        perkiraanPerdarahan: formData.get('perkiraanPerdarahan') || '0',
        transfusiWB: formData.get('transfusiWB') || '0',
        transfusiPRC: formData.get('transfusiPRC') || '0',
        transfusiFFP: formData.get('transfusiFFP') || '0',
        transfusiCryo: formData.get('transfusiCryo') || '0',
        createdAt: id ? getLaporanById(id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Simpan ke localStorage
    const allLaporan = getAllLaporan();
    if (id) {
        // Update existing
        const index = allLaporan.findIndex(l => l.id === id);
        if (index !== -1) {
            allLaporan[index] = laporan;
        }
    } else {
        // Create new
        allLaporan.push(laporan);
    }
    saveAllLaporan(allLaporan);

    // Redirect ke halaman list
    alert('Laporan berhasil disimpan!');
    window.location.href = 'index.html';
}

// Fungsi untuk load laporan untuk edit
function loadLaporanForEdit(id) {
    const laporan = getLaporanById(id);
    if (!laporan) {
        alert('Laporan tidak ditemukan!');
        window.location.href = 'index.html';
        return;
    }

    // Isi form dengan data laporan
    document.getElementById('namaPasien').value = laporan.namaPasien || '';
    document.getElementById('tglLahir').value = laporan.tglLahir || '';
    document.getElementById('noRM').value = laporan.noRM || '';
    document.getElementById('anamnesis').value = laporan.anamnesis || '';
    document.querySelector(`input[name="alergi"][value="${laporan.alergi}"]`).checked = true;
    if (laporan.alergi === 'iya') {
        document.getElementById('alergiDetail').value = laporan.alergiDetail || '';
        document.getElementById('alergiDetail').style.display = 'inline-block';
    }
    document.getElementById('pemeriksaanFisik').value = laporan.pemeriksaanFisik || '';
    document.getElementById('diagnosisPreOperasi').value = laporan.diagnosisPreOperasi || '';
    document.getElementById('namaOperasi').value = laporan.namaOperasi || '';
    document.querySelector(`input[name="alatKhusus"][value="${laporan.alatKhusus}"]`).checked = true;
    if (laporan.alatKhusus === 'iya') {
        document.getElementById('alatKhususDetail').value = laporan.alatKhususDetail || '';
        document.getElementById('alatKhususDetail').style.display = 'inline-block';
    }
    document.getElementById('tanggalOperasi').value = laporan.tanggalOperasi || '';
    document.getElementById('jamMulai').value = laporan.jamMulai || '';
    document.getElementById('jamSelesai').value = laporan.jamSelesai || '';
    document.getElementById('dokterBedah').value = laporan.dokterBedah || '';
    document.getElementById('asisten1').value = laporan.asisten1 || '';
    document.getElementById('asisten2').value = laporan.asisten2 || '';
    document.getElementById('dokterAnestesi').value = laporan.dokterAnestesi || '';
    document.getElementById('perawatInstrumen').value = laporan.perawatInstrumen || '';
    document.querySelector(`input[name="tiperOperasi"][value="${laporan.tiperOperasi}"]`).checked = true;
    document.getElementById('diagnosaPascaBedah').value = laporan.diagnosaPascaBedah || '';
    document.getElementById('operasiTindakan').value = laporan.operasiTindakan || '';
    
    // Tipe anestesi
    laporan.tipeAnestesi?.forEach(tipe => {
        const checkbox = document.querySelector(`input[name="tipeAnestesi"][value="${tipe}"]`);
        if (checkbox) checkbox.checked = true;
    });

    // Spesimen
    document.querySelector(`input[name="spesimen"][value="${laporan.spesimen}"]`).checked = true;
    if (laporan.spesimen === 'ya') {
        document.getElementById('spesimenDetail').style.display = 'block';
        laporan.jenisSpesimen?.forEach(jenis => {
            const checkbox = document.querySelector(`input[name="jenisSpesimen"][value="${jenis}"]`);
            if (checkbox) checkbox.checked = true;
        });
        document.getElementById('asalSpesimen').value = laporan.asalSpesimen || '';
    }

    document.querySelector(`input[name="kultur"][value="${laporan.kultur}"]`).checked = true;
    document.getElementById('perkiraanPerdarahan').value = laporan.perkiraanPerdarahan || '0';
    document.getElementById('transfusiWB').value = laporan.transfusiWB || '0';
    document.getElementById('transfusiPRC').value = laporan.transfusiPRC || '0';
    document.getElementById('transfusiFFP').value = laporan.transfusiFFP || '0';
    document.getElementById('transfusiCryo').value = laporan.transfusiCryo || '0';
}

// Fungsi untuk load dan tampilkan list laporan
function loadLaporanList() {
    const allLaporan = getAllLaporan();
    const tbody = document.getElementById('laporanTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (allLaporan.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.add('show');
        return;
    }

    if (emptyState) emptyState.classList.remove('show');

    // Sort by tanggal operasi (terbaru dulu)
    const sortedLaporan = [...allLaporan].sort((a, b) => {
        return new Date(b.tanggalOperasi) - new Date(a.tanggalOperasi);
    });

    tbody.innerHTML = sortedLaporan.map((laporan, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatDateShort(laporan.tanggalOperasi)}</td>
            <td>${laporan.namaPasien}</td>
            <td>${laporan.noRM}</td>
            <td>${laporan.diagnosisPreOperasi}</td>
            <td>${laporan.namaOperasi}</td>
            <td>${laporan.dokterBedah}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="viewLaporan('${laporan.id}')">Lihat</button>
                    <button class="btn btn-warning btn-sm" onclick="editLaporan('${laporan.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLaporan('${laporan.id}')">Hapus</button>
                    <button class="btn btn-success btn-sm" onclick="exportLaporan('${laporan.id}')">Export</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Fungsi untuk filter laporan
function filterLaporan() {
    const searchInput = document.getElementById('searchInput');
    const filterDate = document.getElementById('filterDate');
    const searchTerm = searchInput.value.toLowerCase();
    const filterDateValue = filterDate.value;

    const allLaporan = getAllLaporan();
    const tbody = document.getElementById('laporanTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    let filtered = allLaporan.filter(laporan => {
        const matchSearch = !searchTerm || 
            laporan.namaPasien.toLowerCase().includes(searchTerm) ||
            laporan.noRM.toLowerCase().includes(searchTerm) ||
            laporan.diagnosisPreOperasi.toLowerCase().includes(searchTerm) ||
            laporan.namaOperasi.toLowerCase().includes(searchTerm);
        
        const matchDate = !filterDateValue || laporan.tanggalOperasi === filterDateValue;
        
        return matchSearch && matchDate;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.add('show');
        return;
    }

    if (emptyState) emptyState.classList.remove('show');

    const sorted = filtered.sort((a, b) => {
        return new Date(b.tanggalOperasi) - new Date(a.tanggalOperasi);
    });

    tbody.innerHTML = sorted.map((laporan, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatDateShort(laporan.tanggalOperasi)}</td>
            <td>${laporan.namaPasien}</td>
            <td>${laporan.noRM}</td>
            <td>${laporan.diagnosisPreOperasi}</td>
            <td>${laporan.namaOperasi}</td>
            <td>${laporan.dokterBedah}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="viewLaporan('${laporan.id}')">Lihat</button>
                    <button class="btn btn-warning btn-sm" onclick="editLaporan('${laporan.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteLaporan('${laporan.id}')">Hapus</button>
                    <button class="btn btn-success btn-sm" onclick="exportLaporan('${laporan.id}')">Export</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Fungsi untuk populate date filter
function populateDateFilter() {
    const allLaporan = getAllLaporan();
    const filterDate = document.getElementById('filterDate');
    if (!filterDate) return;

    const dates = [...new Set(allLaporan.map(l => l.tanggalOperasi).filter(Boolean))].sort().reverse();
    
    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = formatDateShort(date);
        filterDate.appendChild(option);
    });
}

// Fungsi untuk edit laporan
function editLaporan(id) {
    window.location.href = `form.html?id=${id}`;
}

// Fungsi untuk view laporan
function viewLaporan(id) {
    window.location.href = `view.html?id=${id}`;
}

// Fungsi untuk delete laporan
function deleteLaporan(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
        return;
    }

    const allLaporan = getAllLaporan();
    const filtered = allLaporan.filter(l => l.id !== id);
    saveAllLaporan(filtered);
    loadLaporanList();
    populateDateFilter();
}

// Fungsi untuk export laporan ke PDF
function exportLaporan(id) {
    const laporan = getLaporanById(id);
    if (!laporan) {
        alert('Laporan tidak ditemukan!');
        return;
    }

    // Buka window baru untuk print
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Laporan Operasi - ${laporan.namaPasien}</title>
            <style>
                @page {
                    size: A4;
                    margin: 1cm;
                }
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 11pt;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                    color: #000;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                }
                .header-left {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    flex: 1;
                }
                .logo-area {
                    width: 80px;
                    height: 80px;
                    border: 1px solid #000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-sizing: border-box;
                    overflow: hidden;
                }
                .logo-area img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .logo-placeholder {
                    font-size: 8pt;
                    text-align: center;
                    color: #666;
                }
                .header-text {
                    flex: 1;
                }
                .header-right {
                    text-align: right;
                    font-size: 10pt;
                    padding-top: 5px;
                }
                .logo-section {
                    margin-bottom: 8px;
                }
                .hospital-name {
                    font-weight: bold;
                    font-size: 11pt;
                    margin-bottom: 2px;
                    line-height: 1.3;
                }
                .hospital-address {
                    font-size: 9pt;
                    margin-bottom: 8px;
                    text-decoration: underline;
                }
                .form-title {
                    text-align: left;
                    font-size: 24pt;
                    font-weight: bold;
                    margin: 0;
                    line-height: 1.0;
                    letter-spacing: 2px;
                    border: 2px solid #000;
                    padding: 8px 12px;
                    display: inline-block;
                    box-sizing: border-box;
                }
                .patient-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #000;
                    padding-bottom: 12px;
                }
                .patient-details {
                    flex: 1;
                    border-right: 1px solid #000;
                    padding-right: 15px;
                    margin-right: 15px;
                }
                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 10px;
                }
                .title-text {
                    font-size: 24pt;
                    font-weight: bold;
                    line-height: 1.0;
                    letter-spacing: 2px;
                }
                .barcode-section {
                    width: 200px;
                    text-align: right;
                }
                .barcode-area {
                    width: 100%;
                    height: 55px;
                    border: 1px solid #000;
                    text-align: center;
                    padding-top: 18px;
                    font-size: 9pt;
                    margin-bottom: 12px;
                    box-sizing: border-box;
                }
                .section-title {
                    background-color: #d3d3d3;
                    font-weight: bold;
                    font-size: 11pt;
                    margin: 15px 0 12px 0;
                    padding: 6px 10px;
                    text-align: center;
                    border: none;
                }
                .divider-line {
                    border-top: 1px solid #000;
                    margin: 15px 0;
                }
                .form-item {
                    margin-bottom: 12px;
                    line-height: 1.6;
                    display: table;
                    width: 100%;
                    table-layout: fixed;
                }
                .form-item label {
                    display: table-cell;
                    font-weight: normal;
                    vertical-align: top;
                    width: 250px;
                    text-align: left;
                    padding-right: 10px;
                }
                .form-item-content {
                    display: table-cell;
                    vertical-align: top;
                }
                .dotted-line {
                    display: inline-block;
                    min-width: 350px;
                    padding: 0 0 2px 0;
                    min-height: 20px;
                    vertical-align: bottom;
                    margin-left: 5px;
                    border-bottom: 2px dotted #000;
                }
                .dotted-line-short {
                    display: inline-block;
                    min-width: 200px;
                    padding: 0 0 2px 0;
                    min-height: 20px;
                    vertical-align: bottom;
                    margin-left: 5px;
                    border-bottom: 2px dotted #000;
                }
                .dotted-line-long {
                    display: block;
                    width: 100%;
                    padding: 0 0 2px 0;
                    min-height: 20px;
                    margin-top: 8px;
                    box-sizing: border-box;
                    border-bottom: 2px dotted #000;
                }
                .dotted-line-multiline {
                    display: block;
                    width: 100%;
                    padding: 5px 0 2px 0;
                    min-height: 60px;
                    margin-top: 8px;
                    box-sizing: border-box;
                    border-bottom: 2px dotted #000;
                }
                .checkbox-item {
                    display: inline-block;
                    margin-right: 15px;
                    vertical-align: middle;
                }
                .checkbox-item input[type="checkbox"] {
                    margin-right: 5px;
                    width: 12px;
                    height: 12px;
                    vertical-align: middle;
                }
                .table-section {
                    margin: 15px 0;
                }
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                    border: 1px solid #000;
                }
                .info-table td {
                    padding: 8px;
                    border: 1px solid #000;
                    vertical-align: top;
                    width: 33.33%;
                }
                .textarea-field {
                    min-height: 50px;
                    border-bottom: 2px dotted #000;
                    padding: 3px 0;
                    margin-top: 8px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .large-textarea {
                    min-height: 100px;
                }
                .note {
                    font-size: 9pt;
                    font-style: italic;
                    margin-top: 8px;
                    margin-left: 0;
                }
                .page-number {
                    position: fixed;
                    bottom: 1cm;
                    right: 1cm;
                    font-size: 9pt;
                }
                .transfusion-section {
                    margin-top: 10px;
                }
                .transfusion-item {
                    display: inline-block;
                    margin-right: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="header-left">
                    <div class="logo-area">
                        <img src="logo.png" alt="Logo" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'logo-placeholder\\'>LOGO</div>';">
                    </div>
                    <div class="header-text">
                        <div class="logo-section">
                            <div class="hospital-name" style="text-align: left;">KEPOLISIAN NEGARA REPUBLIK INDONESIA</div>
                            <div class="hospital-name" style="text-align: left;">DAERAH SUMATERA SELATAN</div>
                            <div class="hospital-name">RUMAH SAKIT BHAYANGKARA M HASAN</div>
                            <div class="hospital-address">Jl. Jenderal Sudirman KM. 4.5 Palembang 30128 Telp. (0711) 414855</div>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    RM. 16
                </div>
            </div>

            <table class="info-table" style="margin-bottom: 15px;">
                <tr>
                    <td style="width: 200px; padding: 8px; vertical-align: top;">
                        <div style="padding: 8px 12px; display: inline-block;">
                            <div style="font-size: 24pt; font-weight: bold; line-height: 1.0; letter-spacing: 2px;">LAPORAN</div>
                            <div style="font-size: 24pt; font-weight: bold; line-height: 1.0; letter-spacing: 2px;">OPERASI</div>
                        </div>
                    </td>
                    <td style="padding: 8px; vertical-align: top;">
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <label style="margin-right: 5px; white-space: nowrap;">Nama pasien :</label>
                                    <span class="dotted-line-short" style="min-width: 200px; flex: 1;">${laporan.namaPasien || ''}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <label style="margin-right: 5px; white-space: nowrap;">Tgl Lahir :</label>
                                    <span class="dotted-line-short" style="min-width: 200px; flex: 1;">${formatDateShort(laporan.tglLahir) || ''}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <label style="margin-right: 5px; white-space: nowrap;">No RM :</label>
                                    <span class="dotted-line-short" style="min-width: 200px; flex: 1;">${laporan.noRM || ''}</span>
                                </div>
                            </div>
                            <div style="width: 180px; height: 50px; border: 1px solid #000; text-align: center; padding-top: 15px; font-size: 9pt; box-sizing: border-box; align-self: flex-start;">Barcode</div>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="section-title">RENCANA PRE OPERASI / TINDAKAN</div>
            
            <div class="form-item">
                <label>1. Anamnesis Singkat* :</label>
                <div class="form-item-content">
                    <div class="dotted-line-multiline" style="min-height: 50px; padding-top: 3px;">${laporan.anamnesis || ''}</div>
                </div>
            </div>

            <div class="form-item">
                <label>2. Alergi :</label>
                <div class="form-item-content">
                    <span class="checkbox-item" style="margin-right: 12px;">
                        <input type="checkbox" ${laporan.alergi === 'tidak' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Tidak
                    </span>
                    <span class="checkbox-item" style="margin-right: 8px;">
                        <input type="checkbox" ${laporan.alergi === 'iya' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Iya,
                    </span>
                    ${laporan.alergi === 'iya' && laporan.alergiDetail ? `<span class="dotted-line-short" style="min-width: 250px;">${laporan.alergiDetail}</span>` : ''}
                </div>
            </div>

            <div class="form-item">
                <label>3. Pemeriksaan Fisik* :</label>
                <div class="form-item-content">
                    <div class="dotted-line-multiline" style="min-height: 50px; padding-top: 3px;">${laporan.pemeriksaanFisik || ''}</div>
                </div>
            </div>

            <div class="form-item">
                <label>4. Diagnosis Pre Operasi / Tindakan :</label>
                <div class="form-item-content">
                    <span class="dotted-line">${laporan.diagnosisPreOperasi || ''}</span>
                </div>
            </div>

            <div class="form-item">
                <label>5. Operasi / Tindakan</label>
                <div class="form-item-content"></div>
            </div>
            <div style="margin-left: 25px; margin-top: 8px;">
                <div class="form-item" style="margin-bottom: 10px;">
                    <label style="width: 225px;">a. Nama Operasi :</label>
                    <div class="form-item-content">
                        <span class="dotted-line">${laporan.namaOperasi || ''}</span>
                    </div>
                </div>
                <div class="form-item" style="margin-bottom: 0;">
                    <label style="width: 225px;">b. Persiapan Alat Khusus :</label>
                    <div class="form-item-content">
                        <span class="checkbox-item" style="margin-right: 12px;">
                            <input type="checkbox" ${laporan.alatKhusus === 'tidak' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Tidak
                        </span>
                        <span class="checkbox-item" style="margin-right: 8px;">
                            <input type="checkbox" ${laporan.alatKhusus === 'iya' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Iya,
                        </span>
                        ${laporan.alatKhusus === 'iya' && laporan.alatKhususDetail ? `<span class="dotted-line-short" style="min-width: 250px;">${laporan.alatKhususDetail}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="note">*Ditulis yang mendukung diagnosis saja</div>

            <div class="section-title">LAPORAN OPERASI TINDAKAN</div>

            <table class="info-table">
                <tr>
                    <td>Tanggal: ${formatDateShort(laporan.tanggalOperasi) || ''}</td>
                    <td>Jam mulai operasi / tindakan: ${formatTime(laporan.jamMulai) || ''}</td>
                    <td>Jam selesai operasi / tindakan: ${formatTime(laporan.jamSelesai) || ''}</td>
                </tr>
                <tr>
                    <td>Dokter Bedah: ${laporan.dokterBedah || ''}</td>
                    <td>Asisten I: ${laporan.asisten1 || ''}</td>
                    <td>Asisten II: ${laporan.asisten2 || ''}</td>
                </tr>
                <tr>
                    <td>Dokter Anestesi: ${laporan.dokterAnestesi || ''}</td>
                    <td>Perawat Instrumen: ${laporan.perawatInstrumen || ''}</td>
                    <td>Tiper Operasi / Tindakan: 
                        <span class="checkbox-item">
                            <input type="checkbox" ${laporan.tiperOperasi === 'darurat' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Darurat
                        </span>
                        <span class="checkbox-item">
                            <input type="checkbox" ${laporan.tiperOperasi === 'terencana' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Terencana
                        </span>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 8px;">
                        <div style="margin-bottom: 10px;">
                            <strong>Diagnosa Pasca Bedah :</strong>
                            <div style="min-height: 60px; padding-top: 3px; margin-top: 5px;">${laporan.diagnosaPascaBedah || ''}</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 8px;">
                        <div>
                            <strong>Operasi / Tindakan :</strong>
                            <div style="min-height: 80px; padding-top: 3px; margin-top: 5px;">${laporan.operasiTindakan || ''}</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 8px;">
                        <div style="margin-bottom: 10px;">
                            <strong>Tipe Anestesi :</strong>
                            <span class="checkbox-item" style="margin-left: 10px;">
                                <input type="checkbox" ${laporan.tipeAnestesi?.includes('GA') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> GA
                            </span>
                            <span class="checkbox-item">
                                <input type="checkbox" ${laporan.tipeAnestesi?.includes('Epidural') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Epidural
                            </span>
                            <span class="checkbox-item">
                                <input type="checkbox" ${laporan.tipeAnestesi?.includes('Spinal') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Spinal
                            </span>
                            <span class="checkbox-item">
                                <input type="checkbox" ${laporan.tipeAnestesi?.includes('Peripheral') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Peripheral
                            </span>
                            <span class="checkbox-item">
                                <input type="checkbox" ${laporan.tipeAnestesi?.includes('Lokal') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Lokal
                            </span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 8px;">
                        <div style="margin-bottom: 10px;">
                            <strong>Pengirim Spesimen ke Klinik Patologi :</strong>
                            <span class="checkbox-item" style="margin-left: 10px;">
                                <input type="checkbox" ${laporan.spesimen === 'ya' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Ya
                            </span>
                            ${laporan.spesimen === 'ya' ? `
                                <span class="checkbox-item">
                                    <input type="checkbox" ${laporan.jenisSpesimen?.includes('Jaringan') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Jaringan
                                </span>
                                <span class="checkbox-item">
                                    <input type="checkbox" ${laporan.jenisSpesimen?.includes('Batu') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Batu
                                </span>
                                <span class="checkbox-item">
                                    <input type="checkbox" ${laporan.jenisSpesimen?.includes('Pus') ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Pus
                                </span>
                                ${laporan.jenisSpesimen?.includes('Lainnya') ? `
                                    <span class="checkbox-item">
                                        <input type="checkbox" checked disabled style="width: 12px; height: 12px; margin-right: 4px;">
                                    </span>
                                    <span class="dotted-line-short" style="min-width: 150px; margin-left: 5px;"></span>
                                ` : `
                                    <span class="checkbox-item">
                                        <input type="checkbox" disabled style="width: 12px; height: 12px; margin-right: 4px;">
                                    </span>
                                    <span class="dotted-line-short" style="min-width: 150px; margin-left: 5px;"></span>
                                `}
                            ` : ''}
                            <div style="margin-top: 5px;">
                                <span class="checkbox-item">
                                    <input type="checkbox" ${laporan.spesimen === 'tidak' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Tidak
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding: 8px;">
                        <div style="margin-bottom: 10px;">
                            <strong>Asal Spesimen :</strong>
                            <span style="margin-left: 5px;">${laporan.asalSpesimen || ''}</span>
                            <div style="margin-top: 8px;">
                                <strong>Kultur :</strong>
                                <span class="checkbox-item" style="margin-left: 10px;">
                                    <input type="checkbox" ${laporan.kultur === 'ya' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Ya
                                </span>
                                <span class="checkbox-item">
                                    <input type="checkbox" ${laporan.kultur === 'tidak' ? 'checked' : ''} disabled style="width: 12px; height: 12px; margin-right: 4px;"> Tidak
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px;">
                        <strong>Perkiraan jumlah perdarahan :</strong>
                        <span style="margin-left: 5px;">${laporan.perkiraanPerdarahan || '0'}</span> ml
                    </td>
                    <td colspan="2" style="padding: 8px;">
                        <strong>Transfusi</strong>
                        <div style="margin-top: 5px;">
                            <span>WB : <span style="margin-left: 5px;">${laporan.transfusiWB || '0'}</span> ml</span>
                            <span style="margin-left: 15px;">PRC : <span style="margin-left: 5px;">${laporan.transfusiPRC || '0'}</span> ml</span>
                            <span style="margin-left: 15px;">FFP : <span style="margin-left: 5px;">${laporan.transfusiFFP || '0'}</span> ml</span>
                            <span style="margin-left: 15px;">Cryo : <span style="margin-left: 5px;">${laporan.transfusiCryo || '0'}</span> ml</span>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="page-number">Hal. 1-3</div>

            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

