// Tracking Module

function init_tracking() {
    renderTrackingBoard();
}

function renderTrackingBoard() {
    const bookings = AppData.bookings || [];

    const columns = {
        new: bookings.filter(b => b.status === 'new'),
        pending: bookings.filter(b => b.status === 'pending'),
        approved: bookings.filter(b => b.status === 'approved'),
        transit: bookings.filter(b => b.status === 'in_transit'),
        completed: bookings.filter(b => b.status === 'completed')
    };

    document.getElementById('newCount').textContent = columns.new.length;
    document.getElementById('pendingCount').textContent = columns.pending.length;
    document.getElementById('approvedCount').textContent = columns.approved.length;
    document.getElementById('transitCount').textContent = columns.transit.length;
    document.getElementById('completedCount').textContent = columns.completed.length;

    renderColumnCards('newColumn', columns.new);
    renderColumnCards('pendingColumn', columns.pending);
    renderColumnCards('approvedColumn', columns.approved);
    renderColumnCards('transitColumn', columns.transit);
    renderColumnCards('completedColumn', columns.completed);
}

function renderColumnCards(containerId, bookings) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>لا توجد حجوزات</p></div>';
        return;
    }

    container.innerHTML = bookings.slice(0, 10).map(b => `
        <div class="tracking-card">
            <div class="tracking-card-header">
                <span class="tracking-card-id">${b.bookingId}</span>
                <span class="status-badge ${getStatusClass(b.status)}">${getStatusLabel(b.status)}</span>
            </div>
            <div class="tracking-card-body">
                <p class="tracking-passenger">${b.passengerName}</p>
                <p class="tracking-route">${b.tripName}</p>
                <div class="tracking-meta">
                    <span>👥 ${b.passengers}</span>
                    <span>📅 ${b.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusClass(status) {
    const map = {
        new: 'status-new',
        pending: 'status-pending',
        approved: 'status-approved',
        in_transit: 'status-transit',
        completed: 'status-completed'
    };
    return map[status] || '';
}

function getStatusLabel(status) {
    const map = {
        new: 'جديد',
        pending: 'قيد المراجعة',
        approved: 'معتمد',
        in_transit: 'قيد التنفيذ',
        completed: 'مكتمل'
    };
    return map[status] || status;
}
