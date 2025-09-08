// Funciones del calendario
function renderCalendar() {
    const monthYearEl = document.getElementById('current-month-year');
    const calendarGrid = document.getElementById('calendar-grid');

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Domingo, 1 = Lunes
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    if (monthYearEl) monthYearEl.textContent = `${monthNames[month]} ${year}`;
    if (calendarGrid) calendarGrid.innerHTML = '';

    // Ajuste para que la semana empiece en Lunes
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Días vacíos al inicio del mes
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        if (calendarGrid) calendarGrid.appendChild(emptyDay);
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        
        dayEl.innerHTML = `<span class="calendar-day-number">${i}</span>`;
        dayEl.dataset.date = `${year}-${month + 1}-${i}`;

        const dayKey = `${year}-${month + 1}-${i}`;
        if (documents[dayKey] && documents[dayKey].length > 0) {
            dayEl.classList.add('has-data');
        }

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('current-day');
        }
        
        dayEl.addEventListener('click', () => showDocumentsForDay(dayKey));

        if (calendarGrid) calendarGrid.appendChild(dayEl);
    }
    
    // Si el día 4 tiene datos, se lo asignamos por defecto al iniciar
    if (documents['2025-9-4']) {
        const dayElement = document.querySelector('[data-date="2025-9-4"]');
        if (dayElement) dayElement.classList.add('has-data');
    }
}

function showDocumentsForDay(date) {
    const docListEl = document.getElementById('documents-list');
    if (!docListEl) return;
    
    docListEl.innerHTML = '';

    const docs = documents[date] || [];
    
    if (docs.length > 0) {
        const title = document.createElement('h3');
        title.textContent = `Documentos para el ${date}`;
        docListEl.appendChild(title);
        
        docs.forEach(doc => {
            const docItem = document.createElement('div');
            docItem.classList.add('document-item');
            docItem.innerHTML = `
                <div>
                    <strong>Patente:</strong> ${doc.plate}<br>
                    <strong>Tipo:</strong> ${doc.type}
                </div>
                <img src="${doc.fileUrl}" alt="Documento">
            `;
            docListEl.appendChild(docItem);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = `No hay documentos para esta fecha.`;
        docListEl.appendChild(message);
    }
}

// Event listeners para navegación del calendario
document.addEventListener('DOMContentLoaded', function() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
});