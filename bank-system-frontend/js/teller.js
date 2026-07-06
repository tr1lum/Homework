// ==========================================
// Teller Logic - Bank System
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('tellerName').textContent = localStorage.getItem('tellerName') || 'Teller';
});

function showSection(section) {
    const sections = ['createAccount', 'deposit', 'withdraw', 'closeAccount', 'customerInfo'];
    sections.forEach(s => {
        document.getElementById('section-' + s).style.display = s === section ? 'block' : 'none';
    });
    document.querySelectorAll('.list-group-item').forEach(btn => btn.classList.remove('active'));
    const btnMap = { createAccount: 0, deposit: 1, withdraw: 2, closeAccount: 3, customerInfo: 4 };
    document.querySelectorAll('.list-group-item')[btnMap[section]].classList.add('active');
}

// 1. Create Account
document.getElementById('createAccountForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('caName').value;
    const idCard = document.getElementById('caIdCard').value;
    const phone = document.getElementById('caPhone').value;
    const deposit = parseFloat(document.getElementById('caDeposit').value) || 0;

    if (USE_MOCK) {
        const accountNo = '1008' + Math.floor(Math.random() * 100000);
        document.getElementById('createAccountResult').innerHTML =
            '<div class="alert alert-success">Account created! <br> Name: ' + name +
            '<br>Account: ' + accountNo + '<br>Initial Deposit: $' + deposit.toFixed(2) + '</div>';
        this.reset();
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/teller/create-account', 'POST', {
        name, idCard, phone, initialDeposit: deposit
    });
    if (result.code === 200) {
        document.getElementById('createAccountResult').innerHTML =
            '<div class="alert alert-success">Account created! <br>Account: ' + result.data.accountNo + '</div>';
        this.reset();
    } else {
        document.getElementById('createAccountResult').innerHTML =
            '<div class="alert alert-danger">' + result.message + '</div>';
    }
});

// 2. Deposit
document.getElementById('depositForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const account = document.getElementById('depAccount').value;
    const amount = parseFloat(document.getElementById('depAmount').value);

    if (USE_MOCK) {
        document.getElementById('depositResult').innerHTML =
            '<div class="alert alert-success">Deposit successful! $' + amount.toFixed(2) + ' added to ' + account + '</div>';
        this.reset();
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/teller/deposit', 'POST', {
        accountNo: account, amount: amount
    });
    if (result.code === 200) {
        document.getElementById('depositResult').innerHTML =
            '<div class="alert alert-success">Deposit successful! New balance: $' + result.data.balance.toFixed(2) + '</div>';
        this.reset();
    } else {
        document.getElementById('depositResult').innerHTML =
            '<div class="alert alert-danger">' + result.message + '</div>';
    }
});

// 3. Withdraw
document.getElementById('withdrawForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const account = document.getElementById('wdAccount').value;
    const amount = parseFloat(document.getElementById('wdAmount').value);

    if (USE_MOCK) {
        document.getElementById('withdrawResult').innerHTML =
            '<div class="alert alert-success">Withdrawal successful! $' + amount.toFixed(2) + ' withdrawn from ' + account + '</div>';
        this.reset();
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/teller/withdraw', 'POST', {
        accountNo: account, amount: amount
    });
    if (result.code === 200) {
        document.getElementById('withdrawResult').innerHTML =
            '<div class="alert alert-success">Withdrawal successful! New balance: $' + result.data.balance.toFixed(2) + '</div>';
        this.reset();
    } else {
        document.getElementById('withdrawResult').innerHTML =
            '<div class="alert alert-danger">' + result.message + '</div>';
    }
});

// 4. Close Account
document.getElementById('closeAccountForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const account = document.getElementById('clAccount').value;
    const idCard = document.getElementById('clIdCard').value;

    if (USE_MOCK) {
        document.getElementById('closeAccountResult').innerHTML =
            '<div class="alert alert-warning">Account ' + account + ' has been closed.</div>';
        this.reset();
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/teller/close-account', 'POST', {
        accountNo: account, idCard: idCard
    });
    if (result.code === 200) {
        document.getElementById('closeAccountResult').innerHTML =
            '<div class="alert alert-warning">' + result.message + '</div>';
        this.reset();
    } else {
        document.getElementById('closeAccountResult').innerHTML =
            '<div class="alert alert-danger">' + result.message + '</div>';
    }
});

// 5. Customer Info
document.getElementById('customerInfoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const type = document.getElementById('searchType').value;
    const value = document.getElementById('searchValue').value;

    if (USE_MOCK) {
        document.getElementById('customerInfoResult').innerHTML = `
            <div class="card mt-3">
                <div class="card-body">
                    <h6>Customer Info (Mock Data)</h6>
                    <p><strong>Name:</strong> Zhang San<br>
                    <strong>Account:</strong> ${value}<br>
                    <strong>Balance:</strong> $12,345.67<br>
                    <strong>Status:</strong> Active</p>
                </div>
            </div>`;
        return;
    }

    const url = API_BASE_URL + '/teller/customer-info?' + type + '=' + value;
    const result = await apiRequest(url, 'GET');
    if (result.code === 200) {
        const d = result.data;
        document.getElementById('customerInfoResult').innerHTML = `
            <div class="card mt-3">
                <div class="card-body">
                    <h6>Customer Info</h6>
                    <p><strong>Name:</strong> ${d.name}<br>
                    <strong>Account:</strong> ${d.accountNo}<br>
                    <strong>Balance:</strong> $${d.balance.toFixed(2)}<br>
                    <strong>Status:</strong> ${d.status}</p>
                </div>
            </div>`;
    } else {
        document.getElementById('customerInfoResult').innerHTML =
            '<div class="alert alert-danger">' + result.message + '</div>';
    }
});
