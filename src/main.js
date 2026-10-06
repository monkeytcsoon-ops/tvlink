const channels = [
  {
    id: 'cctv1',
    name: 'CCTV-1 综合',
    category: '综合',
    language: '中文',
    source: '本地示例',
    streamUrl: 'https://live.example.com/cctv1.m3u8',
    description: '综合频道示例，适合测试播放器与线路切换。'
  },
  {
    id: 'cctv5',
    name: 'CCTV-5 体育',
    category: '体育',
    language: '中文',
    source: '本地示例',
    streamUrl: 'https://live.example.com/cctv5.m3u8',
    description: '体育赛事直播示例。'
  },
  {
    id: 'news',
    name: '全球新闻',
    category: '新闻',
    language: 'English',
    source: '在线流',
    streamUrl: 'https://live.example.com/global-news.m3u8',
    description: '国际新闻频道示例。'
  },
  {
    id: 'movie',
    name: '电影精选',
    category: '电影',
    language: '中文',
    source: '本地示例',
    streamUrl: 'https://live.example.com/movie-channel.m3u8',
    description: '电影与综艺轮播示例。'
  },
  {
    id: 'kids',
    name: '儿童频道',
    category: '少儿',
    language: '中文',
    source: '本地示例',
    streamUrl: 'https://live.example.com/kids.m3u8',
    description: '适合儿童内容播放的示例频道。'
  }
];

const state = {
  currentIndex: 0,
  query: ''
};

const channelList = document.querySelector('#channelList');
const searchInput = document.querySelector('#searchInput');
const channelTitle = document.querySelector('#channelTitle');
const channelCategory = document.querySelector('#channelCategory');
const channelLanguage = document.querySelector('#channelLanguage');
const channelSource = document.querySelector('#channelSource');
const player = document.querySelector('#player');
const customUrlInput = document.querySelector('#customUrlInput');
const fallbackMessage = document.querySelector('#fallbackMessage');
const randomChannelBtn = document.querySelector('#randomChannelBtn');

function getFilteredChannels() {
  const q = state.query.trim().toLowerCase();

  if (!q) return channels;

  return channels.filter((channel) => {
    return (
      channel.name.toLowerCase().includes(q) ||
      channel.category.toLowerCase().includes(q) ||
      channel.language.toLowerCase().includes(q)
    );
  });
}

function renderChannelList() {
  const filteredChannels = getFilteredChannels();

  if (!filteredChannels.length) {
    channelList.innerHTML = `<div class="empty-state">没有匹配到频道</div>`;
    return;
  }

  channelList.innerHTML = filteredChannels
    .map((channel, index) => {
      const originalIndex = channels.findIndex((item) => item.id === channel.id);
      const activeClass = originalIndex === state.currentIndex ? 'active' : '';

      return `
        <button class="channel-item ${activeClass}" type="button" data-index="${originalIndex}">
          <div>
            <strong>${channel.name}</strong>
            <small>${channel.category}</small>
          </div>
          <span>${channel.language}</span>
        </button>
      `;
    })
    .join('');

  channelList.querySelectorAll('.channel-item').forEach((button) => {
    button.addEventListener('click', () => {
      const nextIndex = Number(button.dataset.index);
      state.currentIndex = nextIndex;
      render();
    });
  });
}

function renderPlayer() {
  const channel = channels[state.currentIndex];
  if (!channel) return;

  channelTitle.textContent = channel.name;
  channelCategory.textContent = channel.category;
  channelLanguage.textContent = channel.language;
  channelSource.textContent = channel.source;

  const url = channel.streamUrl || '';
  player.src = url;
  customUrlInput.value = url;
  player.load();

  if (url && url.includes('example.com')) {
    fallbackMessage.classList.remove('hidden');
  } else {
    fallbackMessage.classList.add('hidden');
  }
}

function render() {
  renderChannelList();
  renderPlayer();
}

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  renderChannelList();
});

randomChannelBtn.addEventListener('click', () => {
  const nextIndex = Math.floor(Math.random() * channels.length);
  state.currentIndex = nextIndex;
  render();
});

document.querySelector('#applyUrlBtn').addEventListener('click', () => {
  const url = customUrlInput.value.trim();
  if (!url) {
    alert('请输入有效的直播流地址');
    return;
  }

  const current = channels[state.currentIndex];
  current.streamUrl = url;
  current.source = '自定义链接';
  customUrlInput.value = url;
  renderPlayer();
  fallbackMessage.classList.add('hidden');
});

render();
