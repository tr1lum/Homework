// ==========================================
// Admin Logic - Bank System
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('adminName').textContent = localStorage.getItem('adminName') || 'Admin';
    refreshDashboard();
    loadEmployees();
});

function showSection(section) {
    const sections = ['dashboard', 'employee', 'rate'];
    sections.forEach(s => {
        document.getElementById('section-' + s).style.display = s === section ? 'block' : 'none';
    });
    document.querySelectorAll('.list-group-item').forEach(btn => btn.classList.remove('active'));
    const btnMap = { dashboard: 0, employee: 1, rate: 2 };
    document.querySelectorAll('.list-group-item')[btnMap[section]].classList.add('active');
}

// ==========================================
// 1. Dashboard
// ==========================================
async function refreshDashboard() {
    if (USE_MOCK) {
        document.getElementById('totalDeposits').textContent = '$1,234,567.89';
        document.getElementById('todayTxCount').textContent = '156';
        document.getElementById('todayTxAmount').textContent = '$89,432.10';
        document.getElementById('totalUsers').textContent = '2,345';
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/admin/dashboard', 'GET');
    if (result.code === 200) {
        const d = result.data;
        document.getElementById('totalDeposits').textContent = '$' + d.totalDeposits.toLocaleString();
        document.getElementById('todayTxCount').textContent = d.todayTxCount;
        document.getElementById('todayTxAmount').textContent = '$' + d.todayTxAmount.toLocaleString();
        document.getElementById('totalUsers').textContent = d.totalUsers;
    }
}

// ==========================================
// 2. Employee Management
// ==========================================
async function loadEmployees() {
    if (USE_MOCK) {
        const mockEmps = [
            { id: 'T001', name: 'Li Ming', role: 'Teller', status: 'Active' },
            { id: 'T002', name: 'Wang Fang', role: 'Teller', status: 'Active' },
            { id: 'T003', name: 'Zhao Wei', role: 'Teller', status: 'Inactive' },
        ];
        renderEmployees(mockEmps);
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/admin/employees', 'GET');
    if (result.code === 200) {
        renderEmployees(result.data);
    }
}

function renderEmployees(employees) {
    const tbody = document.getElementById('employeeTableBody');
    if (!employees || employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No employees found</td></tr>';
        return;
    }
    tbody.innerHTML = employees.map(emp => `
        <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.role}</td>
            <td><span class="badge bg-${emp.status === 'Active' ? 'success' : 'secondary'}">${emp.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editEmployee('${emp.id}')">Edit</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee('${emp.id}')">Delete</button>
                <button class="btn btn-sm btn-outline-warning" onclick="resetPwd('${emp.id}')">Reset Pwd</button>
            </td>
        </tr>
    `).join('');
}

function editEmployee(id) {
    // In mock mode, just show alert
    if (USE_MOCK) {
        alert('Edit employee: ' + id + ' (backend integration pending)');
        return;
    }
    // Fetch employee details and open modal
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete employee ' + id + '?')) {
        if (USE_MOCK) {
            alert('Employee ' + id + ' deleted (mock)');
            loadEmployees();
            return;
        }
        apiRequest(API_BASE_URL + '/admin/employee/' + id, 'DELETE').then(result => {
            if (result.code === 200) {
                alert('Employee deleted');
                loadEmployees();
            }
        });
    }
}

function resetPwd(id) {
    if (confirm('Reset password for employee ' + id + '?')) {
        if (USE_MOCK) {
            alert('Password reset to default for ' + id + ' (mock)');
            return;
        }
        apiRequest(API_BASE_URL + '/admin/employee/' + id + '/reset-password', 'PUT').then(result => {
            if (result.code === 200) {
                alert('Password reset to default');
            }
        });
    }
}

// Employee add/edit form
document.getElementById('employeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('empName').value;
    const pwd = document.getElementById('empPwd').value;

    if (USE_MOCK) {
        alert('Employee ' + name + ' saved (mock)');
        document.getElementById('employeeModal').querySelector('.btn-close').click();
        this.reset();
        loadEmployees();
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/admin/employee', 'POST', {
        name: name,
        password: pwd
    });
    if (result.code === 200) {
        alert('Employee added');
        document.getElementById('employeeModal').querySelector('.btn-close').click();
        this.reset();
        loadEmployees();
    } else {
        alert('Failed: ' + result.message);
    }
});

// ==========================================
// 3. Exchange Rate Config
// ==========================================
document.getElementById('rateForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const currency = document.getElementById('rateCurrency').value;
    const rate = parseFloat(document.getElementById('rateValue').value);

    if (USE_MOCK) {
        document.getElementById('rateResult').innerHTML =
            '<div class="alert alert-success">Rate updated: 1 ' + currency + ' = ' + rate + ' CNY (mock)</div>';
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/admin/rates', 'PUT', {
        currency: currency,
        rate: rate
    });
    if (result.code === 200) {
        document.getElementById('rateResult').innerHTML =
            '<div class="alert alert-success">Rate updated successfully</div>';
    } else {
        document.getElementById('rateResult').innerHTML =
            '<div class="alert alert-danger">' + result.message + '</div>';
    }
});
