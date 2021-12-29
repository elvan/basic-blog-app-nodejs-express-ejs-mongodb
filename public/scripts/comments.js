const loadCommentsButtonEl = document.getElementById('load-comments-button');

async function fetchCommentsForPost() {
  const postId = loadCommentsButtonEl?.dataset.postid;
  const response = await fetch(`/posts/${postId}/comments`);

  if (!response.ok) {
    throw new Error('Failed to load comments');
  }

  const comments = await response.json();
  console.log(comments);
}

loadCommentsButtonEl?.addEventListener('click', fetchCommentsForPost);
