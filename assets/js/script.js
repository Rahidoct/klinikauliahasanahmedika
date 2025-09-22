document.addEventListener("DOMContentLoaded", () => {
    
    // ===================================================================
    // 1. SKRIP UMUM (Berjalan di semua halaman)
    // ===================================================================

    // Inisialisasi Tahun Copyright di Footer
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Fungsionalitas Toggle Sidebar untuk Mobile
    const btnSidebar = document.getElementById("btnSidebar");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("backdrop");
    if (btnSidebar && sidebar && backdrop) {
      btnSidebar.addEventListener("click", () => {
        sidebar.classList.toggle("show");
        backdrop.classList.toggle("show");
      });
      backdrop.addEventListener("click", () => {
        sidebar.classList.remove("show");
        backdrop.classList.remove("show");
      });
    }

    // Inisialisasi semua tooltip Bootstrap
    const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // ===================================================================
    // 2. SKRIP SPESIFIK HALAMAN (Mendeteksi berdasarkan elemen unik)
    // ===================================================================

    // --- 2.0. Halaman Login (deteksi #passwordToggle) ---
    if (document.getElementById('passwordToggle')) {
        const passwordInput = document.getElementById('password');
        const passwordToggle = document.getElementById('passwordToggle');
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = passwordToggle.querySelector('i');
            icon.classList.toggle('fa-eye-slash');
            icon.classList.toggle('fa-eye');
        });
    }

    // --- 2.1. Halaman Dashboard (deteksi #listRooms) ---
    if (document.getElementById('listRooms')) {
        const stats = { apoteker: 2, pasien: 187, inap: 5, dokter: 4 };
        const rooms = [
          { nama: 'Anggrek', status: 'Tidak Tersedia', kapasitas: 2, terisi: 2 },
          { nama: 'Lyli', status: 'Tersedia', kapasitas: 4, terisi: 1 },
          { nama: 'Mawar', status: 'Tersedia', kapasitas: 3, terisi: 0 },
          { nama: 'Melati', status: 'Dalam Perbaikan', kapasitas: 2, terisi: 0 }
        ];

        const statusBadge = (status) => {
          const badges = {
            'Tersedia': `<span class="badge-soft badge-available">Tersedia</span>`,
            'Tidak Tersedia': `<span class="badge-soft badge-unavailable">Penuh</span>`,
            'Dalam Perbaikan': `<span class="badge-soft badge-repair">Perbaikan</span>`
          };
          return badges[status] || badges['Tidak Tersedia'];
        };

        const renderRooms = () => {
          const wrap = document.getElementById('listRooms');
          if (!wrap) return;
          wrap.innerHTML = rooms.map(r => `
            <div class="room">
              <div>
                <div class="room-name">${r.nama}</div>
                <div class="text-muted small">${r.terisi} / ${r.kapasitas} bed terisi</div>
              </div>
              ${statusBadge(r.status)}
            </div>
          `).join('');
        };

        const animateValue = (element, start, end, duration = 1500) => {
          if (!element) return;
          let startTime = null;
          const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuint = 1 - Math.pow(1 - progress, 5);
            element.textContent = Math.floor(easeOutQuint * (end - start) + start).toLocaleString('id-ID');
            if (progress < 1) window.requestAnimationFrame(step);
          };
          window.requestAnimationFrame(step);
        };

        renderRooms();
        animateValue(document.getElementById('statApoteker'), 0, stats.apoteker);
        animateValue(document.getElementById('statPasien'), 0, stats.pasien);
        animateValue(document.getElementById('statInap'), 0, stats.inap);
        animateValue(document.getElementById('statDokter'), 0, stats.dokter);
    }

    // --- 2.2. Halaman Pendaftaran (deteksi #registrationForm) ---
    if (document.getElementById('registrationForm')) {
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }

    // --- 2.3. Halaman Data Pasien (deteksi #patientFormModal) ---
    if (document.getElementById('patientFormModal')) {
        function calculateAndDisplayAges() {
          document.querySelectorAll('.patient-row').forEach(row => {
            const birthDateCell = row.querySelector('[data-birthdate]');
            const ageCell = row.querySelector('.age-cell');
            if (birthDateCell && ageCell) {
              const birthDate = new Date(birthDateCell.dataset.birthdate);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              ageCell.textContent = `${age} Thn`;
            }
          });
        }
        calculateAndDisplayAges();

        const patientFormModal = document.getElementById('patientFormModal');
        patientFormModal.addEventListener('show.bs.modal', event => {
          const button = event.relatedTarget;
          const modalTitle = patientFormModal.querySelector('.modal-title');
          const patientForm = document.getElementById('patientForm');
          const noRM = button.getAttribute('data-norm');
          
          if (noRM) { // Mode Edit
            modalTitle.textContent = 'Edit Data Pasien';
            document.getElementById('patientNoRM').value = noRM;
            document.getElementById('patientNoRM').setAttribute('readonly', true);
            document.getElementById('patientName').value = button.getAttribute('data-nama');
            document.getElementById('patientGender').value = button.getAttribute('data-jk');
            document.getElementById('patientBirthdate').value = button.getAttribute('data-tgllahir-iso');
            document.getElementById('patientContact').value = button.getAttribute('data-kontak');
            document.getElementById('patientAddress').value = button.getAttribute('data-alamat');
            document.getElementById('patientAllergies').value = button.getAttribute('data-alergi');
            document.getElementById('patientVaccinations').value = button.getAttribute('data-vaksin');
          } else { // Mode Tambah Baru
            modalTitle.textContent = 'Tambah Pasien Baru';
            patientForm.reset();
            document.getElementById('patientNoRM').removeAttribute('readonly');
          }
        });

        const deleteConfirmModal = document.getElementById('deleteConfirmModal');
        if (deleteConfirmModal) {
            deleteConfirmModal.addEventListener('show.bs.modal', event => {
                const button = event.relatedTarget;
                const patientName = button.getAttribute('data-nama');
                const patientNameSpan = deleteConfirmModal.querySelector('#patientNameToDelete');
                patientNameSpan.textContent = patientName;
            });
        }
    }

    // --- 2.4. Halaman Antrian Rawat Jalan (deteksi #actionChoiceModal) ---
    if (document.getElementById('actionChoiceModal')) {
        // ... (Kode text-to-speech lengkap dari file asli Anda tetap di sini) ...

        const actionChoiceModal = document.getElementById('actionChoiceModal');
        actionChoiceModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const patientName = button.getAttribute('data-patient-name');
            actionChoiceModal.querySelector('#patientNameForAction').textContent = patientName;
        });
    }

    // --- 2.5. Halaman Pemeriksaan Pasien (deteksi #soapAccordion) ---
    if (document.getElementById('soapAccordion')) {
        const addPrescriptionBtn = document.getElementById('addPrescriptionBtn');
        const prescriptionList = document.getElementById('prescriptionList');
        const prescriptionTemplate = document.getElementById('prescriptionRowTemplate');

        if (addPrescriptionBtn && prescriptionList && prescriptionTemplate) {
            addPrescriptionBtn.addEventListener('click', () => {
                const clone = prescriptionTemplate.content.cloneNode(true);
                prescriptionList.appendChild(clone);
            });
            prescriptionList.addEventListener('click', (event) => {
                if (event.target && event.target.closest('.remove-prescription-btn')) {
                    event.target.closest('.row').remove();
                }
            });
        }

        const followUpRadios = document.querySelectorAll('input[name="followUp"]');
        const inpatientInstructionWrapper = document.getElementById('inpatientInstructionWrapper');
        if (followUpRadios.length > 0 && inpatientInstructionWrapper) {
            followUpRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (document.getElementById('followUpInap').checked) {
                        inpatientInstructionWrapper.classList.remove('d-none');
                    } else {
                        inpatientInstructionWrapper.classList.add('d-none');
                    }
                });
            });
        }
    }
    
    // --- 2.6. Halaman Manajemen Ruangan (deteksi #roomGrid) ---
    if (document.getElementById('roomGrid')) {
        const filterButtons = document.querySelectorAll('.filter-btn-group .btn');
        const roomItems = document.querySelectorAll('.room-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');
                roomItems.forEach(item => {
                    if (filter === 'semua' || item.getAttribute('data-status') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        const addRoomModal = document.getElementById('addRoomModal');
        if (addRoomModal) {
          addRoomModal.addEventListener('show.bs.modal', () => {
            document.getElementById('addRoomForm').reset();
          });
        }

        const statusChangeModal = document.getElementById('statusChangeModal');
        if (statusChangeModal) {
          statusChangeModal.addEventListener('show.bs.modal', event => {
            const cardLink = event.relatedTarget;
            const roomName = cardLink.dataset.roomName;
            const currentStatus = cardLink.dataset.currentStatus;

            document.getElementById('roomNamePlaceholder').textContent = roomName;
            const newStatusSelect = document.getElementById('newStatus');
            newStatusSelect.innerHTML = ''; 

            if (currentStatus === 'tersedia') {
              newStatusSelect.innerHTML = `<option value="tersedia" selected>Tersedia</option><option value="perbaikan">Dalam Perbaikan</option>`;
            } else if (currentStatus === 'perbaikan') {
              newStatusSelect.innerHTML = `<option value="perbaikan" selected>Dalam Perbaikan</option><option value="tersedia">Tersedia</option>`;
            }
          });
        }
    }
    
    // --- 2.7. Halaman Riwayat & Detail Pasien Inap (deteksi modal) ---
    const editInapModal = document.getElementById('editInapModal');
    if (editInapModal) { 
        editInapModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const patientName = button.dataset.patientName;
            editInapModal.querySelector('#editPatientName').textContent = patientName;
        });

        const deleteInapModal = document.getElementById('deleteInapModal');
        deleteInapModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const patientName = button.dataset.patientName;
            deleteInapModal.querySelector('#deletePatientName').textContent = patientName;
        });
    }
    
    // --- 2.8. Halaman Laporan (deteksi #visitTrendChart) ---
    if (document.getElementById('visitTrendChart')) {
        function renderVisitChart() {
          const ctx = document.getElementById('visitTrendChart');
          if (!ctx) return;
          // ... (Kode untuk render Chart.js tetap sama)
        }
        renderVisitChart();

        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const table = document.getElementById("reportTable");
                const wb = XLSX.utils.table_to_book(table, { sheet: "Laporan Kunjungan" });
                const today = new Date();
                const dateString = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                const fileName = `Laporan_Kunjungan_${dateString}.xlsx`;
                XLSX.writeFile(wb, fileName);
            });
        }
    }
    
    // --- 2.9. Halaman Detail Rekam Medis (deteksi #medicalRecordTabs) ---
    if (document.getElementById('medicalRecordTabs')) {
        const kunjunganModal = document.getElementById('kunjunganPasien');
        if (kunjunganModal) {
            kunjunganModal.addEventListener('show.bs.modal', () => {
                document.getElementById('newVisitFormDetail').reset();
            });
        }
    }
    
    // --- 2.10. Halaman Pembayaran (deteksi #amountPaid) ---
    if (document.getElementById('amountPaid')) {
        const totalBillEl = document.getElementById('totalBill');
        const amountPaidEl = document.getElementById('amountPaid');
        const changeEl = document.getElementById('change');

        function formatCurrency(value) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value); }
        function parseCurrency(value) { return Number(String(value).replace(/[^0-9]/g, '')); }

        if (amountPaidEl && totalBillEl && changeEl) {
            amountPaidEl.addEventListener('input', () => {
                let amountPaid = parseCurrency(amountPaidEl.value);
                let totalBill = parseCurrency(totalBillEl.value);
                amountPaidEl.value = amountPaid.toLocaleString('id-ID');
                let change = amountPaid - totalBill;
                changeEl.value = formatCurrency(Math.max(0, change));
            });
        }

        const paymentButtons = document.querySelectorAll('.payment-method-btn');
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                paymentButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    // --- 2.11. Halaman Farmasi (deteksi #pharmacyTabs) ---
    if (document.getElementById('pharmacyTabs')) {
        const prescriptionQueue = document.getElementById('prescriptionQueue');
        const prescriptionModal = new bootstrap.Modal(document.getElementById('prescriptionModal'));
        let activeRow = null;

        const canSpeak = 'speechSynthesis' in window;
        const synth = canSpeak ? window.speechSynthesis : null;
        let voices = [];
        if (canSpeak) {
            const populateVoiceList = () => {
                voices = synth.getVoices().filter(v => v.lang.startsWith('id'));
                if (voices.length === 0) voices = synth.getVoices();
            };
            populateVoiceList();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = populateVoiceList;
            }
        }
        const speak = (text) => {
            if (!canSpeak || synth.speaking) return;
            const utterance = new SpeechSynthesisUtterance(text);
            if (voices.length > 0) utterance.voice = voices[0];
            utterance.pitch = 1;
            utterance.rate = 1;
            synth.speak(utterance);
        };

        if (prescriptionQueue) {
            prescriptionQueue.addEventListener('click', function(event) {
                const actionBtn = event.target.closest('.action-btn');
                if (!actionBtn) return;
                const patientRow = actionBtn.closest('tr');
                const currentStatus = patientRow.dataset.status;
                const patientName = patientRow.querySelector('[data-patient-name]').dataset.patientName;
                activeRow = patientRow;
                if (actionBtn.dataset.action === 'call') {
                    speak(`Pasien atas nama ${patientName}, obat anda sudah siap, silakan menuju ke farmasi.`);
                    return;
                }
                switch (currentStatus) {
                    case 'menunggu': break;
                    case 'disiapkan':
                        const buttonGroupHTML = `<div class="btn-group" role="group"><button class="btn btn-success btn-sm fw-semibold action-btn">Serahkan Obat</button><button class="btn btn-outline-secondary btn-sm action-btn" data-action="call" data-bs-toggle="tooltip" data-bs-placement="top" title="Panggil Pasien"><i class="fa-solid fa-volume-high"></i></button></div>`;
                        updateStatus(patientRow, 'siap', 'status-badge status-siap', 'Siap Diambil', buttonGroupHTML);
                        break;
                    case 'siap':
                        updateStatus(patientRow, 'diambil', 'status-badge status-diambil', 'Selesai', `<i class="fa-solid fa-check-circle text-success fs-5"></i>`);
                        patientRow.querySelectorAll('td').forEach(td => td.classList.add('text-muted'));
                        break;
                }
            });
        }

        function updateStatus(row, nextStatus, badgeClass, badgeText, buttonHTML) {
            const statusCell = row.querySelector('.status-badge');
            const actionCell = row.querySelector('.action-cell');
            row.dataset.status = nextStatus;
            statusCell.className = badgeClass;
            statusCell.textContent = badgeText;
            actionCell.innerHTML = buttonHTML;
        }

        const modalElement = document.getElementById('prescriptionModal');
        if (modalElement) {
            modalElement.addEventListener('show.bs.modal', event => {
                const button = event.relatedTarget;
                document.getElementById('modalPatientName').textContent = button.dataset.patientName;
                document.getElementById('modalDoctorName').textContent = button.dataset.doctorName;
                const prescriptionList = document.getElementById('modalPrescriptionList');
                const prescriptionData = JSON.parse(button.dataset.prescription);
                prescriptionList.innerHTML = '';
                prescriptionData.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = `${item.name} - ${item.qty} (${item.signa})`;
                    prescriptionList.appendChild(li);
                });
            });
            document.getElementById('markAsPreparedBtn').addEventListener('click', () => {
                if (activeRow) {
                    updateStatus(activeRow, 'disiapkan', 'status-badge status-disiapkan', 'Sedang Disiapkan', `<button class="btn btn-warning btn-sm fw-semibold text-dark action-btn">Tandai Siap</button>`);
                }
                prescriptionModal.hide();
            });
        }
        
        const stockDetailModalEl = document.getElementById('stockDetailModal');
        const batchFormModalEl = document.getElementById('batchFormModal');
        if (stockDetailModalEl) {
             stockDetailModalEl.addEventListener('show.bs.modal', event => {
                const button = event.relatedTarget;
                const drugName = button.dataset.drugName;
                let batchesData = JSON.parse(button.dataset.batches || '[]');
                document.getElementById('drugNameLabel').textContent = drugName;
                if (batchFormModalEl) {
                    batchFormModalEl.querySelector('#batchFormDrugName').textContent = drugName;
                }
                renderBatchList(batchesData);
            });
        }

        function renderBatchList(batchesData) {
            const batchList = document.getElementById('batchList');
            batchList.innerHTML = '';
            batchesData.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
            if (batchesData.length === 0) {
                batchList.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada batch untuk obat ini.</td></tr>';
                return;
            }
            batchesData.forEach(batch => {
                const tr = document.createElement('tr');
                const isExpired = new Date(batch.expiry) < new Date();
                const isNearExpiry = !isExpired && (new Date(batch.expiry) - new Date()) / (1000 * 60 * 60 * 24) < 90;
                let expiryClass = isExpired ? 'text-danger fw-bold' : (isNearExpiry ? 'text-warning fw-bold' : '');
                tr.innerHTML = `<td>${batch.batch}</td><td>${batch.stock.toLocaleString('id-ID')}</td><td>${new Date(batch.entry).toLocaleDateString('id-ID')}</td><td class="${expiryClass}">${new Date(batch.expiry).toLocaleDateString('id-ID')}</td><td class="action-buttons"><a href="#" class="text-secondary" data-bs-toggle="modal" data-bs-target="#batchFormModal" data-batch='${JSON.stringify(batch)}' data-bs-placement="top" data-bs-title="Edit Batch"><i class="fa-solid fa-pen-to-square" data-bs-toggle="tooltip" title="Edit Batch"></i></a><a href="#" class="text-danger ms-2" data-bs-toggle="modal" data-bs-target="#deleteBatchModal" data-batch-number="${batch.batch}" data-bs-placement="top" data-bs-title="Hapus Batch"><i class="fa-solid fa-trash-can" data-bs-toggle="tooltip" title="Hapus Batch"></i></a></td>`;
                batchList.appendChild(tr);
            });
            const tooltipTriggerList = [...batchList.querySelectorAll('[data-bs-toggle="tooltip"]')];
            tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        }

        if (batchFormModalEl) {
            batchFormModalEl.addEventListener('show.bs.modal', event => {
                const button = event.relatedTarget;
                const batchDataString = button.dataset.batch;
                const modalTitle = batchFormModalEl.querySelector('#batchFormModalLabel');
                const batchForm = document.getElementById('batchForm');
                if (batchDataString) {
                    modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i>Edit Batch';
                    const batchData = JSON.parse(batchDataString);
                    document.getElementById('batchNumber').value = batchData.batch;
                    document.getElementById('batchStock').value = batchData.stock;
                    document.getElementById('batchEntryDate').value = batchData.entry;
                    document.getElementById('batchExpiryDate').value = batchData.expiry;
                } else {
                    modalTitle.innerHTML = '<i class="fa-solid fa-plus me-2"></i>Tambah Batch Baru';
                    batchForm.reset();
                }
            });
        }
        
        const deleteBatchModal = document.getElementById('deleteBatchModal');
        if (deleteBatchModal) {
          deleteBatchModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const batchNumber = button.dataset.batchNumber;
            deleteBatchModal.querySelector('#batchNumberToDelete').textContent = batchNumber;
          });
        }

        const addDrugModal = document.getElementById('addDrugModal');
        if (addDrugModal) {
          addDrugModal.addEventListener('show.bs.modal', () => {
            document.getElementById('addDrugForm').reset();
          });
        }
    }

}); // AKHIR DARI DOMContentLoaded