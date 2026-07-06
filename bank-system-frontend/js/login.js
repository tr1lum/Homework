// ==========================================
// Login Logic - Bank System
// ==========================================

// Handle Customer Login
document.getElementById('customerLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('customerId').value;
    const pwd = document.getElementById('customerPwd').value;

    if (USE_MOCK) {
        // Mock login - accept any non-empty credentials
        localStorage.setItem('token', 'mock-token-customer');
        localStorage.setItem('role', 'customer');
        localStorage.setItem('customerName', id);
        localStorage.setItem('accountNo', '10086' + Math.floor(Math.random() * 10000));
        window.location.href = 'customer.html';
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/auth/customer/login', 'POST', {
        id: id,
        password: pwd
    });
    if (result.code === 200) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('role', 'customer');
        localStorage.setItem('customerName', result.data.name);
        localStorage.setItem('accountNo', result.data.accountNo);
        window.location.href = 'customer.html';
    } else {
        alert('Login failed: ' + result.message);
    }
});

// Handle Teller Login
document.getElementById('tellerLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('tellerId').value;
    const pwd = document.getElementById('tellerPwd').value;

    if (USE_MOCK) {
        localStorage.setItem('token', 'mock-token-teller');
        localStorage.setItem('role', 'teller');
        localStorage.setItem('tellerName', 'Teller-' + id);
        window.location.href = 'teller.html';
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/auth/teller/login', 'POST', {
        id: id,
        password: pwd
    });
    if (result.code === 200) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('role', 'teller');
        localStorage.setItem('tellerName', result.data.name);
        window.location.href = 'teller.html';
    } else {
        alert('Login failed: ' + result.message);
    }
});

// Handle Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const pwd = document.getElementById('adminPwd').value;

    if (USE_MOCK) {
        localStorage.setItem('token', 'mock-token-admin');
        localStorage.setItem('role', 'admin');
        localStorage.setItem('adminName', 'Admin-' + id);
        window.location.href = 'admin.html';
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/auth/admin/login', 'POST', {
        id: id,
        password: pwd
    });
    if (result.code === 200) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('role', 'admin');
        localStorage.setItem('adminName', result.data.name);
        window.location.href = 'admin.html';
    } else {
        alert('Login failed: ' + result.message);
    }
});
