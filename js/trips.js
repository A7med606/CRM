// Trips Module

function init_trips() {
    renderTripsGrid();
}

function renderTripsGrid() {
    const grid = document.getElementById('tripsGrid');
    if (!grid) return;
    
    const trips = AppData.trips || [];
    
    if (trips.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🚌</div><h3>لا توجد رحلات</h3></div>';
        return;
    }
    
    grid.innerHTML = trips.map(trip => `
        <div class="trip-card ${trip.status}">
            <div class="trip-card-header">
                <span class="trip-id">${trip.tripId}</span>
                <span class="status-badge ${getStatusClass(trip.status)}">${getStatusLabel(trip.status)}</span>
            </div>
            <div class="trip-card-body">
                <h3 class="trip-name">${trip.name}</h3>
                <div class="trip-info">
                    <div class="trip-info-item">
                        <span class="info-label">📅 التاريخ</span>
                        <span class="info-value">${trip.date}</span>
                    </div>
                    <div class="trip-info-item">
                        <span class="info-label">🕐 الوقت</span>
                        <span class="info-value">${trip.time}</span>
                    </div>
                    <div class="trip-info-item">
                        <span class="info-label">👥 الركاب</span>
                        <span class="info-value">${trip.bookedPassengers}/${trip.capacity}</span>
                    </div>
                    <div class="trip-info-item">
                        <span class="info-label">🚌 الحافلة</span>
                        <span class="info-value">${trip.busType || 'هاي اس'}</span>
                    </div>
                </div>
            </div>
            <div class="trip-card-footer">
                <button class="btn btn-ghost btn-sm" onclick="viewTripDetails('${trip.id}')">التفاصيل</button>
                <button class="btn btn-ghost btn-sm" onclick="viewTripBookings('${trip.id}')">الحجوزات</button>
            </div>
        </div>
    `).join('');
}

function showAddTripModal() {
    const html = `
        <form id="addTripForm">
            <div class="form-group">
                <label>اسم الرحلة</label>
                <input type="text" id="newTripName" required placeholder="مثال: القاهرة - الإسكندرية">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" id="newTripDate" required>
                </div>
                <div class="form-group">
                    <label>الوقت</label>
                    <input type="time" id="newTripTime" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>السعة</label>
                    <input type="number" id="newTripCapacity" value="50" min="1">
                </div>
                <div class="form-group">
                    <label>نوع الحافلة</label>
                    <select id="newTripBusType">
                        <option value="هاي اس">هاي اس</option>
                        <option value="سوبر جيت">سوبر جيت</option>
                        <option value="ميكروباص">ميكروباص</option>
                        <option value="فان">فان</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>ملاحظات</label>
                <textarea id="newTripNotes" rows="2" placeholder="ملاحظات..."></textarea>
            </div>
        </form>
    `;
    
    openModal('إضافة رحلة جديدة', html, function() {
        const name = document.getElementById('newTripName').value;
        const date = document.getElementById('newTripDate').value;
        const time = document.getElementById('newTripTime').value;
        const capacity = document.getElementById('newTripCapacity').value;
        const busType = document.getElementById('newTripBusType').value;
        
        if (!name || !date || !time) {
            showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        AppData.trips.push({
            id: Date.now(),
            tripId: generateId('TR'),
            name: name,
            date: date,
            time: time,
            capacity: parseInt(capacity),
            busType: busType,
            bookedPassengers: 0,
            status: 'active',
            notes: document.getElementById('newTripNotes').value
        });
        
        addAuditLog('trip', 'create', `إنشاء رحلة جديدة ${name}`);
        showToast('تم إنشاء الرحلة بنجاح', 'success');
        closeModal();
        renderTripsGrid();
    });
}

function viewTripDetails(id) {
    const trip = (AppData.trips || []).find(t => t.id == id);
    if (!trip) return;
    
    const bookings = (AppData.bookings || []).filter(b => b.tripId == id);
    const html = `
        <div class="booking-details">
            <div class="detail-row"><label>رقم الرحلة:</label><span>${trip.tripId}</span></div>
            <div class="detail-row"><label>الاسم:</label><span>${trip.name}</span></div>
            <div class="detail-row"><label>التاريخ:</label><span>${trip.date}</span></div>
            <div class="detail-row"><label>الوقت:</label><span>${trip.time}</span></div>
            <div class="detail-row"><label>السعة:</label><span>${trip.capacity}</span></div>
            <div class="detail-row"><label>المحجوز:</label><span>${trip.bookedPassengers}</span></div>
            <div class="detail-row"><label>المتبقي:</label><span>${trip.capacity - trip.bookedPassengers}</span></div>
            <div class="detail-row"><label>النوع:</label><span>${trip.busType}</span></div>
            <div class="detail-row"><label>الحالة:</label><span class="status-badge ${getStatusClass(trip.status)}">${getStatusLabel(trip.status)}</span></div>
        </div>
    `;
    openModal('تفاصيل الرحلة', html);
}

function viewTripBookings(id) {
    navigateTo('bookings');
}
