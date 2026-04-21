const commentsContainer = document.getElementById("commentsContainer");
const form = document.getElementById("commentForm");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const titleForm = document.getElementById("titleForm");
const commentsCount = document.getElementById("commentsCount");
const url = "https://jsonplaceholder.typicode.com/comments";

let isEditing = false;
let selectedId = null;
let elementToEdit = null;

function getComments() {
  fetch(url + "?_limit=10")
    .then((res) => res.json())
    .then((data) => {
      commentsContainer.innerHTML = "";
      data.forEach((comment) => commentRender(comment));
      updateCount();
    })
    .catch((err) => {
      commentsContainer.innerHTML =
        "<p class='error'>حدث خطأ أثناء تحميل البيانات</p>";
    });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const dataComment = {
    name: document.getElementById("nameId").value,
    email: document.getElementById("emailId").value,
    body: document.getElementById("bodyId").value,
  };

  if (isEditing) {
    commentUpdate(selectedId, dataComment, elementToEdit);
  } else {
    createComment(dataComment);
  }

  form.reset();
  resetFormState();
});

function createComment(data) {
  commentRender(data, true);
  updateCount();
  fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
}

function commentUpdate(id, data, element) {
  element.querySelector(".comment-name").innerText = data.name;
  element.querySelector(".email-val").innerText = data.email;
  element.querySelector(".comment-body").innerText = data.body;
  element.querySelector(".comment-avatar").innerText = data.name
    .charAt(0)
    .toUpperCase();

  fetch(url + "/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
}

function commentRemove(id, element) {
  if (confirm("هل أنت متأكد من حذف هذا التعليق؟")) {
    element.remove();
    updateCount();
    fetch(url + "/" + id, { method: "DELETE" });
  }
}

function commentRender(comment, isNew = false) {
  const div = document.createElement("div");
  div.classList.add("comment-item");

  const firstLetter = comment.name ? comment.name.charAt(0).toUpperCase() : "?";

  div.innerHTML = `
        <div class="comment-header">
            <div class="comment-avatar">${firstLetter}</div>
            <div class="comment-info">
                <div class="comment-name">${comment.name}</div>
                <div class="comment-email">
                    <i class="fas fa-envelope"></i> <span class="email-val">${comment.email}</span>
                </div>
            </div>
        </div>
        <div class="comment-body">${comment.body}</div>
        <div class="comment-actions">
            <button class="edit-btn"><i class="fas fa-edit"></i> تعديل</button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i> حذف</button>
        </div>
    `;

  div.querySelector(".delete-btn").onclick = () =>
    commentRemove(comment.id, div);

  div.querySelector(".edit-btn").onclick = () => {
    document.getElementById("nameId").value = comment.name;
    document.getElementById("emailId").value = comment.email;
    document.getElementById("bodyId").value = comment.body;

    isEditing = true;
    selectedId = comment.id;
    elementToEdit = div;

    titleForm.innerText = "تعديل التعليق";
    submitBtn.innerHTML = '<i class="fas fa-sync-alt"></i> تحديث التعليق';
    cancelBtn.style.display = "inline-flex";

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isNew) commentsContainer.prepend(div);
  else commentsContainer.appendChild(div);
}

function updateCount() {
  const count = commentsContainer.querySelectorAll(".comment-item").length;
  commentsCount.innerText = count;
}

function resetFormState() {
  isEditing = false;
  selectedId = null;
  elementToEdit = null;
  titleForm.innerText = "إضافة تعليق جديد";
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إضافة تعليق';
  cancelBtn.style.display = "none";
}

cancelBtn.onclick = () => {
  form.reset();
  resetFormState();
};

getComments();