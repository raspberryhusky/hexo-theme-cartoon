document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const closeBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  let searchData = null;

  // 展开模态框
  searchBtn.addEventListener('click', function() {
    searchModal.style.display = 'flex';
    searchInput.focus();
    if (!searchData) {
      fetch('/search.json')
        .then(res => res.json())
        .then(data => {
          searchData = data;
        })
        .catch(err => console.error('Failed to load search.json', err));
    }
  });

  // 关闭模态框
  closeBtn.addEventListener('click', function() {
    searchModal.style.display = 'none';
  });

  // 点击背景关闭
  searchModal.addEventListener('click', function(e) {
    if (e.target === searchModal) {
      searchModal.style.display = 'none';
    }
  });

  // 搜索逻辑
  searchInput.addEventListener('input', function() {
    const keyword = this.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    
    if (!keyword || !searchData) return;
    
    const results = searchData.filter(post => {
      const title = (post.title || '').toLowerCase();
      const content = (post.content || '').toLowerCase();
      return title.includes(keyword) || content.includes(keyword);
    });
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-color);">😢 没有找到相关文章...</div>';
      return;
    }
    
    results.forEach(post => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      
      // 高亮标题
      const titleStr = post.title || '无标题';
      const highlightedTitle = titleStr.replace(new RegExp(keyword, 'gi'), match => `<span class="search-keyword">${match}</span>`);
      
      // 截取内容并高亮
      let contentStr = (post.content || '').replace(/<[^>]+>/g, ''); // 简单去标签
      let preview = '';
      const matchIndex = contentStr.toLowerCase().indexOf(keyword);
      if (matchIndex > -1) {
        const start = Math.max(0, matchIndex - 30);
        const end = Math.min(contentStr.length, matchIndex + 70);
        preview = (start > 0 ? '...' : '') + contentStr.substring(start, end) + '...';
        preview = preview.replace(new RegExp(keyword, 'gi'), match => `<span class="search-keyword">${match}</span>`);
      } else {
        preview = contentStr.substring(0, 100) + '...';
      }
      
      item.innerHTML = `
        <a href="${post.url}" class="search-result-title">${highlightedTitle}</a>
        <div class="search-result-content">${preview}</div>
      `;
      searchResults.appendChild(item);
    });
  });
});