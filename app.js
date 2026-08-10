// ─── Data Store ────────────────────────────────────────────
const Store = {
  assets: [], spaces: [], workflows: [], usageHistory: [],

  load() {
    this.assets       = JSON.parse(localStorage.getItem('ima_assets')       || '[]');
    this.spaces       = JSON.parse(localStorage.getItem('ima_spaces')       || '[]');
    this.workflows    = JSON.parse(localStorage.getItem('ima_workflows')    || '[]');
    this.usageHistory = JSON.parse(localStorage.getItem('ima_usage')        || '[]');
  },

  save() {
    localStorage.setItem('ima_assets',       JSON.stringify(this.assets));
    localStorage.setItem('ima_spaces',       JSON.stringify(this.spaces));
    localStorage.setItem('ima_workflows',    JSON.stringify(this.workflows));
    localStorage.setItem('ima_usage',        JSON.stringify(this.usageHistory));
  },

  addAsset(a) {
    a.id          = Date.now().toString();
    a.created_at  = new Date().toISOString();
    a.usage_count = 0;
    this.assets.push(a);
    this.save();
    return a;
  },

  updateAsset(id, data) {
    const i = this.assets.findIndex(a => a.id === id);
    if (i !== -1) { this.assets[i] = { ...this.assets[i], ...data }; this.save(); }
  },

  deleteAsset(id) {
    this.assets = this.assets.filter(a => a.id !== id);
    this.save();
  },

  addSpace(s) {
    s.id         = Date.now().toString();
    s.created_at = new Date().toISOString();
    this.spaces.push(s);
    this.save();
    return s;
  },

  deleteSpace(id) {
    this.spaces = this.spaces.filter(s => s.id !== id);
    this.save();
  },

  addWorkflow(wf) {
    wf.id          = Date.now().toString();
    wf.created_at  = new Date().toISOString();
    wf.usage_count = 0;
    wf.assets      = wf.assets || [];
    this.workflows.push(wf);
    this.save();
    return wf;
  },

  updateWorkflow(id, data) {
    const i = this.workflows.findIndex(w => w.id === id);
    if (i !== -1) { this.workflows[i] = { ...this.workflows[i], ...data }; this.save(); }
  },

  deleteWorkflow(id) {
    this.workflows = this.workflows.filter(w => w.id !== id);
    this.save();
  },

  recordUsage(assetId) {
    const a = this.assets.find(x => x.id === assetId);
    if (a) a.usage_count = (a.usage_count || 0) + 1;
    this.save();
  },

  getAssetsBySpace(sid) {
    return this.assets.filter(a => a.location_id === sid);
  }
};

