const eventName = document.getElementById('event-name');
const eventDate = document.getElementById('event-date');
const addBtn = document.getElementById('btn-add');
const eventsContainerElement = document.getElementById('events-container');

let events = [];
//Load information
let arr = [];

const json = loadLocalStorage();

try {
    arr = JSON.parse(json);
} catch (error) {
    arr = [];
}

events = arr ? [...arr] : [];

renderEvents();

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addEvent();
});

addBtn.addEventListener('click', (event) => {
    event.preventDefault();
    addEvent();
});

function addEvent() {
    if (eventName.value === '' || eventDate.value === '') {
        return;
    }

    if (dateDiff(eventDate.value) < 0) {
        return;
    }

    const newEvent = {
        id: (Math.random() * 100).toString(36).slice(3),
        name: eventName.value,
        date: eventDate.value,
    };

    events.unshift(newEvent);

    saveLocalStorage(JSON.stringify(events));

    eventName.value = '';
    eventDate.value = '';

    renderEvents();
}

function dateDiff(date) {
    const targetDate = new Date(date);
    const today = new Date();
    const difference = targetDate.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 3600 * 24));
    return days;
}

function renderEvents() {
    const eventsHtml = events.map((event) => {
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-text">days</span>
                </div>
                <div class="event-name">
                    ${event.name}
                </div>
                <time datetime="${event.date}" class="event-date">
                    ${event.date}
                </time>
                <div class="actions">
                    <button data-id="${
                        event.id
                    }" class="btn-delete">Delete</button>
                </div>
            </div>
        `;
    });

    eventsContainerElement.innerHTML = eventsHtml.join('');

    document.querySelectorAll('.btn-delete').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const id = btn.getAttribute('data-id');
            events = events.filter((event) => event.id !== id);
            saveLocalStorage(JSON.stringify(events));
            renderEvents();
        });
    });
}

function saveLocalStorage(data) {
    localStorage.setItem('items', data);
}

function loadLocalStorage() {
    return localStorage.getItem('items');
}
