// Driver Module

function init_driver() {
    renderDriverView();
}

function renderDriverView() {
    renderDriverInfo();
    renderDriverSheets();
}

function renderDriverInfo() {
    const driver = currentUser || AppData.users.find(u => u.role === 'driver');
    if (!driver) return;
    
    document.getElementById('driverName').textContent = driver.name;
    document.getElementById('driverPhone').textContent = driver.phone;
    
    const mySheets = (AppData.transferSheets || []).filter(s => s.driverId == (driver.id || driver.driverId));
    const todayTrips = mySheets.length;
    const todayPassengers = mySheets.reduce((sum, s) => sum + (s.passengerCount || 0), 0);
    const completed = mySheets.filter(s => s.status === 'completed').length;
    
    document.getElementById('driverTodayTrips').textContent = todayTrips;
    document.getElementById('driverTodayPassengers').textContent = todayPassengers;
    document.getElementById('driverCompleted').textContent = completed;
}

function renderDriverSheets() {
    const container = document.getElementById('driverSheets');
    if (!container) return;
    
    const driver = currentUser || AppData.users.find(u => u.role === 'driver');
    const mySheets = (AppData.transferSheets || []).filter(s => 
        s.driverId == (driver ? driver.id : '') || s.status === 'assigned'
    );
    
    if (mySheets.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🚗</div><h3>لا توجد شيتات مخصصة</h3><p>لم يتم تعيين أي شيتات لك بعد</p></div>';
        return;
    }
    
    container.innerHTML = '<h3 style="margin-bottom: 16px;">شيتات النقل</h3>' +
        mySheets.map(sheet => {
            const passengers = sheet.passengers || [];
            return `
                <div class="driver-sheet-card ${sheet.status}">
                    <div class="sheet-header">
                        <div>
                            <h4>${sheet.sheetId}</h4>
                            <p>${sheet.tripName}</p>
                        </div>
                        <span class="status-badge ${getStatusClass(sheet.status)}">${getStatusLabel(sheet.status)}</span>
                    </div>
                    <div class="sheet-info">
                        <span>👥 ${sheet.passengerCount} راكب</span>
                        <span>🕐 ${sheet.time || '08:00 ص'}</span>
                    </div>
                    <div class="sheet-passengers">
                        ${passengers.slice(0, 5).map(p => `
                            <div class="passenger-item">
                                <span class="passenger-name">${p.passengerName}</span>
                                <span class="passenger-phone">${p.phone}</span>
                            </div>
                        `).join('')}
                        ${passengers.length > 5 ? `<p class="more-passengers">+ ${passengers.length - 5} راكب إضافي</p>` : ''}
                    </div>
                    <div class="sheet-actions">
                        ${sheet.status === 'assigned' ? `
                            <button class="btn btn-primary btn-block" onclick="updateSheetStatus('${sheet.id}', 'in_transit')">🚗 انطلق</button>
                        ` : ''}
                        ${sheet.status === 'in_transit' ? `
                            <button class="btn btn-success btn-block" onclick="updateSheetStatus('${sheet.id}', 'completed')">✅ وصلت</button>
                        ` : ''}
                        ${sheet.status === 'completed' ? `
                            <span class="completed-label">✅ تم التوصيل</span>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
}

function updateSheetStatus(sheetId, newStatus) {
    const sheet = AppData.transferSheets.find(s => s.id == sheetId);
    if (sheet) {
        sheet.status = newStatus;
        addAuditLog('transfer', 'update', `تحديث حالة الشيت ${sheet.sheetId} إلى ${getStatusLabel(newStatus)}`);
        
        const statusMessages = {
            'in_transit': 'في الطريق - تم التحديث',
            'completed': 'تم التوصيل بنجاح'
        };
        
        showToast(statusMessages[newStatus] || 'تم التحديث', 'success');
        renderDriverView();
    }
}
