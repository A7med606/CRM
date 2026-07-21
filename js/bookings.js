// Bookings Module

let bookingsPage = 1;
const bookingsPerPage = 10;

function init_bookings() {
    renderBookingsTable();
    initBookingFilters();
}

function initBookingFilters() {
    document.getElementById('bookingStatusFilter').onchange = () => { bookingsPage = 1; renderBookingsTable(); };
    document.getElementById('bookingDateFilter').onchange = () => { bookingsPage = 1; renderBookingsTable(); };
}

function getFilteredBookings() {
    let bookings = [...(AppData.bookings || [])];
    
    // Filter by role - agency sees only their bookings
    if (currentUser && currentUser.role === 'agency') {
        bookings = bookings.filter(b => b.agencyId === currentUser.id);
    }
    
    const statusFilter = document.getElementById('bookingStatusFilter').value;
    const dateFilter = document.getElementById('bookingDateFilter').value;
    
    if (statusFilter) bookings = bookings.filter(b => b.status === statusFilter);
    if (dateFilter) bookings = bookings.filter(b => b.date === dateFilter);
    
    return bookings;
}

function renderBookingsTable() {
    const bookings = getFilteredBookings();
    const paginated = paginate(bookings, bookingsPage, bookingsPerPage);
    const tbody = document.getElementById('bookingsTableBody');
    
    if (paginated.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">لا توجد حجوزات</td></tr>';
    } else {
        tbody.innerHTML = paginated.data.map(b => `
            <tr>
                <td><input type="checkbox" class="booking-checkbox" data-id="${b.id}"></td>
                <td><strong>${b.bookingId}</strong></td>
                <td>${b.passengerName}</td>
                <td>${b.phone}</td>
                <td>${b.tripName}</td>
                <td>${b.date}</td>
                <td>${b.passengers}</td>
                <td><span class="status-badge ${getStatusClass(b.status)}">${getStatusLabel(b.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        ${currentUser && currentUser.role === 'admin' && b.status === 'pending' ? `
                            <button class="btn btn-success btn-sm" onclick="approveBooking('${b.id}')">موافقة</button>
                            <button class="btn btn-danger btn-sm" onclick="rejectBooking('${b.id}')">رفض</button>
                        ` : ''}
                        <button class="btn btn-ghost btn-sm" onclick="viewBooking('${b.id}')">عرض</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    renderPagination('bookingsPagination', paginated, (page) => {
        bookingsPage = page;
        renderBookingsTable();
    });
}

function approveBooking(id) {
    const booking = AppData.bookings.find(b => b.id == id);
    if (booking) {
        booking.status = 'approved';
        addAuditLog('booking', 'approve', `الموافقة على حجز ${booking.bookingId}`);
        showToast('تمت الموافقة على الحجز', 'success');
        renderBookingsTable();
        updateBadge();
    }
}

function rejectBooking(id) {
    const booking = AppData.bookings.find(b => b.id == id);
    if (booking) {
        booking.status = 'rejected';
        addAuditLog('booking', 'reject', `رفض حجز ${booking.bookingId}`);
        showToast('تم رفض الحجز', 'warning');
        renderBookingsTable();
        updateBadge();
    }
}

function viewBooking(id) {
    const b = AppData.bookings.find(x => x.id == id);
    if (!b) return;
    
    const html = `
        <div class="booking-details">
            <div class="detail-row"><label>رقم الحجز:</label><span>${b.bookingId}</span></div>
            <div class="detail-row"><label>اسم المسافر:</label><span>${b.passengerName}</span></div>
            <div class="detail-row"><label>الهاتف:</label><span>${b.phone}</span></div>
            <div class="detail-row"><label>الرحلة:</label><span>${b.tripName}</span></div>
            <div class="detail-row"><label>التاريخ:</label><span>${b.date}</span></div>
            <div class="detail-row"><label>العدد:</label><span>${b.passengers} راكب</span></div>
            <div class="detail-row"><label>الحالة:</label><span class="status-badge ${getStatusClass(b.status)}">${getStatusLabel(b.status)}</span></div>
            <div class="detail-row"><label>ملاحظات:</label><span>${b.notes || 'بدون'}</span></div>
        </div>
    `;
    openModal('تفاصيل الحجز ' + b.bookingId, html);
}

function showAddBookingModal() {
    const trips = AppData.trips || [];
    const html = `
        <form id="addBookingForm">
            <div class="form-group">
                <label>اسم المسافر</label>
                <input type="text" id="newBookingName" required placeholder="الاسم الكامل">
            </div>
            <div class="form-group">
                <label>الهاتف</label>
                <input type="tel" id="newBookingPhone" required placeholder="+20 1xx xxxx xxxx">
            </div>
            <div class="form-group">
                <label>الرحلة</label>
                <select id="newBookingTrip" required>
                    <option value="">اختر الرحلة...</option>
                    ${trips.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>التاريخ</label>
                    <input type="date" id="newBookingDate" required>
                </div>
                <div class="form-group">
                    <label>عدد الركاب</label>
                    <input type="number" id="newBookingPassengers" min="1" value="1" required>
                </div>
            </div>
            <div class="form-group">
                <label>ملاحظات</label>
                <textarea id="newBookingNotes" rows="3" placeholder="ملاحظات إضافية..."></textarea>
            </div>
        </form>
    `;
    
    openModal('إضافة حجز جديد', html, function() {
        const name = document.getElementById('newBookingName').value;
        const phone = document.getElementById('newBookingPhone').value;
        const tripId = document.getElementById('newBookingTrip').value;
        const date = document.getElementById('newBookingDate').value;
        const passengers = document.getElementById('newBookingPassengers').value;
        const notes = document.getElementById('newBookingNotes').value;
        
        if (!name || !phone || !tripId || !date) {
            showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        const trip = trips.find(t => t.id == tripId);
        const newBooking = {
            id: Date.now(),
            bookingId: generateId('BK'),
            passengerName: name,
            phone: phone,
            tripId: tripId,
            tripName: trip ? trip.name : '',
            date: date,
            passengers: parseInt(passengers),
            status: 'pending',
            agencyId: currentUser ? currentUser.id : 1,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        
        AppData.bookings.unshift(newBooking);
        addAuditLog('booking', 'create', `إنشاء حجز جديد ${newBooking.bookingId}`);
        showToast('تم إنشاء الحجز بنجاح', 'success');
        closeModal();
        renderBookingsTable();
        updateBadge();
    });
}

function updateBadge() {
    const pending = (AppData.bookings || []).filter(b => b.status === 'new' || b.status === 'pending').length;
    document.getElementById('bookingsBadge').textContent = pending;
}
