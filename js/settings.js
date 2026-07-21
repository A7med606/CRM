// Settings Module

function init_settings() {
    initSettingsTabs();
    loadSettings();
}

function initSettingsTabs() {
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding panel
            document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById('tab-' + tabName);
            if (panel) panel.classList.add('active');
        });
    });
}

function loadSettings() {
    const settings = AppData.settings || {};
    
    // WhatsApp
    if (settings.whatsapp) {
        setVal('whatsappToken', settings.whatsapp.token);
        setVal('whatsappPhoneId', settings.whatsapp.phoneId);
        setVal('whatsappBusinessId', settings.whatsapp.businessId);
        setCheck('notifyAgency', settings.whatsapp.notifyAgency);
        setCheck('notifyTransport', settings.whatsapp.notifyTransport);
        setCheck('notifyDrivers', settings.whatsapp.notifyDrivers);
    }
    
    // Approval
    if (settings.approval) {
        setCheck('autoApproval', settings.approval.autoApproval);
        setVal('minPassengers', settings.approval.minPassengers);
        setVal('approvalWindow', settings.approval.approvalWindow);
    }
    
    // Import
    if (settings.import) {
        setVal('maxFileSize', settings.import.maxFileSize);
        setCheck('autoValidation', settings.import.autoValidation);
        setCheck('errorNotification', settings.import.errorNotification);
    }
    
    // Encryption
    if (settings.encryption) {
        setVal('encryptionKey', settings.encryption.key);
        setVal('keyRotation', settings.encryption.keyRotation);
    }
    
    // Audit
    if (settings.audit) {
        setVal('auditRetention', settings.audit.retention);
        setCheck('trackBookings', settings.audit.trackBookings);
        setCheck('trackAuth', settings.audit.trackAuth);
        setCheck('autoExport', settings.audit.autoExport);
    }
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.value = value;
}

function setCheck(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.checked = value;
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function getCheck(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

function saveSettings(section) {
    switch(section) {
        case 'whatsapp':
            AppData.settings.whatsapp = {
                token: getVal('whatsappToken'),
                phoneId: getVal('whatsappPhoneId'),
                businessId: getVal('whatsappBusinessId'),
                notifyAgency: getCheck('notifyAgency'),
                notifyTransport: getCheck('notifyTransport'),
                notifyDrivers: getCheck('notifyDrivers')
            };
            break;
        case 'approval':
            AppData.settings.approval = {
                autoApproval: getCheck('autoApproval'),
                minPassengers: parseInt(getVal('minPassengers')) || 5,
                approvalWindow: parseInt(getVal('approvalWindow')) || 24
            };
            break;
        case 'import':
            AppData.settings.import = {
                maxFileSize: parseInt(getVal('maxFileSize')) || 10,
                allowedFormats: '.xlsx,.csv',
                autoValidation: getCheck('autoValidation'),
                errorNotification: getCheck('errorNotification')
            };
            break;
        case 'encryption':
            AppData.settings.encryption = {
                key: getVal('encryptionKey'),
                keyRotation: parseInt(getVal('keyRotation')) || 90
            };
            break;
        case 'audit':
            AppData.settings.audit = {
                retention: parseInt(getVal('auditRetention')) || 365,
                trackBookings: getCheck('trackBookings'),
                trackAuth: getCheck('trackAuth'),
                autoExport: getCheck('autoExport')
            };
            break;
    }
    
    addAuditLog('settings', 'update', `تحديث إعدادات ${section}`);
    showToast('تم حفظ الإعدادات بنجاح', 'success');
    
    // Persist to localStorage
    localStorage.setItem('poseidon_settings', JSON.stringify(AppData.settings));
}

function toggleKeyVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

function rotateKey() {
    if (confirm('هل أنت متأكد من تدوير مفتاح التشفير؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        const newKey = Array.from({length: 32}, () => Math.random().toString(36)[2]).join('');
        const formattedKey = newKey.match(/.{1,8}/g).join('-');
        document.getElementById('encryptionKey').value = formattedKey;
        addAuditLog('settings', 'update', 'تدوير مفتاح التشفير');
        showToast('تم تدوير المفتاح بنجاح', 'success');
    }
}

// Load stored settings on init
(function loadStoredSettings() {
    const stored = localStorage.getItem('poseidon_settings');
    if (stored) {
        try {
            AppData.settings = { ...AppData.settings, ...JSON.parse(stored) };
        } catch(e) {}
    }
})();
