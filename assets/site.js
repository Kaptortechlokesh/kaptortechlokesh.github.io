(() => {
  'use strict';

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }));
  }

  const architecture = [
    {
      kicker: '01 / HOST PLATFORM',
      title: 'The existing mission system',
      copy: 'The host platform produces or consumes commands, telemetry and mission data. Its processor, operating environment and existing interfaces define the starting point for an integration.',
      question: 'What must remain unchanged?',
      owner: 'Platform owner / system integrator'
    },
    {
      kicker: '02 / CRYPTO SUBSYSTEM',
      title: 'Cryptography close to the platform',
      copy: 'A hardware-accelerated cryptographic subsystem can be placed at an agreed trust boundary. Algorithm choice, key handling and processing responsibilities must be defined for the specific system.',
      question: 'Which operations belong in hardware?',
      owner: 'Security architect / hardware team'
    },
    {
      kicker: '03 / INTERFACE LAYER',
      title: 'The bus, protocol and trust boundary',
      copy: 'Electrical interfaces, data framing, protocol behaviour, timing and fault handling are platform-specific engineering tasks. Candidate interfaces in the earlier concept material include SpaceWire, CAN, RS-422 and Ethernet; support must be established per configuration.',
      question: 'What are the electrical and protocol constraints?',
      owner: 'Avionics / communications integrator'
    },
    {
      kicker: '04 / MISSION LINK',
      title: 'The protected communications path',
      copy: 'The final path may connect to an RF, optical or wired communications system. The required protections, endpoints and verification plan depend on the mission, link design and operating environment.',
      question: 'What must be protected end to end?',
      owner: 'Mission and system assurance teams'
    }
  ];
  const archButtons = [...document.querySelectorAll('[data-arch-step]')];
  if (archButtons.length) {
    const targets = {
      kicker: document.querySelector('#arch-kicker'),
      title: document.querySelector('#arch-title'),
      copy: document.querySelector('#arch-copy'),
      question: document.querySelector('#arch-question'),
      owner: document.querySelector('#arch-owner')
    };
    const activate = index => {
      const item = architecture[index];
      if (!item) return;
      archButtons.forEach((button, i) => {
        const active = i === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      Object.keys(targets).forEach(key => { if (targets[key]) targets[key].textContent = item[key]; });
    };
    archButtons.forEach((button, index) => {
      button.addEventListener('click', () => activate(index));
      button.addEventListener('keydown', event => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % archButtons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + archButtons.length) % archButtons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = archButtons.length - 1;
        activate(next);
        archButtons[next].focus();
      });
    });
  }

  const mailForm = document.querySelector('[data-mail-form]');
  if (mailForm) {
    const feedback = document.querySelector('[data-form-feedback]');
    mailForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!mailForm.reportValidity()) return;
      const data = new FormData(mailForm);
      const website = String(data.get('website') || '').trim();
      const body = [
        'KAPTOR TECH — Co-development application',
        '',
        `Organisation: ${data.get('organisation')}`,
        `Website: ${website || 'Not provided'}`,
        `Contact: ${data.get('contact')}`,
        `Work email: ${data.get('email')}`,
        `Area of interest: ${data.get('interest')}`,
        '',
        'Project overview:',
        String(data.get('summary') || '').trim(),
        '',
        'Consent: Applicant agrees that KAPTOR TECH may use these details to respond to this enquiry.'
      ].join('\n');
      const subject = `Co-development enquiry — ${String(data.get('organisation')).trim()}`;
      const mailto = `mailto:partnerships@kaptortech.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (feedback) feedback.textContent = 'Your email application is ready. Review the message in your email app and press Send to submit it. Nothing has been sent by this website.';
      window.location.href = mailto;
    });
  }
})();
