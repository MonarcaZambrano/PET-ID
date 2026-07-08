(() => {
  'use strict';
  const P = window.PetID;
  const form = document.getElementById('requestForm');
  const templateLimit = document.getElementById('templateLimit');
  const result = document.getElementById('requestResult');
  let photoData = '';
  let preferredTemplates = ['guardian'];

  P.titles.forEach(title => {
    const option = document.createElement('option');
    option.value = title;
    option.textContent = title;
    document.getElementById('title').appendChild(option);
  });

  P.templateButtons(document.getElementById('templateChoices'), {
    multiple: true,
    max: 3,
    selected: preferredTemplates,
    onChange: values => {
      preferredTemplates = values;
      templateLimit.classList.add('hidden');
      const first = values[0] || 'guardian';
      document.getElementById('customerCredential').className = `credential theme-${first}`;
    },
    onLimit: () => templateLimit.classList.remove('hidden')
  });

  document.querySelectorAll('[data-product-card]').forEach(card => {
    const input = card.querySelector('input');
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-product-card]').forEach(item => item.classList.remove('selected'));
      card.classList.add('selected');
      input.checked = true;
    });
  });

  const updatePreview = () => {
    document.getElementById('customerName').textContent = (document.getElementById('petName').value || 'Sin nombre').toUpperCase();
    document.getElementById('customerType').textContent = `${document.getElementById('petType').value} · ${document.getElementById('sex').value}`;
    document.getElementById('customerBreed').textContent = document.getElementById('breed').value || 'No informada';
    document.getElementById('customerOwner').textContent = document.getElementById('owner').value || 'Pendiente';
  };

  ['petName','petType','sex','breed','owner'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePreview);
    document.getElementById(id).addEventListener('change', updatePreview);
  });

  document.getElementById('photo').addEventListener('change', async event => {
    result.classList.add('hidden');
    try {
      photoData = await P.imageFileToDataUrl(event.target.files?.[0]);
      const image = document.getElementById('customerPhoto');
      image.src = photoData;
      image.classList.remove('hidden');
      document.getElementById('customerPhotoPlaceholder').classList.add('hidden');
    } catch (error) {
      alert(error.message);
      event.target.value = '';
      photoData = '';
    }
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    result.classList.add('hidden');
    if (!form.reportValidity()) return;
    if (!document.getElementById('consent').checked) return;
    if (!preferredTemplates.length) {
      templateLimit.textContent = 'Selecciona al menos un estilo.';
      templateLimit.classList.remove('hidden');
      return;
    }

    const request = {
      id: crypto.randomUUID(),
      requestId: P.nextRequestId(),
      petId: '',
      publicSlug: P.slug(),
      product: document.querySelector('input[name="product"]:checked')?.value || 'kit-fisico',
      petName: document.getElementById('petName').value.trim(),
      petType: document.getElementById('petType').value,
      sex: document.getElementById('sex').value,
      breed: document.getElementById('breed').value.trim(),
      birth: document.getElementById('birth').value,
      title: document.getElementById('title').value,
      characteristics: document.getElementById('characteristics').value.trim(),
      owner: document.getElementById('owner').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim(),
      email: document.getElementById('email').value.trim(),
      city: document.getElementById('city').value.trim(),
      delivery: document.getElementById('delivery').value,
      medicalNotes: document.getElementById('medicalNotes').value.trim(),
      behaviorNotes: document.getElementById('behaviorNotes').value.trim(),
      privacy: {
        showOwnerName: document.getElementById('showOwnerName').checked,
        showPhone: document.getElementById('showPhone').checked,
        showWhatsapp: document.getElementById('showWhatsapp').checked,
        showEmail: document.getElementById('showEmail').checked,
        showCity: document.getElementById('showCity').checked,
        showMedicalNotes: document.getElementById('showMedicalNotes').checked,
        showBehaviorNotes: document.getElementById('showBehaviorNotes').checked
      },
      preferredTemplates,
      selectedTemplate: preferredTemplates[0],
      photoData,
      paymentStatus: 'pendiente',
      productionStatus: 'solicitud-recibida',
      source: 'portal-publico',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const requests = P.read(P.CONFIG.storageKeys.requests, []);
    requests.unshift(request);
    P.write(P.CONFIG.storageKeys.requests, requests);

    result.innerHTML = `
      <b>Solicitud ${P.escapeHtml(request.requestId)} guardada.</b><br>
      Para continuar la prueba, abre el administrador en este mismo navegador y carga esta solicitud.
      <div class="actions" style="margin-top:12px">
        <a class="btn btn-primary" href="${P.appPath('admin.html')}">Abrir administrador</a>
      </div>`;
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('resetRequest').addEventListener('click', () => {
    setTimeout(() => {
      photoData = '';
      preferredTemplates = ['guardian'];
      document.getElementById('customerPhoto').removeAttribute('src');
      document.getElementById('customerPhoto').classList.add('hidden');
      document.getElementById('customerPhotoPlaceholder').classList.remove('hidden');
      document.getElementById('customerCredential').className = 'credential theme-guardian';
      result.classList.add('hidden');
      updatePreview();
      P.templateButtons(document.getElementById('templateChoices'), {
        multiple: true,
        max: 3,
        selected: preferredTemplates,
        onChange: values => {
          preferredTemplates = values;
          templateLimit.classList.add('hidden');
          const first = values[0] || 'guardian';
          document.getElementById('customerCredential').className = `credential theme-${first}`;
        },
        onLimit: () => templateLimit.classList.remove('hidden')
      });
    }, 0);
  });

  document.addEventListener('contextmenu', event => {
    if (event.target.closest('.credential')) event.preventDefault();
  });

  updatePreview();
})();
