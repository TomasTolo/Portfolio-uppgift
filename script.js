 
ocument.addEventListener('DOMContentLoaded', async () => {
    try {
      const cvContainer = document.getElementById('cv-content');
      const { namn, email, utbildningar, arbetsplatser } = await (await fetch('cv.json')).json();
      
      const createSection = (title, items, key) => `
        <section>
          <h2>${title}</h2>
          ${items.map(item => `
            <div>
              <h3>${item[key]}</h3>
              <p>${item[(key === 'skola') ? 'program' : 'position']}</p>
              <p class="period">${item.period}</p>
              ${item.beskrivning ? `<p>${item.beskrivning}</p>` : ''}
            </div>
          `).join('')}
        </section>`;
  
      cvContainer.innerHTML = `
        <h1>${namn}</h1>
        <p>${email}</p>
        ${createSection('Utbildningar', utbildningar, 'skola')}
        ${createSection('Arbetserfarenhet', arbetsplatser, 'företag')}`;
  
      document.getElementById('downloadBtn').addEventListener('click', async () => {
        try {
          cvContainer.style.display = 'block';
          const canvas = await html2canvas(cvContainer, { scale: 2 });
          const pdf = new jspdf.jsPDF();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, canvas.height * 190 / canvas.width);
          pdf.save('cv.pdf');
        } finally {
          cvContainer.style.display = '';
        }
      });
  
    } catch (error) {
      console.error('Ett fel uppstod:', error);
    }
  });


// Dark mode
const darkModeToggle = document.createElement('button');
darkModeToggle.id = 'dark-mode-toggle';
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
document.querySelector('header nav').appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Spara inställningar
    if(document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
});


// Modalhantering- Inspiration från: https://codeshack.io/interactive-modals-javascript/
document.querySelectorAll('.read-more-button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const modal = document.querySelector(btn.getAttribute('href'));
      modal.style.display = 'block';
      setTimeout(() => modal.querySelector('.modal-content').classList.add('active'), 10);
    });
  });
  
  document.querySelectorAll('.close-modal, .modal').forEach(el => {
    el.addEventListener('click', e => {
      if(e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
        const modal = e.target.closest('.modal');
        modal.querySelector('.modal-content').classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
      }
    });
  });
  
  // Stäng med ESC ref:https://stackoverflow.com/questions/51293224/close-modal-on-esc-press-pure-js
  document.addEventListener('keydown', e => e.key === 'Escape' && 
    document.querySelectorAll('.modal').forEach(modal => {
      if(modal.style.display === 'block') {
        modal.querySelector('.modal-content').classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
      }
    })
  );