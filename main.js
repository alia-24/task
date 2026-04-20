const url = 'https://jsonplaceholder.typicode.com/comments';

let comments = [];
let editId = null;

const commentsBox = document.getElementById('commentsContainer');
const commentForm = document.getElementById('commentForm');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const bodyField = document.getElementById('body');
const addBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');

async function getData() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        comments = data.slice(0, 15);
        showData();
    } catch(error) {
        commentsBox.innerHTML = '<div class="empty">❌ خطأ في التحميل</div>';
    }
}

function showData() {
    if (comments.length === 0) {
        commentsBox.innerHTML = '<div class="empty">📭 لا توجد تعليقات</div>';
        return;
    }
    let html = '';
    for (let i = 0; i < comments.length; i++) {
        html += `
            <div class="comment-item">
                <div class="comment-name">👤 ${comments[i].name}</div>
                <div class="comment-email">📧 ${comments[i].email}</div>
                <div class="comment-body">💬 ${comments[i].body}</div>
                <button class="edit-btn" onclick="edit(${comments[i].id})">✏️ تعديل</button>
                <button class="delete-btn" onclick="del(${comments[i].id})">🗑️ حذف</button>
            </div>
        `;
    }
    commentsBox.innerHTML = html;
}

async function add(data) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify(data)
        });
    
        const newComment = await res.json();
        newComment.id = Date.now();
        comments.unshift(newComment);
        showData();
        reset();
        msg('✅ تم الإضافة', 'success');
    } catch (error) {
        msg('❌ فشل الإضافة', 'error');
    }
}

function edit(id) {
    const comment = comments.find(c => c.id === id);
    if (!comment) return;
    
    editId = id;
    nameField.value = comment.name;
    emailField.value = comment.email;
    bodyField.value = comment.body;
    
    formTitle.innerHTML = '✏️ تعديل';
    addBtn.innerHTML = 'تحديث';
    cancelBtn.style.display = 'inline-block';
}

async function update(id, data) {
    try {
        await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const i = comments.findIndex(c => c.id === id);
        if (i !== -1) {
            comments[i] = { ...comments[i], ...data };
            showData();
        }
        reset();
        msg('✅ تم التحديث', 'success');
    } catch (error) {
        msg('❌ فشل التحديث', 'error');
    }
}

async function del(id) {
    if (!confirm('هل تريد الحذف؟')) return;
    
    try {
        await fetch(`${url}/${id}`, { method: 'DELETE' });
        comments = comments.filter(c => c.id !== id);
        showData();
        msg('✅ تم الحذف', 'success');
        
        if (editId === id) reset();
    } catch (error) {
        msg('❌ فشل الحذف', 'error');
    }
}

async function onSubmit(e) {
    e.preventDefault();
    
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const body = bodyField.value.trim();
    
    if (!name || !email || !body) {
        msg('⚠️ املأ جميع الحقول', 'error');
        return;
    }
    
    const newData = { name, email, body };
    
    if (editId !== null) {
        await update(editId, newData);
    } else {
        await add(newData);
    }
}

function reset() {
    editId = null;
    nameField.value = '';
    emailField.value = '';
    bodyField.value = '';
    formTitle.innerHTML = '➕ إضافة';
    addBtn.innerHTML = 'إضافة';
    cancelBtn.style.display = 'none';
}

function msg(text, type) {
    const m = document.createElement('div');
    m.className = `message ${type}`;
    m.textContent = text;
    document.body.appendChild(m);
    
    setTimeout(() => m.remove(), 2000);
}

commentForm.addEventListener('submit', onSubmit);
cancelBtn.addEventListener('click', reset);
window.edit = edit;
window.del = del;
getData();