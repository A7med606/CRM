// Transfers Module

function init_transfers() {
    renderTransfersTable();
    populateDriverFilter();
}

function populateDriverFilter() {
    const select = document.getElementById('transferDriverFilter');
    if (!select) return;
    select.innerHTML = '<option value="">كل السائقين</option>';
    (AppData.drivers || []).forEach(d => {
        select.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });
}

function renderTransfersTable() {
    const tbody = document.getElementById('transfersTableBody');
    if (!tbody) return;
    
    let sheets = [...(AppData.transferSheets || [])];
    
    const statusFilter = document.getElementById('transferStatusFilter');
    const driverFilter = document.getElementById('transferDriverFilter');
    
    if (statusFilter && statusFilter.value) {
        sheets = sheets.filter(s => s.status === statusFilter.value);
    }
    if (driverFilter && driverFilter.value) {
        sheets = sheets.filter(s => s.driverId == driverFilter.value);
    }
    
    if (sheets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">لا توجد شيتات نقل</td></tr>';
        return;
    }
    
    tbody.innerHTML = sheets.map(sheet => `
        <tr>
            <td><strong>${sheet.sheetId}</strong></td>
            <td>${sheet.driverName || 'غير معيّن'}</td>
            <td>${sheet.tripName}</td>
            <td>${sheet.passengerCount} راكب</td>
            <td><span class="status-badge ${getStatusClass(sheet.status)}">${getStatusLabel(sheet.status)}</span></td>
            <td>
                <div class="action-buttons">
                    ${sheet.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="assignDriver('${sheet.id}')">تعيين سائق</button>
                    ` : ''}
                    <button class="btn btn-ghost btn-sm" onclick="viewTransferSheet('${sheet.id}')">عرض</button>
                    ${sheet.status !== 'pending' ? `
                        <button class="btn btn-ghost btn-sm" onclick="printSheet('${sheet.id}')">🖨️</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function generateTransferSheets() {
    const approvedBookings = (AppData.bookings || []).filter(b => b.status === 'approved');
    if (approvedBookings.length === 0) {
        showToast('لا توجد حجوزات موافقة لإنشاء شيتات', 'warning');
        return;
    }
    
    // Group by trip
    const grouped = {};
    approvedBookings.forEach(b => {
        if (!grouped[b.tripId]) grouped[b.tripId] = [];
        grouped[b.tripId].push(b);
    });
    
    Object.keys(grouped).forEach(tripId => {
        const trip = (AppData.trips || []).find(t => t.id == tripId);
        const bookings = grouped[tripId];
        
        // Create sheets (max 15 per sheet)
        for (let i = 0; i < bookings.length; i += 15) {
            const chunk = bookings.slice(i, i + 15);
            AppData.transferSheets.push({
                id: Date.now() + i,
                sheetId: generateId('TS'),
                tripId: tripId,
                tripName: trip ? trip.name : 'رحلة',
                driverId: null,
                driverName: null,
                passengers: chunk,
                passengerCount: chunk.length,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
        }
    });
    
    addAuditLog('transfer', 'create', `إنشاء ${Object.keys(grouped).length} شيتات نقل`);
    showToast('تم إنشاء شيتات النقل بنجاح', 'success');
    renderTransfersTable();
}

function assignDriver(sheetId) {
    const drivers = AppData.drivers || [];
    const html = `
        <form id="assignDriverForm">
            <div class="form-group">
                <label>اختر السائق</label>
                <select id="assignDriverSelect" required>
                    <option value="">اختر سائق...</option>
                    ${drivers.map(d => `<option value="${d.id}">${d.name} - ${d.phone}</option>`).join('')}
                </select>
            </div>
        </form>
    `;
    
    openModal('تعيين سائق للشيت', html, function() {
        const driverId = document.getElementById('assignDriverSelect').value;
        if (!driverId) {
            showToast('يرجى اختيار سائق', 'error');
            return;
        }
        
        const driver = drivers.find(d => d.id == driverId);
        const sheet = AppData.transferSheets.find(s => s.id == sheetId);
        if (sheet && driver) {
            sheet.driverId = driverId;
            sheet.driverName = driver.name;
            sheet.status = 'assigned';
            addAuditLog('transfer', 'update', `تعيين السائق ${driver.name} للشيت ${sheet.sheetId}`);
            showToast('تم تعيين السائق بنجاح', 'success');
            closeModal();
            renderTransfersTable();
        }
    });
}

function viewTransferSheet(id) {
    const sheet = AppData.transferSheets.find(s => s.id == id);
    if (!sheet) return;
    
    const passengers = sheet.passengers || [];
    const html = `
        <div class="booking-details">
            <div class="detail-row"><label>رقم الشيت:</label><span>${sheet.sheetId}</span></div>
            <div class="detail-row"><label>الرحلة:</label><span>${sheet.tripName}</span></div>
            <div class="detail-row"><label>السائق:</label><span>${sheet.driverName || 'غير معيّن'}</span></div>
            <div class="detail-row"><label>عدد الركاب:</label><span>${sheet.passengerCount}</span></div>
        </div>
        <h4 style="margin-top: 16px;">قائمة الركاب</h4>
        <table class="data-table" style="margin-top: 8px;">
            <thead><tr><th>#</th><th>الاسم</th><th>الهاتف</th><th>الرحلة</th></tr></thead>
            <tbody>
                ${passengers.map((p, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${p.passengerName}</td>
                        <td>${p.phone}</td>
                        <td>${p.tripName}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    openModal('تفاصيل الشيت ' + sheet.sheetId, html);
}

function printSheet(id) {
    showToast('جاري تحضير الطباعة...', 'info');
    // In production this would open a print dialog
    setTimeout(() => window.print(), 500);
}
