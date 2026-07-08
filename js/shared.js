(() => {
  'use strict';

  const CONFIG = {
    publicSiteUrl: 'https://petid-dev.inkpro.cl',
    adminSiteUrl: 'https://petid-admin-dev.inkpro.cl',
    demoMode: true,
    storageKeys: {
      requests: 'petid-demo-requests-v1',
      pets: 'petid-demo-pets-v1',
      finderMessages: 'petid-demo-finder-messages-v1'
    }
  };

  const templates = [
    { id: 'guardian', name: '01 Guardián oscuro', bg1: '#111827', bg2: '#c33d2f', accent: '#c33d2f', text: '#ffffff' },
    { id: 'sport', name: '02 Deportivo rojo', bg1: '#0f1014', bg2: '#e2232a', accent: '#e2232a', text: '#ffffff' },
    { id: 'kennel', name: '03 Kennel clásico', bg1: '#183b2b', bg2: '#d9a441', accent: '#d9a441', text: '#ffffff' },
    { id: 'companion', name: '04 Compañero jovial', bg1: '#0e5970', bg2: '#ff8a3d', accent: '#ff8a3d', text: '#ffffff' },
    { id: 'urban', name: '05 Urbano tech', bg1: '#07172d', bg2: '#28c8ff', accent: '#28c8ff', text: '#ffffff' },
    { id: 'blush', name: '06 Blush elegante', bg1: '#e6a6b8', bg2: '#d9a441', accent: '#e6a6b8', text: '#28324a' },
    { id: 'lavender', name: '07 Lavanda premium', bg1: '#5b3f82', bg2: '#b9a3e3', accent: '#b9a3e3', text: '#ffffff' },
    { id: 'diva', name: '08 Diva burdeo', bg1: '#541b2d', bg2: '#c98b73', accent: '#c98b73', text: '#ffffff' },
    { id: 'sweet', name: '09 Dulce compañía', bg1: '#3e8c8a', bg2: '#ff7a74', accent: '#ff7a74', text: '#ffffff' },
    { id: 'floral', name: '10 Floral celeste', bg1: '#49759a', bg2: '#f5a9b8', accent: '#f5a9b8', text: '#ffffff' }
  ];

  const titles = [
    'El regalón de la casa',
    'Guardián destacado',
    'Campeón de siestas',
    'Mejor compañero',
    'El más comilón',
    'La leyenda'
  ];

  function read(key, fallback = []) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function slug(length = 12) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => chars[byte % chars.length]).join('');
  }

  function nextPetId() {
    const year = new Date().getFullYear();
    const pets = read(CONFIG.storageKeys.pets, []);
    const requests = read(CONFIG.storageKeys.requests, []);
    let max = 0;
    [...pets, ...requests].forEach(item => {
      const match = String(item.petId || '').match(/(\d+)$/);
      if (match) max = Math.max(max, Number(match[1]));
    });
    return `PETID-${year}-${String(max + 1).padStart(6, '0')}`;
  }

  function nextRequestId() {
    return `SOL-${new Date().getFullYear()}-${String(Date.now()).slice(-7)}`;
  }

  function buildPublicPetUrl(publicSlug) {
    return `${CONFIG.publicSiteUrl.replace(/\/$/, '')}/p/${encodeURIComponent(publicSlug)}`;
  }

  const publicPetUrl = buildPublicPetUrl;

  function formatDate(value) {
    if (!value) return 'No informada';
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('es-CL').format(date);
  }

  function phoneHref(value) {
    return String(value || '').replace(/[^+\d]/g, '');
  }

  function whatsappHref(value, message = '') {
    const number = String(value || '').replace(/\D/g, '');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function imageFileToDataUrl(file, maxSide = 1200, quality = .86) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) return reject(new Error('Formato no permitido. Use JPG, PNG o WebP.'));
      if (file.size > 8 * 1024 * 1024) return reject(new Error('La imagen supera 8 MB.'));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('La imagen no es válida.'));
        img.onload = () => {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  function renderQr(container, text) {
    if (!container) return;
    if (window.PetIDQR?.toSvg) {
      container.innerHTML = window.PetIDQR.toSvg(text, { margin: 3 });
    } else {
      container.textContent = 'QR no disponible';
    }
  }

  function templateButtons(container, options = {}) {
    if (!container) return;
    const multiple = Boolean(options.multiple);
    const max = options.max || 3;
    const selected = new Set(options.selected || []);
    container.innerHTML = '';
    templates.forEach(template => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `template-option${selected.has(template.id) ? ' active' : ''}`;
      button.dataset.template = template.id;
      button.innerHTML = `
        <div class="template-thumb" style="--theme-bg1:${template.bg1};--theme-bg2:${template.bg2};--theme-accent:${template.accent};--theme-text:${template.text}"></div>
        <strong>${escapeHtml(template.name)}</strong>`;
      button.addEventListener('click', () => {
        if (multiple) {
          if (selected.has(template.id)) selected.delete(template.id);
          else if (selected.size < max) selected.add(template.id);
          else return options.onLimit?.(max);
          button.classList.toggle('active', selected.has(template.id));
          options.onChange?.([...selected]);
        } else {
          selected.clear();
          selected.add(template.id);
          [...container.querySelectorAll('.template-option')].forEach(item => item.classList.toggle('active', item === button));
          options.onChange?.(template.id);
        }
      });
      container.appendChild(button);
    });
  }

  function createDemoPet() {
    return {
      id: 'demo-luna',
      petId: 'PETID-2026-000001',
      publicSlug: 'demo-luna',
      name: 'Luna',
      petType: 'Perra',
      sex: 'Hembra',
      breed: 'Mestiza',
      birth: '2022-05-18',
      owner: 'Familia PetID',
      phone: '+56 9 5555 0101',
      whatsapp: '+56 9 5555 0101',
      email: 'demo@petid.cl',
      city: 'Santiago',
      medicalNotes: 'Sin información médica pública.',
      behaviorNotes: 'Es amistosa, pero puede estar asustada.',
      internalNotes: '',
      title: 'Mejor compañera',
      template: 'floral',
      photoData: '',
      photoFit: 'cover',
      photoZoom: 105,
      photoBrightness: 110,
      photoX: 50,
      photoY: 50,
      isPublic: true,
      isLost: true,
      status: 'extraviada',
      lostSince: '2026-07-01',
      lastSeenLocation: 'Sector Parque Bicentenario, Vitacura',
      lostMessage: 'Si la encuentra, por favor comuníquese con su familia.',
      rewardText: '',
      privacy: {
        showOwnerName: false,
        showPhone: true,
        showWhatsapp: true,
        showEmail: false,
        showCity: true,
        showMedicalNotes: true,
        showBehaviorNotes: true
      },
      paymentStatus: 'pagado',
      productionStatus: 'entregada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function ensureDemoData() {
    const pets = read(CONFIG.storageKeys.pets, []);
    if (!pets.some(pet => pet.publicSlug === 'demo-luna')) {
      pets.unshift(createDemoPet());
      write(CONFIG.storageKeys.pets, pets);
    }
  }

  function findPetBySlug(publicSlug) {
    const pets = read(CONFIG.storageKeys.pets, []);
    return pets.find(pet => pet.publicSlug === publicSlug) || (publicSlug === 'demo-luna' ? createDemoPet() : null);
  }

  function upsertPet(pet) {
    const pets = read(CONFIG.storageKeys.pets, []);
    const index = pets.findIndex(item => item.id === pet.id || item.petId === pet.petId);
    const normalized = { ...pet, updatedAt: new Date().toISOString() };
    if (index >= 0) pets[index] = normalized;
    else pets.unshift({ ...normalized, id: normalized.id || crypto.randomUUID(), createdAt: normalized.createdAt || new Date().toISOString() });
    write(CONFIG.storageKeys.pets, pets);
    return normalized;
  }

  window.PetID = {
    CONFIG,
    templates,
    titles,
    read,
    write,
    escapeHtml,
    slug,
    nextPetId,
    nextRequestId,
    buildPublicPetUrl,
    publicPetUrl,
    formatDate,
    phoneHref,
    whatsappHref,
    imageFileToDataUrl,
    renderQr,
    templateButtons,
    ensureDemoData,
    findPetBySlug,
    upsertPet,
    createDemoPet
  };

  ensureDemoData();
})();
