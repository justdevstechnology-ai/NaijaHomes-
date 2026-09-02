import { Store } from '../storage.js';
import { $, $$, toast } from '../helpers.js';
import { getStates, getLGAs, getStateLabel } from '../data/nigeria.js';
import { showPage } from './page-shell.js';
import { resetFilters } from '../state.js';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';
const MAX_IMAGE_DIMENSION = 1280;
const IMAGE_QUALITY = 0.82;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB — the raw file, before compression

function populateStateSelect() {
  const stateSelect = $('#post-state');
  if (!stateSelect || stateSelect.dataset.filled) return;
  stateSelect.innerHTML = '<option value="">Select a state</option>' +
    getStates().map(s => `<option value="${s}">${getStateLabel(s)}</option>`).join('');
  stateSelect.dataset.filled = 'true';
}

function populateLgaSelect(state, selectedLga) {
  const lgaSelect = $('#post-lga');
  if (!lgaSelect) return;
  const lgas = getLGAs(state);
  lgaSelect.disabled = !state;
  lgaSelect.innerHTML = state
    ? '<option value="">Select an LGA</option>' + lgas.map(l => `<option value="${l}" ${l === selectedLga ? 'selected' : ''}>${l}</option>`).join('')
    : '<option value="">Select a state first</option>';
}

// Read an uploaded image file and downscale/compress it via canvas so a
// phone photo doesn't blow past localStorage's quota. Falls back to the
// raw data URL if canvas processing fails for any reason.
function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('Could not read file'));
    reader.onload = () => {
      const rawDataUrl = reader.result;
      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            height = Math.round(height * (MAX_IMAGE_DIMENSION / width));
            width = MAX_IMAGE_DIMENSION;
          } else {
            width = Math.round(width * (MAX_IMAGE_DIMENSION / height));
            height = MAX_IMAGE_DIMENSION;
          }
        }
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
        } catch (e) {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// Keep the hidden #post-image field, the preview thumbnail, and the
// placeholder/remove-button visibility all in sync from one place.
function setImagePreview(url) {
  const hidden = $('#post-image');
  const preview = $('#post-image-preview');
  const placeholder = $('#image-upload-placeholder');
  const removeBtn = $('#image-remove-btn');
  if (hidden) hidden.value = url || '';
  if (url) {
    if (preview) { preview.src = url; preview.classList.remove('hidden'); }
    placeholder?.classList.add('hidden');
    removeBtn?.classList.remove('hidden');
  } else {
    if (preview) { preview.src = ''; preview.classList.add('hidden'); }
    placeholder?.classList.remove('hidden');
    removeBtn?.classList.add('hidden');
  }
}

// Wire the state -> LGA cascade and the image upload controls once (these
// listeners stay attached for the lifetime of the page)
export function initPostPropertyForm() {
  populateStateSelect();
  const stateSelect = $('#post-state');
  if (stateSelect && !stateSelect.dataset.wired) {
    stateSelect.addEventListener('change', () => populateLgaSelect(stateSelect.value, null));
    stateSelect.dataset.wired = 'true';
  }

  const fileInput = $('#post-image-file');
  const urlField = $('#post-image-url');

  if (fileInput && !fileInput.dataset.wired) {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      if (file.size > MAX_UPLOAD_BYTES) {
        toast('That image is too large — please choose a file under 8MB');
        fileInput.value = '';
        return;
      }
      try {
        const dataUrl = await resizeImageFile(file);
        setImagePreview(dataUrl);
        if (urlField) urlField.value = '';
      } catch (e) {
        toast('Could not read that image — please try another file');
      }
    });
    fileInput.dataset.wired = 'true';
  }

  if (urlField && !urlField.dataset.wired) {
    urlField.addEventListener('input', () => {
      if (urlField.value) {
        setImagePreview(urlField.value);
        if (fileInput) fileInput.value = '';
      }
    });
    urlField.dataset.wired = 'true';
  }

  const removeBtn = $('#image-remove-btn');
  if (removeBtn && !removeBtn.dataset.wired) {
    removeBtn.addEventListener('click', () => {
      setImagePreview('');
      if (fileInput) fileInput.value = '';
      if (urlField) urlField.value = '';
    });
    removeBtn.dataset.wired = 'true';
  }
}

export function renderPostPropertyPage(prop) {
  initPostPropertyForm();

  const titleEl = $('#post-property-page-title');
  if (titleEl) titleEl.textContent = prop ? 'Edit property' : 'Post a property';

  const id = prop ? prop.id : '';
  const title = prop ? prop.title : '';
  const purpose = prop ? prop.purpose : 'rent';
  const type = prop ? prop.type : 'apartment';
  const price = prop ? prop.price : '';
  const state = prop ? prop.state : '';
  const lga = prop ? (prop.lga || '') : '';
  const area = prop ? (prop.location || '').split(',')[0].trim() : '';
  const bedrooms = prop ? prop.beds : 2;
  const bathrooms = prop ? prop.baths : 2;
  const size = prop ? parseInt(prop.area) || 100 : 100;
  const image = prop ? prop.image : '';
  const description = prop ? prop.description : '';
  const amenities = prop ? prop.amenities : [];

  $('#post-id').value = id;
  $('#post-title').value = title;
  $('#post-purpose').value = purpose;
  $('#post-type').value = type;
  $('#post-price').value = price;
  $('#post-state').value = state;
  populateLgaSelect(state, lga);
  $('#post-area').value = area;
  $('#post-bedrooms').value = bedrooms;
  $('#post-bathrooms').value = bathrooms;
  $('#post-size').value = size;

  // Image: show the preview if editing a property that already has one.
  // Only ever put a plain http(s) URL in the fallback text field — never
  // a data: URL, which would just dump a huge base64 string into a text box.
  setImagePreview(image || '');
  const fileInput = $('#post-image-file');
  const urlField = $('#post-image-url');
  if (fileInput) fileInput.value = '';
  if (urlField) urlField.value = (image && !image.startsWith('data:')) ? image : '';

  $('#post-description').value = description;

  $$('input[name="post-amenity"]').forEach(cb => {
    cb.checked = amenities.includes(cb.value);
  });

  showPage('page-post-property');
}

export function collectPostPropertyForm() {
  const stateVal = $('#post-state').value;
  const lgaVal = $('#post-lga').value;
  const area = $('#post-area').value;
  return {
    id: $('#post-id').value || 'user-' + Date.now(),
    title: $('#post-title').value,
    purpose: $('#post-purpose').value,
    type: $('#post-type').value,
    price: +$('#post-price').value,
    location: lgaVal ? `${area}, ${lgaVal}` : area,
    state: stateVal,
    lga: lgaVal,
    beds: +$('#post-bedrooms').value,
    baths: +$('#post-bathrooms').value,
    area: $('#post-size').value + ' m²',
    image: $('#post-image').value || DEFAULT_IMAGE,
    description: $('#post-description').value,
    amenities: $$('input[name="post-amenity"]:checked').map(el => el.value),
    ownerId: 'demo'
  };
}

export function submitPostPropertyForm() {
  const data = collectPostPropertyForm();
  if (!data.state) {
    toast('Please choose a state');
    return null;
  }
  const isNew = data.id.startsWith('user-') && !Store.properties().some(p => p.id === data.id);
  if (isNew) {
    Store.addProperty(data);
    toast('Property published');
  } else {
    Store.updateProperty(data);
    toast('Listing updated');
  }
  resetFilters();
  return data;
}
