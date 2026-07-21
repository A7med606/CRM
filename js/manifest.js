// Manifest Module

function init_manifest() {
    renderManifest();
}

function renderManifest() {
    const dateEl = document.getElementById('manifestDate');
    const tripEl = document.getElementById('manifestTripName');
    const companyEl = document.getElementById('manifestCompany');
    const driverEl = document.getElementById('manifestDriver');
    const tbody = document.getElementById('manifestTableBody');
    
    if (!tbody) return;
    
    const sheets = (AppData.transferSheets || []).filter(s => s.status !== 'pending');
    
    if (sheets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">لا توجد شيتات نقل</td></tr>';
        return;
    }
    
    // Use first sheet as demo
    const sheet = sheets[0];
    const passengers = sheet.passengers || [];
    
    if (dateEl) dateEl.textContent = 'التاريخ: ' + formatDate(new Date());
    if (tripEl) tripEl.textContent = sheet.tripName;
    if (companyEl) companyEl.textContent = currentUser ? (currentUser.companyName || 'شركة النقل السريع') : 'شركة النقل';
    if (driverEl) driverEl.textContent = sheet.driverName || 'غير معيّن';
    
    tbody.innerHTML = passengers.map((p, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${p.passengerName}</td>
            <td>${p.phone}</td>
            <td>${p.bookingId || generateId('BK')}</td>
            <td>${p.pickupTime || '08:00'}</td>
            <td>${p.pickupLocation || 'فندق-' + (i + 1)}</td>
            <td>${p.notes || '-'}</td>
        </tr>
    `).join('');
}

function printManifest() {
    window.print();
}
