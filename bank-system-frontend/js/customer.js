// ==========================================
// Customer Dashboard Logic - Bank System
// ==========================================

// On page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if logged in
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return;
    }

    // Set welcome message
    const name = localStorage.getItem('customerName') || 'User';
    document.getElementById('customerName').textContent = name;
    document.getElementById('displayAccount').textContent = localStorage.getItem('accountNo') || 'N/A';

    // Load balance on entry
    refreshBalance();
});

// Show/Hide sections
function showSection(section) {
    const sections = ['balance', 'transfer', 'history', 'currency'];
    sections.forEach(s => {
        document.getElementById('section-' + s).style.display = s === section ? 'block' : 'none';
    });

    // Update sidebar active state
    document.querySelectorAll('.list-group-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn' + section.charAt(0).toUpperCase() + section.slice(1)).classList.add('active');
}

// ==========================================
// 1. Balance
// ==========================================
async function refreshBalance() {
    if (USE_MOCK) {
        // Mock balance data
        const balance = (Math.random() * 50000 + 1000).toFixed(2);
        document.getElementById('displayBalance').textContent = '$' + balance;
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/customer/balance', 'GET');
    if (result.code === 200) {
        document.getElementById('displayBalance').textContent = '$' + result.data.balance.toFixed(2);
    } else {
        alert('Failed to fetch balance: ' + result.message);
    }
}

// ==========================================
// 2. Transfer
// ==========================================
document.getElementById('transferForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const to = document.getElementById('transferTo').value;
    const name = document.getElementById('transferName').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);

    // Frontend validation
    if (amount <= 0) {
        document.getElementById('transferResult').innerHTML =
            '<div class="alert alert-danger">Amount must be greater than 0</div>';
        return;
    }

    if (USE_MOCK) {
        document.getElementById('transferResult').innerHTML =
            '<div class="alert alert-success">Transfer successful! $' + amount.toFixed(2) + ' transferred to ' + name + ' (' + to + ')</div>';
        this.reset();
        refreshBalance();
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/customer/transfer', 'POST', {
        toAccount: to,
        toName: name,
        amount: amount
    });
    if (result.code === 200) {
        document.getElementById('transferResult').innerHTML =
            '<div class="alert alert-success">Transfer successful!</div>';
        this.reset();
        refreshBalance();
    } else {
        document.getElementById('transferResult').innerHTML =
            '<div class="alert alert-danger">Transfer failed: ' + result.message + '</div>';
    }
});

// ==========================================
// 3. Transaction History
// ==========================================
async function loadHistory() {
    const start = document.getElementById('histStart').value;
    const end = document.getElementById('histEnd').value;

    if (USE_MOCK) {
        // Mock transaction history
        const mockData = [
            { date: '2024-01-15 10:30', type: 'Deposit', amount: '+$5000.00', desc: 'Cash deposit' },
            { date: '2024-01-14 14:20', type: 'Transfer Out', amount: '-$200.00', desc: 'Transfer to 10086111' },
            { date: '2024-01-13 09:15', type: 'Transfer In', amount: '+$1500.00', desc: 'From 10086222' },
            { date: '2024-01-12 16:45', type: 'Withdraw', amount: '-$1000.00', desc: 'ATM withdrawal' },
        ];
        renderHistory(mockData);
        return;
    }

    const url = API_BASE_URL + '/customer/transactions?start=' + start + '&end=' + end;
    const result = await apiRequest(url, 'GET');
    if (result.code === 200) {
        renderHistory(result.data);
    } else {
        alert('Failed to load history: ' + result.message);
    }
}

function renderHistory(records) {
    const tbody = document.getElementById('historyTableBody');
    if (!records || records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No records found</td></tr>';
        return;
    }
    tbody.innerHTML = records.map(r => `
        <tr>
            <td>${r.date}</td>
            <td>${r.type}</td>
            <td>${r.amount}</td>
            <td>${r.desc}</td>
        </tr>
    `).join('');
}

// ==========================================
// 4. Currency Converter
// ==========================================
document.getElementById('currencyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;

    if (USE_MOCK) {
        // Mock exchange rates
        const rates = { 'CNY': 1, 'USD': 7.2, 'EUR': 7.8, 'JPY': 0.048, 'GBP': 9.1 };
        const fromRate = rates[from];
        const toRate = rates[to];
        const result = (amount * fromRate / toRate).toFixed(4);
        document.getElementById('convertedResult').textContent =
            amount + ' ' + from + ' = ' + result + ' ' + to;
        document.getElementById('exchangeRateInfo').textContent =
            'Rate: 1 ' + from + ' = ' + (fromRate / toRate).toFixed(4) + ' ' + to;
        return;
    }

    const url = API_BASE_URL + '/currency/convert?amount=' + amount + '&from=' + from + '&to=' + to;
    const result = await apiRequest(url, 'GET');
    if (result.code === 200) {
        document.getElementById('convertedResult').textContent =
            amount + ' ' + from + ' = ' + result.data.convertedAmount.toFixed(4) + ' ' + to;
        document.getElementById('exchangeRateInfo').textContent =
            'Rate: 1 ' + from + ' = ' + result.data.rate.toFixed(4) + ' ' + to;
    } else {
        alert('Conversion failed: ' + result.message);
    }
});
