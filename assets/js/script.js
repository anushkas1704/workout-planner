document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    const workoutForm = document.getElementById('workoutForm');
    if (workoutForm) {
        workoutForm.addEventListener('submit', handleWorkoutSubmit);
        loadWorkouts();
    }

    const hero = document.querySelector('.hero');
    if (hero) {
        const img = new Image();
        img.src = 'assets/images/hero-bg.jpg';
        
        img.onload = function() {
            hero.classList.add('loaded');
        };
    }

    const planForm = document.getElementById('planForm');
    const addExerciseBtn = document.getElementById('addExercise');

    if (planForm) {
        planForm.addEventListener('submit', handlePlanSubmit);
        loadPlans(); 
    }

    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', addExerciseField);
    }

    const darkModeToggle = document.getElementById('darkMode');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            darkModeToggle.checked = true;
        }
    }
    
    // Toggle theme
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});


function handleWorkoutSubmit(e) {
    e.preventDefault();
    
    const workout = {
        id: Date.now(),
        exercise: document.getElementById('exercise').value,
        sets: document.getElementById('sets').value,
        reps: document.getElementById('reps').value,
        weight: document.getElementById('weight').value || '0',
        notes: document.getElementById('notes').value,
        date: new Date().toISOString()
    };

    saveWorkout(workout);
    e.target.reset();
    loadWorkouts();
}

function saveWorkout(workout) {
    let workouts = getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

function getWorkouts() {
    return JSON.parse(localStorage.getItem('workouts')) || [];
}

function loadWorkouts() {
    const workoutList = document.getElementById('workoutList');
    if (!workoutList) return;

    const workouts = getWorkouts();
    workoutList.innerHTML = '';

    workouts.forEach(workout => {
        const workoutCard = createWorkoutCard(workout);
        workoutList.appendChild(workoutCard);
    });
}

function createWorkoutCard(workout) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
        <h3>${workout.exercise}</h3>
        <p>Sets: ${workout.sets} | Reps: ${workout.reps}</p>
        ${workout.weight > 0 ? `<p>Weight: ${workout.weight}kg</p>` : ''}
        ${workout.notes ? `<p>Notes: ${workout.notes}</p>` : ''}
        <p class="date">${new Date(workout.date).toLocaleDateString()}</p>
        <button onclick="deleteWorkout(${workout.id})" class="btn btn-delete">Delete</button>
    `;
    return card;
}

function deleteWorkout(id) {
    let workouts = getWorkouts();
    workouts = workouts.filter(workout => workout.id !== id);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    loadWorkouts();
}


function handlePlanSubmit(e) {
    e.preventDefault();
    
    const exercises = [];
    const exerciseItems = document.querySelectorAll('.exercise-item');
    
    exerciseItems.forEach(item => {
        exercises.push({
            name: item.querySelector('.exercise-name').value,
            sets: item.querySelector('.exercise-sets').value,
            reps: item.querySelector('.exercise-reps').value
        });
    });

    const plan = {
        id: Date.now(),
        name: document.getElementById('planName').value,
        exercises: exercises,
        date: new Date().toISOString()
    };

    savePlan(plan);
    e.target.reset();
    loadPlans();
}

function savePlan(plan) {
    let plans = getPlans();
    plans.push(plan);
    localStorage.setItem('plans', JSON.stringify(plans));
}

function getPlans() {
    return JSON.parse(localStorage.getItem('plans')) || [];
}

function loadPlans() {
    const plansList = document.getElementById('plansList');
    if (!plansList) return;

    const plans = getPlans();
    plansList.innerHTML = '';

    plans.forEach(plan => {
        const planCard = createPlanCard(plan);
        plansList.appendChild(planCard);
    });
}

function createPlanCard(plan) {
    const card = document.createElement('div');
    card.className = 'plan-card';
    
    let exercisesList = plan.exercises.map(exercise => 
        `<li>${exercise.name} - ${exercise.sets} sets × ${exercise.reps} reps</li>`
    ).join('');

    card.innerHTML = `
        <h3>${plan.name}</h3>
        <p class="date">Created: ${new Date(plan.date).toLocaleDateString()}</p>
        <div class="exercises-list">
            <h4>Exercises:</h4>
            <ul>${exercisesList}</ul>
        </div>
        <button onclick="deletePlan(${plan.id})" class="btn btn-delete">Delete Plan</button>
    `;
    return card;
}

function deletePlan(id) {
    let plans = getPlans();
    plans = plans.filter(plan => plan.id !== id);
    localStorage.setItem('plans', JSON.stringify(plans));
    loadPlans();
}

function addExerciseField() {
    const exerciseList = document.getElementById('exerciseList');
    const exerciseItem = document.createElement('div');
    exerciseItem.className = 'exercise-item';
    exerciseItem.innerHTML = `
        <div class="form-group">
            <label>Exercise Name</label>
            <input type="text" class="exercise-name" required>
        </div>
        <div class="form-group">
            <label>Sets</label>
            <input type="number" class="exercise-sets" required>
        </div>
        <div class="form-group">
            <label>Reps</label>
            <input type="number" class="exercise-reps" required>
        </div>
        <button type="button" class="btn btn-delete" onclick="removeExercise(this)">Remove</button>
    `;
    exerciseList.appendChild(exerciseItem);
}

function removeExercise(button) {
    button.parentElement.remove();
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}