// ─── Demo Data ─────────────────────────────────────────────
function loadDemo() {
  if (Store.assets.length > 0) return;

  Store.spaces = [
    { id:'home',     name:'家',      parent_id:'', type:'building' },
    { id:'living',   name:'客厅',    parent_id:'home',  type:'room' },
    { id:'bedroom',  name:'卧室',    parent_id:'home',  type:'room' },
    { id:'studio',   name:'工作室',  parent_id:'', type:'building' },
    { id:'cabinet',  name:'摄影柜',  parent_id:'studio',type:'furniture' },
    { id:'shelf1',   name:'第一层',  parent_id:'cabinet',type:'shelf' },
    { id:'shelf2',   name:'第二层',  parent_id:'cabinet',type:'shelf' },
    { id:'desk',     name:'拍摄桌',  parent_id:'studio',type:'furniture' },
  ];

  Store.assets = [
    { id:'1', name:'Sony A7C II',         brand:'Sony',  model:'A7C II',         category:'camera',   location_id:'shelf1', image:'', notes:'2024年购入', usage_count:28 },
    { id:'2', name:'Sony 35mm f/1.4 GM',  brand:'Sony',  model:'35mm f/1.4 GM',  category:'lens',     location_id:'shelf1', image:'', notes:'', usage_count:22 },
    { id:'3', name:'DJI Mic 2',           brand:'DJI',   model:'Mic 2',          category:'audio',    location_id:'shelf2', image:'', notes:'发射器+接收器', usage_count:18 },
    { id:'4', name:'Godox SL60W',         brand:'Godox', model:'SL60W',          category:'lighting', location_id:'desk',   image:'', notes:'主灯', usage_count:15 },
    { id:'5', name:'Samsung T7 SSD 1TB',  brand:'Samsung',model:'T7 1TB',        category:'storage',  location_id:'bedroom',image:'', notes:'备份盘', usage_count:32 },
    { id:'6', name:'MacBook Pro 14"',     brand:'Apple', model:'M3 Pro',         category:'computer', location_id:'desk',   image:'', notes:'剪辑用', usage_count:45 },
    { id:'7', name:'三脚架',              brand:'Manfrotto',model:'MK055',       category:'accessory',location_id:'shelf2', image:'', notes:'', usage_count:10 },
    { id:'8', name:'Sony FE 24-70mm f/2.8',brand:'Sony', model:'24-70mm f/2.8 GM II',category:'lens',location_id:'shelf1',image:'',notes:'变焦镜头',usage_count:20 },
  ];

  Store.workflows = [
    { id:'wf1', name:'桌面科技评测',  type:'product-review', description:'标准桌面产品评测配置', assets:['1','2','4','3'], usage_count:15 },
    { id:'wf2', name:'产品开箱',      type:'unboxing',       description:'开箱视频专用配置',    assets:['1','2','4'],      usage_count:8  },
    { id:'wf3', name:'Vlog 日常',     type:'vlog',           description:'外出Vlog拍摄配置',   assets:['1','3','7'],      usage_count:12 },
    { id:'wf4', name:'桌面 setup 视频',type:'desk-setup',    description:'桌面场景拍摄',        assets:['1','2','4','6'],  usage_count:6  },
  ];

  Store.save();
}

// ─── Helpers ───────────────────────────────────────────────
function getSpacePath(spaceId) {
  const path = [];
  let cur = Store.spaces.find(s => s.id === spaceId);
  while (cur) { path.unshift(cur.name); cur = Store.spaces.find(s => s.id === cur.parent_id); }
  return path.join(' → ') || '未知位置';
}

