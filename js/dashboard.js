// Dashboard Module

function init_dashboard() {
    renderDashboardStats();
    renderLiveTripsList();
    renderRecentActivity();
}

function renderDashboardStats() {
    const bookings = AppData.bookings || [];
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('approvedBookings').textContent = bookings.filter(b => b.status === 'approved' || b.status === 'completed').length;
    document.getElementById('pendingBookings').textContent = bookings.filter(b => b.status === 'pending' || b.status === 'new').length;
    document.getElementById('activeTrips').textContent = (AppData.trips || []).filter(t => t.status === 'active').length;
}

function renderLiveTripsList() {
    const container = document.getElementById('liveTripsList');
    const trips = (AppData.trips || []).filter(t => t.status === 'active').slice(0, 5);
    
    if (trips.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>لا توجد رحلات نشطة</p></div>';
        return;
    }
    
    container.innerHTML = trips.map(trip => `
        <div class="live-trip-item">
            <div class="live-trip-dot active"></div>
            <div class="live-trip-info">
                <span class="live-trip-name">${trip.name}</span>
                <span class="live-trip-time">${trip.date} - ${trip.time}</span>
            </div>
            <span class="live-trip-passengers">${trip.passengers} راكب</span>
        </div>
    `).join('');
}

function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    const logs = (AppData.auditLog || []).slice(0, 8);
    
    if (logs.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>لا توجد نشاطات</p></div>';
        return;
    }
    
    container.innerHTML = logs.map(log => `
        <div class="activity-item">
            <div class="activity-avatar" style="background: ${getAvatarColor(log.user)}">
                ${log.user.charAt(0)}
            </div>
            <div class="activity-content">
                <p><strong>${log.user}</strong> ${log.description}</p>
                <span class="activity-time">${getRelativeTime(log.timestamp)}</span>
            </div>
        </div>
    `).join('');
}
