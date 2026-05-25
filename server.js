const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Data storage ── */
const DATA_DIR  = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'members.json');
const ADMIN_PASS = process.env.ADMIN_PASS || 'sahagroup30';

if (!fs.existsSync(DATA_DIR))  fs.mkdirSync(DATA_DIR,  { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

function readMembers() {
    try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
    catch { return []; }
}
function writeMembers(arr) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

/* ── Middleware ── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));   // serve all files in root

/* ── API: register member ── */
app.post('/api/register', (req, res) => {
    const id = (req.body.memberId || '').trim();
    if (!id) return res.status(400).json({ error: 'กรุณากรอกรหัสสมาชิก' });

    const members = readMembers();
    members.push({
        id,
        timestamp: new Date().toISOString(),
        time_th:   new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    });
    writeMembers(members);
    res.json({ success: true });
});

/* ── Admin: view members ── */
app.get('/admin/members', (req, res) => {
    if (req.query.pass !== ADMIN_PASS)
        return res.status(401).json({ error: 'Unauthorized' });
    const members = readMembers();
    res.json({ count: members.length, members });
});

/* ── Admin: export CSV ── */
app.get('/admin/export', (req, res) => {
    if (req.query.pass !== ADMIN_PASS)
        return res.status(401).send('Unauthorized');
    const members = readMembers();
    const csv = '﻿' +             // BOM for Excel Thai
        'ลำดับ,รหัสสมาชิก,วันที่-เวลา\n' +
        members.map((m, i) => `${i + 1},"${m.id}","${m.time_th}"`).join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition',
        `attachment; filename="members_${new Date().toISOString().slice(0,10)}.csv"`);
    res.send(csv);
});

/* ── Admin: HTML dashboard ── */
app.get('/admin', (req, res) => {
    const pass = req.query.pass || '';
    if (pass !== ADMIN_PASS) {
        return res.send(`<!DOCTYPE html><html lang="th">
<head><meta charset="UTF-8"><title>Admin</title>
<style>
  body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;
       background:#e8f7ff;margin:0}
  .card{background:#fff;padding:40px;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.15);
        text-align:center;min-width:320px}
  h2{color:#C9200A;margin-bottom:20px}
  input{padding:12px 20px;font-size:1em;border:2px solid #ddd;border-radius:30px;width:100%;
        box-sizing:border-box;margin-bottom:12px;text-align:center}
  button{padding:12px 40px;background:linear-gradient(135deg,#ff5030,#C9200A);color:#fff;
         border:none;border-radius:30px;font-size:1em;font-weight:700;cursor:pointer;width:100%}
</style></head>
<body><div class="card">
  <h2>🔐 Admin Login</h2>
  <form method="GET">
    <input type="password" name="pass" placeholder="รหัสผ่าน Admin">
    <button type="submit">เข้าสู่ระบบ</button>
  </form>
</div></body></html>`);
    }

    const members = readMembers();
    const rows = members.map((m, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${m.id}</td>
            <td>${m.time_th}</td>
        </tr>`).join('');

    res.send(`<!DOCTYPE html><html lang="th">
<head><meta charset="UTF-8"><title>Admin – สมาชิก</title>
<style>
  body{font-family:'Kanit',sans-serif;background:#e8f7ff;margin:0;padding:24px}
  h1{color:#C9200A}
  .summary{background:#fff;padding:16px 24px;border-radius:12px;margin-bottom:20px;
           display:inline-block;box-shadow:0 4px 12px rgba(0,0,0,.1)}
  table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;
        overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.1)}
  th{background:#C9200A;color:#fff;padding:12px 16px;text-align:left}
  td{padding:10px 16px;border-bottom:1px solid #eee}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#fff5f5}
  .btn{display:inline-block;margin-top:16px;padding:10px 28px;
       background:linear-gradient(135deg,#28a745,#1e7e34);color:#fff;
       border-radius:30px;text-decoration:none;font-weight:700}
  .btn-red{background:linear-gradient(135deg,#ff5030,#C9200A);margin-left:10px}
</style></head>
<body>
  <h1>📋 รายชื่อสมาชิกที่ร่วมกิจกรรม</h1>
  <div class="summary">สมาชิกทั้งหมด: <strong>${members.length} คน</strong></div><br>
  <a class="btn" href="/admin/export?pass=${pass}">⬇ Export CSV</a>
  <a class="btn btn-red" href="/admin?pass=${pass}" onclick="location.reload();return false;">🔄 Refresh</a>
  <table>
    <thead><tr><th>#</th><th>รหัสสมาชิก</th><th>วันที่-เวลา</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="3" style="text-align:center;color:#aaa">ยังไม่มีข้อมูล</td></tr>'}</tbody>
  </table>
</body></html>`);
});

app.listen(PORT, () => console.log(`✅  Server running on port ${PORT}`));