function getCategoryLabel(cat) {
  const map = { camera:'相机', lens:'镜头', audio:'音频', lighting:'灯光', storage:'存储', computer:'电脑', accessory:'配件' };
  return map[cat] || cat || '其他';
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
window.closeModal = closeModal;

// ─── App ───────────────────────────────────────────────────
const App = {
  selectedSpace: null,

  init() {
    Store.load();
    loadDemo();
    this.bindNav();
    this.bindSearch();
    this.bindModalTriggers();
    this.bindForms();
    this.bindStudio();
    this.updateGreeting();
    this.renderAll();
  },

  updateGreeting() {
    const h = new Date().getHours();
    const el = document.getElementById('greeting');
    if (h < 12) el.textContent = '早上好';
    else if (h < 18) el.textContent = '下午好';
    else el.textContent = '晚上好';
  },

  bindNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        this.switchView(item.dataset.view);
      });
    });
    document.querySelectorAll('[data-view="assets-link"],[data-view="workflows-link"]').forEach(link => {
      link.addEventListener('click', e => { e.preventDefault(); this.switchView(link.dataset.view); });
    });
  },

  switchView(view) {
    this.currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById('view-' + view);
    if (el) el.classList.add('active');
    const nav = document.querySelector(`.nav-item[data-view="${view}"]`);
    if (nav) nav.classList.add('active');
    this.renderAll();
  },

  bindSearch() {
    const input  = document.getElementById('global-search');
    const results = document.getElementById('search-results');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 1) { results.classList.remove('active'); return; }
      const matches = [];
      Store.assets.forEach(a => {
        if (a.name.toLowerCase().includes(q) ||
            (a.brand && a.brand.toLowerCase().includes(q)) ||
            (a.model && a.model.toLowerCase().includes(q)) ||
            (a.category && a.category.toLowerCase().includes(q))) {
          matches.push({ ...a, path: a.location_id ? getSpacePath(a.location_id) : '未知位置' });
        }
      });
      if (!matches.length) {
        results.innerHTML = '<div class="search-result-item"><span style="color:var(--text-muted);padding:12px">无搜索结果</span></div>';
      } else {
        results.innerHTML = matches.slice(0,8).map(m => `
          <div class="search-result-item" onclick="App.navigateAsset('${m.id}')">
            <div class="sr-img">${m.image ? '<img src="'+m.image+'">' : '📷'}</div>
            <div class="sr-info">
              <div class="sr-name">${m.name}</div>
              <div class="sr-meta">${m.path}</div>
            </div>
          </div>`).join('');
      }
      results.classList.add('active');
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-bar')) results.classList.remove('active');
    });
  },

  navigateAsset(id) {
    document.getElementById('search-results').classList.remove('active');
    document.getElementById('global-search').value = '';
    this.switchView('assets');
    setTimeout(() => {
      const card = document.querySelector(`.asset-card[data-id="${id}"]`);
      card?.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 100);
  },

  bindModalTriggers() {
    document.getElementById('btn-add-asset').addEventListener('click',  () => this.openAssetModal());
    document.getElementById('btn-add-asset-modal').addEventListener('click', () => this.openAssetModal());
    document.getElementById('btn-add-space').addEventListener('click',  () => this.openSpaceModal());
    document.getElementById('btn-add-space-modal').addEventListener('click', () => this.openSpaceModal());
    document.getElementById('btn-add-workflow').addEventListener('click', () => this.openWorkflowModal());
  },

  bindForms() {
    document.getElementById('asset-form').addEventListener('submit', e => {
      e.preventDefault();
      const id  = document.getElementById('asset-id').value;
      const data = {
        name:        document.getElementById('asset-name').value,
        brand:       document.getElementById('asset-brand').value,
        model:       document.getElementById('asset-model').value,
        category:    document.getElementById('asset-category').value,
        location_id: document.getElementById('asset-location').value,
        image:       document.getElementById('asset-image').value,
        notes:       document.getElementById('asset-notes').value,
      };
      id ? Store.updateAsset(id, data) : Store.addAsset(data);
      closeModal('modal-asset');
      this.renderAll();
    });

    document.getElementById('space-form').addEventListener('submit', e => {
      e.preventDefault();
      Store.addSpace({
        name:      document.getElementById('space-name').value,
        parent_id: document.getElementById('space-parent').value || '',
        type:      'room',
      });
      closeModal('modal-space');
      this.renderAll();
    });

    document.getElementById('workflow-form').addEventListener('submit', e => {
      e.preventDefault();
      const checked = [];
      document.querySelectorAll('#workflow-assets input:checked').forEach(cb => checked.push(cb.value));
      const id     = document.getElementById('workflow-id').value;
      const data   = {
        name:        document.getElementById('workflow-name').value,
        type:        document.getElementById('workflow-type').value,
        description: document.getElementById('workflow-desc').value,
        assets:      checked,
      };
      id ? Store.updateWorkflow(id, data) : Store.addWorkflow(data);
      closeModal('modal-workflow');
      this.renderAll();
    });

    document.getElementById('category-filter').addEventListener('change', () => this.renderAssets());
    document.getElementById('location-filter').addEventListener('change', () => this.renderAssets());
  },

  bindStudio() {
    document.querySelectorAll('.content-type-card').forEach(card => {
      card.addEventListener('click', () => this.showStudioResult(card.dataset.type));
    });
    document.querySelectorAll('.quick-action').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView('studio');
        setTimeout(() => this.showStudioResult(btn.dataset.contentType), 100);
      });
    });
    document.getElementById('btn-back-studio').addEventListener('click', () => {
      document.getElementById('studio-result').classList.add('hidden');
      document.getElementById('studio-content-types').classList.remove('hidden');
    });
    document.getElementById('btn-save-session').addEventListener('click', () => {
      alert('拍摄已完成！设备使用次数已更新。');
      document.querySelectorAll('.result-equip-item').forEach(el => {
        const id = el.dataset.assetId;
        if (id) Store.recordUsage(id);
      });
      this.renderAll();
    });
  },

  showStudioResult(type) {
    const typeMap = { 'product-review':'产品评测','unboxing':'开箱','vlog':'Vlog','desk-setup':'桌面视频' };
    const wf = Store.workflows.find(w => w.type === type);
    document.getElementById('result-title').textContent = (typeMap[type] || type) + '方案';

    const container = document.getElementById('result-equipment');
    const assetIds  = wf ? (wf.assets || []) : [];

    if (!assetIds.length) {
      container.innerHTML = '<div class="empty-state"><p>暂无推荐设备，请先创建模板</p></div>';
    } else {
      container.innerHTML = assetIds.map(id => {
        const a = Store.assets.find(x => x.id === id);
        if (!a) return '';
        return `<div class="result-equip-item" data-asset-id="${a.id}">
          <div class="re-img">${a.image ? '<img src="'+a.image+'">' : '📷'}</div>
          <div class="re-info">
            <div class="re-name">${a.name}</div>
            <div class="re-cat">${a.brand || getCategoryLabel(a.category)}</div>
          </div>
          <div class="re-loc">${getSpacePath(a.location_id)}<span>位置</span></div>
        </div>`;
      }).join('');
    }

    document.getElementById('studio-content-types').classList.add('hidden');
    document.getElementById('studio-result').classList.remove('hidden');
  },

  openAssetModal(id) {
    document.getElementById('asset-id').value     = id || '';
    document.getElementById('modal-asset-title').textContent = id ? '编辑设备' : '添加设备';

    const loc = document.getElementById('asset-location');
    loc.innerHTML = '<option value="">请选择位置</option>' +
      Store.spaces.map(s => `<option value="${s.id}">${getSpacePath(s.id)}</option>`).join('');

    if (id) {
      const a = Store.assets.find(x => x.id === id);
      if (a) {
        document.getElementById('asset-name').value        = a.name;
        document.getElementById('asset-brand').value       = a.brand || '';
        document.getElementById('asset-model').value       = a.model || '';
        document.getElementById('asset-category').value    = a.category || 'camera';
        document.getElementById('asset-location').value    = a.location_id || '';
        document.getElementById('asset-image').value       = a.image || '';
        document.getElementById('asset-notes').value       = a.notes || '';
      }
    } else {
      document.getElementById('asset-form').reset();
    }
    document.getElementById('modal-asset').classList.add('active');
  },

  openSpaceModal() {
    const p = document.getElementById('space-parent');
    p.innerHTML = '<option value="">无（顶级空间）</option>' +
      Store.spaces.map(s => `<option value="${s.id}">${getSpacePath(s.id)}</option>`).join('');
    document.getElementById('space-form').reset();
    document.getElementById('modal-space').classList.add('active');
  },

  openWorkflowModal(id) {
    document.getElementById('workflow-id').value     = id || '';
    document.getElementById('modal-workflow-title').textContent = id ? '编辑模板' : '新建模板';

    const container = document.getElementById('workflow-assets');
    const selected  = id ? (Store.workflows.find(w => w.id === id)?.assets || []) : [];
    container.innerHTML = Store.assets.map(a => `
      <div class="wa-item ${selected.includes(a.id)?'selected':''}">
        <input type="checkbox" id="wa-${a.id}" value="${a.id}" ${selected.includes(a.id)?'checked':''}>
        <label for="wa-${a.id}">${a.name}</label>
        <span class="wa-cat">${getCategoryLabel(a.category)}</span>
      </div>`).join('');

    if (id) {
      const w = Store.workflows.find(x => x.id === id);
      if (w) {
        document.getElementById('workflow-name').value    = w.name;
        document.getElementById('workflow-type').value    = w.type || 'product-review';
        document.getElementById('workflow-desc').value    = w.description || '';
      }
    } else {
      document.getElementById('workflow-form').reset();
    }
    document.getElementById('modal-workflow').classList.add('active');
  },

  renderAll() {
    this.renderDashboard();
    this.renderAssets();
    this.renderSpaces();
    this.renderWorkflows();
    document.getElementById('asset-count').textContent = Store.assets.length;
    this.updateLocationFilter();
  },

  updateLocationFilter() {
    const sel = document.getElementById('location-filter');
    const cur = sel.value;
    sel.innerHTML = '<option value="">全部位置</option>' +
      Store.spaces.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    sel.value = cur;
  },

  renderDashboard() {
    const recent = [...Store.assets].sort((a,b) => (b.usage_count||0)-(a.usage_count||0)).slice(0,5);
    document.getElementById('recent-assets').innerHTML = recent.length
      ? recent.map(a => `<div class="recent-item" onclick="App.openAssetModal('${a.id}')">
          <div class="r-img">${a.image?'<img src="'+a.image+'">':'📷'}</div>
          <div class="r-info"><div class="r-name">${a.name}</div><div class="r-meta">${getSpacePath(a.location_id)} · ${a.usage_count||0}次</div></div>
        </div>`).join('')
      : '<div class="empty-state"><p>暂无设备</p></div>';

    const recentWf = [...Store.workflows].sort((a,b)=>(b.usage_count||0)-(a.usage_count||0)).slice(0,3);
    document.getElementById('recent-workflows').innerHTML = recentWf.length
      ? recentWf.map(w => `<div class="recent-item" onclick="App.showStudioResult('${w.type}')">
          <div class="r-img" style="background:var(--accent-light);color:var(--accent)">🎬</div>
          <div class="r-info"><div class="r-name">${w.name}</div><div class="r-meta">${(w.assets||[]).length}件设备 · ${w.usage_count||0}次</div></div>
        </div>`).join('')
      : '<div class="empty-state"><p>暂无模板</p></div>';

    const cats = {};
    Store.assets.forEach(a => { cats[a.category] = (cats[a.category]||0)+1; });
    const totalUsage = Store.assets.reduce((s,a) => s+(a.usage_count||0), 0);
    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-item"><div class="stat-value">${Store.assets.length}</div><div class="stat-label">设备总数</div></div>
      <div class="stat-item"><div class="stat-value">${Store.spaces.length}</div><div class="stat-label">空间数量</div></div>
      <div class="stat-item"><div class="stat-value">${Store.workflows.length}</div><div class="stat-label">创作模板</div></div>
      <div class="stat-item"><div class="stat-value">${totalUsage}</div><div class="stat-label">总使用次数</div></div>`;
  },

  renderAssets() {
    const cat  = document.getElementById('category-filter').value;
    const loc  = document.getElementById('location-filter').value;
    let list   = [...Store.assets];
    if (cat)  list = list.filter(a => a.category === cat);
    if (loc)  list = list.filter(a => a.location_id === loc);

    const grid = document.getElementById('assets-grid');
    if (!list.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><p>暂无设备，点击右上角 + 添加</p></div>';
      return;
    }
    grid.innerHTML = list.map(a => `
      <div class="asset-card" data-id="${a.id}">
        <div class="asset-card-img">${a.image?'<img src="'+a.image+'">':'📷'}</div>
        <div class="asset-card-body">
          <div class="asset-card-name" title="${a.name}">${a.name}</div>
          <div class="asset-card-meta">
            <span class="asset-tag">${getCategoryLabel(a.category)}</span>
            <span>· ${getSpacePath(a.location_id)}</span>
          </div>
          <div class="asset-card-actions">
            <button onclick="event.stopPropagation();App.openAssetModal('${a.id}')">编辑</button>
            <button class="del-btn" onclick="event.stopPropagation();App.deleteAsset('${a.id}')">删除</button>
          </div>
        </div>
      </div>`).join('');
  },

  deleteAsset(id) {
    if (confirm('确定要删除这个设备吗？')) {
      Store.deleteAsset(id);
      this.renderAll();
    }
  },

  renderSpaces() {
    const tree = document.getElementById('space-tree');
    const items = document.getElementById('space-items');

    function buildTree(parentId, depth) {
      const children = Store.spaces.filter(s => s.parent_id === parentId);
      if (!children.length) return '';
      return children.map(s => {
        const count = Store.getAssetsBySpace(s.id).length;
        const active = App.selectedSpace === s.id ? ' active' : '';
        return `<div class="space-tree-item${active}" style="margin-left:${depth*16}px" onclick="App.selectSpace('${s.id}')">
          <span>📁</span> ${s.name}
          ${count ? `<span class="cnt">${count}</span>` : ''}
          ${buildTree(s.id, depth+1)}
        </div>`;
      }).join('');
    }

    tree.innerHTML = buildTree('', 0) || '<div class="empty-state"><p>暂无空间</p></div>';

    if (App.selectedSpace) {
      const space = Store.spaces.find(s => s.id === App.selectedSpace);
      document.getElementById('selected-space-name').textContent = space ? space.name : '选择空间';
      const spaceAssets = Store.getAssetsBySpace(App.selectedSpace);
      if (!spaceAssets.length) {
        items.innerHTML = '<div class="empty-state"><p>该空间暂无设备</p></div>';
      } else {
        items.innerHTML = spaceAssets.map(a => `
          <div class="space-item-card" onclick="App.openAssetModal('${a.id}')">
            <div class="r-img">${a.image?'<img src="'+a.image+'">':'📷'}</div>
            <div class="r-info"><div class="r-name">${a.name}</div><div class="r-meta">${a.brand||''} ${a.model||''}</div></div>
            <span class="asset-tag">${getCategoryLabel(a.category)}</span>
          </div>`).join('');
      }
    } else {
      document.getElementById('selected-space-name').textContent = '选择空间';
      items.innerHTML = '<div class="empty-state"><p>从左侧选择一个空间</p></div>';
    }
  },

  selectSpace(id) {
    this.selectedSpace = this.selectedSpace === id ? null : id;
    this.renderSpaces();
  },

  renderWorkflows() {
    const grid = document.getElementById('workflows-grid');
    if (!Store.workflows.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><p>暂无模板，点击右上角创建</p></div>';
      return;
    }
    grid.innerHTML = Store.workflows.map(w => {
      const names = (w.assets||[]).map(id => {
        const a = Store.assets.find(x => x.id === id);
        return a ? `<span class="wf-tag">${a.name}</span>` : '';
      }).filter(Boolean).join('');
      return `<div class="workflow-card" onclick="App.showStudioResult('${w.type}')">
        <div class="wf-header">
          <div class="wf-icon">🎬</div>
          <div class="wf-actions">
            <button onclick="event.stopPropagation();App.openWorkflowModal('${w.id}')">✏️</button>
            <button class="del-btn" onclick="event.stopPropagation();App.deleteWorkflow('${w.id}')">🗑️</button>
          </div>
        </div>
        <h3>${w.name}</h3>
        <p>${w.description || '无描述'}</p>
        <div class="wf-tags">${names}</div>
        <div class="wf-footer">
          <span>${(w.assets||[]).length}件设备</span>
          <span>使用 ${w.usage_count||0} 次</span>
        </div>
      </div>`;
    }).join('');
  },

  deleteWorkflow(id) {
    if (confirm('确定要删除这个模板吗？')) {
      Store.deleteWorkflow(id);
      this.renderAll();
    }
  }
};

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); document.getElementById('global-search')?.focus(); }
});

// Init
document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
