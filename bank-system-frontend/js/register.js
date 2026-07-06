// ==========================================
// Customer Registration Logic - Bank System
// ==========================================

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const idCard = document.getElementById('regIdCard').value;
    const phone = document.getElementById('regPhone').value;
    const pwd = document.getElementById('regPwd').value;
    const pwdConfirm = document.getElementById('regPwdConfirm').value;
    const deposit = parseFloat(document.getElementById('regDeposit').value) || 0;

    // Frontend validation
    if (pwd !== pwdConfirm) {
        alert('Passwords do not match!');
        return;
    }
    if (pwd.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    if (idCard.length !== 18) {
        alert('ID number must be 18 digits!');
        return;
    }

    if (USE_MOCK) {
        alert('Registration successful! Your account number: 1008' + Math.floor(Math.random() * 100000));
        window.location.href = 'index.html';
        return;
    }

    const result = await apiRequest(API_BASE_URL + '/customer/register', 'POST', {
        name: name,
        idCard: idCard,
        phone: phone,
        password: pwd,
        initialDeposit: deposit
    });

    if (result.code === 200) {
        alert('Registration successful! Your account number: ' + result.data.accountNo);
        window.location.href = 'index.html';
    } else {
        alert('Registration failed: ' + result.message);
    }
});
