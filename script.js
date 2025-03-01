document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const categorySelection = document.getElementById('category-selection');
    const difficultySelection = document.getElementById('difficulty-selection');
    const quizPage = document.getElementById('quiz-page');
    const completionPage = document.getElementById('completion-page');

    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const answerButtons = document.querySelectorAll('.answer-button');
    const questionElement = document.getElementById('question');
    const timerElement = document.getElementById('timer');
    const progressBar = document.querySelector('.progress');
    const finalScoreElement = document.getElementById('final-score');
    const toggleModeButton = document.getElementById('toggle-mode');
    const body = document.body;
    const categoryCards = document.querySelectorAll('.category-card');
    const difficultyCards = document.querySelectorAll('.difficulty-card');

    let selectedCategory = '';
    let selectedDifficulty = '';
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let timer;
    let timeLeft = 30;
    let darkMode = false;

    // Toggle Dark/Light Mode
    toggleModeButton.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        darkMode = !darkMode;
    });

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedCategory = card.dataset.category;
            categorySelection.classList.remove('active');
            difficultySelection.classList.add('active');
        });
    });

    difficultyCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedDifficulty = card.dataset.difficulty;
            difficultySelection.classList.remove('active');
            quizPage.classList.add('active');
            startQuiz();
        });
    });

    function getQuestions(category, difficulty) {
        const questionData = {
            cars: [
                // Easy Cars Questions
                { question: 'What company makes the Mustang?', answers: ['Ford', 'Chevy', 'Dodge', 'Toyota'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'Which car brand is known for its safety?', answers: ['Volvo', 'BMW', 'Audi', 'Mercedes'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What type of fuel does a diesel engine use?', answers: ['Diesel', 'Gasoline', 'Ethanol', 'Propane'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What does SUV stand for?', answers: ['Sport Utility Vehicle', 'Super Ultra Vehicle', 'Standard Urban Vehicle', 'Stylish Utility Vehicle'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'Which part of the car is used for steering?', answers: ['Steering wheel', 'Engine', 'Brakes', 'Transmission'], correctAnswer: 0, difficulty: 'easy' },

                // Medium Cars Questions
                { question: 'What is a turbocharger?', answers: ['Forced induction system', 'Braking system', 'Suspension component', 'Steering component'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the purpose of a catalytic converter?', answers: ['Reduce emissions', 'Increase horsepower', 'Improve fuel economy', 'Cool the engine'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the function of ABS?', answers: ['Anti-lock Braking System', 'Automatic Body System', 'Advanced Battery System', 'Airbag Backup System'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the difference between a sedan and a hatchback?', answers: ['Trunk design', 'Engine size', 'Wheelbase', 'Fuel type'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the purpose of a timing belt?', answers: ['Synchronize engine components', 'Cool the engine', 'Lubricate the engine', 'Filter the air'], correctAnswer: 0, difficulty: 'medium' },

                // Hard Cars Questions
                { question: 'What is the function of a limited-slip differential?', answers: ['Distributes torque between wheels', 'Controls engine temperature', 'Adjusts suspension height', 'Manages fuel injection'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the bore and stroke of an engine?', answers: ['Cylinder diameter and piston travel', 'Engine weight and size', 'Fuel consumption and emissions', 'Horsepower and torque'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the working principle of a continuously variable transmission (CVT)?', answers: ['Variable pulley system', 'Gear shifting', 'Clutch engagement', 'Hydraulic pressure'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'Explain the concept of regenerative braking in electric vehicles.', answers: ['Converts kinetic energy to electrical energy', 'Uses friction to slow down', 'Uses air resistance to slow down', 'Uses magnetic fields to slow down'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the significance of the compression ratio in an internal combustion engine?', answers: ['Determines engine efficiency and power', 'Controls engine temperature', 'Regulates fuel flow', 'Manages air intake'], correctAnswer: 0, difficulty: 'hard' },
            ],
            geography: [
                // Easy Geography Questions
                { question: 'Which river is the longest?', answers: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What is the largest desert?', answers: ['Antarctic', 'Sahara', 'Gobi', 'Arabian'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What is the capital of Japan?', answers: ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'Which continent is known as the "Land Down Under"?', answers: ['Australia', 'Africa', 'Europe', 'Asia'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What is the largest ocean?', answers: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correctAnswer: 0, difficulty: 'easy' },

                // Medium Geography Questions
                { question: 'What is the Ring of Fire?', answers: ['Volcanic area', 'Mountain range', 'River system', 'Forest region'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'Which country has the most time zones?', answers: ['France', 'USA', 'Russia', 'Australia'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the significance of the Great Barrier Reef?', answers: ['Largest coral reef system', 'Deepest ocean trench', 'Tallest mountain range', 'Longest river delta'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the difference between latitude and longitude?', answers: ['Horizontal vs. vertical lines', 'Temperature vs. rainfall', 'Elevation vs. depth', 'Population vs. area'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the significance of the Amazon rainforest?', answers: ['Biodiversity hotspot', 'Largest desert', 'Highest mountain', 'Deepest lake'], correctAnswer: 0, difficulty: 'medium' },

                // Hard Geography Questions
                { question: 'What is isostatic rebound?', answers: ['Land rising after ice melting', 'Volcanic eruption process', 'Ocean current pattern', 'Atmospheric pressure change'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the Coriolis effect?', answers: ['Deflection of moving objects due to Earth’s rotation', 'Tidal force influence', 'Wind speed measurement', 'Temperature inversion phenomenon'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'Explain the concept of plate tectonics.', answers: ['Movement of Earth’s lithospheric plates', 'Formation of clouds', 'Flow of ocean currents', 'Formation of deserts'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the significance of the Mid-Atlantic Ridge?', answers: ['Divergent plate boundary', 'Convergent plate boundary', 'Transform plate boundary', 'Subduction zone'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the concept of a rain shadow?', answers: ['Dry area on the leeward side of a mountain', 'Area with heavy rainfall', 'Area with high humidity', 'Area with low temperature'], correctAnswer: 0, difficulty: 'hard' },
            ],
            history: [
                // Easy History Questions
                { question: 'Who was the queen of Egypt?', answers: ['Cleopatra', 'Nefertiti', 'Hatshepsut', 'Isis'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What ancient civilization built the pyramids?', answers: ['Egyptians', 'Mayans', 'Romans', 'Greeks'], correctAnswer:0, difficulty: 'easy' },
                { question: 'In what year did Christopher Columbus reach the Americas?', answers: ['1492', '1620', '1776', '1812'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'Who was the first president of the United States?', answers: ['George Washington', 'Thomas Jefferson', 'John Adams', 'Benjamin Franklin'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What was the name of the ship that sank in 1912?', answers: ['Titanic', 'Lusitania', 'Bismarck', 'Endurance'], correctAnswer: 0, difficulty: 'easy' },

                // Medium History Questions
                { question: 'What was the Renaissance?', answers: ['Cultural rebirth', 'War period', 'Economic crisis', 'Scientific revolution'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'Who led the Russian Revolution?', answers: ['Vladimir Lenin', 'Joseph Stalin', 'Leon Trotsky', 'Nikita Khrushchev'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What was the significance of the Magna Carta?', answers: ['Limited the power of the monarchy', 'Started the French Revolution', 'Ended the American Civil War', 'Established the United Nations'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What was the Silk Road?', answers: ['Ancient trade route', 'Modern highway', 'Railway line', 'River system'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What was the impact of the Industrial Revolution?', answers: ['Mass production and urbanization', 'Agricultural advancements', 'Discovery of new continents', 'Spread of democracy'], correctAnswer: 0, difficulty: 'medium' },

                // Hard History Questions
                { question: 'What was the Treaty of Versailles?', answers: ['Ended WWI', 'Started WWII', 'Established UN', 'Created EU'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What was the impact of the Meiji Restoration?', answers: ['Modernization of Japan', 'Fall of the Roman Empire', 'Discovery of America', 'French Revolution'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'Explain the significance of the Code of Hammurabi.', answers: ['First written legal code', 'Religious text', 'Philosophical treatise', 'Scientific discovery'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What were the consequences of the Berlin Conference of 1884?', answers: ['Scramble for Africa', 'Formation of the EU', 'End of the Cold War', 'Discovery of penicillin'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What was the impact of the Columbian Exchange?', answers: ['Transfer of plants, animals, and diseases', 'Discovery of electricity', 'Invention of the printing press', 'Establishment of the League of Nations'], correctAnswer: 0, difficulty: 'hard' },
            ],
            tech: [
                // Easy Tech Questions
                { question: 'What is RAM?', answers: ['Random Access Memory', 'Read Only Memory', 'Remote Access Module', 'Rotational Access Memory'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What does URL stand for?', answers: ['Uniform Resource Locator', 'Universal Resource Locator', 'Unified Resource Locator', 'Unique Resource Locator'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What is an operating system?', answers: ['Software that manages computer hardware', 'A type of computer hardware', 'A programming language', 'A video game'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What is the internet?', answers: ['Global network of computers', 'A type of software', 'A video game console', 'A television channel'], correctAnswer: 0, difficulty: 'easy' },
                { question: 'What is an email?', answers: ['Electronic mail', 'A type of printing', 'A computer virus', 'A musical instrument'], correctAnswer: 0, difficulty: 'easy' },

                // Medium Tech Questions
                { question: 'What is cloud computing?', answers: ['Internet-based computing', 'Local storage', 'Hardware setup', 'Software design'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is an API?', answers: ['Application Programming Interface', 'Advanced Processing Interface', 'Automated Program Installation', 'Access Point Identifier'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the purpose of a firewall?', answers: ['Network security', 'Speed up internet', 'Increase storage', 'Improve graphics'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the difference between HTTP and HTTPS?', answers: ['Secure vs. insecure connection', 'Fast vs. slow connection', 'Image vs. text transfer', 'Local vs. remote access'], correctAnswer: 0, difficulty: 'medium' },
                { question: 'What is the function of a router?', answers: ['Network traffic management', 'Data storage', 'Video processing', 'Sound recording'], correctAnswer: 0, difficulty: 'medium' },

                // Hard Tech Questions
                { question: 'What is quantum computing?', answers: ['Uses quantum mechanics', 'Traditional computing', 'Analog computing', 'Optical computing'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is blockchain technology?', answers: ['Decentralized ledger', 'Centralized database', 'Data encryption method', 'Network routing protocol'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'Explain the concept of machine learning.', answers: ['Algorithms that learn from data', 'Manual data entry', 'Hardware optimization', 'Software debugging'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the significance of the Turing test?', answers: ['Evaluates AI intelligence', 'Measures computer speed', 'Tests network security', 'Analyzes data storage'], correctAnswer: 0, difficulty: 'hard' },
                { question: 'What is the concept of containerization in software development?', answers: ['Packaging software with its dependencies', 'Centralized data storage', 'Automated code testing', 'Remote server management'], correctAnswer: 0, difficulty: 'hard' },
            ],
        };

        return questionData[category].filter(q => q.difficulty === difficulty);
    }

    // Start button event listener
    startButton.addEventListener('click', () => {
        landingPage.classList.remove('active');
        categorySelection.classList.add('active');
    });

    // Restart button event listener
    restartButton.addEventListener('click', () => {
        completionPage.classList.remove('active');
        landingPage.classList.add('active');
        resetQuiz();
    });

    // Start quiz function
    function startQuiz() {
        // Assume getQuestions function is defined elsewhere and returns an array of question objects.
        questions = getQuestions(selectedCategory, selectedDifficulty);
        currentQuestionIndex = 0;
        score = 0;
        showQuestion();
    }

    // Show question function
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
            return;
        }

        const question = questions[currentQuestionIndex];
        questionElement.textContent = question.question;

        question.answers.forEach((answer, index) => {
            answerButtons[index].textContent = answer;
            answerButtons[index].dataset.answer = index;
            answerButtons[index].classList.remove('correct', 'wrong');
        });

        startTimer();
        updateProgressBar();
    }

    // Start timer function
    function startTimer() {
        timeLeft = 30;
        timerElement.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                checkAnswer(-1);
            }
        }, 1000);
    }

    // Check answer function
    function checkAnswer(selectedIndex) {
        clearInterval(timer);
        const question = questions[currentQuestionIndex];

        if (selectedIndex === question.correctAnswer) {
            score++;
            answerButtons[selectedIndex].classList.add('correct');
        } else if (selectedIndex !== -1) {
            answerButtons[selectedIndex].classList.add('wrong');
            answerButtons[question.correctAnswer].classList.add('correct');
        } else {
            answerButtons[question.correctAnswer].classList.add('correct');
        }

        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 1500);
    }

    // Update progress bar function
    function updateProgressBar() {
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // End quiz function
    function endQuiz() {
        quizPage.classList.remove('active');
        completionPage.classList.add('active');
        finalScoreElement.textContent = `Your score: ${score} / ${questions.length}`;
}

// Reset quiz function
function resetQuiz() {
    selectedCategory = '';
    selectedDifficulty = '';
    currentQuestionIndex = 0;
    score = 0;
    questions = [];
    timeLeft = 30;
    clearInterval(timer);
    progressBar.style.width = '0%';
}

// Answer button event listeners
answerButtons.forEach(button => {
    button.addEventListener('click', () => {
        checkAnswer(parseInt(button.dataset.answer));
    });
});
});