(() => {
  'use strict';
  const P = window.PetID;
  const ids = ['petId','publicSlug','name','petType','sex','breed','birth','title','owner','phone','whatsapp','email','city','paymentStatus','productionStatus','medicalNotes','behaviorNotes','internalNotes','lostSince','lastSeenLocation','lostMessage','rewardText','photoFit','photoZoom','photoBrightness','photoX','photoY'];
  const el = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  let currentId = '';
  let sourceRequestId = '';
  let template = 'guardian';
  let photoData = '';

  P.titles.forEach(title => {
    const option = document.createElement('option'); option.value = title; option.textContent = title; el.title.appendChild(option);
  });

  function bool(id) { return document.getElementById(id).checked; }
  function setBool(id, value) { document.getElementById(id).checked = Boolean(value); }

  function resetForm() {
    currentId = '';
    sourceRequestId = '';
    template = 'guardian';
    photoData = '';
    document.getElementById('adminForm').reset();
    el.petId.value = P.nextPetId();
    el.publicSlug.value = P.slug();
    el.title.value = P.titles[0];
    el.photoFit.value = 'cover'; el.photoZoom.value = 105; el.photoBrightness.value = 110; el.photoX.value = 50; el.photoY.value = 50;
    setBool('isPublic', true); setBool('showPhone', true); setBool('showWhatsapp', true); setBool('showCity', true); setBool('showMedicalNotes', true); setBool('showBehaviorNotes', true);
    setBool('isLost', false); document.getElementById('lostFields').classList.add('hidden');
    document.getElementById('editorStatus').textContent = 'Nuevo';
    document.getElementById('frontPhoto').classList.add('hidden'); document.getElementById('frontPlaceholder').classList.remove('hidden');
    P.templateButtons(document.getElementById('adminTemplates'), { selected: [template], onChange: value => { template = value; updatePreview(); } });
    updatePreview();
  }

  function dataFromForm() {
    return {
      id: currentId || crypto.randomUUID(), sourceRequestId,
      petId: el.petId.value || P.nextPetId(), publicSlug: el.publicSlug.value || P.slug(),
      name: el.name.value.trim() || 'Sin nombre', petType: el.petType.value, sex: el.sex.value, breed: el.breed.value.trim(), birth: el.birth.value,
      title: el.title.value, owner: el.owner.value.trim(), phone: el.phone.value.trim(), whatsapp: el.whatsapp.value.trim(), email: el.email.value.trim(), city: el.city.value.trim(),
      medicalNotes: el.medicalNotes.value.trim(), behaviorNotes: el.behaviorNotes.value.trim(), internalNotes: el.internalNotes.value.trim(),
      template, photoData, photoFit: el.photoFit.value, photoZoom: Number(el.photoZoom.value), photoBrightness: Number(el.photoBrightness.value), photoX: Number(el.photoX.value), photoY: Number(el.photoY.value),
      isPublic: bool('isPublic'), isLost: bool('isLost'), status: bool('isLost') ? 'extraviada' : 'activa',
      lostSince: el.lostSince.value, lastSeenLocation: el.lastSeenLocation.value.trim(), lostMessage: el.lostMessage.value.trim(), rewardText: el.rewardText.value.trim(),
      privacy: { showOwnerName: bool('showOwnerName'), showPhone: bool('showPhone'), showWhatsapp: bool('showWhatsapp'), showEmail: bool('showEmail'), showCity: bool('showCity'), showMedicalNotes: bool('showMedicalNotes'), showBehaviorNotes: bool('showBehaviorNotes') },
      paymentStatus: el.paymentStatus.value, productionStatus: el.productionStatus.value
    };
  }

  function applyData(data) {
    currentId = data.id || '';
    sourceRequestId = data.sourceRequestId || data.id || '';
    el.petId.value = data.petId || P.nextPetId(); el.publicSlug.value = data.publicSlug || P.slug();
    el.name.value = data.name || data.petName || ''; el.petType.value = data.petType || 'Perro'; el.sex.value = data.sex || 'Macho'; el.breed.value = data.breed || ''; el.birth.value = data.birth || '';
    el.title.value = data.title || P.titles[0]; el.owner.value = data.owner || ''; el.phone.value = data.phone || ''; el.whatsapp.value = data.whatsapp || ''; el.email.value = data.email || ''; el.city.value = data.city || '';
    el.medicalNotes.value = data.medicalNotes || ''; el.behaviorNotes.value = data.behaviorNotes || ''; el.internalNotes.value = data.internalNotes || '';
    el.paymentStatus.value = data.paymentStatus || 'pendiente'; el.productionStatus.value = data.productionStatus || 'solicitud-recibida';
    template = data.template || data.selectedTemplate || data.preferredTemplates?.[0] || 'guardian'; photoData = data.photoData || '';
    el.photoFit.value = data.photoFit || 'cover'; el.photoZoom.value = data.photoZoom ?? 105; el.photoBrightness.value = data.photoBrightness ?? 110; el.photoX.value = data.photoX ?? 50; el.photoY.value = data.photoY ?? 50;
    setBool('isPublic', data.isPublic ?? true); setBool('isLost', data.isLost ?? false);
    el.lostSince.value = data.lostSince || ''; el.lastSeenLocation.value = data.lastSeenLocation || ''; el.lostMessage.value = data.lostMessage || ''; el.rewardText.value = data.rewardText || '';
    const privacy = data.privacy || {};
    ['showOwnerName','showPhone','showWhatsapp','showEmail','showCity','showMedicalNotes','showBehaviorNotes'].forEach(id => setBool(id, privacy[id] ?? ['showPhone','showWhatsapp','showCity','showMedicalNotes','showBehaviorNotes'].includes(id)));
    document.getElementById('lostFields').classList.toggle('hidden', !bool('isLost'));
    document.getElementById('editorStatus').textContent = data.requestId ? `Desde ${data.requestId}` : 'Editando';
    P.templateButtons(document.getElementById('adminTemplates'), { selected: [template], onChange: value => { template = value; updatePreview(); } });
    updatePreview();
  }

  function updatePreview() {
    const d = dataFromForm();
    ['frontCard','backCard'].forEach(id => document.getElementById(id).className = `credential theme-${template}`);
    document.getElementById('frontName').textContent = d.name.toUpperCase();
    document.getElementById('frontType').textContent = `${d.petType} · ${d.sex}`;
    document.getElementById('frontId').textContent = d.petId; document.getElementById('frontBirth').textContent = P.formatDate(d.birth); document.getElementById('frontBreed').textContent = d.breed || 'No informada'; document.getElementById('frontOwner').textContent = d.owner || 'No informado';
    document.getElementById('backId').textContent = d.petId; document.getElementById('backPhone').textContent = d.phone || d.whatsapp || 'No informado'; document.getElementById('backCity').textContent = d.city || 'No informada'; document.getElementById('backTitle').textContent = d.title || '';
    const url = P.buildPublicPetUrl(d.publicSlug); document.getElementById('backUrl').textContent = url.replace(/^https?:\/\//,''); document.getElementById('openPublic').href = url; P.renderQr(document.getElementById('credentialQr'), url); P.renderQr(document.getElementById('tagQr'), url);
    document.getElementById('tagName').textContent = d.name || 'PETID'; document.getElementById('tagCode').textContent = d.petId;
    const image = document.getElementById('frontPhoto');
    if (photoData) { image.src = photoData; image.classList.remove('hidden'); document.getElementById('frontPlaceholder').classList.add('hidden'); } else { image.classList.add('hidden'); document.getElementById('frontPlaceholder').classList.remove('hidden'); }
    image.style.objectFit = d.photoFit; image.style.objectPosition = `${d.photoX}% ${d.photoY}%`; image.style.transform = `scale(${d.photoZoom / 100})`; image.style.filter = `brightness(${d.photoBrightness / 100})`;
    document.getElementById('zoomValue').textContent = `${d.photoZoom}%`; document.getElementById('brightnessValue').textContent = `${d.photoBrightness}%`; document.getElementById('xValue').textContent = `${d.photoX}%`; document.getElementById('yValue').textContent = `${d.photoY}%`;
  }

  function renderRequests() {
    const query = document.getElementById('requestSearch').value.toLowerCase();
    const requests = P.read(P.CONFIG.storageKeys.requests, []);
    document.getElementById('requestCount').textContent = requests.length;
    const body = document.getElementById('requestsTable'); body.innerHTML = '';
    requests.filter(r => JSON.stringify([r.requestId,r.petName,r.owner,r.phone,r.email]).toLowerCase().includes(query)).forEach(request => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${P.escapeHtml(request.requestId)}</td><td>${P.escapeHtml(request.petName)}</td><td><span class="badge ${request.paymentStatus === 'pagado' ? 'success' : 'warning'}">${P.escapeHtml(request.paymentStatus)}</span></td><td><button type="button">Cargar</button></td>`;
      tr.querySelector('button').addEventListener('click', () => applyData(request)); body.appendChild(tr);
    });
    if (!body.children.length) body.innerHTML = '<tr><td colspan="4" class="muted">No hay solicitudes en este navegador.</td></tr>';
  }

  function renderPets() {
    const query = document.getElementById('petSearch').value.toLowerCase();
    const pets = P.read(P.CONFIG.storageKeys.pets, []);
    document.getElementById('petCount').textContent = pets.length;
    const body = document.getElementById('petsTable'); body.innerHTML = '';
    pets.filter(p => JSON.stringify([p.petId,p.name,p.owner,p.phone,p.city]).toLowerCase().includes(query)).forEach(pet => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${P.escapeHtml(pet.petId)}</td><td>${P.escapeHtml(pet.name)}</td><td>${P.escapeHtml(pet.owner || '')}</td><td><span class="badge ${pet.isLost ? 'danger' : 'success'}">${pet.isLost ? 'Extraviada' : 'Activa'}</span></td><td><div class="row-actions"><button data-action="edit">Editar</button><button data-action="open">Abrir QR</button></div></td>`;
      tr.querySelector('[data-action="edit"]').addEventListener('click', () => applyData(pet));
      tr.querySelector('[data-action="open"]').addEventListener('click', () => window.open(P.buildPublicPetUrl(pet.publicSlug), '_blank', 'noopener'));
      body.appendChild(tr);
    });
    if (!body.children.length) body.innerHTML = '<tr><td colspan="5" class="muted">No se encontraron registros.</td></tr>';
  }

  document.getElementById('adminForm').addEventListener('submit', event => {
    event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
    const saved = P.upsertPet(dataFromForm()); currentId = saved.id;
    if (sourceRequestId) {
      const requests = P.read(P.CONFIG.storageKeys.requests, []); const index = requests.findIndex(r => r.id === sourceRequestId || r.requestId === sourceRequestId);
      if (index >= 0) { requests[index] = { ...requests[index], paymentStatus: saved.paymentStatus, productionStatus: saved.productionStatus, petId: saved.petId, publicSlug: saved.publicSlug, updatedAt: new Date().toISOString() }; P.write(P.CONFIG.storageKeys.requests, requests); }
    }
    const message = document.getElementById('saveMessage'); message.textContent = `Registro ${saved.petId} guardado en modo demostración.`; message.classList.remove('hidden');
    renderRequests(); renderPets(); updatePreview();
  });

  document.getElementById('adminPhoto').addEventListener('change', async event => {
    try { photoData = await P.imageFileToDataUrl(event.target.files?.[0]); updatePreview(); } catch (error) { alert(error.message); event.target.value = ''; }
  });
  document.getElementById('isLost').addEventListener('change', () => { document.getElementById('lostFields').classList.toggle('hidden', !bool('isLost')); updatePreview(); });
  [...document.querySelectorAll('#adminForm input,#adminForm select,#adminForm textarea'), el.photoFit, el.photoZoom, el.photoBrightness, el.photoX, el.photoY].forEach(input => { input.addEventListener('input', updatePreview); input.addEventListener('change', updatePreview); });
  document.getElementById('resetPhoto').addEventListener('click', () => { el.photoFit.value='cover'; el.photoZoom.value=105; el.photoBrightness.value=110; el.photoX.value=50; el.photoY.value=50; updatePreview(); });
  document.getElementById('newRecord').addEventListener('click', resetForm);
  document.getElementById('requestSearch').addEventListener('input', renderRequests); document.getElementById('petSearch').addEventListener('input', renderPets);
  document.getElementById('printCredential').addEventListener('click', () => window.print()); document.getElementById('printTag').addEventListener('click', () => window.print());
  document.getElementById('tagShape').addEventListener('change', event => { ['tagFront','tagBack'].forEach(id => document.getElementById(id).className = `tag ${event.target.value}`); });

  resetForm(); renderRequests(); renderPets();
})();
