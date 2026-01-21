// Benchmark Tests System
class BenchmarkTests {
    constructor() {
        this.currentGrade = null;
        this.currentSubject = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.testQuestions = [];
        this.startTime = null;
        this.timeLimit = 30; // minutes
    }

    // Grade and Subject Mapping
    getSubjectsForGrade(grade) {
        const gradeData = BENCHMARK_QUESTIONS[grade];
        if (!gradeData) return [];
        return Object.keys(gradeData);
    }

    selectGrade(grade) {
        this.currentGrade = grade;
        document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Show subjects
        const subjects = this.getSubjectsForGrade(grade);
        const subjectsGrid = document.getElementById('subjects-grid');
        subjectsGrid.innerHTML = subjects.map(subject =>
            `<button class="subject-btn" onclick="app.selectSubject('${subject}')">${subject}</button>`
        ).join('');

        document.getElementById('subjects-container').style.display = 'block';
        document.getElementById('test-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'none';
    }

    selectSubject(subject) {
        this.currentSubject = subject;
        document.querySelectorAll('.subject-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Load test questions
        this.loadTestQuestions();
        this.startTest();
    }

    loadTestQuestions() {
        // Get questions from the benchmark questions bank
        const gradeData = BENCHMARK_QUESTIONS[this.currentGrade];

        if (!gradeData || !gradeData[this.currentSubject]) {
            this.testQuestions = this.generateSampleQuestions();
            this.userAnswers = new Array(this.testQuestions.length).fill(null);
            return;
        }

        // Get the subject data which contains sections
        const subjectData = gradeData[this.currentSubject];

        // Flatten all questions from all sections
        this.testQuestions = [];
        for (let section in subjectData) {
            if (Array.isArray(subjectData[section])) {
                this.testQuestions = this.testQuestions.concat(subjectData[section]);
            }
        }

        this.userAnswers = new Array(this.testQuestions.length).fill(null);
    }

    generateSampleQuestions() {
        // Generate 10 sample questions
        return Array.from({ length: 10 }, (_, i) => ({
            q: `Sample Question ${i + 1} for ${this.currentGrade} ${this.currentSubject}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correct: Math.floor(Math.random() * 4)
        }));
    }

    startTest() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.testQuestions.length).fill(null);
        this.startTime = Date.now();

        document.getElementById('subjects-container').style.display = 'none';
        document.getElementById('test-container').style.display = 'block';
        document.getElementById('results-container').style.display = 'none';

        this.displayQuestion();
        this.startTimer();
    }

    displayQuestion() {
        const question = this.testQuestions[this.currentQuestionIndex];
        document.getElementById('test-title').textContent = `${this.currentGrade} - ${this.currentSubject}`;
        document.getElementById('question-counter').textContent = `Question ${this.currentQuestionIndex + 1} of ${this.testQuestions.length}`;
        document.getElementById('question-text').textContent = question.q;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = question.options.map((option, idx) => `
            <div class="option ${this.userAnswers[this.currentQuestionIndex] === idx ? 'selected' : ''}" 
                 onclick="app.selectAnswer(${idx})">
                ${String.fromCharCode(65 + idx)}. ${option}
            </div>
        `).join('');

        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.testQuestions.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';

        // Update button visibility
        document.getElementById('next-btn').style.display = this.currentQuestionIndex < this.testQuestions.length - 1 ? 'block' : 'none';
        document.getElementById('submit-btn').style.display = this.currentQuestionIndex === this.testQuestions.length - 1 ? 'block' : 'none';
    }

    selectAnswer(optionIndex) {
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        this.displayQuestion();
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.testQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    submitTest() {
        clearInterval(this.timerInterval);
        this.calculateResults();
    }

    calculateResults() {
        let correctCount = 0;
        const results = [];

        this.testQuestions.forEach((question, idx) => {
            const isCorrect = this.userAnswers[idx] === question.correct;
            if (isCorrect) correctCount++;

            results.push({
                question: question.q,
                userAnswer: question.options[this.userAnswers[idx]] || 'Not answered',
                correctAnswer: question.options[question.correct],
                isCorrect: isCorrect
            });
        });

        const percentage = (correctCount / this.testQuestions.length) * 100;
        const coinsEarned = Math.floor(percentage / 10) * 10; // 10 coins per 10%

        this.displayResults(percentage, correctCount, coinsEarned, results);
    }

    displayResults(percentage, correctCount, coinsEarned, results) {
        document.getElementById('test-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'block';

        document.getElementById('final-score').textContent = percentage.toFixed(1) + '%';
        document.getElementById('correct-count').textContent = `${correctCount} / ${this.testQuestions.length}`;
        document.getElementById('coins-earned').textContent = `${coinsEarned} 🪙`;

        const detailedResults = document.getElementById('detailed-results');
        detailedResults.innerHTML = results.map(result => `
            <div class="result-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-item-question">${result.isCorrect ? '✓' : '✗'} ${result.question}</div>
                <div class="result-item-answer">Your answer: ${result.userAnswer}</div>
                ${!result.isCorrect ? `<div class="result-item-answer">Correct answer: ${result.correctAnswer}</div>` : ''}
            </div>
        `).join('');
    }

    retakeTest() {
        this.startTest();
    }

    backToGrades() {
        document.getElementById('subjects-container').style.display = 'none';
        document.getElementById('test-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'none';
        document.getElementById('grade-selector').style.display = 'block';
        document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.subject-btn').forEach(btn => btn.classList.remove('active'));
    }

    startTimer() {
        let timeRemaining = this.timeLimit * 60;
        this.timerInterval = setInterval(() => {
            timeRemaining--;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            document.getElementById('timer').textContent = `⏱️ ${minutes}:${String(seconds).padStart(2, '0')}`;

            if (timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.submitTest();
            }
        }, 1000);
    }
}

// Initialize app
const app = new BenchmarkTests();
