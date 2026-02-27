const API = '/api';

const $ = (sel) => document.querySelector(sel);
const postForm = $('#postForm');
const postType = $('#postType');
const mediaUrls = $('#mediaUrls');
const caption = $('#caption');
const scheduleDate = $('#scheduleDate');
const scheduleTime = $('#scheduleTime');
const postNowBtn = $('#postNowBtn');
const refreshBtn = $('#refreshBtn');
const postsContainer = $('#postsContainer');

// Set default date/time to now + 1 hour
function setDefaultDateTime() {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  scheduleDate.value = now.toISOString().split('T')[0];
  scheduleTime.value = now.toTimeString().slice(0, 5);
}

setDefaultDateTime();

// Toast notification
function showToast(message, type = 'success') {
  const toast = $('#toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Format date for display
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

// Parse media URLs from textarea
function getMediaUrls() {
  return mediaUrls.value
    .split('\n')
    .map(u => u.trim())
    .filter(u => u.length > 0);
}

// Render posts list
function renderPosts(posts) {
  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="empty-state">No posts scheduled yet. Create one above!</p>';
    return;
  }

  postsContainer.innerHTML = posts.map(post => {
    const urls = JSON.parse(post.media_urls);
    const typeLabel = post.type.charAt(0).toUpperCase() + post.type.slice(1);
    const mediaCount = urls.length > 1 ? ` (${urls.length} items)` : '';
    const captionPreview = post.caption || '(no caption)';
    const deleteBtn = post.status === 'pending'
      ? `<button class="btn btn-danger" onclick="deletePost(${post.id})">Cancel</button>`
      : '';
    const errorMsg = post.error_message
      ? `<div style="color: var(--danger); font-size: 0.8rem; margin-top: 0.25rem;">${post.error_message}</div>`
      : '';

    return `
      <div class="post-card">
        <div class="post-info">
          <h3>${typeLabel}${mediaCount}</h3>
          <p class="post-caption">${escapeHtml(captionPreview)}</p>
          <div class="post-meta">
            <span>${formatDate(post.scheduled_at)}</span>
            ${post.ig_media_id ? `<span>ID: ${post.ig_media_id}</span>` : ''}
          </div>
          ${errorMsg}
        </div>
        <div class="post-actions">
          <span class="badge badge-${post.status}">${post.status}</span>
          ${deleteBtn}
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fetch and render posts
async function loadPosts() {
  try {
    const res = await fetch(`${API}/posts`);
    const posts = await res.json();
    renderPosts(posts);
  } catch {
    postsContainer.innerHTML = '<p class="empty-state">Failed to load posts</p>';
  }
}

// Create a post
async function submitPost(scheduledAt) {
  const urls = getMediaUrls();
  const type = postType.value;

  if (urls.length === 0) {
    showToast('Please enter at least one media URL', 'error');
    return;
  }
  if (type === 'carousel' && urls.length < 2) {
    showToast('Carousel requires at least 2 URLs', 'error');
    return;
  }

  try {
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        caption: caption.value,
        media_urls: urls,
        scheduled_at: scheduledAt,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      showToast(err.error || 'Failed to create post', 'error');
      return;
    }

    showToast('Post scheduled successfully!');
    postForm.reset();
    setDefaultDateTime();
    loadPosts();
  } catch {
    showToast('Network error', 'error');
  }
}

// Delete a post
window.deletePost = async function(id) {
  try {
    const res = await fetch(`${API}/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Post cancelled');
      loadPosts();
    } else {
      showToast('Failed to cancel post', 'error');
    }
  } catch {
    showToast('Network error', 'error');
  }
};

// Form submit — scheduled post
postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = scheduleDate.value;
  const time = scheduleTime.value;
  if (!date || !time) {
    showToast('Please select a date and time', 'error');
    return;
  }
  const scheduledAt = new Date(`${date}T${time}`).toISOString();
  submitPost(scheduledAt);
});

// Post Now button
postNowBtn.addEventListener('click', () => {
  const scheduledAt = new Date().toISOString();
  submitPost(scheduledAt);
});

// Refresh button
refreshBtn.addEventListener('click', loadPosts);

// === Pipeline Section ===

const generateBtn = $('#generateBtn');
const pipelineInfo = $('#pipelineInfo');
const pipelineLogsContainer = $('#pipelineLogsContainer');

async function loadPipelineStatus() {
  try {
    const res = await fetch(`${API}/pipeline/status`);
    const status = await res.json();

    const parts = [];
    if (status.openaiConfigured) {
      parts.push(`OpenAI: connected`);
    } else {
      parts.push(`OpenAI: not configured`);
    }
    if (status.cloudinaryConfigured) {
      parts.push(`Cloudinary: connected`);
    } else {
      parts.push(`Cloudinary: not configured`);
    }
    parts.push(`Schedule: ${status.schedule.morningHour}:00 & ${status.schedule.eveningHour}:00`);
    parts.push(`${status.topicsCount} topics in rotation`);

    pipelineInfo.textContent = parts.join('  |  ');

    generateBtn.disabled = !status.openaiConfigured || !status.cloudinaryConfigured;
    if (!status.openaiConfigured || !status.cloudinaryConfigured) {
      generateBtn.title = 'Configure OPENAI_API_KEY and Cloudinary in .env first';
    }
  } catch {
    pipelineInfo.textContent = 'Could not load pipeline status';
  }
}

async function loadPipelineLogs() {
  try {
    const res = await fetch(`${API}/pipeline/logs`);
    const logs = await res.json();

    if (logs.length === 0) {
      pipelineLogsContainer.innerHTML = '<p class="empty-state" style="padding: 1rem;">No pipeline runs yet</p>';
      return;
    }

    pipelineLogsContainer.innerHTML = logs.slice(0, 10).map(log => {
      const statusClass = log.status === 'completed' ? 'badge-published'
        : log.status === 'failed' ? 'badge-failed' : 'badge-publishing';
      return `
        <div class="log-entry">
          <span class="log-topic">${escapeHtml(log.topic_id.replace(/-/g, ' '))}</span>
          <span class="log-time">${formatDate(log.created_at)}</span>
          <span class="badge ${statusClass}">${log.status}</span>
        </div>
      `;
    }).join('');
  } catch {
    pipelineLogsContainer.innerHTML = '<p class="empty-state" style="padding: 1rem;">Failed to load logs</p>';
  }
}

generateBtn.addEventListener('click', async () => {
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';

  try {
    const res = await fetch(`${API}/pipeline/generate`, { method: 'POST' });
    if (res.ok) {
      showToast('Pipeline started! This takes 1-2 minutes...');
      // Poll for updates
      const poll = setInterval(async () => {
        await loadPipelineLogs();
        await loadPosts();
        const logsRes = await fetch(`${API}/pipeline/logs`);
        const logs = await logsRes.json();
        if (logs.length > 0 && logs[0].status !== 'started') {
          clearInterval(poll);
          generateBtn.disabled = false;
          generateBtn.textContent = 'Generate & Post Now';
          if (logs[0].status === 'completed') {
            showToast('Infographic generated and posted!');
          } else {
            showToast('Pipeline failed — check logs', 'error');
          }
        }
      }, 5000);
    } else {
      const err = await res.json();
      showToast(err.error || 'Failed to start pipeline', 'error');
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate & Post Now';
    }
  } catch {
    showToast('Network error', 'error');
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate & Post Now';
  }
});

// Auto-refresh every 30 seconds
setInterval(() => {
  loadPosts();
  loadPipelineLogs();
}, 30000);

// Initial load
loadPosts();
loadPipelineStatus();
loadPipelineLogs();
