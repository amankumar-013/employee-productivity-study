// 1. Initialize an array to hold our tasks. 
// We use localStorage so data isn't lost when the page refreshes!
let tasks = JSON.parse(localStorage.getItem('employeeTasks')) || [];

// 2. Select HTML elements we need to interact with
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// Metric elements
const totalTasksEl = document.getElementById('totalTasks');
const totalHoursEl = document.getElementById('totalHours');
const productivityScoreEl = document.getElementById('productivityScore');

// 3. Listen for the form submission
taskForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents page from reloading

    // Get values from the form
    const taskName = document.getElementById('taskName').value;
    const hoursSpent = parseFloat(document.getElementById('hoursSpent').value);
    const taskStatus = document.getElementById('taskStatus').value;

    // Create a task object
    const newTask = {
        id: Date.now(), // unique ID based on timestamp
        name: taskName,
        hours: hoursSpent,
        status: taskStatus
    };

    // Add to array and save
    tasks.push(newTask);
    saveData();
    
    // Clear form and update screen
    taskForm.reset();
    updateDashboard();
});

// 4. Function to save data to local storage
function saveData() {
    localStorage.setItem('employeeTasks', JSON.stringify(tasks));
}

// 5. Function to delete a task
// Attached to the window object so the HTML button can trigger it globally
window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveData();
    updateDashboard();
}

// 6. Function to update the UI (Table and Metrics)
function updateDashboard() {
    // Clear the current table content
    taskList.innerHTML = '';
    
    let totalHours = 0;
    let completedTasks = 0;

    // Loop through tasks to populate table and calculate metrics
    tasks.forEach(task => {
        totalHours += task.hours;
        if (task.status === 'Completed') {
            completedTasks++;
        }

        // Determine CSS class for status color
        const statusClass = task.status === 'Completed' ? 'status-completed' : 'status-pending';

        // Create a new row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.hours}</td>
            <td class="${statusClass}">${task.status}</td>
            <td><button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button></td>
        `;
        taskList.appendChild(row);
    });

    // Update Metrics display
    totalTasksEl.innerText = tasks.length;
    totalHoursEl.innerText = totalHours.toFixed(1);

    // Calculate Productivity Score (Completed Tasks / Total Tasks * 100)
    let productivity = 0;
    if (tasks.length > 0) {
        productivity = (completedTasks / tasks.length) * 100;
    }
    productivityScoreEl.innerText = productivity.toFixed(0) + '%';
}

// 7. Run this function when the page first loads to show existing data
updateDashboard();
