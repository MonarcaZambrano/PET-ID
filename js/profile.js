(() => {
  'use strict';
  const P = window.PetID;
  const params = new URLSearchParams(location.search);
  const pathMatch = location.pathname.match(/^\/p\/([^/?#]+)/);
  const publicSlug = decodeURIComponent(params.get('slug') || pathMatch?.[1] || 'demo-luna');
  const pet = P.findPetBySlug(publicSlug);

  if (!pet || pet.isPublic === false) {
    document.getElementById('publicCard').classList.add('hidden');
    document.getElementById('notFound').classList.remove('hidden');
    return;
  }

  const privacy = pet.privacy || {};
  document.title = `${pet.name} · PetID`;
  document.getElementById('publicCode').textContent = pet.petId;
  document.getElementById('publicName').textContent = pet.name;
  document.getElementById('publicType').textContent = `${pet.petType || 'Mascota'} · ${pet.sex || 'No especificado'}`;
  document.getElementById('publicMessage').textContent = pet.isLost
    ? 'Esta mascota está extraviada. Su familia la está buscando.'
    : 'Esta mascota cuenta con identificación PetID. Si la encontró sin su familia, comuníquese con su responsable.';

  if (pet.photoData) {
    const image = document.getElementById('publicPhoto');
    image.src = pet.photoData;
    image.classList.remove('hidden');
    document.getElementById('publicPhotoPlaceholder').classList.add('hidden');
  }

  const details = [
    ['Raza', pet.breed || 'No informada'],
    ['Nacimiento', P.formatDate(pet.birth)],
    privacy.showCity ? ['Ciudad o comuna', pet.city || 'No informada'] : null,
    privacy.showOwnerName ? ['Responsable', pet.owner || 'No informado'] : null,
    privacy.showMedicalNotes && pet.medicalNotes ? ['Información médica', pet.medicalNotes] : null,
    privacy.showBehaviorNotes && pet.behaviorNotes ? ['Cómo acercarse', pet.behaviorNotes] : null
  ].filter(Boolean);
  document.getElementById('publicDetails').innerHTML = details.map(([label, value]) => `<div class="detail"><b>${P.escapeHtml(label)}</b>${P.escapeHtml(value)}</div>`).join('');

  const actions = [];
  if (privacy.showPhone && pet.phone) actions.push(`<a class="btn btn-primary" href="tel:${P.phoneHref(pet.phone)}">Llamar</a>`);
  if (privacy.showWhatsapp && (pet.whatsapp || pet.phone)) actions.push(`<a class="btn btn-success" target="_blank" rel="noopener" href="${P.whatsappHref(pet.whatsapp || pet.phone, `Hola, encontré a ${pet.name}. Vi su perfil PetID.`)}">WhatsApp</a>`);
  if (privacy.showEmail && pet.email) actions.push(`<a class="btn btn-outline" href="mailto:${encodeURIComponent(pet.email)}">Correo</a>`);
  document.getElementById('contactActions').innerHTML = actions.join('');

  if (pet.isLost) {
    const banner = document.getElementById('lostBanner');
    banner.textContent = `⚠ ${pet.name} está extraviada/o. Por favor, ayuda a contactar a su familia.`;
    banner.classList.remove('hidden');
    const lost = document.getElementById('lostDetails');
    lost.innerHTML = [
      pet.lostSince ? `<b>Extraviada desde:</b> ${P.escapeHtml(P.formatDate(pet.lostSince))}` : '',
      pet.lastSeenLocation ? `<br><b>Último lugar:</b> ${P.escapeHtml(pet.lastSeenLocation)}` : '',
      pet.lostMessage ? `<br>${P.escapeHtml(pet.lostMessage)}` : '',
      pet.rewardText ? `<br><b>Recompensa:</b> ${P.escapeHtml(pet.rewardText)}` : ''
    ].join('');
    lost.classList.remove('hidden');
  }

  document.getElementById('foundForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const message = {
      id: crypto.randomUUID(),
      petId: pet.id,
      publicSlug,
      finderName: document.getElementById('finderName').value.trim(),
      finderPhone: document.getElementById('finderPhone').value.trim(),
      message: document.getElementById('finderMessage').value.trim(),
      status: 'nuevo',
      createdAt: new Date().toISOString()
    };
    const messages = P.read(P.CONFIG.storageKeys.finderMessages, []);
    messages.unshift(message);
    P.write(P.CONFIG.storageKeys.finderMessages, messages);
    const result = document.getElementById('finderResult');
    result.textContent = 'Aviso guardado en este dispositivo de demostración. En producción se enviará al responsable y al panel PetID.';
    result.classList.remove('hidden');
    event.currentTarget.reset();
  });
})();
