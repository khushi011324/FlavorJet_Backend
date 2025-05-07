document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

const fetchEvents = () => {
    fetch('/events')
        .then(response => response.json())
        .then(events => {
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = '';

            events.forEach(event => {
                const listItem = document.createElement('li');
                listItem.textContent = `${event.name} - ${event.date} - ${event.location}`;
                eventsList.appendChild(listItem);
            });
        })
        .catch(error => {
            document.getElementById('errorMessage').textContent = 'Error loading events';
            console.error('Error:', error);
        });
};

document.getElementById('registerForm').addEventListener('submit', event => {
    event.preventDefault();

    const eventName = document.getElementById('registerEventName').value;
    const userName = document.getElementById('registerUserName').value;
    const userEmail = document.getElementById('registerUserEmail').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName, userName, userEmail }),
    })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));
});

document.getElementById('cancelForm').addEventListener('submit', event => {
    event.preventDefault();

    const eventName = document.getElementById('cancelEventName').value;
    const userEmail = document.getElementById('cancelUserEmail').value;

    fetch('/cancel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName, userEmail }),
    })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));
});
