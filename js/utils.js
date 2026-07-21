// Utility Functions

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(date) {
  const d = new Date(date);
  const datePart = d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  const timePart = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
}

function getRelativeTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'الآن';
  if (diffMin < 60) return `منذ ${diffMin} ${diffMin === 1 ? 'دقيقة' : 'دقائق'}`;
  if (diffHr < 24) return `منذ ${diffHr} ${diffHr === 1 ? 'ساعة' : 'ساعات'}`;
  if (diffDay < 30) return `منذ ${diffDay} ${diffDay === 1 ? 'يوم' : 'أيام'}`;
  return formatDate(d);
}

function getStatusLabel(status) {
  const map = {
    new: 'جديد',
    pending: 'معلق',
    approved: 'موافق',
    rejected: 'مرفوض',
    in_transit: 'في النقل',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    active: 'نشط',
    assigned: 'تم التعيين',
    inactive: 'غير نشط',
    open: 'مفتوح',
    partial: 'جزئي'
  };
  return map[status] || status;
}

function getStatusClass(status) {
  const map = {
    new: 'status-new',
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected',
    in_transit: 'status-in_transit',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    active: 'status-active',
    assigned: 'status-assigned',
    partial: 'status-pending'
  };
  return map[status] || 'status-new';
}

function getRoleLabel(role) {
  const map = {
    admin: 'مدير النظام',
    agency: 'وكالة السياحة',
    transport: 'شركة النقل',
    driver: 'سائق'
  };
  return map[role] || role;
}

function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('20')) {
    const local = cleaned.slice(2);
    if (local.length === 10) {
      return `+20 ${local.slice(0, 3)} ${local.slice(3, 7)} ${local.slice(7)}`;
    }
  }
  if (cleaned.length === 10) {
    return `+20 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

function generateId(prefix) {
  const stored = localStorage.getItem(`counter_${prefix}`) || 0;
  const next = parseInt(stored) + 1;
  localStorage.setItem(`counter_${prefix}`, next);
  return `${prefix}-${String(next).padStart(3, '0')}`;
}

function filterByText(items, text, fields) {
  if (!text || !text.trim()) return items;
  const lower = text.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const val = item[field];
      return val && String(val).toLowerCase().includes(lower);
    })
  );
}

function filterByStatus(items, status) {
  if (!status || status === 'all') return items;
  return items.filter(item => item.status === status);
}

function filterByDate(items, dateField, date) {
  if (!date) return items;
  const target = new Date(date).toDateString();
  return items.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate.toDateString() === target;
  });
}

function paginate(items, page, perPage) {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * perPage;
  const data = items.slice(start, start + perPage);
  return { data, totalPages, currentPage, total };
}

function renderPagination(containerId, paginationData, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const { totalPages, currentPage } = paginationData;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '<div class="pagination">';

  html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">السابق</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
  }

  html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">التالي</button>`;
  html += '</div>';

  container.innerHTML = html;

  container.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page >= 1 && page <= totalPages) callback(page);
    });
  });
}

function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container') || (() => {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.style.cssText = 'position:fixed;top:20px;left:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(div);
    return div;
  })();

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-message">${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-show'));

  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

function openModal(title, bodyHtml, onConfirm) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="modal-cancel-btn">إلغاء</button>
        <button class="btn btn-primary" id="modal-confirm-btn">تأكيد</button>
      </div>
    </div>
  `;

  overlay.classList.add('active');

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    if (onConfirm) onConfirm();
    closeModal();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

function exportToCSV(data, filename, headers) {
  if (!data || !data.length) return;

  const keys = headers ? headers.map(h => h.key) : Object.keys(data[0]);
  const labels = headers ? headers.map(h => h.label) : keys;

  const rows = [labels.join(',')];

  data.forEach(item => {
    const values = keys.map(key => {
      let val = item[key] ?? '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });
    rows.push(values.join(','));
  });

  const csvContent = '\uFEFF' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function getAvatarColor(name) {
  const colors = [
    '#1a73e8', '#e8710a', '#0d652d', '#c5221f',
    '#9334e6', '#185abc', '#b06000', '#137333',
    '#a50e0e', '#7617c8', '#e37400', '#007b83',
    '#1967d2', '#d93025', '#1e8e3e', '#f9ab00'
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

function validatePhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('20') && cleaned.length === 12) return true;
  if (cleaned.length === 10 && cleaned.startsWith('0')) return true;
  return false;
}

function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateDate(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}
