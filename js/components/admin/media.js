import { el, clear, icon } from '../../utils/dom.js';
import { loadMediaAssets, saveMediaAssets } from '../../services/data.js';

const MEDIA_CONTAINER_ID = 'media-view';
const MODAL_MEDIA_ID = 'media-modal-grid';
const MAIN_GRID_ID = 'media-grid-wrapper';
const FILE_INPUT_ID = 'media-hidden-upload';
const iconMap = {
  image: 'image',
  pdf: 'file-text',
  doc: 'file-text',
  docx: 'file-text',
  ppt: 'file-bar-chart',
  pptx: 'file-bar-chart',
  xls: 'file-spreadsheet',
  xlsx: 'file-spreadsheet',
  default: 'file'
};

let assets = [];
let searchQuery = '';
let selectedAsset = null;
let mediaCallback = null;

export const getSelectedAsset = () => selectedAsset;

export const renderMedia = async () => {
  const container = el('div', {
    id: MEDIA_CONTAINER_ID,
    class: 'flex flex-col space-y-6 flex-1 min-h-0 animate-in fade-in slide-in-from-right-2 duration-300'
  }, [
    renderHeader(),
    el('div', { class: 'relative flex flex-1 min-h-0 overflow-hidden' }, [
        el('div', {
            id: 'media-grid-wrapper',
            class: 'flex-1 min-w-0'
        }, [await renderGrid()]), 
        renderSelectedInfoPanel() 
    ]),
    renderHiddenFileInput()
  ]);
  return container;
};
const renderHeader = () => {
  return el('div', {
    class: 'flex flex-col md:flex-row md:items-center md:justify-between gap-4'
  }, [
    el('div', {}, [
      el('h2', { class: 'text-2xl font-black' }, 'Media Library'),
      el('p', { class: 'text-sm text-gray-500' }, 'Static assets referenced across the site.')
    ]),
    el('div', { class: 'flex gap-2 items-center' }, [
      renderSearch(MEDIA_CONTAINER_ID),
      el('button', {
        onclick: () => document.getElementById(FILE_INPUT_ID)?.click(),
        class: 'px-4 py-2 rounded-xl border border-white/10 text-sm text-gray-300 hover:border-white/30'
      }, [icon('upload', 'w-4 h-4 mr-1 inline'), 'Upload'])
    ])
  ]);
};
const renderSearch = (containerId) => {
  return el('input', {
    type: 'text',
    placeholder: 'Search assets...',
    value: searchQuery,
    oninput: (e) => { 
        searchQuery = e.target.value.toLowerCase(); 
        refreshGrid(containerId === MEDIA_CONTAINER_ID ? MAIN_GRID_ID : MODAL_MEDIA_ID); 
    },
    class: 'w-full md:w-64 px-4 py-2 rounded-xl bg-gray-900 border border-white/10 text-sm outline-none focus:border-blue-500 transition-all'
  });
};
const renderGrid = async (containerId = MEDIA_CONTAINER_ID) => {
  assets = await loadMediaAssets();
  const filtered = assets.filter(a => a.id.toLowerCase().includes(searchQuery) || a.alt.toLowerCase().includes(searchQuery));
  if (!filtered.length) return el('p', { class: 'text-gray-500 text-sm' }, 'No assets found.');
  const grid = el('div', { class: `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 min-w-0 overflow-y-auto`});
  filtered.forEach(asset => grid.appendChild(renderAssetCard(asset, containerId)));
  if (window.lucide) window.lucide.createIcons();
  return grid;
};
const renderAssetCard = (asset, containerId = MEDIA_CONTAINER_ID) => {
  const isActive = selectedAsset?.id === asset.id;
  return el('div', { class: 'relative group rounded-xl overflow-hidden border transition-all' }, [
    el('button', {
      type: 'button',
      'data-asset-id': asset.id,
      onclick: () => handleAssetSelect(asset),
      class: getAssetButtonClass(asset)
    }, [
      asset.type === 'image'
        ? el('img', { src: asset.src, alt: asset.alt, class: 'aspect-square object-cover w-full' })
        : el('div', { class: 'aspect-square flex items-center justify-center bg-gray-800 text-gray-500' },
            icon(iconMap[asset.type] || iconMap.default, 'w-6 h-6')
          )
    ]),
    el('div', { class: 'absolute inset-x-0 bottom-0 bg-black/70 text-[10px] text-white px-2 py-1 truncate' }, asset.id),
    el('button', {
      type: 'button',
      onclick: async (e) => {
        e.stopPropagation();
        if (!confirm(`Delete asset "${asset.id}"? This cannot be undone.`)) return;
        assets = assets.filter(a => a.id !== asset.id);
        await saveMediaAssets(assets);
        if (selectedAsset?.id === asset.id) {
            selectedAsset = null;
            updateSelectedInfoUI();
        }
        refreshGrid(containerId === MEDIA_CONTAINER_ID ? MAIN_GRID_ID : MODAL_MEDIA_ID);
      },
      class: 'absolute top-0 right-0 z-10 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-red-500'
    }, icon('trash-2', 'w-4 h-4'))
  ]);
};
const handleAssetSelect = (asset) => {
  selectedAsset = asset;
  if (typeof mediaCallback === 'function') {
    mediaCallback(asset);
    closeMediaModal();
    return;
  }
  updateAssetSelectionUI();
};
const updateAssetSelectionUI = () => {
  document.querySelectorAll('[data-asset-id]').forEach(btn => {
    const isActive = btn.dataset.assetId === selectedAsset?.id;
    btn.classList.toggle('border-blue-500', isActive);
    btn.classList.toggle('ring-2', isActive);
    btn.classList.toggle('ring-blue-500/40', isActive);
    btn.classList.toggle('border-white/10', !isActive);
  });
  updateSelectedInfoUI();
};
const renderSelectedInfoPanel = () => {
  return el('aside', {
    id: 'media-info-panel',
    class: ` w-1/2 max-w-lg  flex-shrink-0 hidden border-l border-white/10 bg-gray-900 flex flex-col  min-h-0 `
  }, [
    el('div', {
      class: 'flex items-center justify-between px-4 py-3 border-b border-white/10'
    }, [
      el('h4', { class: 'text-sm font-semibold text-gray-200' }, 'Asset details'),
      el('button', {
        onclick: () => {
          selectedAsset = null;
          updateSelectedInfoUI();
        },
        class: 'p-2 rounded-lg text-gray-400 hover:bg-gray-700/50'
      }, icon('x', 'w-4 h-4'))
    ]),
    el('div', {
      id: 'media-info-content',
      class: 'flex-1 flex flex-col min-h-0'
    })
  ]);
};
const updateSelectedInfoUI = () => {
  const panel = document.getElementById('media-info-panel');
  const content = document.getElementById('media-info-content');
  if (!panel || !content) return;
  clear(content);
  if (!selectedAsset) {
    panel.classList.add('hidden');
    return;
  }
  panel.classList.remove('hidden');
  content.append(
    el('div', { class: 'flex-none p-4' }, [
      selectedAsset.type === 'image'
        ? el('img', {
            src: selectedAsset.src,
            alt: selectedAsset.alt,
            class: 'w-full h-56 object-contain rounded-xl bg-black/40'
          })
        : el('div', {
            class: 'w-full h-56 flex items-center justify-center text-gray-400 bg-black/40 rounded-xl'
          }, icon(iconMap[selectedAsset.type] || iconMap.default, 'w-16 h-16'))
    ]),
    el('div', {
      class: 'flex-1 overflow-y-auto p-4 space-y-3 border-t border-white/10'
    }, [
      metaRow('File name', selectedAsset.id),
      metaRow('Alt text', selectedAsset.alt || '—'),
      metaRow('Type', selectedAsset.type),
      metaRow('Source', selectedAsset.src)
    ])
  );
  const gridWrapper = document.getElementById('media-grid-wrapper');
  if (gridWrapper) gridWrapper.classList.toggle('mr-4', !!selectedAsset);
};
const metaRow = (label, value) => {
  return el('div', { class: 'space-y-1' }, [
    el('div', { class: 'text-[11px] uppercase tracking-wide text-gray-400' }, label),
    el('div', { class: 'text-sm text-gray-200 break-all' }, value)
  ]);
};
const getAssetButtonClass = (asset) => {
  const isActive = selectedAsset?.id === asset.id;
  return `
    w-full h-full relative transition-all
    rounded-xl border
    ${isActive
      ? 'border-blue-500 ring-2 ring-blue-500/40'
      : 'border-white/10 hover:border-white/30'}
  `;
};

