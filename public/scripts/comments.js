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

  if (comments?.length > 0) {
    const commentsListEl = createCommentsList(comments);
    commentsSectionEl.innerHTML = '';
    commentsSectionEl.appendChild(commentsListEl);
  } else {
    commentsSectionEl.firstElementChild.textContent =
      'We could not find any comments. Maybe you should add one?';
  }
}

async function saveComment(event) {
  event.preventDefault();

  const postId = loadCommentsButtonEl?.dataset.postid;
  const title = commentTitleEl.value;
  const text = commentTextEl.value;

  const comment = {
    title,
    text,
  };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });

    if (response.ok) {
      fetchCommentsForPost();
      commentTitleEl.value = '';
      commentTextEl.value = '';
    } else {
      throw new Error('Failed to save comment');
    }
  } catch (error) {
    alert(error);
  }
}

loadCommentsButtonEl?.addEventListener('click', fetchCommentsForPost);
commentsFormEl?.addEventListener('submit', saveComment);
