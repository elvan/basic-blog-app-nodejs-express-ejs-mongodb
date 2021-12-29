// @ts-nocheck
const loadCommentsButtonEl = document.getElementById('load-comments-button');
const commentsSectionEl = document.getElementById('comments');
const commentsFormEl = document.querySelector('#comments-form form');
const commentTitleEl = document.getElementById('title');
const commentTextEl = document.getElementById('text');

function createCommentsList(comments) {
  const commentsListEl = document.createElement('ul');

  for (const comment of comments) {
    const commentEl = document.createElement('li');
    commentEl.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
      </article>
    `;

    commentsListEl.appendChild(commentEl);
  }

  return commentsListEl;
}

async function fetchCommentsForPost() {
  const postId = loadCommentsButtonEl?.dataset.postid;
  const response = await fetch(`/posts/${postId}/comments`);

  if (!response.ok) {
    throw new Error('Failed to load comments');
  }

  const comments = await response.json();

  const commentsListEl = createCommentsList(comments);
  commentsSectionEl.innerHTML = '';
  commentsSectionEl.appendChild(commentsListEl);
}

function saveComment(event) {
  event.preventDefault();

  const postId = loadCommentsButtonEl?.dataset.postid;
  const title = commentTitleEl.value;
  const text = commentTextEl.value;

  const comment = {
    postId,
    title,
    text,
  };

  console.log(comment);
}

loadCommentsButtonEl?.addEventListener('click', fetchCommentsForPost);
commentsFormEl?.addEventListener('submit', saveComment);