export const openMediaManager = async ({ onSelect }) => {
  mediaCallback = onSelect;
  searchQuery = '';
  selectedAsset = null;
  document.body.style.overflow = 'hidden';
  document.body.appendChild(await renderMediaModal());
  if (window.lucide) window.lucide.createIcons();
};
const renderMediaModal = async () => {
  return el('div', {
    class: 'media-modal fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center'
  }, [
    el('div', { class: 'w-full max-w-5xl max-h-[90vh] bg-gray-900 rounded-3xl border border-white/10 shadow-2xl flex flex-col' }, [
      renderModalHeader(),
      el('div', {  class: 'flex-1 p-6 overflow-y-auto', id: MODAL_MEDIA_ID }, [
        el('div', { class: 'flex justify-end mb-6' }, [renderSearch(MODAL_MEDIA_ID)]),
        await renderGrid(MODAL_MEDIA_ID)
      ]),
      renderModalFooter(),
      renderHiddenFileInput()
    ])
  ]);
};
const renderModalHeader = () => {
  return el('div', { class: 'flex items-center justify-between px-6 py-4 border-b border-white/10' }, [
    el('h3', { class: 'text-lg font-black' }, 'Media Manager'),
    el('button', { onclick: closeMediaModal, class: 'p-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-gray-500 transition-colors' },
      icon('x', 'w-5 h-5'))
  ]);
};
const renderModalFooter = () => {
  return el('div', { class: 'flex items-center justify-between gap-4 px-6 py-4 border-t border-white/10 bg-black/40' }, [
    el('div', { class: 'text-xs text-gray-400 truncate' },
      selectedAsset ? `Selected: ${selectedAsset.id}` : 'No media selected'
    ),
    el('div', { class: 'flex items-center gap-3' }, [
      el('button', {
        onclick: () => document.getElementById(FILE_INPUT_ID).click(),
        class: 'px-4 py-2 text-sm rounded-xl border border-white/10 text-gray-300 hover:border-white/30'
      }, [icon('upload', 'w-4 h-4 inline mr-2'), 'Upload']),
      el('button', {
        type: 'button',
        onclick: closeMediaModal,
        class: 'px-4 py-2 text-sm rounded-xl border border-white/10 hover:border-white/30 text-gray-400'
      }, 'Cancel')
    ])
  ]);
};
const renderHiddenFileInput = () => {
  return el('input', {
    id: FILE_INPUT_ID,
    type: 'file',
    accept: 'image/*',
    class: 'hidden',
    onchange: handleFileSelect
  });
};
const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = '';
  const reader = new FileReader();
  reader.onload = async () => {
    const previewAsset = {
      id: file.name,
      src: reader.result,
      alt: file.name,
      type: 'image',
      _temp: true
    };
    assets.unshift(previewAsset);
    selectedAsset = previewAsset;
    await saveMediaAssets(assets);
    refreshAllMediaViews();
  };
  reader.readAsDataURL(file);
};
const refreshAllMediaViews = () => {
  const main = document.getElementById(MEDIA_CONTAINER_ID);
  const modal = document.getElementById(MODAL_MEDIA_ID);
  if (main) refreshGrid(MAIN_GRID_ID);
  if (modal) refreshGrid(MODAL_MEDIA_ID);
};
const refreshGrid = async (gridId) => {
  const container = document.getElementById(gridId);
  if (!container) return;
  clear(container);
  container.appendChild(
    await renderGrid(gridId === MODAL_MEDIA_ID ? MODAL_MEDIA_ID : MEDIA_CONTAINER_ID)
  );
  if (window.lucide) window.lucide.createIcons();
};
const closeMediaModal = () => {
  assets = assets.filter(a => !a._temp);
  mediaCallback = null;
  selectedAsset = null;
  document.querySelector('.media-modal')?.remove();
  document.body.style.overflow = '';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMediaModal();
});