// @ts-nocheck
const loadCommentsButtonEl = document.getElementById('load-comments-button');
const commentsSectionEl = document.getElementById('comments');

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

loadCommentsButtonEl?.addEventListener('click', fetchCommentsForPost);
