// Import Module

let importedData = [];
let validationErrors = [];

function init_import() {
    renderImportHistory();
    setupUploadArea();
}

function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length) handleFileUpload(files[0]);
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length) handleFileUpload(this.files[0]);
    });
}

function handleFileUpload(file) {
    const maxSize = (AppData.settings.import.maxFileSize || 10) * 1024 * 1024;
    if (file.size > maxSize) {
        showToast('حجم الملف يتجاوز الحد الأقصى', 'error');
        return;
    }
    
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'csv'].includes(ext)) {
        showToast('صيغة الملف غير مدعومة', 'error');
        return;
    }
    
    showToast('جاري تحليل الملف...', 'info');
    
    setTimeout(() => {
        simulateFileParsing(file.name);
    }, 1000);
}

function simulateFileParsing(filename) {
    importedData = [];
    validationErrors = [];
    
    const sampleBookings = [
        { name: 'محمد أحمد علي', phone: '+20 100 123 4567', trip: 'القاهرة - الإسكندرية', date: '2026-07-25', passengers: 4, hotel: 'فندق الماسة' },
        { name: 'فاطمة حسن محمود', phone: '+20 101 234 5678', trip: 'الجيزة - الأهرامات', date: '2026-07-26', passengers: 2, hotel: 'ريتز كارلتون' },
        { name: 'علي محمد عبد الله', phone: '12345', trip: 'شرم الشيخ - الغردقة', date: '2026-07-27', passengers: 6, hotel: 'هيلتون' },
        { name: 'سارة إبراهيم خالد', phone: '+20 102 345 6789', trip: 'القاهرة - الإسكندرية', date: '2026-07-25', passengers: 3, hotel: 'سيتي ستارز' },
        { name: 'عمر سعيد أحمد', phone: '+20 103 456 7890', trip: 'أسوان - أبو سمبل', date: '2026-07-28', passengers: 8, hotel: 'كتارا' },
        { name: 'نورا عبد الرحمن', phone: '+20 104 567 8901', trip: 'القاهرة - الإسكندرية', date: '2026-07-25', passengers: 1, hotel: 'ال Serif' },
        { name: 'حسين مصطفى علي', phone: '+20 105 678 9012', trip: 'الجيزة - الأهرامات', date: '2026-07-26', passengers: 5, hotel: 'مرسي علم' },
        { name: 'مريم خالد يوسف', phone: '+20 106 789 0123', trip: 'شرم الشيخ - الغردقة', date: '', passengers: 2, hotel: 'Stella Di Mare' },
    ];
    
    sampleBookings.forEach((item, index) => {
        const errors = [];
        if (!validatePhone(item.phone)) errors.push('رقم الهاتف غير صحيح');
        if (!item.date) errors.push('التاريخ مفقود');
        if (item.passengers < 1) errors.push('عدد الركاب غير صحيح');
        
        if (errors.length > 0) {
            validationErrors.push({ row: index + 1, errors: errors, data: item });
        }
        
        importedData.push({ ...item, valid: errors.length === 0, errors: errors });
    });
    
    showImportPreview(filename);
}

function showImportPreview(filename) {
    document.getElementById('uploadArea').classList.add('hidden');
    document.getElementById('importPreview').classList.remove('hidden');
    
    document.getElementById('validCount').textContent = importedData.filter(d => d.valid).length + ' صحيح';
    document.getElementById('errorCount').textContent = importedData.filter(d => !d.valid).length + ' خطأ';
    document.getElementById('totalCount').textContent = importedData.length + ' إجمالي';
    
    const thead = document.getElementById('previewTableHead');
    thead.innerHTML = `<tr>
        <th>#</th><th>الاسم</th><th>الهاتف</th><th>الرحلة</th>
        <th>التاريخ</th><th>العدد</th><th>الفندق</th><th>الحالة</th>
    </tr>`;
    
    const tbody = document.getElementById('previewTableBody');
    tbody.innerHTML = importedData.map((item, i) => `
        <tr class="${item.valid ? 'row-valid' : 'row-error'}">
            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.trip}</td>
            <td>${item.date || '-'}</td>
            <td>${item.passengers}</td>
            <td>${item.hotel}</td>
            <td>${item.valid ? '<span class="status-badge approved">صحيح</span>' : '<span class="status-badge rejected">' + item.errors.join(', ') + '</span>'}</td>
        </tr>
    `).join('');
    
    const confirmBtn = document.getElementById('confirmImportBtn');
    if (validationErrors.length > 0) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = `تأكيد (${importedData.filter(d => d.valid).length} صحيح فقط)`;
        confirmBtn.classList.remove('btn-primary');
        confirmBtn.classList.add('btn-warning');
    } else {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'تأكيد الاستيراد';
    }
    
    if (validationErrors.length > 0) {
        document.getElementById('validationErrors').classList.remove('hidden');
        document.getElementById('errorList').innerHTML = validationErrors.map(err => `
            <div class="error-item">
                <span class="error-row">صف ${err.row}:</span>
                <span class="error-messages">${err.errors.join(' - ')}</span>
            </div>
        `).join('');
    }
}

function cancelImport() {
    importedData = [];
    validationErrors = [];
    document.getElementById('importPreview').classList.add('hidden');
    document.getElementById('uploadArea').classList.remove('hidden');
    document.getElementById('validationErrors').classList.add('hidden');
    document.getElementById('fileInput').value = '';
}

function confirmImport() {
    const validData = importedData.filter(d => d.valid);
    if (validData.length === 0) {
        showToast('لا توجد بيانات صحيحة للاستيراد', 'error');
        return;
    }
    
    validData.forEach(item => {
        const trip = (AppData.trips || []).find(t => t.name === item.trip);
        AppData.bookings.push({
            id: Date.now() + Math.random(),
            bookingId: generateId('BK'),
            passengerName: item.name,
            phone: item.phone,
            tripId: trip ? trip.id : '',
            tripName: item.trip,
            date: item.date,
            passengers: item.passengers,
            status: 'pending',
            agencyId: currentUser ? currentUser.id : 1,
            notes: 'مستورد من Excel',
            createdAt: new Date().toISOString()
        });
    });
    
    const batch = {
        id: Date.now(),
        batchId: generateId('IMP'),
        filename: 'imported_file.xlsx',
        date: new Date().toISOString().split('T')[0],
        totalCount: importedData.length,
        validCount: validData.length,
        errorCount: validationErrors.length,
        status: validationErrors.length > 0 ? 'partial' : 'completed'
    };
    AppData.importBatches.unshift(batch);
    
    addAuditLog('booking', 'create', `استيراد ${validData.length} حجز من Excel`);
    showToast(`تم استيراد ${validData.length} حجز بنجاح`, 'success');
    
    cancelImport();
    renderImportHistory();
}

function renderImportHistory() {
    const tbody = document.getElementById('importHistoryBody');
    if (!tbody) return;
    
    const batches = AppData.importBatches || [];
    if (batches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">لا توجد سجلات استيراد</td></tr>';
        return;
    }
    
    tbody.innerHTML = batches.map(b => `
        <tr>
            <td><strong>${b.batchId}</strong></td>
            <td>${b.filename}</td>
            <td>${b.date}</td>
            <td>${b.validCount}/${b.totalCount}</td>
            <td><span class="status-badge ${b.status === 'completed' ? 'approved' : 'pending'}">${b.status === 'completed' ? 'مكتمل' : 'جزئي'}</span></td>
            <td><button class="btn btn-ghost btn-sm" onclick="viewImportBatch('${b.id}')">عرض</button></td>
        </tr>
    `).join('');
}
