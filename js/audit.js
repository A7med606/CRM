// Audit Log Module

let auditPage = 1;
const auditPerPage = 15;

function init_audit() {
    renderAuditLog();
    initAuditFilters();
}

function initAuditFilters() {
    const entityFilter = document.getElementById('auditEntityFilter');
    const actionFilter = document.getElementById('auditActionFilter');
    const dateFilter = document.getElementById('auditDateFilter');

    if (entityFilter) entityFilter.onchange = () => { auditPage = 1; renderAuditLog(); };
    if (actionFilter) actionFilter.onchange = () => { auditPage = 1; renderAuditLog(); };
    if (dateFilter) dateFilter.onchange = () => { auditPage = 1; renderAuditLog(); };
}

function getFilteredAuditLog() {
    let logs = [...(AppData.auditLog || [])];

    const entity = document.getElementById('auditEntityFilter') ? document.getElementById('auditEntityFilter').value : '';
    const action = document.getElementById('auditActionFilter') ? document.getElementById('auditActionFilter').value : '';
    const date = document.getElementById('auditDateFilter') ? document.getElementById('auditDateFilter').value : '';

    if (entity) logs = logs.filter(l => l.entity === entity);
    if (action) logs = logs.filter(l => l.action === action);
    if (date) logs = logs.filter(l => l.timestamp && l.timestamp.startsWith(date));

    return logs;
}

function renderAuditLog() {
    const logs = getFilteredAuditLog();
    const paginated = paginate(logs, auditPage, auditPerPage);
    const tbody = document.getElementById('auditTableBody');

    if (!tbody) return;

    if (paginated.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">لا توجد سجلات</td></tr>';
    } else {
        tbody.innerHTML = paginated.data.map(log => `
            <tr>
                <td>${formatDateTime(log.timestamp)}</td>
                <td>${log.user}</td>
                <td>${getEntityLabel(log.entity)}</td>
                <td>${getActionLabel(log.action)}</td>
                <td>${log.description}</td>
                <td>${log.ip || '127.0.0.1'}</td>
                <td><button class="btn btn-ghost btn-sm" onclick="viewAuditDetail('${log.id}')">عرض</button></td>
            </tr>
        `).join('');
    }

    renderPagination('auditPagination', paginated, (page) => {
        auditPage = page;
        renderAuditLog();
    });
}

function getEntityLabel(entity) {
    const labels = {
        booking: 'حجز',
        trip: 'رحلة',
        transfer: 'شيت نقل',
        user: 'مستخدم',
        settings: 'إعدادات',
        import: 'استيراد'
    };
    return labels[entity] || entity;
}

function getActionLabel(action) {
    const labels = {
        create: 'إنشاء',
        update: 'تعديل',
        delete: 'حذف',
        approve: 'موافقة',
        reject: 'رفض',
        login: 'تسجيل دخول',
        export: 'تصدير'
    };
    return labels[action] || action;
}

function viewAuditDetail(id) {
    const log = (AppData.auditLog || []).find(l => l.id == id);
    if (!log) return;

    const html = `
        <div class="booking-details">
            <div class="detail-row"><label>الوقت:</label><span>${formatDateTime(log.timestamp)}</span></div>
            <div class="detail-row"><label>المستخدم:</label><span>${log.user}</span></div>
            <div class="detail-row"><label>الكيان:</label><span>${getEntityLabel(log.entity)}</span></div>
            <div class="detail-row"><label>العملية:</label><span>${getActionLabel(log.action)}</span></div>
            <div class="detail-row"><label>الوصف:</label><span>${log.description}</span></div>
            <div class="detail-row"><label>IP:</label><span>${log.ip || '127.0.0.1'}</span></div>
            ${log.oldData ? `<div class="detail-row"><label>البيانات القديمة:</label><pre>${JSON.stringify(log.oldData, null, 2)}</pre></div>` : ''}
            ${log.newData ? `<div class="detail-row"><label>البيانات الجديدة:</label><pre>${JSON.stringify(log.newData, null, 2)}</pre></div>` : ''}
        </div>
    `;
    openModal('تفاصيل السجل', html);
}

function addAuditLog(entity, action, description) {
    if (!AppData.auditLog) AppData.auditLog = [];

    AppData.auditLog.unshift({
        id: Date.now(),
        entity: entity,
        action: action,
        description: description,
        user: currentUser ? currentUser.name : 'System',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1'
    });
}

function exportAuditLog() {
    const logs = getFilteredAuditLog();
    const headers = ['الوقت', 'المستخدم', 'الكيان', 'العملية', 'الوصف', 'IP'];
    const data = logs.map(l => ({
        'الوقت': formatDateTime(l.timestamp),
        'المستخدم': l.user,
        'الكيان': getEntityLabel(l.entity),
        'العملية': getActionLabel(l.action),
        'الوصف': l.description,
        'IP': l.ip || ''
    }));
    exportToCSV(data, 'audit_log_' + new Date().toISOString().split('T')[0] + '.csv', headers);
    showToast('تم تصدير السجل بنجاح', 'success');
}
