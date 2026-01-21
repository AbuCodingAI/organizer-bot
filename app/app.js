// School Management System - Complete Version
// All functionality in one file

class SchoolManagementSystem {
    constructor() {
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.authMode = 'login'; // 'login' or 'register'
        this.init();
    }

    init() {
        // Apply dark mode if saved
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        this.initDemoData();
        // Initialize Gemini API key with your key as default
        if (!localStorage.getItem('gemini_api_key')) {
            localStorage.setItem('gemini_api_key', 'AIzaSyCl9yOBRC7oRN5CLQaLewunha8sfYBvZ8o');
        }

        // Check Firebase auth state
        auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // User is logged in
                try {
                    const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
                    if (userDoc.exists) {
                        this.currentUser = {
                            id: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...userDoc.data()
                        };
                        this.showDashboard();
                        this.unlockAchievement('first_login');
                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                    this.showLogin();
                }
            } else {
                // User is logged out
                this.currentUser = null;
                this.showLogin();
            }
        });
    }

    // Initialize demo data
    initDemoData() {
        if (!localStorage.getItem('sms_initialized')) {
            // Demo users - including parent
            const users = [
                {
                    id: 'student1',
                    username: 'student',
                    password: 'demo123',
                    name: 'Emma Johnson',
                    email: 'student@school.edu',
                    role: 'student',
                    avatar: '👨‍🎓',
                    studyCoins: 50,
                    profile: {
                        academicInfo: {
                            currentGPA: 3.8,
                            attendance: 95
                        }
                    }
                },
                {
                    id: 'teacher1',
                    username: 'teacher',
                    password: 'demo123',
                    name: 'Dr. Sarah Wilson',
                    email: 'teacher@school.edu',
                    role: 'teacher',
                    avatar: '👩‍🏫'
                },
                {
                    id: 'admin1',
                    username: 'admin',
                    password: 'demo123',
                    name: 'Principal Anderson',
                    email: 'admin@school.edu',
                    role: 'admin',
                    avatar: '👨‍💼'
                },
                {
                    id: 'parent1',
                    username: 'parent',
                    password: 'demo123',
                    name: 'Michael Johnson',
                    email: 'parent@school.edu',
                    role: 'parent',
                    avatar: '👨‍👩‍👧‍👦',
                    children: ['student1']
                }
            ];

            // Demo subjects
            const subjects = [
                { id: 'math', name: 'Mathematics', code: 'MATH101', color: '#667eea' },
                { id: 'english', name: 'English', code: 'ENG101', color: '#f093fb' },
                { id: 'science', name: 'Science', code: 'SCI101', color: '#4facfe' },
                { id: 'history', name: 'History', code: 'HIST101', color: '#43e97b' }
            ];

            // Demo periods
            const periods = [
                { period: 1, startTime: '08:00', endTime: '08:45', name: 'Period 1' },
                { period: 2, startTime: '09:00', endTime: '09:45', name: 'Period 2' },
                { period: 3, startTime: '10:00', endTime: '10:45', name: 'Period 3' },
                { period: 4, startTime: '11:00', endTime: '11:45', name: 'Period 4' }
            ];

            // Demo timetable
            const timetable = {
                schedule: [
                    {
                        day: 'monday',
                        periods: [
                            { period: 1, subject: 'math', subjectName: 'Mathematics', teacher: 'Dr. Sarah Wilson', room: 'Room 101', time: '08:00-08:45' },
                            { period: 2, subject: 'english', subjectName: 'English', teacher: 'Ms. Brown', room: 'Room 102', time: '09:00-09:45' }
                        ]
                    },
                    {
                        day: 'tuesday',
                        periods: [
                            { period: 1, subject: 'science', subjectName: 'Science', teacher: 'Dr. Smith', room: 'Lab 1', time: '08:00-08:45' },
                            { period: 2, subject: 'history', subjectName: 'History', teacher: 'Mr. Davis', room: 'Room 103', time: '09:00-09:45' }
                        ]
                    }
                ]
            };

            // Demo assignments
            const assignments = [
                {
                    id: 'assign1',
                    title: 'Math Homework Chapter 5',
                    subject: 'math',
                    subjectName: 'Mathematics',
                    dueDate: '2025-01-15',
                    status: 'pending',
                    description: 'Complete exercises 1-20'
                },
                {
                    id: 'assign2',
                    title: 'English Essay',
                    subject: 'english',
                    subjectName: 'English',
                    dueDate: '2025-01-18',
                    status: 'pending',
                    description: 'Write a 500-word essay'
                }
            ];

            // Demo grades
            const grades = [
                {
                    id: 'grade1',
                    studentId: 'student1',
                    assignmentId: 'assign1',
                    pointsEarned: 85,
                    pointsPossible: 100,
                    percentage: 85,
                    letterGrade: 'B',
                    gradedAt: '2025-01-10'
                }
            ];

            localStorage.setItem('sms_users', JSON.stringify(users));
            localStorage.setItem('sms_subjects', JSON.stringify(subjects));
            localStorage.setItem('sms_periods', JSON.stringify(periods));
            localStorage.setItem('sms_timetable', JSON.stringify(timetable));
            localStorage.setItem('sms_assignments', JSON.stringify(assignments));
            localStorage.setItem('sms_grades', JSON.stringify(grades));
            localStorage.setItem('sms_initialized', 'true');
        }
    }

    // Show login screen with registration
    showLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <h1>🏫 School Management</h1>
                    <p id="subtitle">Select your role to continue</p>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" onclick="app.switchAuthMode('login')">Login</button>
                        <button class="auth-tab" onclick="app.switchAuthMode('register')">Register</button>
                    </div>

                    <!-- Login Form -->
                    <div id="login-section">
                        <div class="role-buttons">
                            <button class="role-btn" onclick="app.selectRole('student')">
                                👨‍🎓 Student<br><small>Emma Johnson</small>
                            </button>
                            <button class="role-btn" onclick="app.selectRole('teacher')">
                                👩‍🏫 Teacher<br><small>Dr. Sarah Wilson</small>
                            </button>
                            <button class="role-btn" onclick="app.selectRole('admin')">
                                👨‍💼 Administrator<br><small>Principal Anderson</small>
                            </button>
                            <button class="role-btn" onclick="app.selectRole('parent')">
                                👨‍👩‍👧‍👦 Parent<br><small>Michael Johnson</small>
                            </button>
                        </div>

                        <div id="login-form" style="display: none; margin-top: 20px;">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" id="username" placeholder="Enter username">
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="password" placeholder="Enter password">
                            </div>
                            <button class="btn-primary" onclick="app.login()">Sign In</button>
                            <p style="margin-top: 16px; text-align: center; color: #666; font-size: 14px;">
                                Demo: username = role name, password = demo123
                            </p>
                        </div>

                        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e5ea;">
                            <p style="text-align: center; color: #666; font-size: 14px;">
                                Not affiliated with a school?<br>
                                <a href="individual/individual.html" style="color: #007aff; text-decoration: none; font-weight: 600;">Try Individual Mode →</a>
                            </p>
                        </div>
                    </div>

                    <!-- Registration Form -->
                    <div id="register-section" style="display: none;">
                        <div class="form-group">
                            <label>Role</label>
                            <select id="reg-role">
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="parent">Parent</option>
                                <option value="individual">Individual (Personal Use)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="reg-name" placeholder="Enter your full name">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="reg-email" placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" id="reg-username" placeholder="Choose a username">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="reg-password" placeholder="Choose a password">
                        </div>
                        <button class="btn-primary" onclick="app.register()">Create Account</button>
                    </div>
                </div>
            </div>
        `;
    }

    switchAuthMode(mode) {
        this.authMode = mode;
        const loginSection = document.getElementById('login-section');
        const registerSection = document.getElementById('register-section');
        const subtitle = document.getElementById('subtitle');
        const tabs = document.querySelectorAll('.auth-tab');

        // Return early if elements don't exist
        if (!loginSection || !registerSection || !subtitle) {
            return;
        }

        tabs.forEach(tab => tab.classList.remove('active'));

        if (mode === 'login') {
            loginSection.style.display = 'block';
            registerSection.style.display = 'none';
            subtitle.textContent = 'Select your role to continue';
            tabs[0].classList.add('active');
        } else {
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
            subtitle.textContent = 'Create a new account';
            tabs[1].classList.add('active');
        }
    }

    selectRole(role) {
        this.selectedRole = role;
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('username').value = role;
        document.getElementById('username').focus();
    }

    async register() {
        const role = document.getElementById('reg-role').value;
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        if (!name || !email || !username || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            // Create Firebase user with email format
            const firebaseEmail = `${username}@schoolmgmt.local`;
            const userCredential = await auth.createUserWithEmailAndPassword(firebaseEmail, password);
            const firebaseUser = userCredential.user;

            // Create user profile in Firestore
            const newUser = {
                username,
                name,
                email,
                role,
                avatar: this.getAvatarForRole(role),
                studyCoins: 0,
                createdAt: new Date().toISOString(),
                profile: role === 'student' ? {
                    academicInfo: {
                        currentGPA: 0,
                        attendance: 100
                    }
                } : {}
            };

            await db.collection('users').doc(firebaseUser.uid).set(newUser);

            this.showMessage('Account created successfully! Please login.', 'success');
            this.switchAuthMode('login');
        } catch (error) {
            console.error('Registration error:', error);
            if (error.code === 'auth/email-already-in-use') {
                this.showMessage('Username already exists', 'error');
            } else if (error.code === 'auth/weak-password') {
                this.showMessage('Password is too weak (min 6 characters)', 'error');
            } else {
                this.showMessage('Registration failed: ' + error.message, 'error');
            }
        }
    }

    getAvatarForRole(role) {
        const avatars = {
            student: '👨‍🎓',
            teacher: '👩‍🏫',
            admin: '👨‍💼',
            parent: '👨‍👩‍👧‍👦',
            individual: '👤'
        };
        return avatars[role] || '👤';
    }

    async login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showMessage('Please enter username and password', 'error');
            return;
        }

        try {
            // Use email format: username@schoolmgmt.local
            const email = `${username}@schoolmgmt.local`;

            // Sign in with Firebase
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const firebaseUser = userCredential.user;

            // Get user data from Firestore
            const userDoc = await db.collection('users').doc(firebaseUser.uid).get();

            if (userDoc.exists) {
                this.currentUser = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email,
                    ...userDoc.data()
                };
                this.showDashboard();
                this.showMessage('Welcome back, ' + this.currentUser.name + '!', 'success');
            } else {
                this.showMessage('User profile not found', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);

            // Fallback to demo credentials from localStorage
            const demoUsers = JSON.parse(localStorage.getItem('sms_users') || '[]');
            const demoUser = demoUsers.find(u => u.username === username && u.password === password);

            if (demoUser) {
                this.currentUser = demoUser;
                this.showDashboard();
                this.showMessage('Welcome back, ' + this.currentUser.name + '!', 'success');
                return;
            }

            if (error.code === 'auth/user-not-found') {
                this.showMessage('User not found', 'error');
            } else if (error.code === 'auth/wrong-password') {
                this.showMessage('Invalid password', 'error');
            } else {
                this.showMessage('Login failed: ' + error.message, 'error');
            }
        }
    }

    async logout() {
        try {
            await auth.signOut();
            this.currentUser = null;
            this.showLogin();
            this.showMessage('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('Logout failed', 'error');
        }
    }

    // Show dashboard
    showDashboard() {
        // Apply saved theme
        const savedTheme = localStorage.getItem('app_theme') || 'default';
        document.body.className = savedTheme === 'default' ? '' : `theme-${savedTheme}`;

        // Apply saved background
        const savedBg = localStorage.getItem('app_background') || 'none';
        document.body.setAttribute('data-background', savedBg);

        // Apply custom colors if custom theme
        if (savedTheme === 'custom') {
            setTimeout(() => this.applyCustomColors(), 100);
        }

        // Setup notifications if permission already granted
        if (Notification.permission === 'granted') {
            this.setupNotifications();
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard">
                <div class="sidebar">
                    <div class="sidebar-header">
                        <h2>${this.currentUser.avatar} ${this.currentUser.name}</h2>
                        <p>${this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1)}</p>
                        <div class="study-coins-display">
                            <span class="coin-icon">🪙</span>
                            <span class="coin-amount">${this.currentUser.studyCoins || 0}</span>
                            <span class="coin-label">Study Coins</span>
                        </div>
                    </div>
                    
                    <div class="nav-menu">
                        <div class="nav-section">
                            <button class="nav-btn active" data-view="dashboard" onclick="app.navigateTo('dashboard', event)">
                                📊 Dashboard
                            </button>
                        </div>

                        <div class="nav-section">
                            <button class="nav-btn" data-view="study" onclick="app.toggleStudyMenu(event)">
                                📚 Study
                            </button>
                            <div class="nav-subsection" id="study-menu" style="display: none;">
                                <button class="nav-btn" data-view="tests" onclick="app.navigateTo('tests', event)">
                                    🎯 Tests
                                </button>
                                <button class="nav-btn" data-view="pomodoro" onclick="app.navigateTo('pomodoro', event)">
                                    ⏱️ Pomodoro
                                </button>
                                <button class="nav-btn" data-view="files" onclick="app.navigateTo('files', event)">
                                    📁 Files
                                </button>
                                <button class="nav-btn" data-view="idle" onclick="app.navigateTo('idle', event)">
                                    💻 IDLE
                                </button>
                                <button class="nav-btn" data-view="groups" onclick="app.navigateTo('groups', event)">
                                    👥 Study Groups
                                </button>
                                <button class="nav-btn" data-view="spaced" onclick="app.navigateTo('spaced', event)">
                                    🔄 Spaced Repetition
                                </button>
                                <button class="nav-btn" data-view="conrad" onclick="app.navigateTo('conrad', event)">
                                    🤖 Conrad AI
                                </button>
                            </div>
                        </div>

                        <div class="nav-section">
                            <button class="nav-btn" data-view="assignments" onclick="app.navigateTo('assignments', event)">
                                📝 Assignments
                            </button>
                        </div>

                        <div class="nav-section">
                            <button class="nav-btn" data-view="grades" onclick="app.navigateTo('grades', event)">
                                🎯 Grades
                            </button>
                        </div>

                        <div class="nav-section">
                            <button class="nav-btn" data-view="coins" onclick="app.toggleCoinsMenu(event)">
                                🪙 Coins
                            </button>
                            <div class="nav-subsection" id="coins-menu" style="display: none;">
                                <button class="nav-btn" data-view="shop" onclick="app.navigateTo('shop', event)">
                                    🛒 Shop
                                </button>
                                <button class="nav-btn" data-view="surveys" onclick="app.navigateTo('surveys', event)">
                                    📋 Surveys
                                </button>
                            </div>
                        </div>

                        <div class="nav-section">
                            <button class="nav-btn" data-view="websites" onclick="app.navigateTo('websites', event)">
                                🌐 Important Websites
                            </button>
                        </div>

                        <div class="nav-section">
                            <button class="nav-btn" data-view="settings" onclick="app.navigateTo('settings', event)">
                                ⚙️ Settings
                            </button>
                        </div>
                    </div>
                    
                    <button class="logout-btn" onclick="app.logout()">
                        🚪 Logout
                    </button>
                </div>
                
                <div class="main-content" id="main-content">
                    ${this.getDashboardContent()}
                </div>
            </div>
        `;
    }

    updateCoinsDisplay() {
        // Update sidebar coins
        const coinsDisplay = document.querySelector('.coin-amount');
        if (coinsDisplay) {
            coinsDisplay.textContent = this.currentUser.studyCoins || 0;
        }

        // Update mobile header coins
        const viewHeader = document.querySelector('.view-header');
        if (viewHeader) {
            viewHeader.setAttribute('data-coins', this.currentUser.studyCoins || 0);
        }
    }

    navigateTo(view, event) {
        this.currentView = view;

        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }

        // Update content
        const content = document.getElementById('main-content');
        switch (view) {
            case 'dashboard':
                content.innerHTML = this.getDashboardContent();
                break;
            case 'timetable':
                content.innerHTML = this.getTimetableContent();
                break;
            case 'assignments':
                content.innerHTML = this.getAssignmentsContent();
                break;
            case 'grades':
                content.innerHTML = this.getGradesContent();
                break;
            case 'files':
                content.innerHTML = this.getFilesContent();
                break;
            case 'pomodoro':
                content.innerHTML = this.getPomodoroContent();
                this.initPomodoro();
                break;
            case 'surveys':
                content.innerHTML = this.getSurveysContent();
                break;
            case 'tests':
                content.innerHTML = this.getTestsContent();
                break;
            case 'idle':
                content.innerHTML = this.getIdleContent();
                break;
            case 'shop':
                content.innerHTML = this.getShopContent();
                break;
            case 'conrad':
                content.innerHTML = this.getConradContent();
                break;
            case 'groups':
                content.innerHTML = this.getGroupsContent();
                break;
            case 'voice':
                content.innerHTML = this.getVoiceRecorderContent();
                break;
            case 'spaced':
                content.innerHTML = this.getSpacedRepetitionContent();
                break;
            case 'websites':
                content.innerHTML = this.getWebsitesContent();
                break;
            case 'settings':
                content.innerHTML = this.getSettingsContent();
                break;
        }
    }

    toggleStudyMenu(event) {
        if (event) event.preventDefault();
        const studyMenu = document.getElementById('study-menu');
        if (studyMenu) {
            studyMenu.style.display = studyMenu.style.display === 'none' ? 'flex' : 'none';
        }
    }

    toggleCoinsMenu(event) {
        if (event) event.preventDefault();
        const coinsMenu = document.getElementById('coins-menu');
        if (coinsMenu) {
            coinsMenu.style.display = coinsMenu.style.display === 'none' ? 'flex' : 'none';
        }
    }

    getDashboardContent() {
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const grades = JSON.parse(localStorage.getItem('sms_grades') || '[]');
        const subjects = JSON.parse(localStorage.getItem('sms_subjects') || '[]');

        // Check for upcoming assignments (due within 3 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison

        const upcomingAssignments = assignments.filter(a => {
            if (a.status === 'completed') return false;
            const dueDate = new Date(a.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilDue >= 0 && daysUntilDue <= 3;
        });

        // Check for overdue assignments (due date has passed)
        const overdueAssignments = assignments.filter(a => {
            if (a.status === 'completed') return false;
            const dueDate = new Date(a.dueDate + 'T23:59:59');
            const todayStart = new Date(today);
            todayStart.setHours(0, 0, 0, 0);
            return dueDate < todayStart;
        });

        return `
            <div class="view-header">
                <h2>📊 Dashboard</h2>
                <p>Welcome back, ${this.currentUser.name}</p>
            </div>
            
            ${overdueAssignments.length > 0 ? `
                <div class="alert alert-danger">
                    <h3>⚠️ Overdue Assignments (${overdueAssignments.length})</h3>
                    ${overdueAssignments.map(a => `
                        <div class="alert-item">
                            <strong>${a.title}</strong> - Due: ${a.dueDate}
                            <button class="btn-small" onclick="app.navigateTo('assignments')">View</button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${upcomingAssignments.length > 0 ? `
                <div class="alert alert-warning">
                    <h3>⏰ Due Soon (${upcomingAssignments.length})</h3>
                    ${upcomingAssignments.map(a => {
            const dueDate = new Date(a.dueDate);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return `
                            <div class="alert-item">
                                <strong>${a.title}</strong> - Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}
                                <button class="btn-small" onclick="app.navigateTo('assignments')">View</button>
                            </div>
                        `;
        }).join('')}
                </div>
            ` : ''}

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📝</div>
                    <div class="stat-info">
                        <h3>${assignments.length}</h3>
                        <p>Assignments</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-info">
                        <h3>${grades.length}</h3>
                        <p>Graded</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🪙</div>
                    <div class="stat-info">
                        <h3>${this.currentUser.studyCoins || 0}</h3>
                        <p>Study Coins</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>🏆 Achievements</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 16px;">
                    ${this.getAchievementBadges()}
                </div>
            </div>

            <div classrd">
                <h3>📅 Today's Schedule</h3>
                <p>Your classes for today</p>
            </div>

            <div class="card">
                <h3>📝 Upcoming Assignments</h3>
                ${assignments.slice(0, 3).map(a => `
                    <div class="assignment-item">
                        <div class="assignment-info">
                            <h4>${a.title}</h4>
                            <div class="assignment-meta">
                                <span>📚 ${a.subjectName}</span>
                                <span>📅 Due: ${a.dueDate}</span>
                            </div>
                        </div>
                        <span class="assignment-status status-${a.status}">${a.status}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getTimetableContent() {
        const timetable = JSON.parse(localStorage.getItem('sms_timetable') || '{}');
        const periods = JSON.parse(localStorage.getItem('sms_periods') || '[]');
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const canManagePeriods = ['admin', 'student', 'individual'].includes(this.currentUser.role);

        return `
            <div class="view-header">
                <h2>📅 Class Timetable</h2>
                <p>Your weekly schedule - Click any cell to edit</p>
                ${canManagePeriods ? `
                    <div class="header-actions">
                        <button class="btn-primary" onclick="app.addPeriod()">➕ Add Period</button>
                        <button class="btn-secondary" onclick="app.managePeriods()">⏰ Manage Periods</button>
                    </div>
                ` : ''}
            </div>

            <div class="card">
                <div class="timetable-grid">
                    <div class="timetable-header">
                        <div class="time-header">Time</div>
                        ${days.map(day => `
                            <div class="day-header">${day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        `).join('')}
                    </div>
                    
                    ${periods.map(period => `
                        <div class="timetable-row">
                            <div class="time-cell">
                                <div class="period-name">${period.name}</div>
                                <div class="period-time">${period.startTime} - ${period.endTime}</div>
                                ${canManagePeriods ? `
                                    <button class="edit-period-btn" onclick="app.editPeriodTime(${period.period})" title="Edit time">
                                        ✏️
                                    </button>
                                    <button class="delete-period-btn" onclick="app.deletePeriod(${period.period})" title="Delete period">
                                        🗑️
                                    </button>
                                ` : ''}
                            </div>
                            ${days.map(day => {
            const daySchedule = timetable.schedule?.find(d => d.day === day);
            const periodClass = daySchedule?.periods.find(p => p.period === period.period);

            return `
                                    <div class="class-cell ${periodClass ? 'has-class' : 'no-class'} ${canManagePeriods ? 'editable' : ''}" 
                                         onclick="${canManagePeriods ? `app.editClass('${day}', ${period.period})` : ''}">
                                        ${periodClass ? `
                                            <div class="class-details">
                                                <div class="subject-name">${periodClass.subjectName}</div>
                                                <div class="teacher-name">${periodClass.teacher}</div>
                                                <div class="room-name">${periodClass.room}</div>
                                            </div>
                                            ${canManagePeriods ? `
                                                <button class="delete-class-btn" onclick="event.stopPropagation(); app.deleteClass('${day}', ${period.period})" title="Remove class">
                                                    ✕
                                                </button>
                                            ` : ''}
                                        ` : `
                                            <div class="no-class-text">${canManagePeriods ? '+ Add Class' : 'Free Period'}</div>
                                        `}
                                    </div>
                                `;
        }).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    addPeriod() {
        const periods = JSON.parse(localStorage.getItem('sms_periods') || '[]');
        const lastPeriod = periods[periods.length - 1];
        const newPeriodNumber = lastPeriod ? lastPeriod.period + 1 : 1;

        const newPeriod = {
            period: newPeriodNumber,
            startTime: '14:00',
            endTime: '14:45',
            name: `Period ${newPeriodNumber}`
        };

        periods.push(newPeriod);
        localStorage.setItem('sms_periods', JSON.stringify(periods));

        this.showMessage('Period added successfully!', 'success');
        this.navigateTo('timetable');
    }

    deletePeriod(periodNumber) {
        if (!confirm('Are you sure you want to delete this period?')) return;

        const periods = JSON.parse(localStorage.getItem('sms_periods') || '[]');
        const filteredPeriods = periods.filter(p => p.period !== periodNumber);
        localStorage.setItem('sms_periods', JSON.stringify(filteredPeriods));

        this.showMessage('Period deleted successfully!', 'success');
        this.navigateTo('timetable');
    }

    managePeriods() {
        const periods = JSON.parse(localStorage.getItem('sms_periods') || '[]');

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⏰ Manage Periods</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="modal-body">
                    <h3>Current Periods</h3>
                    ${periods.map(p => `
                        <div class="period-item">
                            <span>${p.name}: ${p.startTime} - ${p.endTime}</span>
                            <div>
                                <button class="btn-secondary btn-small" onclick="app.editPeriodTime(${p.period}); this.closest('.modal').remove();">Edit</button>
                                <button class="btn-danger btn-small" onclick="app.deletePeriod(${p.period}); this.closest('.modal').remove();">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                    <button class="btn-primary" onclick="app.addPeriod(); this.closest('.modal').remove();">Add New Period</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    editPeriodTime(periodNumber) {
        const periods = JSON.parse(localStorage.getItem('sms_periods') || '[]');
        const period = periods.find(p => p.period === periodNumber);
        if (!period) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>✏️ Edit Period ${periodNumber}</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Period Name</label>
                        <input type="text" id="periodName" value="${period.name}" placeholder="e.g., Period 1">
                    </div>
                    <div class="form-group">
                        <label>Start Time</label>
                        <input type="time" id="startTime" value="${period.startTime}">
                    </div>
                    <div class="form-group">
                        <label>End Time</label>
                        <input type="time" id="endTime" value="${period.endTime}">
                    </div>
                    <button class="btn-primary" onclick="app.savePeriodTime(${periodNumber})">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    savePeriodTime(periodNumber) {
        const periods = JSON.parse(localStorage.getItem('sms_periods') || '[]');
        const period = periods.find(p => p.period === periodNumber);
        if (!period) return;

        period.name = document.getElementById('periodName').value || `Period ${periodNumber}`;
        period.startTime = document.getElementById('startTime').value;
        period.endTime = document.getElementById('endTime').value;

        localStorage.setItem('sms_periods', JSON.stringify(periods));
        document.querySelector('.modal').remove();
        this.showMessage('Period updated successfully!', 'success');
        this.navigateTo('timetable');
    }

    editClass(day, periodNumber) {
        const timetable = JSON.parse(localStorage.getItem('sms_timetable') || '{ "schedule": [] }');

        let daySchedule = timetable.schedule.find(d => d.day === day);
        if (!daySchedule) {
            daySchedule = { day: day, periods: [] };
            timetable.schedule.push(daySchedule);
        }

        const existingClass = daySchedule.periods.find(p => p.period === periodNumber);

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${existingClass ? '✏️ Edit' : '➕ Add'} Class</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="modal-body">
                    <h3>${day.charAt(0).toUpperCase() + day.slice(1)} - Period ${periodNumber}</h3>
                    
                    <div class="form-group">
                        <label>Subject Name *</label>
                        <input type="text" id="classSubjectName" value="${existingClass ? existingClass.subjectName : ''}" placeholder="e.g., Mathematics, English, Science">
                        <small style="color: #666; font-size: 13px; margin-top: 4px; display: block;">Type any subject name</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Teacher *</label>
                        <input type="text" id="classTeacher" value="${existingClass ? existingClass.teacher : ''}" placeholder="e.g., Dr. Smith">
                    </div>
                    
                    <div class="form-group">
                        <label>Room *</label>
                        <input type="text" id="classRoom" value="${existingClass ? existingClass.room : ''}" placeholder="e.g., Room 101">
                    </div>
                    
                    <button class="btn-primary" onclick="app.saveClass('${day}', ${periodNumber})">
                        ${existingClass ? 'Save Changes' : 'Add Class'}
                    </button>
                    ${existingClass ? `
                        <button class="btn-danger" onclick="app.deleteClass('${day}', ${periodNumber}); this.closest('.modal').remove();">
                            Delete Class
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    saveClass(day, periodNumber) {
        const subjectName = document.getElementById('classSubjectName').value.trim();
        const teacher = document.getElementById('classTeacher').value.trim();
        const room = document.getElementById('classRoom').value.trim();

        if (!subjectName || !teacher || !room) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const timetable = JSON.parse(localStorage.getItem('sms_timetable') || '{ "schedule": [] }');
        let daySchedule = timetable.schedule.find(d => d.day === day);

        if (!daySchedule) {
            daySchedule = { day: day, periods: [] };
            timetable.schedule.push(daySchedule);
        }

        const existingClassIndex = daySchedule.periods.findIndex(p => p.period === periodNumber);
        const classData = {
            period: periodNumber,
            subject: subjectName.toLowerCase().replace(/\s+/g, '_'), // Generate ID from name
            subjectName: subjectName,
            teacher: teacher,
            room: room
        };

        if (existingClassIndex >= 0) {
            daySchedule.periods[existingClassIndex] = classData;
        } else {
            daySchedule.periods.push(classData);
        }

        localStorage.setItem('sms_timetable', JSON.stringify(timetable));
        document.querySelector('.modal').remove();
        this.showMessage('Class saved successfully!', 'success');
        this.navigateTo('timetable');
    }

    deleteClass(day, periodNumber) {
        if (!confirm('Are you sure you want to remove this class?')) return;

        const timetable = JSON.parse(localStorage.getItem('sms_timetable') || '{ "schedule": [] }');
        const daySchedule = timetable.schedule.find(d => d.day === day);

        if (daySchedule) {
            daySchedule.periods = daySchedule.periods.filter(p => p.period !== periodNumber);
            localStorage.setItem('sms_timetable', JSON.stringify(timetable));
            this.showMessage('Class removed successfully!', 'success');
            this.navigateTo('timetable');
        }
    }

    showAddAssignmentModal() {
        const subjects = JSON.parse(localStorage.getItem('sms_subjects') || '[]');

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>➕ Add New Assignment</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Title *</label>
                        <input type="text" id="assignment-title" placeholder="Enter assignment title">
                    </div>
                    <div class="form-group">
                        <label>Subject *</label>
                        <select id="assignment-subject">
                            <option value="">Select a subject</option>
                            ${subjects.map(s => `
                                <option value="${s.id}" data-name="${s.name}">${s.name}</option>
                            `).join('')}
                            <option value="other" data-name="Other">Other (Custom Subject)</option>
                        </select>
                    </div>
                    <div class="form-group" id="custom-subject-group" style="display: none;">
                        <label>Custom Subject Name *</label>
                        <input type="text" id="custom-subject-name" placeholder="Enter subject name">
                    </div>
                    <div class="form-group">
                        <label>Due Date *</label>
                        <input type="date" id="assignment-date">
                    </div>
                    <div class="form-group">
                        <label>Type</label>
                        <select id="assignment-type">
                            <option value="homework">Homework</option>
                            <option value="project">Project</option>
                            <option value="exam">Exam</option>
                            <option value="quiz">Quiz</option>
                            <option value="reading">Reading</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Priority</label>
                        <select id="assignment-priority">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Estimated Time (minutes)</label>
                        <input type="number" id="assignment-time" placeholder="e.g., 60" min="5" step="5">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="assignment-recurring">
                            Recurring Task
                        </label>
                    </div>
                    <div class="form-group" id="recurring-options" style="display: none;">
                        <label>Repeat Every</label>
                        <select id="recurring-frequency">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div class="form-group" id="recurring-end-date" style="display: none;">
                        <label>Stop Recurring On</label>
                        <input type="date" id="recurring-end-date-input" placeholder="When should this task stop repeating?">
                        <small style="color: #666; font-size: 13px; margin-top: 4px; display: block;">Leave empty for no end date</small>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="assignment-description" placeholder="Enter assignment description" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Steps to Complete (Optional)</label>
                        <div id="steps-container">
                            <div class="step-item">
                                <input type="text" class="step-input" placeholder="Step 1">
                                <button class="btn-small btn-danger" onclick="this.parentElement.remove()">✕</button>
                            </div>
                        </div>
                        <button class="btn-secondary btn-small" onclick="app.addStep()" style="margin-top: 8px;">+ Add Step</button>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        <button class="btn-primary" onclick="app.addAssignment()">Add Assignment</button>
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add subject change handler
        document.getElementById('assignment-subject').addEventListener('change', function () {
            const customGroup = document.getElementById('custom-subject-group');
            if (this.value === 'other') {
                customGroup.style.display = 'block';
            } else {
                customGroup.style.display = 'none';
            }
        });

        // Add recurring checkbox handler
        document.getElementById('assignment-recurring').addEventListener('change', function () {
            const recurringOptions = document.getElementById('recurring-options');
            const recurringEndDate = document.getElementById('recurring-end-date');
            if (this.checked) {
                recurringOptions.style.display = 'block';
                recurringEndDate.style.display = 'block';
            } else {
                recurringOptions.style.display = 'none';
                recurringEndDate.style.display = 'none';
            }
        });
    }

    addStep() {
        const container = document.getElementById('steps-container');
        const stepCount = container.children.length + 1;
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <input type="text" class="step-input" placeholder="Step ${stepCount}">
            <button class="btn-small btn-danger" onclick="this.parentElement.remove()">✕</button>
        `;
        container.appendChild(stepDiv);
    }

    addAssignment() {
        const title = document.getElementById('assignment-title').value.trim();
        const subjectSelect = document.getElementById('assignment-subject');
        let subject = subjectSelect.value;
        let subjectName = subjectSelect.selectedOptions[0]?.getAttribute('data-name') || '';

        // Handle custom subject
        if (subject === 'other') {
            const customName = document.getElementById('custom-subject-name').value.trim();
            if (!customName) {
                this.showMessage('Please enter a custom subject name', 'error');
                return;
            }
            subject = 'custom_' + Date.now();
            subjectName = customName;
        }

        const dueDate = document.getElementById('assignment-date').value;
        const type = document.getElementById('assignment-type').value;
        const priority = document.getElementById('assignment-priority').value;
        const estimatedTime = document.getElementById('assignment-time').value;
        const isRecurring = document.getElementById('assignment-recurring').checked;
        const recurringFrequency = isRecurring ? document.getElementById('recurring-frequency').value : null;
        const recurringEndDate = isRecurring ? document.getElementById('recurring-end-date-input').value : null;
        const description = document.getElementById('assignment-description').value.trim();

        // Collect steps
        const stepInputs = document.querySelectorAll('.step-input');
        const steps = Array.from(stepInputs)
            .map(input => input.value.trim())
            .filter(step => step.length > 0);

        if (!title) {
            this.showMessage('Please enter an assignment title', 'error');
            return;
        }
        if (!subject) {
            this.showMessage('Please select a subject', 'error');
            return;
        }
        if (!dueDate) {
            this.showMessage('Please select a due date', 'error');
            return;
        }

        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');

        const newAssignment = {
            id: 'assign_' + Date.now(),
            title,
            subject,
            subjectName,
            dueDate,
            type,
            priority,
            estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
            isRecurring,
            recurringFrequency,
            recurringEndDate,
            status: 'pending',
            description: description || 'No description provided',
            steps: steps,
            completedSteps: [],
            storageLocation: null
        };

        assignments.push(newAssignment);
        localStorage.setItem('sms_assignments', JSON.stringify(assignments));

        document.querySelector('.modal').remove();
        this.showMessage('Assignment added successfully!', 'success');
        this.navigateTo('assignments');
    }

    completeAssignment(assignmentId) {
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const assignment = assignments.find(a => a.id === assignmentId);

        if (assignment) {
            // Show storage location modal
            this.showStorageLocationModal(assignmentId, assignment.title);
        }
    }

    showStorageLocationModal(assignmentId, assignmentTitle) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📁 Where did you store it?</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 20px;">You completed: <strong>${assignmentTitle}</strong></p>
                    <p style="margin-bottom: 16px; color: #666;">Where did you keep the completed work?</p>
                    
                    <div class="storage-options">
                        <button class="storage-option-btn" onclick="app.saveStorageLocation('${assignmentId}', 'HW Folder')">
                            📂 HW Folder
                        </button>
                        <button class="storage-option-btn" onclick="app.saveStorageLocation('${assignmentId}', 'Case-It')">
                            💼 Case-It
                        </button>
                        <button class="storage-option-btn" onclick="app.saveStorageLocation('${assignmentId}', 'Accordion Folder')">
                            📁 Accordion Folder
                        </button>
                        <button class="storage-option-btn" onclick="app.saveStorageLocation('${assignmentId}', 'Binder')">
                            📒 Binder
                        </button>
                        <button class="storage-option-btn" onclick="app.saveStorageLocation('${assignmentId}', 'Backpack')">
                            🎒 Backpack
                        </button>
                        <button class="storage-option-btn" onclick="app.showCustomStorageInput('${assignmentId}')">
                            ✏️ Other
                        </button>
                    </div>
                    
                    <div id="custom-storage-input" style="display: none; margin-top: 16px;">
                        <input type="text" id="custom-storage-text" placeholder="Enter custom location" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                        <button class="btn-primary" onclick="app.saveCustomStorage('${assignmentId}')" style="margin-top: 8px;">Save</button>
                    </div>
                    
                    <button class="btn-secondary" onclick="app.skipStorageLocation('${assignmentId}')" style="margin-top: 16px; width: 100%;">
                        Skip (Don't track location)
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showCustomStorageInput(assignmentId) {
        document.getElementById('custom-storage-input').style.display = 'block';
        document.getElementById('custom-storage-text').focus();
    }

    saveCustomStorage(assignmentId) {
        const customLocation = document.getElementById('custom-storage-text').value.trim();
        if (!customLocation) {
            this.showMessage('Please enter a location', 'error');
            return;
        }
        this.saveStorageLocation(assignmentId, customLocation);
    }

    saveStorageLocation(assignmentId, location) {
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const assignment = assignments.find(a => a.id === assignmentId);

        if (assignment) {
            assignment.status = 'completed';
            assignment.completedAt = new Date().toISOString();
            assignment.storageLocation = location;

            // Handle recurring assignments - create next instance
            if (assignment.isRecurring) {
                const nextDueDate = this.calculateNextDueDate(assignment.dueDate, assignment.recurringFrequency);

                // Check if we should create another instance
                const shouldContinue = !assignment.recurringEndDate ||
                    new Date(nextDueDate) <= new Date(assignment.recurringEndDate);

                if (shouldContinue) {
                    const newAssignment = {
                        ...assignment,
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        dueDate: nextDueDate,
                        status: 'pending',
                        completedAt: null,
                        storageLocation: null
                    };
                    assignments.push(newAssignment);
                }
            }

            localStorage.setItem('sms_assignments', JSON.stringify(assignments));

            document.querySelector('.modal').remove();
            this.showMessage(`Assignment completed! Stored in: ${location}`, 'success');
            this.navigateTo('assignments');
        }
    }

    skipStorageLocation(assignmentId) {
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const assignment = assignments.find(a => a.id === assignmentId);

        if (assignment) {
            assignment.status = 'completed';
            assignment.completedAt = new Date().toISOString();
            assignment.storageLocation = 'Not tracked';

            // Handle recurring assignments - create next instance
            if (assignment.isRecurring) {
                const nextDueDate = this.calculateNextDueDate(assignment.dueDate, assignment.recurringFrequency);

                // Check if we should create another instance
                const shouldContinue = !assignment.recurringEndDate ||
                    new Date(nextDueDate) <= new Date(assignment.recurringEndDate);

                if (shouldContinue) {
                    const newAssignment = {
                        ...assignment,
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        dueDate: nextDueDate,
                        status: 'pending',
                        completedAt: null,
                        storageLocation: null
                    };
                    assignments.push(newAssignment);
                }
            }

            localStorage.setItem('sms_assignments', JSON.stringify(assignments));

            document.querySelector('.modal').remove();
            this.showMessage('Assignment marked as complete!', 'success');
            this.navigateTo('assignments');
        }
    }

    undoAssignment(assignmentId) {
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const assignment = assignments.find(a => a.id === assignmentId);

        if (assignment) {
            assignment.status = 'pending';
            delete assignment.completedAt;
            localStorage.setItem('sms_assignments', JSON.stringify(assignments));
            this.showMessage('Assignment marked as pending!', 'success');
            this.navigateTo('assignments');
        }
    }

    deleteAssignment(assignmentId) {
        if (!confirm('Are you sure you want to delete this assignment?')) return;

        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const filteredAssignments = assignments.filter(a => a.id !== assignmentId);
        localStorage.setItem('sms_assignments', JSON.stringify(filteredAssignments));

        this.showMessage('Assignment deleted successfully!', 'success');
        this.navigateTo('assignments');
    }

    calculateNextDueDate(currentDueDate, frequency) {
        const current = new Date(currentDueDate);
        let nextDate = new Date(current);

        // Calculate next date based on frequency
        if (frequency === 'daily') {
            nextDate.setDate(nextDate.getDate() + 1);
        } else if (frequency === 'weekly') {
            nextDate.setDate(nextDate.getDate() + 7);
        } else if (frequency === 'biweekly') {
            nextDate.setDate(nextDate.getDate() + 14);
        } else if (frequency === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        // Skip weekends - move to next Monday if lands on weekend
        const dayOfWeek = nextDate.getDay();
        if (dayOfWeek === 0) { // Sunday
            nextDate.setDate(nextDate.getDate() + 1);
        } else if (dayOfWeek === 6) { // Saturday
            nextDate.setDate(nextDate.getDate() + 2);
        }

        // Return in YYYY-MM-DD format
        return nextDate.toISOString().split('T')[0];
    }

    getAssignmentsContent() {
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');

        // Count recurring assignments by title and subject
        const recurringCounts = {};
        assignments.forEach(a => {
            if (a.isRecurring && a.status === 'pending') {
                const key = `${a.title}_${a.subjectName}`;
                recurringCounts[key] = (recurringCounts[key] || 0) + 1;
            }
        });

        return `
            <div class="view-header">
                <h2>📝 Assignments</h2>
                <p>Track your assignments and deadlines</p>
                <button class="btn-primary" onclick="app.showAddAssignmentModal()" style="width: auto; padding: 12px 24px;">
                    ➕ Add Assignment
                </button>
            </div>

            <div class="card">
                <h3>All Assignments</h3>
                ${assignments.length === 0 ? `
                    <p style="text-align: center; color: #999; padding: 40px 20px;">
                        No assignments yet. Click "Add Assignment" to create one!
                    </p>
                ` : assignments.map(a => {
            const recurringKey = `${a.title}_${a.subjectName}`;
            const recurringCount = recurringCounts[recurringKey];

            return `
                    <div class="assignment-item ${a.status === 'completed' ? 'assignment-completed' : ''}">
                        <div class="assignment-info">
                            <h4>
                                ${a.status === 'completed' ? '✓ ' : ''}${a.title}
                                ${a.isRecurring && a.status === 'pending' && recurringCount > 1 ?
                    `<span class="recurring-badge" title="${recurringCount} pending instances">🔄 ${recurringCount}</span>`
                    : ''}
                            </h4>
                            <div class="assignment-meta">
                                <span>📚 ${a.subjectName}</span>
                                <span>📅 Due: ${a.dueDate}</span>
                                ${a.isRecurring ? `<span>🔁 ${a.recurringFrequency}</span>` : ''}
                            </div>
                            <p style="margin-top: 8px; color: #666;">${a.description}</p>
                        </div>
                        <div class="assignment-actions">
                            <span class="assignment-status status-${a.status}">${a.status}</span>
                            ${a.status === 'pending' ? `
                                <button class="btn-complete" onclick="app.completeAssignment('${a.id}')" title="Mark as complete">
                                    ✓ Complete
                                </button>
                            ` : `
                                <button class="btn-undo" onclick="app.undoAssignment('${a.id}')" title="Mark as pending">
                                    ↶ Undo
                                </button>
                            `}
                            <button class="btn-delete" onclick="app.deleteAssignment('${a.id}')" title="Delete assignment">
                                🗑️
                            </button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        `;
    }

    getGradesContent() {
        const grades = JSON.parse(localStorage.getItem('sms_grades') || '[]');
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');

        return `
            <div class="view-header">
                <h2>🎯 My Grades</h2>
                <p>Track your academic progress</p>
                <div style="display: flex; gap: 12px; margin-top: 16px;">
                    <button class="btn-primary" onclick="app.showGradeCalculator()" style="width: auto; padding: 12px 24px;">
                        📊 Grade Calculator
                    </button>
                    ${this.currentUser.role === 'student' ? `
                        <button class="btn-secondary" onclick="app.deleteAllGrades()" style="width: auto; padding: 12px 24px;">
                            🗑️ Delete All Grades
                        </button>
                        <button class="btn-secondary" onclick="app.resetGrades()" style="width: auto; padding: 12px 24px;">
                            🔄 Reset Grades
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🎓</div>
                    <div class="stat-info">
                        <h3>3.5</h3>
                        <p>Current GPA</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-info">
                        <h3>${grades.length}</h3>
                        <p>Graded Assignments</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-info">
                        <h3>85%</h3>
                        <p>Average Score</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>Recent Grades</h3>
                ${grades.length === 0 ? `
                    <p style="text-align: center; color: #999; padding: 20px;">No grades yet. Complete assignments to earn grades!</p>
                ` : grades.map(g => {
            const assignment = assignments.find(a => a.id === g.assignmentId);
            return `
                        <div class="grade-item" style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <h4>${assignment?.title || 'Unknown Assignment'}</h4>
                                <p style="color: #666; font-size: 14px;">${g.gradedAt}</p>
                            </div>
                            <div class="grade-score">
                                <span class="percentage ${this.getGradeClass(g.percentage)}">${g.percentage}%</span>
                                <span class="letter-grade">${g.letterGrade}</span>
                            </div>
                            ${this.currentUser.role === 'student' ? `
                                <button class="btn-small btn-danger" onclick="app.deleteGrade('${g.id}')" style="margin-left: 12px;">
                                    🗑️ Delete
                                </button>
                            ` : ''}
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    getFilesContent() {
        const files = JSON.parse(localStorage.getItem('sms_files') || '[]');

        return `
            <div class="view-header">
                <h2>📁 Files & Uploads</h2>
                <p>Upload and manage your files</p>
            </div>

            <div class="card">
                <h3>Upload Files</h3>
                <div class="upload-section">
                    <div class="upload-area" onclick="document.getElementById('fileInput').click()">
                        <div class="upload-icon">📤</div>
                        <p>Click to upload files</p>
                        <small>Supported: PDF, DOCX, YAML, TXT, Images</small>
                    </div>
                    <input type="file" id="fileInput" style="display: none;" multiple onchange="app.handleFileUpload(event)">
                </div>

                <div class="file-types">
                    <button class="btn-secondary" onclick="app.uploadQuiz()">📝 Upload Quiz (YAML)</button>
                    <button class="btn-secondary" onclick="app.uploadTest()">📋 Upload Test</button>
                    <button class="btn-secondary" onclick="app.uploadPreviousWork()">📚 Upload Previous Work</button>
                </div>
            </div>

            <div class="card">
                <h3>My Files</h3>
                ${files.length > 0 ? files.map(f => `
                    <div class="file-item">
                        <div class="file-icon">${this.getFileIcon(f.type)}</div>
                        <div class="file-info">
                            <h4>${f.name}</h4>
                            <p>${f.size} • ${f.uploadDate}</p>
                        </div>
                        <div class="file-actions">
                            <button class="btn-small btn-secondary" onclick="app.analyzeWithAI('${f.id}')">🤖 Analyze with Conrad</button>
                            <button class="btn-small btn-danger" onclick="app.deleteFile('${f.id}')">🗑️</button>
                        </div>
                    </div>
                `).join('') : '<p style="text-align: center; color: #666;">No files uploaded yet</p>'}
            </div>
        `;
    }

    getGroupsContent() {
        const groups = JSON.parse(localStorage.getItem('study_groups') || '[]');
        const userGroups = groups.filter(g => g.members.includes(this.currentUser.id));

        return `
            <div class="view-header">
                <h2>👥 Study Groups</h2>
                <p>Create or join study groups to collaborate with classmates</p>
            </div>

            <div class="card">
                <h3>Create New Group</h3>
                <div class="form-group">
                    <input type="text" id="groupName" placeholder="Group name (e.g., Math Study Group)" style="margin-bottom: 12px;">
                    <input type="text" id="groupSubject" placeholder="Subject (e.g., Mathematics)" style="margin-bottom: 12px;">
                    <textarea id="groupDescription" placeholder="Group description..." style="margin-bottom: 12px; min-height: 80px;"></textarea>
                    <button class="btn-primary" onclick="app.createStudyGroup()" style="width: auto; padding: 12px 24px;">
                        ➕ Create Group
                    </button>
                </div>
            </div>

            <div class="card">
                <h3>Your Groups (${userGroups.length})</h3>
                ${userGroups.length > 0 ? userGroups.map(group => `
                    <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <h4 style="margin-bottom: 4px;">${group.name}</h4>
                                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">📚 ${group.subject}</p>
                                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">${group.description}</p>
                                <p style="color: var(--text-secondary); font-size: 13px;">👥 ${group.members.length} members • Created ${new Date(group.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button class="btn-secondary" onclick="app.leaveStudyGroup('${group.id}')" style="width: auto; padding: 8px 16px; font-size: 14px;">
                                Leave
                            </button>
                        </div>
                    </div>
                `).join('') : '<p style="color: var(--text-secondary);">You haven\'t joined any groups yet. Create one or browse available groups below.</p>'}
            </div>

            <div class="card">
                <h3>Browse All Groups</h3>
                ${groups.length > 0 ? groups.filter(g => !g.members.includes(this.currentUser.id)).map(group => `
                    <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <h4 style="margin-bottom: 4px;">${group.name}</h4>
                                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">📚 ${group.subject}</p>
                                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">${group.description}</p>
                                <p style="color: var(--text-secondary); font-size: 13px;">👥 ${group.members.length} members</p>
                            </div>
                            <button class="btn-primary" onclick="app.joinStudyGroup('${group.id}')" style="width: auto; padding: 8px 16px; font-size: 14px;">
                                Join
                            </button>
                        </div>
                    </div>
                `).join('') : '<p style="color: var(--text-secondary);">No other groups available. Create one to get started!</p>'}
            </div>
        `;
    }

    createStudyGroup() {
        const name = document.getElementById('groupName').value.trim();
        const subject = document.getElementById('groupSubject').value.trim();
        const description = document.getElementById('groupDescription').value.trim();

        if (!name || !subject || !description) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const groups = JSON.parse(localStorage.getItem('study_groups') || '[]');
        const newGroup = {
            id: 'group_' + Date.now(),
            name,
            subject,
            description,
            members: [this.currentUser.id],
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString(),
            messages: []
        };

        groups.push(newGroup);
        localStorage.setItem('study_groups', JSON.stringify(groups));

        document.getElementById('groupName').value = '';
        document.getElementById('groupSubject').value = '';
        document.getElementById('groupDescription').value = '';

        this.unlockAchievement('group_creator');
        this.showMessage('Study group created successfully!', 'success');
        this.navigateTo('groups');
    }

    joinStudyGroup(groupId) {
        const groups = JSON.parse(localStorage.getItem('study_groups') || '[]');
        const group = groups.find(g => g.id === groupId);

        if (group && !group.members.includes(this.currentUser.id)) {
            group.members.push(this.currentUser.id);
            localStorage.setItem('study_groups', JSON.stringify(groups));
            this.showMessage(`Joined "${group.name}"!`, 'success');
            this.navigateTo('groups');
        }
    }

    leaveStudyGroup(groupId) {
        const groups = JSON.parse(localStorage.getItem('study_groups') || '[]');
        const group = groups.find(g => g.id === groupId);

        if (group) {
            group.members = group.members.filter(m => m !== this.currentUser.id);
            localStorage.setItem('study_groups', JSON.stringify(groups));
            this.showMessage(`Left "${group.name}"`, 'success');
            this.navigateTo('groups');
        }
    }

    getVoiceRecorderContent() {
        const recordings = JSON.parse(localStorage.getItem('voice_recordings') || '[]');

        return `
            <div class="view-header">
                <h2>🎙️ Voice Recorder</h2>
                <p>Record lectures and notes for later review</p>
                <span style="display: inline-block; background: #34c759; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 8px; font-weight: 600;">✨ AI Integrated - Auto Transcription</span>
            </div>

            <div class="card">
                <h3>Record New Lecture</h3>
                <div style="margin-bottom: 16px;">
                    <input type="text" id="recordingTitle" placeholder="Lecture title (e.g., Math Chapter 5)" style="margin-bottom: 12px; width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary);">
                    <input type="text" id="recordingSubject" placeholder="Subject" style="margin-bottom: 12px; width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary);">
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <button class="btn-primary" id="recordBtn" onclick="app.startRecording()" style="width: auto; padding: 12px 24px;">
                        🔴 Start Recording
                    </button>
                    <button class="btn-secondary" id="stopBtn" onclick="app.stopRecording()" style="width: auto; padding: 12px 24px; display: none;">
                        ⏹️ Stop Recording
                    </button>
                    <span id="recordingTime" style="color: var(--text-secondary); font-weight: 600; display: none;">00:00</span>
                </div>
            </div>

            <div class="card">
                <h3>Your Recordings (${recordings.length})</h3>
                ${recordings.length > 0 ? recordings.map(rec => `
                    <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <h4 style="margin-bottom: 4px;">${rec.title}</h4>
                                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">📚 ${rec.subject}</p>
                                <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 8px;">⏱️ ${rec.duration} • ${new Date(rec.date).toLocaleDateString()}</p>
                                <audio controls style="width: 100%; margin-bottom: 8px;">
                                    <source src="${rec.audio}" type="audio/webm">
                                    Your browser does not support the audio element.
                                </audio>
                                ${rec.transcript ? `
                                    <div style="background: var(--bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #34c759;">
                                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; font-weight: 600;">📝 Transcript (AI Generated)</p>
                                        <p style="font-size: 14px; line-height: 1.5;">${rec.transcript}</p>
                                    </div>
                                ` : ''}
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${!rec.transcript ? `
                                    <button class="btn-primary" onclick="app.transcribeRecording('${rec.id}')" style="width: auto; padding: 8px 16px; font-size: 14px; white-space: nowrap;">
                                        ✨ Transcribe
                                    </button>
                                ` : ''}
                                <button class="btn-secondary" onclick="app.deleteRecording('${rec.id}')" style="width: auto; padding: 8px 16px; font-size: 14px;">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('') : '<p style="color: var(--text-secondary);">No recordings yet. Start recording your first lecture!</p>'}
            </div>
        `;
    }

    startRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showMessage('Your browser does not support audio recording', 'error');
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordingChunks = [];
            this.recordingStartTime = Date.now();

            this.mediaRecorder.ondataavailable = (event) => {
                this.recordingChunks.push(event.data);
            };

            this.mediaRecorder.start();

            // Update UI
            document.getElementById('recordBtn').style.display = 'none';
            document.getElementById('stopBtn').style.display = 'inline-block';
            document.getElementById('recordingTime').style.display = 'inline-block';

            // Update timer
            this.recordingTimer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('recordingTime').textContent =
                    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);

            this.showMessage('Recording started...', 'success');
        }).catch(err => {
            this.showMessage('Microphone access denied', 'error');
            console.error('Error accessing microphone:', err);
        });
    }

    stopRecording() {
        if (!this.mediaRecorder) return;

        this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.recordingChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);

            const title = document.getElementById('recordingTitle').value.trim();
            const subject = document.getElementById('recordingSubject').value.trim();

            if (!title || !subject) {
                this.showMessage('Please enter title and subject', 'error');
                return;
            }

            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            const recordings = JSON.parse(localStorage.getItem('voice_recordings') || '[]');
            const newRecording = {
                id: 'rec_' + Date.now(),
                title,
                subject,
                duration,
                date: new Date().toISOString(),
                audio: audioUrl
            };

            recordings.push(newRecording);
            localStorage.setItem('voice_recordings', JSON.stringify(recordings));

            // Reset UI
            document.getElementById('recordBtn').style.display = 'inline-block';
            document.getElementById('stopBtn').style.display = 'none';
            document.getElementById('recordingTime').style.display = 'none';
            document.getElementById('recordingTitle').value = '';
            document.getElementById('recordingSubject').value = '';
            clearInterval(this.recordingTimer);

            this.showMessage('Recording saved successfully!', 'success');
            this.navigateTo('voice');
        };

        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    deleteRecording(recordingId) {
        if (confirm('Delete this recording?')) {
            const recordings = JSON.parse(localStorage.getItem('voice_recordings') || '[]');
            const filtered = recordings.filter(r => r.id !== recordingId);
            localStorage.setItem('voice_recordings', JSON.stringify(filtered));
            this.showMessage('Recording deleted', 'success');
            this.navigateTo('voice');
        }
    }

    async transcribeRecording(recordingId) {
        const recordings = JSON.parse(localStorage.getItem('voice_recordings') || '[]');
        const recording = recordings.find(r => r.id === recordingId);

        if (!recording) {
            this.showMessage('Recording not found', 'error');
            return;
        }

        if (!transcriptionService.isConfigured()) {
            this.showMessage('Gemini API key not configured. Please set it in Settings.', 'error');
            return;
        }

        try {
            this.showMessage('Transcribing audio... This may take a moment.', 'info');

            // Convert audio blob URL to blob
            const response = await fetch(recording.audio);
            const audioBlob = await response.blob();

            // Transcribe using Gemini
            const transcript = await transcriptionService.transcribeAudio(audioBlob, 'audio/webm');

            // Save transcript to recording
            recording.transcript = transcript;
            const index = recordings.findIndex(r => r.id === recordingId);
            recordings[index] = recording;
            localStorage.setItem('voice_recordings', JSON.stringify(recordings));

            this.showMessage('Transcription complete!', 'success');
            this.navigateTo('voice');
        } catch (error) {
            console.error('Transcription failed:', error);
            this.showMessage(`Transcription failed: ${error.message}`, 'error');
        }
    }

    getSpacedRepetitionContent() {
        const items = JSON.parse(localStorage.getItem('spaced_items') || '[]');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate which items need review today
        const dueToday = items.filter(item => {
            const nextReview = new Date(item.nextReview);
            nextReview.setHours(0, 0, 0, 0);
            return nextReview <= today;
        });

        return `
            <div class="view-header">
                <h2>🔄 Spaced Repetition</h2>
                <p>Optimal review scheduling for better retention</p>
            </div>

            <div class="card">
                <h3>Add Item to Review</h3>
                <div style="margin-bottom: 16px;">
                    <input type="text" id="itemQuestion" placeholder="Question or topic" style="margin-bottom: 12px; width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary);">
                    <textarea id="itemAnswer" placeholder="Answer or explanation" style="margin-bottom: 12px; width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary); min-height: 80px;"></textarea>
                    <input type="text" id="itemSubject" placeholder="Subject" style="margin-bottom: 12px; width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary);">
                    <button class="btn-primary" onclick="app.addSpacedItem()" style="width: auto; padding: 12px 24px;">
                        ➕ Add Item
                    </button>
                </div>
            </div>

            <div class="card">
                <h3>📅 Due Today (${dueToday.length})</h3>
                ${dueToday.length > 0 ? dueToday.map((item, idx) => `
                    <div style="background: var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                        <h4 style="margin-bottom: 8px;">${item.question}</h4>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 12px;">📚 ${item.subject}</p>
                        <details style="margin-bottom: 12px;">
                            <summary style="cursor: pointer; color: #007aff; font-weight: 600;">Show Answer</summary>
                            <p style="margin-top: 8px; padding: 12px; background: var(--bg-secondary); border-radius: 6px; color: var(--text-primary);">${item.answer}</p>
                        </details>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-primary" onclick="app.markSpacedItemCorrect('${item.id}')" style="width: auto; padding: 8px 16px; font-size: 14px;">
                                ✅ Got It
                            </button>
                            <button class="btn-secondary" onclick="app.markSpacedItemIncorrect('${item.id}')" style="width: auto; padding: 8px 16px; font-size: 14px;">
                                ❌ Need Help
                            </button>
                        </div>
                    </div>
                `).join('') : '<p style="color: var(--text-secondary);">No items due today! Great job staying on top of your reviews.</p>'}
            </div>

            <div class="card">
                <h3>📊 All Items (${items.length})</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                    ${items.map(item => {
            const nextReview = new Date(item.nextReview);
            const daysUntil = Math.ceil((nextReview - today) / (1000 * 60 * 60 * 24));
            const isDue = daysUntil <= 0;

            return `
                            <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; border-left: 4px solid ${isDue ? '#ff3b30' : '#34c759'};">
                                <h5 style="margin-bottom: 4px; font-size: 14px;">${item.question}</h5>
                                <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">📚 ${item.subject}</p>
                                <p style="color: var(--text-secondary); font-size: 12px; margin-bottom: 8px;">
                                    ${isDue ? '🔴 Due now' : `📅 Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                                </p>
                                <p style="color: var(--text-secondary); font-size: 12px;">
                                    Interval: ${item.interval} days • Repetitions: ${item.repetitions}
                                </p>
                                <button class="btn-secondary" onclick="app.deleteSpacedItem('${item.id}')" style="width: 100%; padding: 6px; font-size: 12px; margin-top: 8px;">
                                    🗑️ Delete
                                </button>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    addSpacedItem() {
        const question = document.getElementById('itemQuestion').value.trim();
        const answer = document.getElementById('itemAnswer').value.trim();
        const subject = document.getElementById('itemSubject').value.trim();

        if (!question || !answer || !subject) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const items = JSON.parse(localStorage.getItem('spaced_items') || '[]');
        const newItem = {
            id: 'spaced_' + Date.now(),
            question,
            answer,
            subject,
            interval: 1, // Start with 1 day interval
            repetitions: 0,
            nextReview: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        items.push(newItem);
        localStorage.setItem('spaced_items', JSON.stringify(items));

        document.getElementById('itemQuestion').value = '';
        document.getElementById('itemAnswer').value = '';
        document.getElementById('itemSubject').value = '';

        this.showMessage('Item added to spaced repetition!', 'success');
        this.navigateTo('spaced');
    }

    markSpacedItemCorrect(itemId) {
        const items = JSON.parse(localStorage.getItem('spaced_items') || '[]');
        const item = items.find(i => i.id === itemId);

        if (item) {
            // Increase interval using SM-2 algorithm
            item.interval = Math.max(1, item.interval * 1.5);
            item.repetitions++;

            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + Math.ceil(item.interval));
            item.nextReview = nextReview.toISOString();

            localStorage.setItem('spaced_items', JSON.stringify(items));
            this.showMessage('Great! Next review in ' + Math.ceil(item.interval) + ' days', 'success');
            this.navigateTo('spaced');
        }
    }

    markSpacedItemIncorrect(itemId) {
        const items = JSON.parse(localStorage.getItem('spaced_items') || '[]');
        const item = items.find(i => i.id === itemId);

        if (item) {
            // Reset interval
            item.interval = 1;
            item.repetitions = 0;
            item.nextReview = new Date().toISOString();

            localStorage.setItem('spaced_items', JSON.stringify(items));
            this.showMessage('No problem! Review again tomorrow', 'success');
            this.navigateTo('spaced');
        }
    }

    deleteSpacedItem(itemId) {
        if (confirm('Delete this item?')) {
            const items = JSON.parse(localStorage.getItem('spaced_items') || '[]');
            const filtered = items.filter(i => i.id !== itemId);
            localStorage.setItem('spaced_items', JSON.stringify(filtered));
            this.showMessage('Item deleted', 'success');
            this.navigateTo('spaced');
        }
    }

    getConradContent() {
        // Check if Conrad is unlocked
        const unlockedFeatures = JSON.parse(localStorage.getItem('unlocked_features') || '[]');
        const conradUnlocked = unlockedFeatures.includes('conrad');

        if (!conradUnlocked) {
            return `
                <div class="view-header">
                    <h2>🔒 Conrad AI Assistant</h2>
                    <p>Unlock Conrad to access AI-powered study help</p>
                </div>
                
                <div class="locked-feature">
                    <div class="lock-icon">🔒</div>
                    <h2>Conrad AI is Locked</h2>
                    <p>Unlock Conrad AI to get instant help with homework, explanations, and study tips!</p>
                    <div class="unlock-price">
                        <span class="price-amount">30</span>
                        <span class="price-currency">🪙 Study Coins</span>
                    </div>
                    <button class="btn-primary btn-large" onclick="app.navigateTo('shop')">
                        Go to Shop
                    </button>
                    <div class="feature-preview">
                        <h3>What you'll get:</h3>
                        <ul>
                            <li>✅ Instant answers to any question</li>
                            <li>✅ Math problem solver</li>
                            <li>✅ Wikipedia & dictionary search</li>
                            <li>✅ Study tips and guidance</li>
                            <li>✅ 24/7 AI assistance</li>
                        </ul>
                    </div>
                </div>
            `;
        }

        return `
            <div class="view-header">
                <h2>🤖 Conrad AI Assistant</h2>
                <p>Your personal AI tutor and study companion</p>
            </div>

            <div class="conrad-container">
                <div class="conrad-features">
                    <div class="feature-card">
                        <div class="feature-icon">📚</div>
                        <h3>Study Help</h3>
                        <p>Get explanations and help with homework</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📝</div>
                        <h3>Quiz Analysis</h3>
                        <p>Upload quizzes for detailed analysis</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎯</div>
                        <h3>Test Prep</h3>
                        <p>Practice with previous tests and get feedback</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💡</div>
                        <h3>Smart Suggestions</h3>
                        <p>Personalized study recommendations</p>
                    </div>
                </div>

                <div class="conrad-chat">
                    <div class="chat-header">
                        <h3>💬 Chat with Conrad</h3>
                        <p>Ask me anything about your studies!</p>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        <div class="message conrad-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <p>Hello ${this.currentUser.name}! I'm Conrad, your AI study assistant. I can solve math problems, search for information, and help with your studies!</p>
                                <div class="quick-actions">
                                    <button onclick="app.askConrad('What is 25 * 4')">🔢 Math: 25 × 4</button>
                                    <button onclick="app.askConrad('Fix this sentence: Looking through the telescope, the clock looked big')">✏️ Fix Grammar</button>
                                    <button onclick="app.askConrad('Study tips')">💡 Study Tips</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" id="conradInput" placeholder="Type your question..." onkeypress="if(event.key==='Enter') app.sendToConrad()">
                        <button class="btn-primary" onclick="app.sendToConrad()">Send</button>
                    </div>
                </div>

                <div class="conrad-info">
                    <h3>✨ What I Can Do</h3>
                    <p><strong>🔢 Math Solver:</strong> Ask me any math problem like "2+2" or "what is 15*8"</p>
                    <p><strong>✏️ Grammar Fixer:</strong> Fix sentences like "Fix this: Looking through the telescope, the clock looked big"</p>
                    <p><strong>🤖 Gemini AI:</strong> Ask "What is..." questions for AI-powered answers (requires API key)</p>
                    <p><strong>🔍 Information Search:</strong> Ask me questions and I'll help you find answers on Google</p>
                    <p><strong>💡 Study Help:</strong> Get study tips and academic guidance</p>
                    <p style="margin-top: 16px; color: #666; font-size: 14px;">
                        <strong>Tip:</strong> Try asking "What is photosynthesis" or "Fix this sentence: ..."
                    </p>
                </div>
            </div>
        `;
    }

    // File handling methods
    handleFileUpload(event) {
        const files = event.target.files;
        const storedFiles = JSON.parse(localStorage.getItem('sms_files') || '[]');

        Array.from(files).forEach(file => {
            const fileData = {
                id: 'file_' + Date.now() + '_' + Math.random(),
                name: file.name,
                size: this.formatFileSize(file.size),
                type: file.type || this.getFileType(file.name),
                uploadDate: new Date().toLocaleDateString(),
                userId: this.currentUser.id
            };
            storedFiles.push(fileData);
        });

        localStorage.setItem('sms_files', JSON.stringify(storedFiles));
        this.showMessage(`${files.length} file(s) uploaded successfully!`, 'success');
        this.navigateTo('files');
    }

    uploadQuiz() {
        document.getElementById('fileInput').accept = '.yaml,.yml';
        document.getElementById('fileInput').click();
    }

    uploadTest() {
        document.getElementById('fileInput').accept = '.pdf,.doc,.docx';
        document.getElementById('fileInput').click();
    }

    uploadPreviousWork() {
        document.getElementById('fileInput').accept = '*';
        document.getElementById('fileInput').click();
    }

    deleteFile(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        const files = JSON.parse(localStorage.getItem('sms_files') || '[]');
        const filteredFiles = files.filter(f => f.id !== fileId);
        localStorage.setItem('sms_files', JSON.stringify(filteredFiles));

        this.showMessage('File deleted successfully!', 'success');
        this.navigateTo('files');
    }

    analyzeWithAI(fileId) {
        this.showMessage('Analyzing file with Conrad AI...', 'success');
        setTimeout(() => {
            this.navigateTo('conrad');
            setTimeout(() => {
                this.addConradMessage('I\'ve analyzed your file! Here are my insights: This looks like great work. Would you like me to provide detailed feedback?');
            }, 500);
        }, 1000);
    }

    // Survey System methods
    getSurveysContent() {
        const completedSurveys = JSON.parse(localStorage.getItem('completed_surveys') || '[]');
        const availableSurveys = this.getAvailableSurveys();

        return `
            <div class="view-header">
                <h2>📋 Surveys</h2>
                <p>Complete surveys to earn Study Coins!</p>
                <div style="display: flex; gap: 16px; align-items: center; margin-top: 16px;">
                    <div class="coins-header">
                        <span class="coin-icon-large">🪙</span>
                        <span class="coin-amount-large">${this.currentUser.studyCoins || 0}</span>
                    </div>
                    <button class="btn-secondary" onclick="app.downloadSurveyersLog()" style="width: auto; padding: 12px 20px;">
                        📥 Download surveyers.log
                    </button>
                    ${this.currentUser.role === 'admin' ? `
                        <button class="btn-secondary" onclick="app.exportSurveyResponses()" style="width: auto; padding: 12px 20px;">
                            📊 Export Responses
                        </button>
                    ` : ''}
                </div>
            </div>
            
            <div class="surveys-container">
                <div class="card">
                    <h3>🎁 Available Surveys</h3>
                    <p style="color: #666; margin-bottom: 20px;">Earn coins by sharing your feedback!</p>
                    
                    ${availableSurveys.length === 0 ? `
                        <div style="text-align: center; padding: 40px; color: #999;">
                            <p style="font-size: 48px; margin-bottom: 16px;">🎉</p>
                            <p style="font-size: 18px; font-weight: 600;">All caught up!</p>
                            <p>Check back later for new surveys.</p>
                        </div>
                    ` : availableSurveys.map(survey => `
                        <div class="survey-card">
                            <div class="survey-header">
                                <div>
                                    <h4>${survey.title}</h4>
                                    <p class="survey-description">${survey.description}</p>
                                </div>
                                <div class="survey-reward">
                                    <span class="coin-icon">🪙</span>
                                    <span class="coin-value">+${survey.reward}</span>
                                </div>
                            </div>
                            <div class="survey-meta">
                                <span>⏱️ ${survey.duration} min</span>
                                <span>📊 ${survey.questions} questions</span>
                            </div>
                            <button class="btn-primary" onclick="app.startSurvey('${survey.id}')">
                                Start Survey
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="card">
                    <h3>✅ Completed Surveys</h3>
                    ${completedSurveys.length === 0 ? `
                        <p style="text-align: center; color: #999; padding: 20px;">
                            No surveys completed yet. Start earning coins!
                        </p>
                    ` : completedSurveys.map(survey => `
                        <div class="completed-survey-item">
                            <div>
                                <strong>${survey.title}</strong>
                                <span style="color: #666; font-size: 14px;">Completed ${new Date(survey.completedAt).toLocaleDateString()}</span>
                            </div>
                            <span class="earned-coins">+${survey.reward} 🪙</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getAvailableSurveys() {
        const allSurveys = [
            {
                id: 'welcome_survey',
                title: 'Welcome Survey',
                description: 'Help us understand your study habits and preferences',
                reward: 10,
                duration: 2,
                questions: 5
            },
            {
                id: 'app_feedback',
                title: 'App Feedback',
                description: 'Share your thoughts on the School Management System',
                reward: 15,
                duration: 3,
                questions: 8
            },
            {
                id: 'study_methods',
                title: 'Study Methods Survey',
                description: 'Tell us about your favorite study techniques',
                reward: 20,
                duration: 5,
                questions: 10
            },
            {
                id: 'feature_request',
                title: 'Feature Requests',
                description: 'What features would you like to see next?',
                reward: 25,
                duration: 4,
                questions: 6
            }
        ];

        const completed = JSON.parse(localStorage.getItem('completed_surveys') || '[]');
        const completedIds = completed.map(s => s.id);

        return allSurveys.filter(s => !completedIds.includes(s.id));
    }

    startSurvey(surveyId) {
        const surveys = {
            welcome_survey: {
                title: 'Welcome Survey',
                reward: 10,
                questions: [
                    { q: 'What grade are you in?', type: 'text' },
                    { q: 'How many hours do you study per day?', type: 'text' },
                    { q: 'What is your favorite subject?', type: 'text' },
                    { q: 'Do you use any other study apps?', type: 'text' },
                    { q: 'How did you hear about us?', type: 'text' }
                ]
            },
            app_feedback: {
                title: 'App Feedback',
                reward: 15,
                questions: [
                    { q: 'How would you rate the app overall? (1-10)', type: 'text' },
                    { q: 'What feature do you use most?', type: 'text' },
                    { q: 'What feature needs improvement?', type: 'text' },
                    { q: 'Is the app easy to navigate?', type: 'text' },
                    { q: 'Would you recommend this app to friends?', type: 'text' },
                    { q: 'What do you like most about the app?', type: 'text' },
                    { q: 'What do you dislike about the app?', type: 'text' },
                    { q: 'Any additional comments?', type: 'text' }
                ]
            },
            study_methods: {
                title: 'Study Methods Survey',
                reward: 20,
                questions: [
                    { q: 'Do you prefer studying alone or in groups?', type: 'text' },
                    { q: 'What time of day do you study best?', type: 'text' },
                    { q: 'Do you use flashcards?', type: 'text' },
                    { q: 'How do you take notes?', type: 'text' },
                    { q: 'Do you use the Pomodoro technique?', type: 'text' },
                    { q: 'What helps you focus while studying?', type: 'text' },
                    { q: 'How do you prepare for exams?', type: 'text' },
                    { q: 'What is your biggest study challenge?', type: 'text' },
                    { q: 'Do you listen to music while studying?', type: 'text' },
                    { q: 'What motivates you to study?', type: 'text' }
                ]
            },
            feature_request: {
                title: 'Feature Requests',
                reward: 25,
                questions: [
                    { q: 'What new feature would you like to see?', type: 'text' },
                    { q: 'Would you use a mobile app version?', type: 'text' },
                    { q: 'Do you want social features (study groups)?', type: 'text' },
                    { q: 'Would you pay for premium features?', type: 'text' },
                    { q: 'What subjects need more resources?', type: 'text' },
                    { q: 'Any other suggestions?', type: 'text' }
                ]
            }
        };

        const survey = surveys[surveyId];
        if (!survey) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content survey-modal">
                <div class="modal-header">
                    <h2>📋 ${survey.title}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="survey-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="surveyProgress" style="width: 0%"></div>
                        </div>
                        <span id="progressText">Question 1 of ${survey.questions.length}</span>
                    </div>
                    
                    <div id="surveyQuestions">
                        ${survey.questions.map((q, i) => `
                            <div class="survey-question" data-question="${i}" style="display: ${i === 0 ? 'block' : 'none'}">
                                <h3>Question ${i + 1}</h3>
                                <p>${q.q}</p>
                                <textarea id="answer_${i}" placeholder="Type your answer here..." rows="4"></textarea>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="survey-nav">
                        <button class="btn-secondary" id="prevBtn" onclick="app.prevQuestion()" style="display: none;">
                            ← Previous
                        </button>
                        <button class="btn-primary" id="nextBtn" onclick="app.nextQuestion(${survey.questions.length})">
                            Next →
                        </button>
                        <button class="btn-primary" id="submitBtn" onclick="app.submitSurvey('${surveyId}', ${survey.reward}, '${survey.title}')" style="display: none;">
                            Submit & Earn ${survey.reward} 🪙
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.currentQuestion = 0;
        this.totalQuestions = survey.questions.length;
    }

    nextQuestion(total) {
        this.currentQuestion++;
        this.updateSurveyProgress(total);

        document.querySelectorAll('.survey-question').forEach((q, i) => {
            q.style.display = i === this.currentQuestion ? 'block' : 'none';
        });

        document.getElementById('prevBtn').style.display = 'inline-block';

        if (this.currentQuestion === total - 1) {
            document.getElementById('nextBtn').style.display = 'none';
            document.getElementById('submitBtn').style.display = 'inline-block';
        }
    }

    prevQuestion() {
        this.currentQuestion--;
        this.updateSurveyProgress(this.totalQuestions);

        document.querySelectorAll('.survey-question').forEach((q, i) => {
            q.style.display = i === this.currentQuestion ? 'block' : 'none';
        });

        if (this.currentQuestion === 0) {
            document.getElementById('prevBtn').style.display = 'none';
        }

        document.getElementById('nextBtn').style.display = 'inline-block';
        document.getElementById('submitBtn').style.display = 'none';
    }

    updateSurveyProgress(total) {
        const progress = ((this.currentQuestion + 1) / total) * 100;
        document.getElementById('surveyProgress').style.width = progress + '%';
        document.getElementById('progressText').textContent = `Question ${this.currentQuestion + 1} of ${total}`;
    }

    submitSurvey(surveyId, reward, title) {
        // Collect all answers
        const answers = [];
        const questions = document.querySelectorAll('.survey-question');
        questions.forEach((q, index) => {
            const answer = document.getElementById(`answer_${index}`).value;
            const questionText = q.querySelector('p').textContent;
            answers.push({
                question: questionText,
                answer: answer
            });
        });

        // Save survey response for email export
        const surveyResponses = JSON.parse(localStorage.getItem('survey_responses') || '[]');
        const surveyResponse = {
            surveyId: surveyId,
            surveyTitle: title,
            userName: this.currentUser.name,
            userEmail: this.currentUser.email,
            userId: this.currentUser.id,
            answers: answers,
            completedAt: new Date().toISOString(),
            exported: false
        };
        surveyResponses.push(surveyResponse);
        localStorage.setItem('survey_responses', JSON.stringify(surveyResponses));

        // Save to surveyers.log
        this.appendToSurveyersLog(surveyResponse);

        // Save completed survey
        const completed = JSON.parse(localStorage.getItem('completed_surveys') || '[]');
        completed.push({
            id: surveyId,
            title: title,
            reward: reward,
            completedAt: new Date().toISOString()
        });
        localStorage.setItem('completed_surveys', JSON.stringify(completed));

        // Award coins
        this.currentUser.studyCoins = (this.currentUser.studyCoins || 0) + reward;
        const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].studyCoins = this.currentUser.studyCoins;
            localStorage.setItem('sms_users', JSON.stringify(users));
        }

        // Close modal
        document.querySelector('.modal').remove();

        // Show success message
        this.showMessage(`Survey completed! You earned ${reward} Study Coins! 🪙`, 'success');

        // Update coins display
        this.updateCoinsDisplay();

        // Refresh surveys page
        this.navigateTo('surveys');
    }

    appendToSurveyersLog(surveyResponse) {
        // Get existing log or create new one
        let surveyersLog = JSON.parse(localStorage.getItem('surveyers_log') || '[]');

        // Add timestamp and format the entry
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...surveyResponse
        };

        surveyersLog.push(logEntry);
        localStorage.setItem('surveyers_log', JSON.stringify(surveyersLog));

        // Also create a downloadable text version
        this.updateSurveyersLogFile(surveyersLog);
    }

    updateSurveyersLogFile(surveyersLog) {
        // Create a formatted text log
        let logContent = '=== SURVEYERS LOG ===\n';
        logContent += `Last Updated: ${new Date().toISOString()}\n`;
        logContent += `Total Surveys: ${surveyersLog.length}\n`;
        logContent += '='.repeat(50) + '\n\n';

        surveyersLog.forEach((entry, index) => {
            logContent += `SURVEY #${index + 1}\n`;
            logContent += '-'.repeat(50) + '\n';
            logContent += `Timestamp: ${entry.timestamp}\n`;
            logContent += `Survey ID: ${entry.surveyId}\n`;
            logContent += `Survey Title: ${entry.surveyTitle}\n`;
            logContent += `User Name: ${entry.userName}\n`;
            logContent += `User Email: ${entry.userEmail}\n`;
            logContent += `User ID: ${entry.userId}\n`;
            logContent += `\nAnswers:\n`;

            entry.answers.forEach((ans, i) => {
                logContent += `  Q${i + 1}: ${ans.question}\n`;
                logContent += `  A${i + 1}: ${ans.answer}\n\n`;
            });

            logContent += '='.repeat(50) + '\n\n';
        });

        // Store formatted log in localStorage
        localStorage.setItem('surveyers_log_text', logContent);
    }

    downloadSurveyersLog() {
        const logContent = localStorage.getItem('surveyers_log_text') || 'No survey data available';
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logContent));
        element.setAttribute('download', 'surveyers.log');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    exportSurveyResponses() {
        const responses = JSON.parse(localStorage.getItem('survey_responses') || '[]');

        if (responses.length === 0) {
            this.showMessage('No survey responses to export', 'error');
            return;
        }

        // Format as email-friendly text
        let emailText = `SURVEY RESPONSES EXPORT\n`;
        emailText += `Generated: ${new Date().toLocaleString()}\n`;
        emailText += `Total Responses: ${responses.length}\n`;
        emailText += `${'='.repeat(80)}\n\n`;

        responses.forEach((r, index) => {
            emailText += `Response #${index + 1}\n`;
            emailText += `Survey: ${r.surveyTitle}\n`;
            emailText += `User: ${r.userName} (${r.userEmail})\n`;
            emailText += `User ID: ${r.userId}\n`;
            emailText += `Completed: ${new Date(r.completedAt).toLocaleString()}\n\n`;
            emailText += `Answers:\n`;
            r.answers.forEach((a, i) => {
                emailText += `  ${i + 1}. ${a.question}\n`;
                emailText += `     Answer: ${a.answer}\n\n`;
            });
            emailText += `${'='.repeat(80)}\n\n`;
        });

        emailText += `\nTO SEND VIA EMAIL:\n`;
        emailText += `1. Copy this text\n`;
        emailText += `2. Open your email client\n`;
        emailText += `3. Send to: user.example@gmail.com (replace with your email)\n`;
        emailText += `4. Subject: Monthly Survey Responses - ${new Date().toLocaleDateString()}\n`;

        // Create downloadable file
        const blob = new Blob([emailText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `survey-responses-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);

        this.showMessage('Survey responses exported! Check your downloads.', 'success');
    }

    // Benchmark Tests methods
    getTestsContent() {
        const testResults = JSON.parse(localStorage.getItem('test_results') || '[]');
        const availableTests = this.getAvailableTests();
        const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');

        return `
            <div class="view-header">
                <h2>🎯 Benchmark Tests</h2>
                <p>Test your knowledge and earn Study Coins!</p>
            </div>

            <div class="card" style="background: #e3f2fd; border-left: 4px solid #2196F3; margin-bottom: 24px;">
                <h3>✨ Create Custom Tests</h3>
                <p style="margin-bottom: 12px;">For unlimited custom tests, visit our dedicated platform:</p>
                <a href="https://quizmaster17.vercel.app" target="_blank" style="display: inline-block; padding: 12px 24px; background: #2196F3; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    🔗 Go to QuizMaster17
                </a>
            </div>

            ${customQuizzes.length > 0 ? `
                <div class="card">
                    <h3>📄 Your Custom Quizzes (from PDFs)</h3>
                    <p style="color: #666; margin-bottom: 20px;">Quizzes created from uploaded PDF files</p>
                    <div class="custom-quizzes-grid">
                        ${customQuizzes.map(quiz => `
                            <div class="quiz-card">
                                <div class="quiz-header">
                                    <h4>${quiz.title}</h4>
                                    <span class="quiz-badge">${quiz.questions.length} Q</span>
                                </div>
                                <p style="color: #666; font-size: 14px;">Uploaded: ${new Date(quiz.createdAt).toLocaleDateString()}</p>
                                <div style="margin-top: 12px; display: flex; gap: 8px;">
                                    <button class="btn-primary" onclick="app.startCustomQuiz('${quiz.id}')" style="flex: 1;">
                                        📝 Take Quiz
                                    </button>
                                    <button class="btn-secondary" onclick="app.deleteCustomQuiz('${quiz.id}')" style="flex: 1;">
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="card">
                <h3>📤 Upload PDF as Quiz</h3>
                <p style="color: #666; margin-bottom: 20px;">Upload a PDF file and we'll convert it into an interactive quiz</p>
                <div class="upload-section">
                    <div class="upload-area" onclick="document.getElementById('pdfQuizInput').click()">
                        <div class="upload-icon">📄</div>
                        <p>Click to upload PDF</p>
                        <small>Supported: PDF files only</small>
                    </div>
                    <input type="file" id="pdfQuizInput" accept=".pdf" style="display: none;" onchange="app.handlePdfQuizUpload(event)">
                </div>
                <p style="font-size: 13px; color: #666; margin-top: 12px;">
                    💡 <strong>Tip:</strong> Format your PDF with questions like "Q1. Question text?" followed by answer options or leave blank for free response.
                </p>
                <p style="font-size: 13px; color: #999; margin-top: 8px;">
                    Cost: ${this.currentUser.role === 'student' ? '30 Study Coins' : 'Free (Teacher/Admin)'}
                </p>
            </div>
            
            <div class="tests-container">
                <div class="tests-grid">
                    ${availableTests.map(test => {
            const result = testResults.find(r => r.testId === test.id);
            const bestScore = result ? result.score : 0;
            const studyMinutes = result ? (result.recommendedStudyMinutes || result.recommendedStudyHours * 60 || 0) : 0;

            return `
                            <div class="test-card ${result ? 'completed' : ''}">
                                <div class="test-icon">${test.icon}</div>
                                <h3>${test.title}</h3>
                                <p class="test-description">${test.description}</p>
                                <div class="test-meta">
                                    <span>📝 ${test.questions} questions</span>
                                    <span>⏱️ ${test.duration} min</span>
                                </div>
                                ${result ? `
                                    <div class="test-score">
                                        <span class="score-label">Best Score:</span>
                                        <span class="score-value">${bestScore}%</span>
                                    </div>
                                    <div class="study-hours-badge">
                                        <span>📚 ${studyMinutes} min recommended</span>
                                    </div>
                                ` : ''}
                                <div class="test-reward">
                                    <span>🪙 Earn up to ${test.maxReward} coins</span>
                                </div>
                                <button class="btn-primary" onclick="app.startTest('${test.id}')">
                                    ${result ? 'Retake Test' : 'Start Test'}
                                </button>
                            </div>
                        `;
        }).join('')}
                </div>
                
                ${testResults.length > 0 ? `
                    <div class="card">
                        <h3>📊 Your Test History</h3>
                        <div class="test-history">
                            ${testResults.slice(-10).reverse().map(r => {
            const test = availableTests.find(t => t.id === r.testId);
            return `
                                    <div class="history-item">
                                        <div class="history-info">
                                            <strong>${test ? test.icon + ' ' + test.title : 'Test'}</strong>
                                            <span>${new Date(r.completedAt).toLocaleDateString()} - Score: ${r.score}% - 📚 ${r.recommendedStudyMinutes || r.recommendedStudyHours * 60 || 0} min study</span>
                                        </div>
                                        <span class="earned-coins">+${r.coinsEarned} 🪙</span>
                                    </div>
                                `;
        }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // IDLE - Integrated Development and Learning Environment
    getIdleContent() {
        const selectedLanguage = localStorage.getItem('idle_language') || 'python';

        return `
            <div class="view-header">
                <h2>💻 IDLE - Learn to Code</h2>
                <p>Interactive tutorials for Python, HTML, CSS, and JavaScript</p>
            </div>

            <div class="card">
                <h3>🎯 Select a Language</h3>
                <div class="language-selector" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px;">
                    <button class="language-btn ${selectedLanguage === 'python' ? 'active' : ''}" onclick="app.selectIdleLanguage('python')" style="padding: 16px; border: 2px solid ${selectedLanguage === 'python' ? '#3776ab' : '#e5e5ea'}; border-radius: 8px; background: ${selectedLanguage === 'python' ? '#f0f7ff' : 'white'}; cursor: pointer; font-weight: 600;">
                        🐍 Python
                    </button>
                    <button class="language-btn ${selectedLanguage === 'html' ? 'active' : ''}" onclick="app.selectIdleLanguage('html')" style="padding: 16px; border: 2px solid ${selectedLanguage === 'html' ? '#e34c26' : '#e5e5ea'}; border-radius: 8px; background: ${selectedLanguage === 'html' ? '#fff5f0' : 'white'}; cursor: pointer; font-weight: 600;">
                        🏷️ HTML
                    </button>
                    <button class="language-btn ${selectedLanguage === 'css' ? 'active' : ''}" onclick="app.selectIdleLanguage('css')" style="padding: 16px; border: 2px solid ${selectedLanguage === 'css' ? '#563d7c' : '#e5e5ea'}; border-radius: 8px; background: ${selectedLanguage === 'css' ? '#f5f0ff' : 'white'}; cursor: pointer; font-weight: 600;">
                        🎨 CSS
                    </button>
                    <button class="language-btn ${selectedLanguage === 'javascript' ? 'active' : ''}" onclick="app.selectIdleLanguage('javascript')" style="padding: 16px; border: 2px solid ${selectedLanguage === 'javascript' ? '#f7df1e' : '#e5e5ea'}; border-radius: 8px; background: ${selectedLanguage === 'javascript' ? '#fffbf0' : 'white'}; cursor: pointer; font-weight: 600;">
                        ⚡ JavaScript
                    </button>
                    <button class="language-btn ${selectedLanguage === 'sl' ? 'active' : ''}" onclick="app.selectIdleLanguage('sl')" style="padding: 16px; border: 2px solid ${selectedLanguage === 'sl' ? '#9c27b0' : '#e5e5ea'}; border-radius: 8px; background: ${selectedLanguage === 'sl' ? '#f3e5f5' : 'white'}; cursor: pointer; font-weight: 600;">
                        ✨ SL (Tutorial)
                    </button>
                </div>
            </div>

            ${this.getIdleTutorialContent(selectedLanguage)}
        `;
    }

    selectIdleLanguage(language) {
        localStorage.setItem('idle_language', language);
        this.navigateTo('idle');
    }

    getIdleTutorialContent(language) {
        const tutorials = {
            python: {
                title: '🐍 Python Basics',
                lessons: [
                    {
                        id: 'py1',
                        title: 'Variables and Data Types',
                        description: 'Learn about variables, strings, numbers, and lists',
                        code: 'name = "Alice"\nage = 25\nprint(f"Hello {name}, you are {age} years old")'
                    },
                    {
                        id: 'py2',
                        title: 'Loops and Conditionals',
                        description: 'Master if statements and for/while loops',
                        code: 'for i in range(1, 6):\n    if i % 2 == 0:\n        print(f"{i} is even")\n    else:\n        print(f"{i} is odd")'
                    },
                    {
                        id: 'py3',
                        title: 'Functions',
                        description: 'Create reusable code with functions',
                        code: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))\nprint(greet("Bob", "Hi"))'
                    }
                ]
            },
            html: {
                title: '🏷️ HTML Basics',
                lessons: [
                    {
                        id: 'html1',
                        title: 'HTML Structure',
                        description: 'Learn the basic structure of an HTML document',
                        code: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Welcome!</h1>\n    <p>This is a paragraph.</p>\n</body>\n</html>'
                    },
                    {
                        id: 'html2',
                        title: 'Forms and Input',
                        description: 'Create interactive forms with input fields',
                        code: '<form>\n    <label>Name:</label>\n    <input type="text" name="name">\n    <label>Email:</label>\n    <input type="email" name="email">\n    <button type="submit">Submit</button>\n</form>'
                    },
                    {
                        id: 'html3',
                        title: 'Semantic HTML',
                        description: 'Use semantic tags for better structure',
                        code: '<header>\n    <nav>Navigation</nav>\n</header>\n<main>\n    <article>\n        <h2>Article Title</h2>\n        <p>Content here</p>\n    </article>\n</main>\n<footer>Footer</footer>'
                    }
                ]
            },
            css: {
                title: '🎨 CSS Basics',
                lessons: [
                    {
                        id: 'css1',
                        title: 'Selectors and Properties',
                        description: 'Learn CSS selectors and styling properties',
                        code: 'h1 {\n    color: blue;\n    font-size: 32px;\n    text-align: center;\n}\n\n.highlight {\n    background-color: yellow;\n    padding: 10px;\n}'
                    },
                    {
                        id: 'css2',
                        title: 'Flexbox Layout',
                        description: 'Create flexible layouts with Flexbox',
                        code: '.container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n}\n\n.item {\n    flex: 1;\n    background: lightblue;\n    padding: 20px;\n}'
                    },
                    {
                        id: 'css3',
                        title: 'Responsive Design',
                        description: 'Make your site work on all devices',
                        code: '@media (max-width: 768px) {\n    .container {\n        flex-direction: column;\n    }\n    \n    h1 {\n        font-size: 24px;\n    }\n}'
                    }
                ]
            },
            javascript: {
                title: '⚡ JavaScript Basics',
                lessons: [
                    {
                        id: 'js1',
                        title: 'Variables and Functions',
                        description: 'Learn variables, functions, and scope',
                        code: 'const greet = (name) => {\n    return `Hello, ${name}!`;\n};\n\nlet message = greet("Alice");\nconsole.log(message);'
                    },
                    {
                        id: 'js2',
                        title: 'DOM Manipulation',
                        description: 'Interact with HTML elements',
                        code: 'const button = document.getElementById("myBtn");\nbutton.addEventListener("click", () => {\n    alert("Button clicked!");\n    document.body.style.backgroundColor = "lightblue";\n});'
                    },
                    {
                        id: 'js3',
                        title: 'Async and Promises',
                        description: 'Handle asynchronous operations',
                        code: 'const fetchData = async () => {\n    try {\n        const response = await fetch("https://api.example.com/data");\n        const data = await response.json();\n        console.log(data);\n    } catch (error) {\n        console.error("Error:", error);\n    }\n};'
                    }
                ]
            },
            sl: {
                title: '✨ SL - Special Learning Language',
                lessons: [
                    {
                        id: 'sl1',
                        title: 'What is SL?',
                        description: 'SL is a special tutorial language combining Python, HTML, CSS, and JavaScript concepts',
                        code: 'LEARN Python:\n  - Variables: name = "value"\n  - Functions: def myFunc(): pass\n  - Loops: for i in range(10): pass\n\nLEARN HTML:\n  - Tags: <tag>content</tag>\n  - Attributes: <tag attr="value">\n\nLEARN CSS:\n  - Selectors: .class, #id, element\n  - Properties: color, size, layout\n\nLEARN JavaScript:\n  - Events: click, hover, submit\n  - DOM: document.getElementById()'
                    },
                    {
                        id: 'sl2',
                        title: 'Building a Web App',
                        description: 'Combine all languages to build interactive web applications',
                        code: 'PROJECT: Todo App\n\nHTML:\n  - Input field for tasks\n  - Button to add task\n  - List to display tasks\n\nCSS:\n  - Style the input and button\n  - Make list items look nice\n  - Add hover effects\n\nJavaScript:\n  - Get input value\n  - Add to list on button click\n  - Delete items on click\n  - Save to localStorage'
                    },
                    {
                        id: 'sl3',
                        title: 'Full Stack Concepts',
                        description: 'Learn how frontend and backend work together',
                        code: 'FRONTEND (What user sees):\n  - HTML: Structure\n  - CSS: Styling\n  - JavaScript: Interactivity\n\nBACKEND (Server logic):\n  - Python: Process data\n  - Database: Store data\n  - API: Send data to frontend\n\nFLOW:\n  1. User interacts with HTML/CSS/JS\n  2. JavaScript sends request to backend\n  3. Python processes and returns data\n  4. JavaScript updates the page'
                    }
                ]
            }
        };

        const tutorial = tutorials[language];

        return `
            <div class="card">
                <h3>${tutorial.title}</h3>
                <div style="margin-bottom: 20px;">
                    <button class="btn-primary" onclick="app.openInteractiveIdle('${language}')" style="width: 100%; padding: 12px;">
                        💻 Open Interactive Editor
                    </button>
                </div>
                <div class="lessons-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 16px;">
                    ${tutorial.lessons.map(lesson => `
                        <div class="lesson-card" style="border: 1px solid #e5e5ea; border-radius: 8px; padding: 16px; cursor: pointer;" onclick="app.showIdleLesson('${language}', '${lesson.id}')">
                            <h4>${lesson.title}</h4>
                            <p style="color: #666; font-size: 14px; margin: 8px 0;">${lesson.description}</p>
                            <button class="btn-primary" style="width: 100%; margin-top: 12px;">
                                📖 View Lesson
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    openInteractiveIdle(language) {
        const defaultCode = {
            python: 'print("Hello, World!")\nprint("Welcome to Python IDLE")',
            html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n    <p>Edit this HTML and see the preview!</p>\n</body>\n</html>',
            css: 'body {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    padding: 20px;\n}\n\nh1 {\n    text-align: center;\n    font-size: 48px;\n}',
            javascript: 'console.log("Hello from JavaScript!");\n\nconst greeting = "Welcome to JavaScript IDLE";\nconsole.log(greeting);\n\nconst add = (a, b) => a + b;\nconsole.log("2 + 3 =", add(2, 3));',
            sl: 'LEARN: This is SL - Special Learning Language\nCombines Python, HTML, CSS, and JavaScript\nEdit and experiment with code!'
        };

        const savedCode = localStorage.getItem(`idle_code_${language}`) || defaultCode[language];

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.zIndex = '10000';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 95vw; max-height: 95vh; width: 95vw; height: 95vh; display: flex; flex-direction: column; padding: 0;">
                <div class="modal-header" style="padding: 16px; border-bottom: 1px solid #e5e5ea;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2>💻 Interactive ${language.toUpperCase()} IDLE</h2>
                        <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
                    </div>
                </div>
                <div style="display: flex; flex: 1; gap: 0; overflow: hidden;">
                    <!-- Code Editor -->
                    <div style="flex: 1; display: flex; flex-direction: column; border-right: 1px solid #e5e5ea;">
                        <div style="padding: 12px; background: #f5f5f5; border-bottom: 1px solid #e5e5ea; font-weight: 600;">
                            📝 Code Editor
                        </div>
                        <textarea id="idleCodeEditor" style="flex: 1; padding: 16px; font-family: 'Courier New', monospace; font-size: 13px; border: none; resize: none; background: #1e1e1e; color: #d4d4d4;">${savedCode}</textarea>
                        <div style="padding: 12px; background: #f5f5f5; border-top: 1px solid #e5e5ea; display: flex; gap: 8px;">
                            <button class="btn-primary" onclick="app.runIdleCode('${language}')" style="flex: 1;">
                                ▶️ Run Code
                            </button>
                            <button class="btn-secondary" onclick="app.resetIdleCode('${language}')" style="flex: 1;">
                                🔄 Reset
                            </button>
                            <button class="btn-secondary" onclick="app.saveIdleCode('${language}')" style="flex: 1;">
                                💾 Save
                            </button>
                        </div>
                    </div>

                    <!-- Output/Preview -->
                    <div style="flex: 1; display: flex; flex-direction: column; background: white;">
                        <div style="padding: 12px; background: #f5f5f5; border-bottom: 1px solid #e5e5ea; font-weight: 600;">
                            ${language === 'html' || language === 'css' ? '👁️ Preview' : '📤 Output'}
                        </div>
                        <div id="idleOutput" style="flex: 1; padding: 16px; overflow-y: auto; background: white; font-family: 'Courier New', monospace; font-size: 13px; white-space: pre-wrap; word-break: break-word;">
                            ${language === 'html' || language === 'css' ? '<p style="color: #999;">Click "Run Code" to see preview</p>' : '<p style="color: #999;">Output will appear here</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async runIdleCode(language) {
        const codeEditor = document.getElementById('idleCodeEditor');
        const output = document.getElementById('idleOutput');
        const code = codeEditor.value;

        // Save code
        localStorage.setItem(`idle_code_${language}`, code);

        if (language === 'python') {
            // Python execution - try Pyodide first, then fallback to CLI
            output.innerHTML = '<span style="color: #999;">Executing Python...</span>';

            try {
                // Try Pyodide if available
                if (typeof pyodide !== 'undefined' && window.pyodideReady) {
                    const pyodideInstance = await loadPyodide();

                    const logs = [];
                    const originalPrint = pyodideInstance.globals.get('print');

                    pyodideInstance.globals.set('print', (...args) => {
                        logs.push(args.map(arg => {
                            if (typeof arg === 'object') {
                                return JSON.stringify(arg);
                            }
                            return String(arg);
                        }).join(' '));
                    });

                    try {
                        await pyodideInstance.runPythonAsync(code);
                        output.innerHTML = logs.map(log => `<span style="color: #4ec9b0;">${log}</span>`).join('\n') || '<span style="color: #999;">Code executed successfully (no output)</span>';
                    } catch (error) {
                        output.innerHTML = `<span style="color: #f48771;">Error: ${error.message}</span>`;
                    }

                    pyodideInstance.globals.set('print', originalPrint);
                } else {
                    // Fallback to CLI execution
                    await this.executePythonCLI(code, output);
                }
            } catch (error) {
                // If Pyodide fails, try CLI
                await this.executePythonCLI(code, output);
            }
        } else if (language === 'javascript') {
            output.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: white;';
            iframe.sandbox.add('allow-scripts');

            const sampleHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .log { color: #4ec9b0; font-family: monospace; margin: 5px 0; }
                        .error { color: #f48771; font-family: monospace; margin: 5px 0; }
                    </style>
                </head>
                <body>
                    <h1>JavaScript Output</h1>
                    <div class="output" id="output"></div>
                    <script>
                        const logs = [];
                        const originalLog = console.log;

                        console.log = function(...args) {
                            logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
                            updateOutput();
                        };

                        function updateOutput() {
                            const outputDiv = document.getElementById('output');
                            outputDiv.innerHTML = logs.map(log => '<div class="log">' + log + '</div>').join('');
                        }

                        try {
                            ${code}
                        } catch (error) {
                            logs.push('Error: ' + error.message);
                            const outputDiv = document.getElementById('output');
                            outputDiv.innerHTML = logs.map(log => '<div class="' + (log.startsWith('Error') ? 'error' : 'log') + '">' + log + '</div>').join('');
                        }
                    </script>
                </body>
                </html>
            `;

            output.appendChild(iframe);
            iframe.contentDocument.write(sampleHtml);
            iframe.contentDocument.close();
        } else if (language === 'html') {
            // HTML preview with proper sandboxing
            output.innerHTML = '';

            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: white;';
            iframe.sandbox.add('allow-scripts');

            output.appendChild(iframe);
            iframe.contentDocument.write(code);
            iframe.contentDocument.close();
        } else if (language === 'css') {
            // CSS preview with sample HTML
            output.innerHTML = '';

            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: white;';
            iframe.sandbox.add('allow-scripts');

            // Sample HTML with CSS
            const sampleHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                            <title>Valid Code</title>
                            <style>
                                ${code}
                            </style>
                        </head>
                        <body>
                            <h1>CSS Preview</h1>
                            <p>Your CSS is applied to this preview</p>
                            <div class="container">
                                <div class="item">Item 1</div>
                                <div class="item">Item 2</div>
                                <div class="item">Item 3</div>
                            </div>
                            <button>Sample Button</button>
                            <input type="text" placeholder="Sample Input">
                        </body>
                    </html>
            `;

            output.appendChild(iframe);
            iframe.contentDocument.write(sampleHtml);
            iframe.contentDocument.close();
        } else if (language === 'sl') {
            // SL - Special Learning Language
            output.innerHTML = '';

            // Parse SL commands
            const lines = code.split('\n');
            let result = '';

            for (const line of lines) {
                const trimmed = line.trim();

                // Tutorial Query: Tutorial Query -> opens YouTube
                if (trimmed.toLowerCase().startsWith('tutorial ')) {
                    const query = trimmed.substring(9).trim();
                    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                    result += `<div style="color: #4ec9b0; margin: 10px 0;">
                        📺 Tutorial: <a href="${youtubeUrl}" target="_blank" style="color: #2196F3; text-decoration: underline;">${query}</a>
                    </div>`;
                } else if (trimmed.length > 0 && !trimmed.startsWith('//')) {
                    result += `<div style="color: #d4d4d4; margin: 5px 0;">${trimmed}</div>`;
                }
            }

            output.innerHTML = result || '<span style="color: #999;">No output</span>';
        }
    }

    saveIdleCode(language) {
        const codeEditor = document.getElementById('idleCodeEditor');
        localStorage.setItem(`idle_code_${language}`, codeEditor.value);
        this.showMessage(`${language.toUpperCase()} code saved!`, 'success');
    }

    resetIdleCode(language) {
        const defaultCode = {
            python: 'print("Hello, World!")\nprint("Welcome to Python IDLE")',
            html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n    <p>Edit this HTML and see the preview!</p>\n</body>\n</html>',
            css: 'body {\n    font-family: Arial, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    color: white;\n    padding: 20px;\n}\n\nh1 {\n    text-align: center;\n    font-size: 48px;\n}',
            javascript: 'console.log("Hello from JavaScript!");\n\nconst greeting = "Welcome to JavaScript IDLE";\nconsole.log(greeting);\n\nconst add = (a, b) => a + b;\nconsole.log("2 + 3 =", add(2, 3));',
            sl: 'LEARN: This is SL - Special Learning Language\nCombines Python, HTML, CSS, and JavaScript\nEdit and experiment with code!'
        };

        const codeEditor = document.getElementById('idleCodeEditor');
        codeEditor.value = defaultCode[language];
        localStorage.setItem(`idle_code_${language}`, defaultCode[language]);
        this.showMessage('Code reset to default', 'success');
    }

    showIdleLesson(language, lessonId) {
        const tutorials = {
            python: {
                py1: { title: 'Variables and Data Types', code: 'name = "Alice"\nage = 25\nprint(f"Hello {name}, you are {age} years old")' },
                py2: { title: 'Loops and Conditionals', code: 'for i in range(1, 6):\n    if i % 2 == 0:\n        print(f"{i} is even")\n    else:\n        print(f"{i} is odd")' },
                py3: { title: 'Functions', code: 'def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))\nprint(greet("Bob", "Hi"))' }
            },
            html: {
                html1: { title: 'HTML Structure', code: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Welcome!</h1>\n    <p>This is a paragraph.</p>\n</body>\n</html>' },
                html2: { title: 'Forms and Input', code: '<form>\n    <label>Name:</label>\n    <input type="text" name="name">\n    <label>Email:</label>\n    <input type="email" name="email">\n    <button type="submit">Submit</button>\n</form>' },
                html3: { title: 'Semantic HTML', code: '<header>\n    <nav>Navigation</nav>\n</header>\n<main>\n    <article>\n        <h2>Article Title</h2>\n        <p>Content here</p>\n    </article>\n</main>\n<footer>Footer</footer>' }
            },
            css: {
                css1: { title: 'Selectors and Properties', code: 'h1 {\n    color: blue;\n    font-size: 32px;\n    text-align: center;\n}\n\n.highlight {\n    background-color: yellow;\n    padding: 10px;\n}' },
                css2: { title: 'Flexbox Layout', code: '.container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n}\n\n.item {\n    flex: 1;\n    background: lightblue;\n    padding: 20px;\n}' },
                css3: { title: 'Responsive Design', code: '@media (max-width: 768px) {\n    .container {\n        flex-direction: column;\n    }\n    \n    h1 {\n        font-size: 24px;\n    }\n}' }
            },
            javascript: {
                js1: { title: 'Variables and Functions', code: 'const greet = (name) => {\n    return `Hello, ${name}!`;\n};\n\nlet message = greet("Alice");\nconsole.log(message);' },
                js2: { title: 'DOM Manipulation', code: 'const button = document.getElementById("myBtn");\nbutton.addEventListener("click", () => {\n    alert("Button clicked!");\n    document.body.style.backgroundColor = "lightblue";\n});' },
                js3: { title: 'Async and Promises', code: 'const fetchData = async () => {\n    try {\n        const response = await fetch("https://api.example.com/data");\n        const data = await response.json();\n        console.log(data);\n    } catch (error) {\n        console.error("Error:", error);\n    }\n};' }
            },
            sl: {
                sl1: { title: 'What is SL?', code: 'LEARN Python:\n  - Variables: name = "value"\n  - Functions: def myFunc(): pass\n  - Loops: for i in range(10): pass\n\nLEARN HTML:\n  - Tags: <tag>content</tag>\n  - Attributes: <tag attr="value">\n\nLEARN CSS:\n  - Selectors: .class, #id, element\n  - Properties: color, size, layout\n\nLEARN JavaScript:\n  - Events: click, hover, submit\n  - DOM: document.getElementById()' },
                sl2: { title: 'Building a Web App', code: 'PROJECT: Todo App\n\nHTML:\n  - Input field for tasks\n  - Button to add task\n  - List to display tasks\n\nCSS:\n  - Style the input and button\n  - Make list items look nice\n  - Add hover effects\n\nJavaScript:\n  - Get input value\n  - Add to list on button click\n  - Delete items on click\n  - Save to localStorage' },
                sl3: { title: 'Full Stack Concepts', code: 'FRONTEND (What user sees):\n  - HTML: Structure\n  - CSS: Styling\n  - JavaScript: Interactivity\n\nBACKEND (Server logic):\n  - Python: Process data\n  - Database: Store data\n  - API: Send data to frontend\n\nFLOW:\n  1. User interacts with HTML/CSS/JS\n  2. JavaScript sends request to backend\n  3. Python processes and returns data\n  4. JavaScript updates the page' }
            }
        };

        const lesson = tutorials[language][lessonId];

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>${lesson.title}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; font-family: monospace; white-space: pre-wrap; word-break: break-word; font-size: 13px; line-height: 1.6;">
                        ${lesson.code}
                    </div>
                    <div style="margin-top: 20px; padding: 16px; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #2196F3;">
                        <h4>💡 Tips:</h4>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            <li>Read the code carefully</li>
                            <li>Try to understand each line</li>
                            <li>Practice by typing it yourself</li>
                            <li>Modify it and see what happens</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    getAvailableTests() {
        return [
            {
                id: 'math',
                title: 'Mathematics',
                icon: '🔢',
                description: 'Algebra, geometry, and problem solving',
                questions: 10,
                duration: 15,
                maxReward: 30
            },
            {
                id: 'science',
                title: 'Science',
                icon: '🔬',
                description: 'Biology, chemistry, and physics',
                questions: 10,
                duration: 15,
                maxReward: 30
            },
            {
                id: 'history',
                title: 'History',
                icon: '📜',
                description: 'World history and important events',
                questions: 10,
                duration: 12,
                maxReward: 25
            },
            {
                id: 'english',
                title: 'English',
                icon: '📚',
                description: 'Grammar, vocabulary, and literature',
                questions: 10,
                duration: 12,
                maxReward: 25
            },
            {
                id: 'spanish',
                title: 'Spanish',
                icon: '🇪🇸',
                description: 'Spanish vocabulary and grammar',
                questions: 10,
                duration: 12,
                maxReward: 25
            },
            {
                id: 'python',
                title: 'Python Coding',
                icon: '🐍',
                description: 'Python programming fundamentals',
                questions: 10,
                duration: 20,
                maxReward: 35
            },
            {
                id: 'javascript',
                title: 'JavaScript',
                icon: '💻',
                description: 'JavaScript programming basics',
                questions: 10,
                duration: 20,
                maxReward: 35
            },
            {
                id: 'finance',
                title: 'Finance',
                icon: '💰',
                description: 'Personal finance and economics',
                questions: 10,
                duration: 15,
                maxReward: 30
            },
            {
                id: 'general',
                title: 'General Knowledge',
                icon: '🌍',
                description: 'Geography, culture, and current events',
                questions: 10,
                duration: 12,
                maxReward: 25
            }
        ];
    }

    startTest(testId) {
        const tests = this.getBenchmarkTests();
        const test = tests[testId];

        if (!test) {
            console.error('Test not found:', testId, 'Available tests:', Object.keys(tests));
            this.showMessage('Error: Test not found', 'error');
            return;
        }

        if (!test.questions || test.questions.length === 0) {
            console.error('No questions in test:', testId);
            this.showMessage('Error: No questions available for this test', 'error');
            return;
        }

        this.currentTest = {
            id: testId,
            questions: test.questions,
            currentQuestion: 0,
            answers: [],
            startTime: Date.now()
        };

        console.log('Starting test:', testId, 'with', test.questions.length, 'questions');
        this.showTestQuestion();
    }

    showTestQuestion() {
        const allTests = this.getBenchmarkTests();
        const test = allTests[this.currentTest.id];

        if (!test) {
            console.error('Test not found:', this.currentTest.id);
            this.showMessage('Error: Test not found', 'error');
            return;
        }

        if (!test.questions || test.questions.length === 0) {
            console.error('No questions found for test:', this.currentTest.id);
            this.showMessage('Error: No questions available', 'error');
            return;
        }

        const question = test.questions[this.currentTest.currentQuestion];

        if (!question) {
            console.error('Question not found at index:', this.currentTest.currentQuestion);
            this.showMessage('Error: Question not found', 'error');
            return;
        }

        const progress = ((this.currentTest.currentQuestion + 1) / test.questions.length) * 100;

        const modal = document.createElement('div');
        modal.className = 'modal test-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${test.icon} ${test.title} Test</h2>
                    <button class="close-btn" onclick="if(confirm('Are you sure you want to quit? Progress will be lost.')) this.closest('.modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="test-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span>Question ${this.currentTest.currentQuestion + 1} of ${test.questions.length}</span>
                    </div>
                    
                    <div class="test-question">
                        <h3>${question.question}</h3>
                        <div class="test-options">
                            ${question.options.map((option, i) => `
                                <button class="test-option" onclick="app.selectAnswer(${i})">
                                    <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                                    <span class="option-text">${option}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove old modal if exists
        const oldModal = document.querySelector('.test-modal');
        if (oldModal) oldModal.remove();

        document.body.appendChild(modal);
    }

    selectAnswer(answerIndex) {
        const test = this.getBenchmarkTests()[this.currentTest.id];
        const question = test.questions[this.currentTest.currentQuestion];

        this.currentTest.answers.push({
            questionIndex: this.currentTest.currentQuestion,
            answer: answerIndex,
            correct: answerIndex === question.correct
        });

        this.currentTest.currentQuestion++;

        if (this.currentTest.currentQuestion < test.questions.length) {
            this.showTestQuestion();
        } else {
            this.finishTest();
        }
    }

    finishTest() {
        const test = this.getBenchmarkTests()[this.currentTest.id];
        const testInfo = this.getAvailableTests().find(t => t.id === this.currentTest.id);

        const correctAnswers = this.currentTest.answers.filter(a => a.correct).length;
        const score = Math.round((correctAnswers / test.questions.length) * 100);
        const timeTaken = Math.round((Date.now() - this.currentTest.startTime) / 1000);

        // Calculate recommended study time in minutes
        // 100% = 10 mins, 0% = 180 mins (3 hours), each 10% = 17 less minutes
        // Formula: minutes = 180 - (score / 10) * 17
        const recommendedStudyMinutes = Math.round(180 - (score / 10) * 17);

        // Calculate coins earned (based on score)
        let coinsEarned = 0;
        if (score >= 90) coinsEarned = testInfo.maxReward;
        else if (score >= 80) coinsEarned = Math.round(testInfo.maxReward * 0.8);
        else if (score >= 70) coinsEarned = Math.round(testInfo.maxReward * 0.6);
        else if (score >= 60) coinsEarned = Math.round(testInfo.maxReward * 0.4);
        else if (score >= 50) coinsEarned = Math.round(testInfo.maxReward * 0.2);

        // Save result
        const results = JSON.parse(localStorage.getItem('test_results') || '[]');
        results.push({
            testId: this.currentTest.id,
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: test.questions.length,
            timeTaken: timeTaken,
            coinsEarned: coinsEarned,
            recommendedStudyMinutes: recommendedStudyMinutes,
            completedAt: new Date().toISOString()
        });
        localStorage.setItem('test_results', JSON.stringify(results));

        // Award coins
        if (coinsEarned > 0) {
            this.currentUser.studyCoins = (this.currentUser.studyCoins || 0) + coinsEarned;
            const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].studyCoins = this.currentUser.studyCoins;
                localStorage.setItem('sms_users', JSON.stringify(users));
            }
            this.updateCoinsDisplay();
        }

        // Show results
        const modal = document.querySelector('.test-modal');
        if (modal) {
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🎉 Test Complete!</h2>
                        <button class="close-btn" onclick="this.closest('.modal').remove(); app.navigateTo('tests')">✕</button>
                    </div>
                    <div class="modal-body test-results">
                        <div class="result-score ${score >= 70 ? 'pass' : 'fail'}">
                            <div class="score-circle">
                                <span class="score-number">${score}%</span>
                            </div>
                            <h3>${score >= 90 ? 'Excellent!' : score >= 70 ? 'Good Job!' : score >= 50 ? 'Not Bad!' : 'Keep Practicing!'}</h3>
                        </div>
                        
                        <div class="result-stats">
                            <div class="stat-item">
                                <span class="stat-label">Correct Answers</span>
                                <span class="stat-value">${correctAnswers}/${test.questions.length}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Time Taken</span>
                                <span class="stat-value">${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Coins Earned</span>
                                <span class="stat-value coins-earned">+${coinsEarned} 🪙</span>
                            </div>
                        </div>
                        
                        <div class="study-recommendation">
                            <div class="recommendation-header">
                                <span class="recommendation-icon">📚</span>
                                <h4>Recommended Study Time</h4>
                            </div>
                            <div class="recommendation-content">
                                <div class="study-hours">
                                    <span class="hours-number">${recommendedStudyMinutes}</span>
                                    <span class="hours-label">minutes</span>
                                </div>
                                <p class="recommendation-text">
                                    ${score >= 90 ? 'Excellent! Just 10-27 minutes to maintain mastery.' :
                    score >= 80 ? 'Good work! Study 27-44 minutes to reach mastery.' :
                        score >= 70 ? 'Keep going! Study 44-61 minutes to improve.' :
                            score >= 60 ? 'More practice needed. Study 61-78 minutes to build skills.' :
                                score >= 50 ? 'Significant study needed. Dedicate 78-95 minutes to this subject.' :
                                    'This subject needs major focus. Plan 95+ minutes of dedicated study.'}
                                </p>
                                <div class="study-tips">
                                    <strong>💡 Study Tips:</strong>
                                    <ul>
                                        <li>Use the Pomodoro timer for focused sessions</li>
                                        <li>Review incorrect answers carefully</li>
                                        <li>Ask Conrad AI for help with difficult topics</li>
                                        <li>Retake the test after studying to track progress</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        ${this.currentTest.answers.filter(a => !a.correct).length > 0 ? `
                            <div class="wrong-answers-section">
                                <h3>❌ Review Incorrect Answers</h3>
                                ${this.currentTest.answers.filter(a => !a.correct).map(answer => {
                                        const question = test.questions[answer.questionIndex];
                                        return `
                                        <div class="wrong-answer-item">
                                            <div class="question-text">
                                                <strong>Q${answer.questionIndex + 1}:</strong> ${question.question}
                                            </div>
                                            <div class="answer-comparison">
                                                <div class="your-answer wrong">
                                                    <span class="label">Your Answer:</span>
                                                    <span class="value">${String.fromCharCode(65 + answer.answer)}. ${question.options[answer.answer]}</span>
                                                </div>
                                                <div class="correct-answer">
                                                    <span class="label">Correct Answer:</span>
                                                    <span class="value">${String.fromCharCode(65 + question.correct)}. ${question.options[question.correct]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                    }).join('')}
                            </div>
                        ` : '<div class="perfect-score">🎉 Perfect Score! You got all answers correct!</div>'}
                        
                        <div class="result-actions">
                            <button class="btn-primary" onclick="app.startTest('${this.currentTest.id}')">
                                Retake Test
                            </button>
                            <button class="btn-secondary" onclick="this.closest('.modal').remove(); app.navigateTo('tests')">
                                Back to Tests
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    getBenchmarkTests() {
        return {
            math: {
                icon: '🔢',
                title: 'Mathematics',
                questions: [
                    { question: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correct: 1 },
                    { question: 'Solve: 3x + 7 = 22', options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'], correct: 1 },
                    { question: 'What is the area of a circle with radius 5? (π ≈ 3.14)', options: ['78.5', '31.4', '15.7', '62.8'], correct: 0 },
                    { question: 'What is 2³ × 2²?', options: ['16', '32', '64', '128'], correct: 1 },
                    { question: 'If a triangle has angles 60° and 80°, what is the third angle?', options: ['30°', '40°', '50°', '60°'], correct: 1 },
                    { question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], correct: 2 },
                    { question: 'Simplify: (x² × x³) ÷ x', options: ['x³', 'x⁴', 'x⁵', 'x⁶'], correct: 1 },
                    { question: 'What is 7! (7 factorial)?', options: ['49', '343', '5040', '720'], correct: 2 },
                    { question: 'If y = 2x + 3 and x = 4, what is y?', options: ['9', '10', '11', '12'], correct: 2 },
                    { question: 'What is the slope of the line y = 3x - 5?', options: ['3', '-5', '5', '-3'], correct: 0 }
                ]
            },
            science: {
                icon: '🔬',
                title: 'Science',
                questions: [
                    { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
                    { question: 'How many bones are in the adult human body?', options: ['196', '206', '216', '226'], correct: 1 },
                    { question: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], correct: 0 },
                    { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'], correct: 2 },
                    { question: 'What is the most abundant gas in Earth\'s atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 1 },
                    { question: 'What is the pH of pure water?', options: ['5', '6', '7', '8'], correct: 2 },
                    { question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correct: 1 },
                    { question: 'What is the smallest unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Organ'], correct: 2 },
                    { question: 'What force keeps planets in orbit around the sun?', options: ['Magnetism', 'Gravity', 'Friction', 'Inertia'], correct: 1 },
                    { question: 'What is H2O commonly known as?', options: ['Hydrogen', 'Oxygen', 'Water', 'Peroxide'], correct: 2 }
                ]
            },
            history: {
                icon: '📜',
                title: 'History',
                questions: [
                    { question: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2 },
                    { question: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'], correct: 1 },
                    { question: 'What year did the Titanic sink?', options: ['1910', '1911', '1912', '1913'], correct: 2 },
                    { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correct: 2 },
                    { question: 'What ancient wonder was located in Egypt?', options: ['Hanging Gardens', 'Colossus of Rhodes', 'Great Pyramid', 'Lighthouse'], correct: 2 },
                    { question: 'Who discovered America in 1492?', options: ['Amerigo Vespucci', 'Christopher Columbus', 'Leif Erikson', 'Ferdinand Magellan'], correct: 1 },
                    { question: 'What year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1990'], correct: 2 },
                    { question: 'Who was the first person to walk on the moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'John Glenn', 'Yuri Gagarin'], correct: 1 },
                    { question: 'What empire was ruled by Julius Caesar?', options: ['Greek', 'Roman', 'Persian', 'Egyptian'], correct: 1 },
                    { question: 'In what year did the American Civil War begin?', options: ['1859', '1860', '1861', '1862'], correct: 2 }
                ]
            },
            english: {
                icon: '📚',
                title: 'English',
                questions: [
                    { question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childes', 'Childrens'], correct: 1 },
                    { question: 'Which word is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1 },
                    { question: 'What is the past tense of "run"?', options: ['Runned', 'Run', 'Ran', 'Running'], correct: 2 },
                    { question: 'Which is the correct spelling?', options: ['Recieve', 'Receive', 'Recive', 'Receeve'], correct: 1 },
                    { question: 'What type of word is "quickly"?', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], correct: 3 },
                    { question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correct: 1 },
                    { question: 'What is an antonym of "hot"?', options: ['Warm', 'Cold', 'Cool', 'Freezing'], correct: 1 },
                    { question: 'Which sentence is correct?', options: ['Their going to the store', 'There going to the store', 'They\'re going to the store', 'Theyre going to the store'], correct: 2 },
                    { question: 'What is a metaphor?', options: ['A comparison using like or as', 'A direct comparison', 'An exaggeration', 'A sound word'], correct: 1 },
                    { question: 'What is the superlative form of "good"?', options: ['Gooder', 'Goodest', 'Better', 'Best'], correct: 3 }
                ]
            },
            spanish: {
                icon: '🇪🇸',
                title: 'Spanish',
                questions: [
                    { question: 'What does "Hola" mean?', options: ['Goodbye', 'Hello', 'Thank you', 'Please'], correct: 1 },
                    { question: 'How do you say "thank you" in Spanish?', options: ['Por favor', 'De nada', 'Gracias', 'Lo siento'], correct: 2 },
                    { question: 'What is "cat" in Spanish?', options: ['Perro', 'Gato', 'Pájaro', 'Pez'], correct: 1 },
                    { question: 'What does "Buenos días" mean?', options: ['Good night', 'Good afternoon', 'Good morning', 'Good evening'], correct: 2 },
                    { question: 'How do you say "one" in Spanish?', options: ['Uno', 'Dos', 'Tres', 'Cuatro'], correct: 0 },
                    { question: 'What is "water" in Spanish?', options: ['Leche', 'Jugo', 'Agua', 'Café'], correct: 2 },
                    { question: 'What does "¿Cómo estás?" mean?', options: ['What is your name?', 'How are you?', 'Where are you?', 'How old are you?'], correct: 1 },
                    { question: 'What is "red" in Spanish?', options: ['Azul', 'Verde', 'Rojo', 'Amarillo'], correct: 2 },
                    { question: 'How do you say "goodbye" in Spanish?', options: ['Hola', 'Adiós', 'Gracias', 'Sí'], correct: 1 },
                    { question: 'What does "Yo soy" mean?', options: ['You are', 'I am', 'He is', 'We are'], correct: 1 }
                ]
            },
            python: {
                icon: '🐍',
                title: 'Python',
                questions: [
                    { question: 'What is the correct way to print in Python?', options: ['echo("Hello")', 'print("Hello")', 'console.log("Hello")', 'printf("Hello")'], correct: 1 },
                    { question: 'What data type is [1, 2, 3]?', options: ['Tuple', 'Dictionary', 'List', 'Set'], correct: 2 },
                    { question: 'How do you create a comment in Python?', options: ['// comment', '/* comment */', '# comment', '<!-- comment -->'], correct: 2 },
                    { question: 'What does len([1,2,3]) return?', options: ['1', '2', '3', '4'], correct: 2 },
                    { question: 'What is the correct way to define a function?', options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'], correct: 1 },
                    { question: 'What does "==" do in Python?', options: ['Assignment', 'Comparison', 'Addition', 'Concatenation'], correct: 1 },
                    { question: 'What is the output of: 5 // 2?', options: ['2', '2.5', '3', '2.0'], correct: 0 },
                    { question: 'How do you start a for loop?', options: ['for i in range(5):', 'for (i=0; i<5; i++)', 'foreach i in 5:', 'loop i to 5:'], correct: 0 },
                    { question: 'What is the correct way to import a module?', options: ['include math', 'import math', 'require math', 'using math'], correct: 1 },
                    { question: 'What does "str(5)" do?', options: ['Converts 5 to string', 'Converts 5 to integer', 'Multiplies by 5', 'Divides by 5'], correct: 0 }
                ]
            },
            javascript: {
                icon: '💻',
                title: 'JavaScript',
                questions: [
                    { question: 'How do you declare a variable in JavaScript?', options: ['var x = 5', 'variable x = 5', 'int x = 5', 'x := 5'], correct: 0 },
                    { question: 'What is the correct way to write an if statement?', options: ['if x = 5', 'if (x == 5)', 'if x == 5 then', 'if [x == 5]'], correct: 1 },
                    { question: 'How do you write a function in JavaScript?', options: ['function myFunc()', 'def myFunc()', 'func myFunc()', 'function: myFunc()'], correct: 0 },
                    { question: 'What does "===" check?', options: ['Value only', 'Type only', 'Value and type', 'Neither'], correct: 2 },
                    { question: 'How do you add an element to an array?', options: ['array.add()', 'array.push()', 'array.append()', 'array.insert()'], correct: 1 },
                    { question: 'What is the output of: typeof "Hello"?', options: ['text', 'string', 'char', 'str'], correct: 1 },
                    { question: 'How do you write a comment in JavaScript?', options: ['# comment', '<!-- comment -->', '// comment', '/* comment'], correct: 2 },
                    { question: 'What does "let" do?', options: ['Declares a constant', 'Declares a variable', 'Declares a function', 'Declares a class'], correct: 1 },
                    { question: 'How do you access the first element of an array?', options: ['array[0]', 'array[1]', 'array.first()', 'array.get(0)'], correct: 0 },
                    { question: 'What is the correct way to write a for loop?', options: ['for (i = 0; i < 5; i++)', 'for i in range(5)', 'for (i to 5)', 'foreach (i in 5)'], correct: 0 }
                ]
            },
            finance: {
                icon: '💰',
                title: 'Finance',
                questions: [
                    { question: 'What does APR stand for?', options: ['Annual Percentage Rate', 'Average Payment Rate', 'Annual Payment Return', 'Average Percentage Return'], correct: 0 },
                    { question: 'What is a stock?', options: ['A loan', 'Ownership in a company', 'A type of bond', 'A savings account'], correct: 1 },
                    { question: 'What is compound interest?', options: ['Simple interest', 'Interest on interest', 'Fixed interest', 'No interest'], correct: 1 },
                    { question: 'What is a budget?', options: ['A spending plan', 'A savings account', 'A type of loan', 'An investment'], correct: 0 },
                    { question: 'What does ROI stand for?', options: ['Rate of Interest', 'Return on Investment', 'Risk of Investment', 'Rate of Income'], correct: 1 },
                    { question: 'What is inflation?', options: ['Prices going down', 'Prices going up', 'Stable prices', 'No prices'], correct: 1 },
                    { question: 'What is a credit score?', options: ['Amount of debt', 'Creditworthiness rating', 'Bank balance', 'Income level'], correct: 1 },
                    { question: 'What is diversification?', options: ['Buying one stock', 'Spreading investments', 'Saving money', 'Spending money'], correct: 1 },
                    { question: 'What is a 401(k)?', options: ['A type of loan', 'Retirement savings plan', 'Credit card', 'Checking account'], correct: 1 },
                    { question: 'What does GDP stand for?', options: ['Gross Domestic Product', 'General Domestic Product', 'Gross Development Product', 'General Development Product'], correct: 0 }
                ]
            },
            general: {
                icon: '🌍',
                title: 'General Knowledge',
                questions: [
                    { question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
                    { question: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2 },
                    { question: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
                    { question: 'Who invented the telephone?', options: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Benjamin Franklin'], correct: 1 },
                    { question: 'What is the tallest mountain in the world?', options: ['K2', 'Kilimanjaro', 'Mount Everest', 'Denali'], correct: 2 },
                    { question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1 },
                    { question: 'How many colors are in a rainbow?', options: ['5', '6', '7', '8'], correct: 2 },
                    { question: 'What is the largest planet in our solar system?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correct: 1 },
                    { question: 'What language is spoken in Brazil?', options: ['Spanish', 'Portuguese', 'French', 'Italian'], correct: 1 },
                    { question: 'How many days are in a leap year?', options: ['364', '365', '366', '367'], correct: 2 }
                ]
            }
        };
    }

    // PDF Quiz Methods
    async handlePdfQuizUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check if user has enough coins (students need 30, teachers/admins get free)
        if (this.currentUser.role === 'student') {
            if ((this.currentUser.studyCoins || 0) < 30) {
                this.showMessage('You need 30 Study Coins to upload a PDF quiz. You have ' + (this.currentUser.studyCoins || 0), 'error');
                return;
            }
        }

        // Ask if this is a test
        const isTest = confirm('Is this PDF a test/quiz that you want to convert into an interactive quiz?');
        if (!isTest) {
            this.showMessage('Upload cancelled', 'info');
            return;
        }

        // Show loading message
        this.showMessage('Processing PDF... This may take a moment', 'success');

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const pdfData = e.target.result;

                // Extract text from PDF (basic extraction)
                const extractedText = await this.extractTextFromPdf(pdfData);

                // Parse questions from extracted text
                const questions = this.parseQuestionsFromText(extractedText);

                if (questions.length === 0) {
                    this.showMessage('No questions found in PDF. Please ensure the PDF contains questions.', 'error');
                    return;
                }

                // Create quiz object
                const quiz = {
                    id: 'quiz_' + Date.now(),
                    title: file.name.replace('.pdf', ''),
                    questions: questions,
                    createdAt: new Date().toISOString(),
                    fileName: file.name
                };

                // Save quiz
                const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
                customQuizzes.push(quiz);
                localStorage.setItem('custom_quizzes', JSON.stringify(customQuizzes));

                // Deduct coins from student
                if (this.currentUser.role === 'student') {
                    this.currentUser.studyCoins = (this.currentUser.studyCoins || 0) - 30;
                    const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
                    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
                    if (userIndex !== -1) {
                        users[userIndex].studyCoins = this.currentUser.studyCoins;
                        localStorage.setItem('sms_users', JSON.stringify(users));
                    }
                    this.updateCoinsDisplay();
                }

                this.showMessage(`Quiz created successfully! Found ${questions.length} questions. Cost: ${this.currentUser.role === 'student' ? '30 coins' : 'Free'}`, 'success');
                this.navigateTo('tests');
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Error processing PDF:', error);
            this.showMessage('Error processing PDF. Please try again.', 'error');
        }
    }

    async extractTextFromPdf(pdfData) {
        // Simple PDF text extraction (basic implementation)
        // In production, you'd use a library like pdf.js
        try {
            const text = new TextDecoder().decode(pdfData);
            return text;
        } catch (e) {
            // Fallback: try to extract as binary
            const view = new Uint8Array(pdfData);
            let text = '';
            for (let i = 0; i < view.length; i++) {
                const char = String.fromCharCode(view[i]);
                if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
                    text += char;
                }
            }
            return text;
        }
    }

    parseQuestionsFromText(text) {
        const questions = [];

        // Split by common question patterns
        const lines = text.split('\n').filter(line => line.trim().length > 0);

        let currentQuestion = null;
        let currentAnswers = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Check if line starts with question pattern (Q1., 1., Question:, etc.)
            const questionMatch = line.match(/^(Q\d+\.|Question\s*\d+:|^\d+\.|^[A-Z]\.|^-\s+)/i);

            if (questionMatch) {
                // Save previous question if exists
                if (currentQuestion) {
                    questions.push({
                        question: currentQuestion,
                        options: currentAnswers.length > 0 ? currentAnswers : [],
                        type: currentAnswers.length > 0 ? 'multiple' : 'free'
                    });
                }

                // Start new question
                currentQuestion = line.replace(questionMatch[0], '').trim();
                currentAnswers = [];
            } else if (currentQuestion && line.match(/^[A\)\.\s]|^[B\)\.\s]|^[C\)\.\s]|^[D\)\.\s]|^[E\)\.\s]|^[1\)\.\s]|^[2\)\.\s]|^[3\)\.\s]|^[4\)\.\s]|^[5\)\.\s]/i)) {
                // This is an answer option
                const answerText = line.replace(/^[A-E\d\)\.\s]+/i, '').trim();
                if (answerText.length > 0) {
                    currentAnswers.push(answerText);
                }
            }
        }

        // Add last question
        if (currentQuestion) {
            questions.push({
                question: currentQuestion,
                options: currentAnswers.length > 0 ? currentAnswers : [],
                type: currentAnswers.length > 0 ? 'multiple' : 'free'
            });
        }

        return questions.filter(q => q.question.length > 0);
    }

    startCustomQuiz(quizId) {
        const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
        const quiz = customQuizzes.find(q => q.id === quizId);

        if (!quiz) {
            this.showMessage('Quiz not found', 'error');
            return;
        }

        this.currentCustomQuiz = {
            id: quizId,
            title: quiz.title,
            questions: quiz.questions,
            currentQuestion: 0,
            answers: [],
            startTime: Date.now()
        };

        this.showCustomQuizQuestion();
    }

    showCustomQuizQuestion() {
        const quiz = this.currentCustomQuiz;
        const question = quiz.questions[quiz.currentQuestion];
        const isLastQuestion = quiz.currentQuestion === quiz.questions.length - 1;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content quiz-modal" style="max-width: 600px;">
                <div class="modal-header">
                    <h2>${quiz.title}</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="quiz-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((quiz.currentQuestion + 1) / quiz.questions.length) * 100}%"></div>
                        </div>
                        <span>Question ${quiz.currentQuestion + 1} of ${quiz.questions.length}</span>
                    </div>

                    <div class="quiz-question">
                        <h3>${question.question}</h3>
                        
                        ${question.type === 'multiple' ? `
                            <div class="quiz-options">
                                ${question.options.map((option, idx) => `
                                    <button class="quiz-option" onclick="app.selectCustomAnswer(${idx})">
                                        <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                                        <span class="option-text">${option}</span>
                                    </button>
                                `).join('')}
                            </div>
                        ` : `
                            <textarea id="freeResponseAnswer" placeholder="Type your answer here..." rows="4" style="width: 100%; padding: 12px; border: 1px solid #e5e5ea; border-radius: 8px; font-family: inherit;"></textarea>
                        `}
                    </div>

                    <div class="quiz-nav" style="display: flex; gap: 12px; margin-top: 20px;">
                        <button class="btn-secondary" onclick="app.prevCustomQuestion()" style="display: ${quiz.currentQuestion === 0 ? 'none' : 'block'};">
                            ← Previous
                        </button>
                        <button class="btn-primary" onclick="app.nextCustomQuestion()" style="display: ${isLastQuestion ? 'none' : 'block'}; flex: 1;">
                            Next →
                        </button>
                        <button class="btn-primary" onclick="app.finishCustomQuiz()" style="display: ${isLastQuestion ? 'block' : 'none'}; flex: 1;">
                            Finish Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    selectCustomAnswer(answerIndex) {
        const question = this.currentCustomQuiz.questions[this.currentCustomQuiz.currentQuestion];
        this.currentCustomQuiz.answers[this.currentCustomQuiz.currentQuestion] = {
            answer: question.options[answerIndex],
            answerIndex: answerIndex
        };

        // Highlight selected option
        document.querySelectorAll('.quiz-option').forEach((btn, idx) => {
            btn.style.background = idx === answerIndex ? '#007aff' : '';
            btn.style.color = idx === answerIndex ? 'white' : '';
        });
    }

    nextCustomQuestion() {
        // Save free response if exists
        const freeResponseInput = document.getElementById('freeResponseAnswer');
        if (freeResponseInput) {
            this.currentCustomQuiz.answers[this.currentCustomQuiz.currentQuestion] = {
                answer: freeResponseInput.value
            };
        }

        this.currentCustomQuiz.currentQuestion++;
        document.querySelector('.modal').remove();
        this.showCustomQuizQuestion();
    }

    prevCustomQuestion() {
        this.currentCustomQuiz.currentQuestion--;
        document.querySelector('.modal').remove();
        this.showCustomQuizQuestion();
    }

    finishCustomQuiz() {
        // Save last answer
        const freeResponseInput = document.getElementById('freeResponseAnswer');
        if (freeResponseInput) {
            this.currentCustomQuiz.answers[this.currentCustomQuiz.currentQuestion] = {
                answer: freeResponseInput.value
            };
        }

        const quiz = this.currentCustomQuiz;
        const completedQuiz = {
            quizId: quiz.id,
            title: quiz.title,
            completedAt: new Date().toISOString(),
            answers: quiz.answers,
            timeSpent: Math.round((Date.now() - quiz.startTime) / 1000)
        };

        // Save completion
        const completedQuizzes = JSON.parse(localStorage.getItem('completed_custom_quizzes') || '[]');
        completedQuizzes.push(completedQuiz);
        localStorage.setItem('completed_custom_quizzes', JSON.stringify(completedQuizzes));

        document.querySelector('.modal').remove();
        this.showMessage(`Quiz completed! Time: ${Math.round(completedQuiz.timeSpent / 60)} minutes`, 'success');
        this.navigateTo('tests');
    }

    deleteCustomQuiz(quizId) {
        if (confirm('Are you sure you want to delete this quiz?')) {
            const customQuizzes = JSON.parse(localStorage.getItem('custom_quizzes') || '[]');
            const updatedQuizzes = customQuizzes.filter(q => q.id !== quizId);
            localStorage.setItem('custom_quizzes', JSON.stringify(updatedQuizzes));
            this.showMessage('Quiz deleted', 'success');
            this.navigateTo('tests');
        }
    }
    getShopContent() {
        const unlockedFeatures = JSON.parse(localStorage.getItem('unlocked_features') || '[]');

        const shopItems = [
            {
                id: 'conrad',
                name: 'Conrad AI Assistant',
                description: 'Unlock AI-powered study help, instant answers, and 24/7 assistance',
                icon: '🤖',
                price: 30,
                unlocked: unlockedFeatures.includes('conrad')
            },
            {
                id: 'themes_premium',
                name: 'Premium Themes Pack',
                description: 'Unlock 10 exclusive premium themes with unique color schemes',
                icon: '🎨',
                price: 50,
                unlocked: unlockedFeatures.includes('themes_premium')
            },
            {
                id: 'study_streak',
                name: 'Study Streak Tracker',
                description: 'Track your daily study streaks and earn bonus coins',
                icon: '🔥',
                price: 25,
                unlocked: unlockedFeatures.includes('study_streak')
            },
            {
                id: 'advanced_analytics',
                name: 'Advanced Analytics',
                description: 'Detailed charts and insights about your study patterns',
                icon: '📊',
                price: 40,
                unlocked: unlockedFeatures.includes('advanced_analytics')
            },
            {
                id: 'custom_avatars',
                name: 'Custom Avatars',
                description: 'Upload your own avatar or choose from 50+ options',
                icon: '👤',
                price: 20,
                unlocked: unlockedFeatures.includes('custom_avatars')
            },
            {
                id: 'study_music',
                name: 'Focus Music Player',
                description: 'Built-in music player with focus-enhancing playlists',
                icon: '🎵',
                price: 35,
                unlocked: unlockedFeatures.includes('study_music')
            }
        ];

        return `
            <div class="view-header">
                <h2>🛒 Study Coin Shop</h2>
                <p>Unlock premium features with your Study Coins</p>
                <div class="coins-header">
                    <span class="coin-icon-large">🪙</span>
                    <span class="coin-amount-large">${this.currentUser.studyCoins || 0}</span>
                </div>
            </div>
            
            <div class="shop-container">
                <div class="shop-grid">
                    ${shopItems.map(item => `
                        <div class="shop-item ${item.unlocked ? 'unlocked' : ''}">
                            <div class="item-icon">${item.icon}</div>
                            <h3>${item.name}</h3>
                            <p class="item-description">${item.description}</p>
                            <div class="item-price">
                                <span class="price-amount">${item.price}</span>
                                <span class="price-currency">🪙</span>
                            </div>
                            ${item.unlocked ? `
                                <button class="btn-unlocked" disabled>
                                    ✅ Unlocked
                                </button>
                            ` : `
                                <button class="btn-primary ${(this.currentUser.studyCoins || 0) < item.price ? 'btn-disabled' : ''}" 
                                        onclick="app.purchaseItem('${item.id}', ${item.price}, '${item.name}')"
                                        ${(this.currentUser.studyCoins || 0) < item.price ? 'disabled' : ''}>
                                    ${(this.currentUser.studyCoins || 0) < item.price ? '🔒 Not Enough Coins' : '🛒 Purchase'}
                                </button>
                            `}
                        </div>
                    `).join('')}
                </div>
                
                <div class="card">
                    <h3>💡 How to Earn More Coins</h3>
                    <div class="earn-coins-grid">
                        <div class="earn-method">
                            <span class="method-icon">📋</span>
                            <div>
                                <strong>Complete Surveys</strong>
                                <p>Earn 10-25 coins per survey</p>
                            </div>
                        </div>
                        <div class="earn-method">
                            <span class="method-icon">🎯</span>
                            <div>
                                <strong>Take Tests</strong>
                                <p>Earn up to 35 coins per test</p>
                            </div>
                        </div>
                        <div class="earn-method">
                            <span class="method-icon">⏱️</span>
                            <div>
                                <strong>Study with Pomodoro</strong>
                                <p>Coming soon: Earn coins for study time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    purchaseItem(itemId, price, itemName) {
        if ((this.currentUser.studyCoins || 0) < price) {
            this.showMessage('Not enough Study Coins!', 'error');
            return;
        }

        if (!confirm(`Purchase ${itemName} for ${price} coins?`)) {
            return;
        }

        // Deduct coins
        this.currentUser.studyCoins -= price;
        const users = JSON.parse(localStorage.getItem('sms_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].studyCoins = this.currentUser.studyCoins;
            localStorage.setItem('sms_users', JSON.stringify(users));
        }

        // Unlock feature
        const unlockedFeatures = JSON.parse(localStorage.getItem('unlocked_features') || '[]');
        unlockedFeatures.push(itemId);
        localStorage.setItem('unlocked_features', JSON.stringify(unlockedFeatures));

        this.updateCoinsDisplay();
        this.showMessage(`${itemName} unlocked! 🎉`, 'success');
        this.navigateTo('shop');
    }

    // Pomodoro Timer methods
    getPomodoroContent() {
        const studySessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
        const today = new Date().toDateString();
        const todaySessions = studySessions.filter(s => new Date(s.date).toDateString() === today);
        const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

        const thisWeek = this.getWeekSessions(studySessions);
        const weekMinutes = thisWeek.reduce((sum, s) => sum + s.duration, 0);

        return `
            <div class="view-header">
                <h2>⏱️ Pomodoro Timer</h2>
                <p>Stay focused with the Pomodoro Technique</p>
            </div>
            
            <div class="pomodoro-container">
                <div class="pomodoro-timer-card">
                    <div class="timer-display" id="timerDisplay">25:00</div>
                    <div class="timer-label" id="timerLabel">Focus Time</div>
                    
                    <div class="timer-controls">
                        <button class="btn-timer btn-start" id="startBtn" onclick="app.startPomodoro()">
                            ▶️ Start
                        </button>
                        <button class="btn-timer btn-pause" id="pauseBtn" onclick="app.pausePomodoro()" style="display: none;">
                            ⏸️ Pause
                        </button>
                        <button class="btn-timer btn-reset" onclick="app.resetPomodoro()">
                            🔄 Reset
                        </button>
                    </div>
                    
                    <div class="timer-settings">
                        <div class="setting-item">
                            <label>Focus Time</label>
                            <select id="focusTime" onchange="app.updateTimerSettings()">
                                <option value="15">15 min</option>
                                <option value="25" selected>25 min</option>
                                <option value="30">30 min</option>
                                <option value="45">45 min</option>
                                <option value="60">60 min</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Break Time</label>
                            <select id="breakTime" onchange="app.updateTimerSettings()">
                                <option value="3">3 min</option>
                                <option value="5" selected>5 min</option>
                                <option value="10">10 min</option>
                                <option value="15">15 min</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="pomodoro-count">
                        <span id="pomodoroCount">0</span> Pomodoros completed today
                    </div>
                </div>
                
                <div class="study-stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📅</div>
                        <div class="stat-info">
                            <h3>${todayMinutes} min</h3>
                            <p>Today</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📊</div>
                        <div class="stat-info">
                            <h3>${weekMinutes} min</h3>
                            <p>This Week</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-info">
                            <h3>${todaySessions.length}</h3>
                            <p>Sessions Today</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-info">
                            <h3>${Math.round(weekMinutes / 7)} min</h3>
                            <p>Daily Average</p>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>📈 Study History</h3>
                    <div class="study-history">
                        ${studySessions.slice(-10).reverse().map(s => `
                            <div class="history-item">
                                <div class="history-info">
                                    <strong>${s.duration} minutes</strong>
                                    <span>${new Date(s.date).toLocaleDateString()} at ${new Date(s.date).toLocaleTimeString()}</span>
                                </div>
                                <span class="history-badge">${s.type === 'focus' ? '🎯 Focus' : '☕ Break'}</span>
                            </div>
                        `).join('') || '<p style="text-align: center; color: #999;">No study sessions yet. Start your first Pomodoro!</p>'}
                    </div>
                </div>
                
                <div class="card">
                    <h3>💡 What is Pomodoro Technique?</h3>
                    <p>The Pomodoro Technique is a time management method that uses a timer to break work into intervals:</p>
                    <ul>
                        <li>🎯 <strong>Focus for 25 minutes</strong> - Work without distractions</li>
                        <li>☕ <strong>Break for 5 minutes</strong> - Rest and recharge</li>
                        <li>🔄 <strong>Repeat 4 times</strong> - Then take a longer break (15-30 min)</li>
                    </ul>
                    <p><strong>Benefits:</strong> Improved focus, reduced burnout, better time management</p>
                </div>
            </div>
        `;
    }

    initPomodoro() {
        this.pomodoroState = {
            timeLeft: 25 * 60,
            isRunning: false,
            isPaused: false,
            interval: null,
            mode: 'focus',
            focusDuration: 25,
            breakDuration: 5,
            completedToday: 0
        };

        // Load today's completed count
        const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
        const today = new Date().toDateString();
        this.pomodoroState.completedToday = sessions.filter(s =>
            new Date(s.date).toDateString() === today && s.type === 'focus'
        ).length;

        document.getElementById('pomodoroCount').textContent = this.pomodoroState.completedToday;
    }

    startPomodoro() {
        if (!this.pomodoroState) this.initPomodoro();

        this.pomodoroState.isRunning = true;
        this.pomodoroState.isPaused = false;

        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-block';

        this.pomodoroState.interval = setInterval(() => {
            this.pomodoroState.timeLeft--;
            this.updateTimerDisplay();

            if (this.pomodoroState.timeLeft <= 0) {
                this.completePomodoro();
            }
        }, 1000);
    }

    pausePomodoro() {
        if (!this.pomodoroState) return;

        this.pomodoroState.isRunning = false;
        this.pomodoroState.isPaused = true;
        clearInterval(this.pomodoroState.interval);

        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    resetPomodoro() {
        if (!this.pomodoroState) return;

        clearInterval(this.pomodoroState.interval);
        this.pomodoroState.isRunning = false;
        this.pomodoroState.isPaused = false;
        this.pomodoroState.timeLeft = this.pomodoroState.focusDuration * 60;
        this.pomodoroState.mode = 'focus';

        this.updateTimerDisplay();
        document.getElementById('timerLabel').textContent = 'Focus Time';
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    completePomodoro() {
        clearInterval(this.pomodoroState.interval);

        // Save session to history
        const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
        const session = {
            date: new Date().toISOString(),
            duration: this.pomodoroState.mode === 'focus' ? this.pomodoroState.focusDuration : this.pomodoroState.breakDuration,
            type: this.pomodoroState.mode
        };
        sessions.push(session);
        localStorage.setItem('study_sessions', JSON.stringify(sessions));

        // Play notification sound (browser beep)
        if (Notification.permission === 'granted') {
            new Notification(
                this.pomodoroState.mode === 'focus' ? '🎉 Focus Session Complete!' : '☕ Break Time Over!',
                {
                    body: this.pomodoroState.mode === 'focus'
                        ? 'Great job! Time for a break.'
                        : 'Break is over. Ready to focus again?',
                    icon: '⏱️'
                }
            );
        }

        // Switch mode
        if (this.pomodoroState.mode === 'focus') {
            this.pomodoroState.completedToday++;
            document.getElementById('pomodoroCount').textContent = this.pomodoroState.completedToday;

            this.pomodoroState.mode = 'break';
            this.pomodoroState.timeLeft = this.pomodoroState.breakDuration * 60;
            document.getElementById('timerLabel').textContent = 'Break Time';
            this.showMessage('Focus session complete! Take a break.', 'success');
        } else {
            this.pomodoroState.mode = 'focus';
            this.pomodoroState.timeLeft = this.pomodoroState.focusDuration * 60;
            document.getElementById('timerLabel').textContent = 'Focus Time';
            this.showMessage('Break over! Ready to focus again?', 'success');
        }

        this.updateTimerDisplay();
        this.pomodoroState.isRunning = false;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';

        // Refresh the page to update stats
        this.navigateTo('pomodoro');
    }

    updateTimerDisplay() {
        if (!this.pomodoroState) return;

        const minutes = Math.floor(this.pomodoroState.timeLeft / 60);
        const seconds = this.pomodoroState.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = display;
        }
    }

    updateTimerSettings() {
        const focusTime = parseInt(document.getElementById('focusTime').value);
        const breakTime = parseInt(document.getElementById('breakTime').value);

        this.pomodoroState.focusDuration = focusTime;
        this.pomodoroState.breakDuration = breakTime;

        if (!this.pomodoroState.isRunning) {
            this.pomodoroState.timeLeft = focusTime * 60;
            this.updateTimerDisplay();
        }
    }

    getWeekSessions(sessions) {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessions.filter(s => new Date(s.date) >= weekAgo);
    }

    // Conrad AI methods
    async sendToConrad() {
        const input = document.getElementById('conradInput');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        // Show typing indicator
        this.addConradTyping();

        setTimeout(async () => {
            const response = await this.getConradResponse(message);
            this.removeConradTyping();
            this.addConradMessage(response);
        }, 1000);
    }

    async askConrad(question) {
        this.addUserMessage(question);

        // Show typing indicator
        this.addConradTyping();

        setTimeout(async () => {
            const response = await this.getConradResponse(question);
            this.removeConradTyping();
            this.addConradMessage(response);
        }, 1000);
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-avatar">${this.currentUser.avatar}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addConradMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message conrad-message';

        // Convert markdown-style links and bold text
        let formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/\n/g, '<br>');

        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${formattedMessage}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addConradTyping() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message conrad-message typing-indicator';
        typingDiv.id = 'conrad-typing';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    removeConradTyping() {
        const typingIndicator = document.getElementById('conrad-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async getConradResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Check if it's a "What is" question FIRST - use Gemini API
        // This should take priority over other checks
        if (this.isWhatIsQuestion(message)) {
            return await this.askGemini(message);
        }

        // Check if it's a grammar question
        if (this.isGrammarQuestion(message)) {
            return this.fixGrammar(message);
        }

        // Check if it's a math question
        if (this.isMathQuestion(message)) {
            return this.solveMath(message);
        }

        // Check for quick responses
        const quickResponses = {
            'quiz': 'Great! Upload your quiz file and I\'ll analyze it for you. I can identify patterns, suggest improvements, and help you understand any mistakes.',
            'study tips': 'Here are some effective study tips: 1) Use spaced repetition, 2) Take regular breaks, 3) Teach concepts to others, 4) Practice active recall. What subject are you studying?',
            'help': 'I\'m here to help! You can ask me about homework, search for information, solve math problems, and provide study tips. What would you like to do?'
        };

        for (const [key, response] of Object.entries(quickResponses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        // For everything else, search Google
        return await this.searchGoogle(message);
    }

    isWhatIsQuestion(message) {
        // Check for "What is", "Define", "Explain", "Tell me about" patterns
        // This should match ANY text after these keywords, including multi-word phrases
        return /^(what is|what are|define|explain|tell me about|who is|when was|where is|how does|why|describe)\s+.+/i.test(message.trim());
    }

    async askGemini(question) {
        // Get API key from localStorage
        const geminiApiKey = localStorage.getItem('gemini_api_key');

        if (!geminiApiKey) {
            // No API key, use Google search fallback
            return await this.searchGoogle(question);
        }

        try {
            // Add instruction for detailed responses
            const detailedQuestion = `Please provide a comprehensive and detailed answer to the following question. Include examples, explanations, and relevant context:\n\n${question}`;

            // Try with gemini-1.5-flash first
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: detailedQuestion
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();

                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const answer = data.candidates[0].content.parts[0].text;

                    // Extract search term from question
                    const searchTerm = question.replace(/^(what is|what are|define|explain|tell me about|who is|when was|where is|how does|why|describe)\s+/i, '').trim();
                    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
                    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm.replace(/\s+/g, '_'))}`;

                    return `🤖 **Gemini AI Response**\n\n${answer}\n\n---\n\n**Want to learn more?**\n\n[🔍 Search on Google](${googleUrl}) | [📖 Search on Wikipedia](${wikiUrl})`;
                }
            }

            // If gemini-1.5-flash fails, try gemini-pro
            if (response.status === 404 || response.status === 400) {
                return await this.askGeminiAlt(question, geminiApiKey);
            }

            // If both fail, use Google search
            throw new Error(`Gemini API error: ${response.status}`);
        } catch (error) {
            console.error('Gemini API error:', error);
            // Fallback to Google search
            return await this.searchGoogle(question);
        }
    }

    async askGeminiAlt(question, apiKey) {
        try {
            // Try with gemini-pro model as fallback
            const detailedQuestion = `Please provide a comprehensive and detailed answer to the following question. Include examples, explanations, and relevant context:\n\n${question}`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: detailedQuestion
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();

                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const answer = data.candidates[0].content.parts[0].text;

                    // Extract search term from question
                    const searchTerm = question.replace(/^(what is|what are|define|explain|tell me about|who is|when was|where is|how does|why|describe)\s+/i, '').trim();
                    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
                    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm.replace(/\s+/g, '_'))}`;

                    return `🤖 **Gemini AI Response**\n\n${answer}\n\n---\n\n**Want to learn more?**\n\n[🔍 Search on Google](${googleUrl}) | [📖 Search on Wikipedia](${wikiUrl})`;
                }
            }

            throw new Error(`Gemini Pro API error: ${response.status}`);
        } catch (error) {
            console.error('Gemini Alt API error:', error);
            // Final fallback to Google search
            return await this.searchGoogle(question);
        }
    }

    isGrammarQuestion(message) {
        // Check for grammar-related keywords and patterns
        const grammarKeywords = /fix|correct|grammar|sentence|punctuation|spelling|tense|subject-verb|agreement|dangling|modifier|phrase|clause|error|mistake|rewrite/i;
        const hasColon = message.includes(':');
        const hasQuotation = /["'].*["']/.test(message);

        return grammarKeywords.test(message) || hasColon || hasQuotation;
    }

    fixGrammar(message) {
        // Extract the sentence to fix
        let sentenceToFix = message;

        // Remove common prefixes
        sentenceToFix = sentenceToFix
            .replace(/^(fix|correct|grammar|check|rewrite|improve)[\s:]*(.+)$/i, '$2')
            .replace(/^(this sentence|the sentence|sentence)[\s:]*(.+)$/i, '$2')
            .trim();

        // Remove quotes if present
        sentenceToFix = sentenceToFix.replace(/^["'](.+)["']$/, '$1').trim();

        // Grammar correction rules
        const corrections = this.analyzeGrammar(sentenceToFix);

        if (corrections.length === 0) {
            return `✅ **Your sentence looks good!**\n\n"${sentenceToFix}"\n\nNo major grammar issues detected. Keep up the great work!`;
        }

        let response = `📝 **Grammar Analysis**\n\n`;
        response += `**Original:** "${sentenceToFix}"\n\n`;
        response += `**Corrected:** "${corrections[0].corrected}"\n\n`;
        response += `**Changes Made:**\n`;

        corrections.forEach((correction, index) => {
            response += `${index + 1}. **${correction.issue}** - ${correction.explanation}\n`;
        });

        return response;
    }

    analyzeGrammar(sentence) {
        const corrections = [];

        // Check for dangling modifiers
        const danglingModifierPatterns = [
            {
                pattern: /^(looking|walking|running|sitting|standing|reading|writing|thinking|listening|watching|driving|flying|swimming|jumping|climbing|falling|sleeping|eating|drinking|cooking|cleaning|playing|studying|working|talking|laughing|crying|singing|dancing|drawing|painting|building|breaking|fixing|opening|closing|entering|leaving|arriving|departing|beginning|ending|starting|stopping|continuing|finishing|starting|trying|helping|asking|telling|showing|giving|taking|bringing|sending|receiving|finding|losing|keeping|holding|catching|throwing|pushing|pulling|hitting|kicking|touching|feeling|smelling|tasting|hearing|seeing|knowing|believing|thinking|wanting|needing|liking|loving|hating|fearing|hoping|wishing|dreaming|remembering|forgetting|learning|teaching|understanding|explaining|describing|defining|naming|calling|choosing|deciding|planning|preparing|arranging|organizing|managing|controlling|leading|following|joining|leaving|meeting|greeting|welcoming|thanking|apologizing|forgiving|blaming|praising|criticizing|judging|evaluating|comparing|contrasting|analyzing|examining|investigating|exploring|discovering|inventing|creating|designing|developing|improving|changing|transforming|converting|translating|interpreting|expressing|communicating|sharing|discussing|debating|arguing|agreeing|disagreeing|accepting|rejecting|approving|disapproving|allowing|preventing|permitting|forbidding|enabling|disabling|encouraging|discouraging|supporting|opposing|helping|hindering|assisting|resisting|cooperating|competing|collaborating|conflicting|uniting|dividing|combining|separating|joining|splitting|merging|diverging|converging|expanding|contracting|growing|shrinking|increasing|decreasing|rising|falling|lifting|lowering|raising|dropping|throwing|catching|bouncing|rolling|sliding|spinning|turning|twisting|bending|stretching|reaching|grasping|releasing|gripping|loosening|tightening|fastening|unfastening|attaching|detaching|connecting|disconnecting|linking|unlinking|binding|unbinding|tying|untying|knotting|unknotting|wrapping|unwrapping|covering|uncovering|hiding|revealing|showing|concealing|displaying|presenting|offering|accepting|refusing|declining|agreeing|disagreeing|consenting|dissenting|permitting|prohibiting|allowing|disallowing|enabling|disabling|facilitating|hindering|promoting|demoting|advancing|retreating|progressing|regressing|improving|deteriorating|enhancing|diminishing|strengthening|weakening|hardening|softening|sharpening|dulling|brightening|darkening|lightening|heavying|warming|cooling|heating|chilling|freezing|thawing|melting|solidifying|liquefying|vaporizing|condensing|evaporating|precipitating|accumulating|dispersing|concentrating|diluting|mixing|separating|blending|filtering|straining|sifting|sorting|arranging|organizing|categorizing|classifying|grouping|clustering|distributing|allocating|assigning|delegating|appointing|electing|selecting|choosing|picking|designating|nominating|recommending|suggesting|proposing|submitting|presenting|offering|tendering|bidding|quoting|pricing|charging|costing|valuing|assessing|estimating|calculating|computing|measuring|weighing|counting|numbering|enumerating|listing|cataloging|indexing|filing|storing|retrieving|accessing|obtaining|acquiring|procuring|purchasing|buying|selling|trading|exchanging|bartering|borrowing|lending|renting|leasing|hiring|employing|recruiting|enrolling|registering|signing|subscribing|unsubscribing|joining|leaving|entering|exiting|arriving|departing|coming|going|returning|staying|remaining|waiting|pausing|stopping|halting|ceasing|terminating|concluding|finishing|completing|accomplishing|achieving|attaining|reaching|obtaining|gaining|earning|winning|losing|finding|searching|seeking|hunting|pursuing|chasing|fleeing|escaping|evading|avoiding|dodging|sidestepping|circumventing|bypassing|overcoming|surmounting|conquering|defeating|vanquishing|triumphing|succeeding|failing|stumbling|tripping|falling|crashing|colliding|hitting|striking|smashing|shattering|breaking|cracking|splitting|tearing|ripping|shredding|cutting|slicing|dicing|chopping|mincing|grinding|crushing|pressing|squeezing|wringing|twisting|bending|folding|unfolding|rolling|unrolling|coiling|uncoiling|winding|unwinding|looping|unlooping|knotting|unknotting|tangling|untangling|matting|unmatting|combing|brushing|smoothing|roughing|polishing|buffing|waxing|oiling|lubricating|greasing|coating|painting|staining|dyeing|bleaching|whitening|darkening|fading|brightening|dulling|sharpening|blunting|honing|stropping|grinding|filing|rasping|sanding|scraping|scrubbing|scouring|cleaning|washing|rinsing|drying|wringing|squeezing|pressing|ironing|steaming|heating|cooling|warming|chilling|freezing|thawing|melting|boiling|simmering|stewing|roasting|baking|frying|grilling|broiling|toasting|charring|smoking|curing|pickling|fermenting|aging|ripening|maturing|seasoning|flavoring|sweetening|souring|salting|peppering|spicing|seasoning|garnishing|plating|serving|eating|drinking|tasting|savoring|chewing|swallowing|digesting|absorbing|assimilating|processing|filtering|straining|sifting|sorting|arranging|organizing|categorizing|classifying|grouping|clustering|distributing|allocating|assigning|delegating|appointing|electing|selecting|choosing|picking|designating|nominating|recommending|suggesting|proposing|submitting|presenting|offering|tendering|bidding|quoting|pricing|charging|costing|valuing|assessing|estimating|calculating|computing|measuring|weighing|counting|numbering|enumerating|listing|cataloging|indexing|filing|storing|retrieving|accessing|obtaining|acquiring|procuring|purchasing|buying|selling|trading|exchanging|bartering|borrowing|lending|renting|leasing|hiring|employing|recruiting|enrolling|registering|signing|subscribing|unsubscribing|joining|leaving|entering|exiting|arriving|departing|coming|going|returning|staying|remaining|waiting|pausing|stopping|halting|ceasing|terminating|concluding|finishing|completing|accomplishing|achieving|attaining|reaching|obtaining|gaining|earning|winning|losing|finding|searching|seeking|hunting|pursuing|chasing|fleeing|escaping|evading|avoiding|dodging|sidestepping|circumventing|bypassing|overcoming|surmounting|conquering|defeating|vanquishing|triumphing|succeeding|failing|stumbling|tripping|falling|crashing|colliding|hitting|striking|smashing|shattering|breaking|cracking|splitting|tearing|ripping|shredding|cutting|slicing|dicing|chopping|mincing|grinding|crushing|pressing|squeezing|wringing|twisting|bending|folding|unfolding|rolling|unrolling|coiling|uncoiling|winding|unwinding|looping|unlooping|knotting|unknotting|tangling|untangling|matting|unmatting|combing|brushing|smoothing|roughing|polishing|buffing|waxing|oiling|lubricating|greasing|coating|painting|staining|dyeing|bleaching|whitening|darkening|fading|brightening|dulling|sharpening|blunting|honing|stropping|grinding|filing|rasping|sanding|scraping|scrubbing|scouring|cleaning|washing|rinsing|drying|wringing|squeezing|pressing|ironing|steaming|heating|cooling|warming|chilling|freezing|thawing|melting|boiling|simmering|stewing|roasting|baking|frying|grilling|broiling|toasting|charring|smoking|curing|pickling|fermenting|aging|ripening|maturing|seasoning|flavoring|sweetening|souring|salting|peppering|spicing|seasoning|garnishing|plating|serving|eating|drinking|tasting|savoring|chewing|swallowing|digesting|absorbing|assimilating|processing|filtering|straining|sifting|sorting|arranging|organizing|categorizing|classifying|grouping|clustering|distributing|allocating|assigning|delegating|appointing|electing|selecting|choosing|picking|designating|nominating|recommending|suggesting|proposing|submitting|presenting|offering|tendering|bidding|quoting|pricing|charging|costing|valuing|assessing|estimating|calculating|computing|measuring|weighing|counting|numbering|enumerating|listing|cataloging|indexing|filing|storing|retrieving|accessing|obtaining|acquiring|procuring|purchasing|buying|selling|trading|exchanging|bartering|borrowing|lending|renting|leasing|hiring|employing|recruiting|enrolling|registering|signing|subscribing|unsubscribing|joining|leaving|entering|exiting|arriving|departing|coming|going|returning|staying|remaining|waiting|pausing|stopping|halting|ceasing|terminating|concluding|finishing|completing|accomplishing|achieving|attaining|reaching|obtaining|gaining|earning|winning|losing|finding|searching|seeking|hunting|pursuing|chasing|fleeing|escaping|evading|avoiding|dodging|sidestepping|circumventing|bypassing|overcoming|surmounting|conquering|defeating|vanquishing|triumphing|succeeding|failing)\s+(.+?)(?:,|$)/i,
                fix: (match) => {
                    const participle = match[1].toLowerCase();
                    const rest = match[2];
                    return `When ${participle}, ${rest}`;
                },
                issue: 'Dangling Modifier',
                explanation: 'The introductory phrase doesn\'t clearly connect to the subject. Restructured to clarify the relationship.'
            }
        ];

        // Check for missing periods
        if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
            corrections.push({
                issue: 'Missing Punctuation',
                explanation: 'Added period at the end of the sentence.',
                corrected: sentence + '.'
            });
        }

        // Check for dangling modifiers
        for (const rule of danglingModifierPatterns) {
            const match = sentence.match(rule.pattern);
            if (match) {
                const corrected = rule.fix(match);
                corrections.push({
                    issue: rule.issue,
                    explanation: rule.explanation,
                    corrected: corrected
                });
                return corrections;
            }
        }

        // Check for subject-verb agreement issues
        const svAgreementCheck = this.checkSubjectVerbAgreement(sentence);
        if (svAgreementCheck) {
            corrections.push(svAgreementCheck);
        }

        // Check for common tense issues
        const tenseCheck = this.checkTenseConsistency(sentence);
        if (tenseCheck) {
            corrections.push(tenseCheck);
        }

        // If no specific issues found, return the sentence as-is
        if (corrections.length === 0) {
            corrections.push({
                issue: 'No Issues',
                explanation: 'Sentence is grammatically correct.',
                corrected: sentence
            });
        }

        return corrections;
    }

    checkSubjectVerbAgreement(sentence) {
        // Simple check for common subject-verb agreement issues
        const patterns = [
            { pattern: /\b(the|a|an)\s+(\w+)\s+(are|were)\b/i, fix: (m) => m[0].replace(/are|were/, 'is'), issue: 'Subject-Verb Agreement' },
            { pattern: /\b(they|we|you|I)\s+(is|was)\b/i, fix: (m) => m[0].replace(/is|was/, 'are'), issue: 'Subject-Verb Agreement' }
        ];

        for (const rule of patterns) {
            const match = sentence.match(rule.pattern);
            if (match) {
                return {
                    issue: rule.issue,
                    explanation: 'Subject and verb must agree in number.',
                    corrected: sentence.replace(rule.pattern, rule.fix(match))
                };
            }
        }
        return null;
    }

    checkTenseConsistency(sentence) {
        // Check for mixed tenses
        const pastTenseWords = /\b(was|were|had|did|went|came|saw|said|made|got|took|knew|thought|found|left|felt|told|became|began|seemed|appeared|looked|sounded|tasted|smelled|felt)\b/gi;
        const presentTenseWords = /\b(is|are|have|has|do|does|go|come|see|say|make|get|take|know|think|find|leave|feel|tell|become|begin|seem|appear|look|sound|taste|smell|feel)\b/gi;

        const pastMatches = sentence.match(pastTenseWords) || [];
        const presentMatches = sentence.match(presentTenseWords) || [];

        if (pastMatches.length > 0 && presentMatches.length > 0) {
            return {
                issue: 'Tense Inconsistency',
                explanation: 'Sentence mixes past and present tense. Maintain consistent tense throughout.',
                corrected: sentence
            };
        }
        return null;
    }

    isMathQuestion(message) {
        // Check if message contains math operators, numbers, or math keywords
        const mathPattern = /[\d+\-*/^()=]|what is \d+|calculate|solve|equals|plus|minus|times|divided|multiply|add|subtract/i;
        const hasNumbers = /\d/.test(message);
        const hasMathWords = /calculate|solve|equals|plus|minus|times|divided|multiply|add|subtract|what is \d/i.test(message);

        return (hasNumbers && hasMathWords) || /[\d+\-*/^()]+/.test(message);
    }

    solveMath(message) {
        try {
            // Handle word problems and extract numbers
            let expression = message;

            // Convert words to operators
            expression = expression.replace(/\bplus\b/gi, '+');
            expression = expression.replace(/\bminus\b/gi, '-');
            expression = expression.replace(/\btimes\b|\bmultiplied by\b/gi, '*');
            expression = expression.replace(/\bdivided by\b/gi, '/');
            expression = expression.replace(/\bto the power of\b/gi, '**');

            // Extract math expression (numbers and operators)
            const mathMatch = expression.match(/[\d+\-*/^().\s]+/);
            if (mathMatch) {
                let expr = mathMatch[0].trim();
                // Replace ^ with ** for exponentiation
                expr = expr.replace(/\^/g, '**');

                // Safely evaluate the expression
                const result = Function('"use strict"; return (' + expr + ')')();

                // Format the result nicely
                const formattedResult = Number.isInteger(result) ? result : result.toFixed(2);

                return `**Answer: ${formattedResult}**\n\n` +
                    `📊 Calculation: ${expr.replace(/\*\*/g, '^')} = ${formattedResult}\n\n` +
                    `💡 *Tip: You can ask me any math problem!*`;
            }
        } catch (e) {
            console.log('Math evaluation error:', e);
        }

        // If we can't solve it, search for it
        return this.searchGoogle(message);
    }

    async searchGoogle(query) {
        // Clean up the query
        const cleanQuery = query.trim();

        try {
            // Try Wikipedia API first (has CORS support)
            const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
            const response = await fetch(wikiUrl);

            if (response.ok) {
                const data = await response.json();
                if (data.extract && data.type !== 'disambiguation') {
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;
                    return `**${data.title}**\n\n` +
                        `${data.extract}\n\n` +
                        `📖 [Read full article on Wikipedia](${data.content_urls.desktop.page})\n` +
                        `🔍 [Search on Google](${searchUrl})`;
                }
            }
        } catch (e) {
            console.log('Wikipedia search failed:', e);
        }

        // For single words or "what is X" queries, try dictionary
        const isSingleWord = cleanQuery.split(' ').length === 1;
        const isDefinitionQuery = /^(what is|define|meaning of)\s+(\w+)$/i.test(cleanQuery);

        if (isSingleWord || isDefinitionQuery) {
            try {
                // Extract the word to look up
                const wordToDefine = isDefinitionQuery
                    ? cleanQuery.match(/^(?:what is|define|meaning of)\s+(\w+)$/i)[1]
                    : cleanQuery;

                const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wordToDefine)}`;
                const response = await fetch(dictUrl);

                if (response.ok) {
                    const data = await response.json();
                    if (data && data[0] && data[0].meanings && data[0].meanings[0]) {
                        const word = data[0].word;
                        const meaning = data[0].meanings[0];
                        const definition = meaning.definitions[0].definition;
                        const partOfSpeech = meaning.partOfSpeech;
                        const example = meaning.definitions[0].example;
                        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;

                        let response = `**${word}** *(${partOfSpeech})*\n\n${definition}`;

                        if (example) {
                            response += `\n\n*Example: "${example}"*`;
                        }

                        response += `\n\n🔍 [Search on Google for more](${searchUrl})`;

                        return response;
                    }
                }
            } catch (e) {
                console.log('Dictionary search failed:', e);
            }
        }

        // Final fallback: Provide comprehensive search links
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const wikiSearchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
        const khanUrl = `https://www.khanacademy.org/search?search_again=1&page_search_query=${encodeURIComponent(query)}`;

        return `Let me help you find information about **"${query}"**!\n\n` +
            `🔍 **[Search on Google](${searchUrl})**\n` +
            `📖 [Search Wikipedia](${wikiSearchUrl})\n` +
            `🎓 [Khan Academy](${khanUrl})\n` +
            `📚 [Quizlet](https://quizlet.com/search?query=${encodeURIComponent(query)})\n\n` +
            `💡 *Click any link above to learn more!*`;
    }

    // Grade calculator
    showGradeCalculator() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>📊 Weighted Grade Calculator</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                
                <div class="calculator-category">
                    <div class="category-header">
                        <h4>📝 Homework</h4>
                        <div class="weight-input">
                            <label>Weight:</label>
                            <input type="number" value="20" min="0" max="100">
                            <span>%</span>
                        </div>
                    </div>
                    <div class="grade-inputs">
                        <input type="number" class="grade-input" placeholder="Grade %" min="0" max="100">
                    </div>
                </div>

                <div class="calculator-category">
                    <div class="category-header">
                        <h4>📋 Tests</h4>
                        <div class="weight-input">
                            <label>Weight:</label>
                            <input type="number" value="50" min="0" max="100">
                            <span>%</span>
                        </div>
                    </div>
                    <div class="grade-inputs">
                        <input type="number" class="grade-input" placeholder="Grade %" min="0" max="100">
                    </div>
                </div>

                <div class="calculator-category">
                    <div class="category-header">
                        <h4>📚 Projects</h4>
                        <div class="weight-input">
                            <label>Weight:</label>
                            <input type="number" value="30" min="0" max="100">
                            <span>%</span>
                        </div>
                    </div>
                    <div class="grade-inputs">
                        <input type="number" class="grade-input" placeholder="Grade %" min="0" max="100">
                    </div>
                </div>

                <div class="calculator-results">
                    <h3>Final Weighted Grade</h3>
                    <div class="final-grade" id="finalGrade">0.0%</div>
                    <p>Enter grades above to calculate</p>
                </div>

                <button class="btn-primary" onclick="app.calculateGrade()">Calculate Grade</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    calculateGrade() {
        const categories = document.querySelectorAll('.calculator-category');
        let totalWeight = 0;
        let weightedSum = 0;

        categories.forEach(category => {
            const weight = parseFloat(category.querySelector('.weight-input input').value) || 0;
            const grade = parseFloat(category.querySelector('.grade-input').value) || 0;

            totalWeight += weight;
            weightedSum += (grade * weight / 100);
        });

        const finalGrade = totalWeight > 0 ? weightedSum : 0;
        document.getElementById('finalGrade').textContent = finalGrade.toFixed(1) + '%';
    }

    // Helper methods
    getGradeClass(percentage) {
        if (percentage >= 90) return 'excellent';
        if (percentage >= 80) return 'good';
        if (percentage >= 70) return 'average';
        return 'needs-improvement';
    }

    getFileIcon(type) {
        if (type.includes('pdf')) return '📄';
        if (type.includes('doc')) return '📝';
        if (type.includes('image')) return '🖼️';
        if (type.includes('yaml') || type.includes('yml')) return '📋';
        return '📁';
    }

    deleteGrade(gradeId) {
        if (confirm('Are you sure you want to delete this grade? This action cannot be undone.')) {
            const grades = JSON.parse(localStorage.getItem('sms_grades') || '[]');
            const updatedGrades = grades.filter(g => g.id !== gradeId);
            localStorage.setItem('sms_grades', JSON.stringify(updatedGrades));
            this.showMessage('Grade deleted successfully!', 'success');
            this.navigateTo('grades');
        }
    }

    deleteAllGrades() {
        if (confirm('Are you sure you want to delete ALL grades? This action cannot be undone.')) {
            if (confirm('This will permanently remove all your grades. Are you absolutely sure?')) {
                localStorage.setItem('sms_grades', JSON.stringify([]));
                this.showMessage('All grades deleted successfully!', 'success');
                this.navigateTo('grades');
            }
        }
    }

    resetGrades() {
        if (confirm('Reset all grades to 100%? This will clear all grading data.')) {
            const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');

            // Create new grades with 100% for all assignments
            const newGrades = assignments.map(assignment => ({
                id: 'grade_' + Math.random().toString(36).substr(2, 9),
                studentId: this.currentUser.id,
                assignmentId: assignment.id,
                pointsEarned: 100,
                pointsPossible: 100,
                percentage: 100,
                letterGrade: 'A',
                gradedAt: new Date().toISOString()
            }));

            localStorage.setItem('sms_grades', JSON.stringify(newGrades));
            this.showMessage('All grades reset to 100%!', 'success');
            this.navigateTo('grades');
        }
    }

    getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        return ext;
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    getWebsitesContent() {
        const defaultWebsites = [
            {
                id: 'scratch',
                name: 'Scratch',
                url: 'https://scratch.mit.edu',
                icon: '🎨',
                description: 'Create interactive stories, games, and animations'
            },
            {
                id: 'replit',
                name: 'Replit',
                url: 'https://replit.com',
                icon: '💻',
                description: 'Online IDE for coding in any language'
            },
            {
                id: 'organizer',
                name: 'Student Organizer (v1)',
                url: 'https://ashariff1413.github.io/student-organizer/',
                icon: '📋',
                description: 'Original version of this product'
            }
        ];

        const teacherWebsites = JSON.parse(localStorage.getItem('pinned_websites') || '[]');
        const allWebsites = [...defaultWebsites, ...teacherWebsites];
        const isTeacher = this.currentUser && this.currentUser.role === 'teacher';

        return `
            <div class="view-header">
                <h2>🌐 Important Websites</h2>
                <p>Quick access to helpful learning resources</p>
            </div>

            <div class="websites-grid">
                ${allWebsites.map(website => `
                    <a href="${website.url}" target="_blank" class="website-card">
                        <div class="website-icon">${website.icon}</div>
                        <h3>${website.name}</h3>
                        <p>${website.description}</p>
                        <span class="visit-link">Visit →</span>
                    </a>
                `).join('')}
            </div>

            ${isTeacher ? `
                <div class="card" style="margin-top: 40px;">
                    <h3>📌 Manage Pinned Websites</h3>
                    <p style="color: #666; margin-bottom: 20px;">Add or remove websites for your students</p>
                    <button class="btn-primary" onclick="app.navigateTo('settings')" style="width: auto; padding: 12px 24px;">
                        ⚙️ Go to Settings
                    </button>
                </div>
            ` : ''}
        `;
    }

    getSettingsContent() {
        const currentTheme = localStorage.getItem('app_theme') || 'default';
        const customColors = JSON.parse(localStorage.getItem('custom_colors') || '{}');

        return `
            <div class="view-header">
                <h2>⚙️ Settings</h2>
                <p>Customize your experience</p>
            </div>

            <div class="card">
                <h3>🎨 Quick Themes</h3>
                <p style="color: #666; margin-bottom: 20px;">Choose a preset theme or customize below</p>
                
                <div class="theme-grid">
                    <div class="theme-card ${currentTheme === 'default' ? 'active' : ''}" onclick="app.setTheme('default')">
                        <div class="theme-preview default-preview">
                            <div class="preview-bar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <h4>Default</h4>
                        <p>Clean & Professional</p>
                    </div>

                    <div class="theme-card ${currentTheme === 'coffee' ? 'active' : ''}" onclick="app.setTheme('coffee')">
                        <div class="theme-preview coffee-preview">
                            <div class="preview-bar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <h4>☕ Coffee & Focus</h4>
                        <p>Warm & Cozy</p>
                    </div>

                    <div class="theme-card ${currentTheme === 'student' ? 'active' : ''}" onclick="app.setTheme('student')">
                        <div class="theme-preview student-preview">
                            <div class="preview-bar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <h4>✂️ Creativity & Motion</h4>
                        <p>Playful & Energetic</p>
                    </div>

                    <div class="theme-card ${currentTheme === 'custom' ? 'active' : ''}" onclick="app.setTheme('custom')">
                        <div class="theme-preview custom-preview">
                            <div class="preview-bar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <h4>🎨 Custom</h4>
                        <p>Your Colors</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>🎨 Custom Color Palette</h3>
                <p style="color: #666; margin-bottom: 20px;">Pick your own colors for each element</p>
                
                <div class="color-customizer">
                    <div class="color-row">
                        <label>Background</label>
                        <input type="color" value="${customColors.background || '#f5f5f7'}" onchange="app.updateCustomColor('background', this.value)">
                        <input type="text" value="${customColors.background || '#f5f5f7'}" onchange="app.updateCustomColor('background', this.value)" placeholder="#f5f5f7">
                    </div>
                    
                    <div class="color-row">
                        <label>Sidebar Background</label>
                        <input type="color" value="${customColors.sidebarBg || '#ffffff'}" onchange="app.updateCustomColor('sidebarBg', this.value)">
                        <input type="text" value="${customColors.sidebarBg || '#ffffff'}" onchange="app.updateCustomColor('sidebarBg', this.value)" placeholder="#ffffff">
                    </div>
                    
                    <div class="color-row">
                        <label>Primary Accent</label>
                        <input type="color" value="${customColors.primary || '#007aff'}" onchange="app.updateCustomColor('primary', this.value)">
                        <input type="text" value="${customColors.primary || '#007aff'}" onchange="app.updateCustomColor('primary', this.value)" placeholder="#007aff">
                    </div>
                    
                    <div class="color-row">
                        <label>Secondary Accent</label>
                        <input type="color" value="${customColors.secondary || '#34c759'}" onchange="app.updateCustomColor('secondary', this.value)">
                        <input type="text" value="${customColors.secondary || '#34c759'}" onchange="app.updateCustomColor('secondary', this.value)" placeholder="#34c759">
                    </div>
                    
                    <div class="color-row">
                        <label>Card Background</label>
                        <input type="color" value="${customColors.cardBg || '#ffffff'}" onchange="app.updateCustomColor('cardBg', this.value)">
                        <input type="text" value="${customColors.cardBg || '#ffffff'}" onchange="app.updateCustomColor('cardBg', this.value)" placeholder="#ffffff">
                    </div>
                    
                    <div class="color-row">
                        <label>Text Primary</label>
                        <input type="color" value="${customColors.textPrimary || '#1d1d1f'}" onchange="app.updateCustomColor('textPrimary', this.value)">
                        <input type="text" value="${customColors.textPrimary || '#1d1d1f'}" onchange="app.updateCustomColor('textPrimary', this.value)" placeholder="#1d1d1f">
                    </div>
                    
                    <div class="color-row">
                        <label>Text Muted</label>
                        <input type="color" value="${customColors.textMuted || '#666666'}" onchange="app.updateCustomColor('textMuted', this.value)">
                        <input type="text" value="${customColors.textMuted || '#666666'}" onchange="app.updateCustomColor('textMuted', this.value)" placeholder="#666666">
                    </div>
                    
                    <div class="color-row">
                        <label>Button Primary</label>
                        <input type="color" value="${customColors.buttonPrimary || '#007aff'}" onchange="app.updateCustomColor('buttonPrimary', this.value)">
                        <input type="text" value="${customColors.buttonPrimary || '#007aff'}" onchange="app.updateCustomColor('buttonPrimary', this.value)" placeholder="#007aff">
                    </div>
                    
                    <div class="color-row">
                        <label>Button Hover</label>
                        <input type="color" value="${customColors.buttonHover || '#0056cc'}" onchange="app.updateCustomColor('buttonHover', this.value)">
                        <input type="text" value="${customColors.buttonHover || '#0056cc'}" onchange="app.updateCustomColor('buttonHover', this.value)" placeholder="#0056cc">
                    </div>
                    
                    <div class="color-row">
                        <label>Border Color</label>
                        <input type="color" value="${customColors.border || '#e5e5ea'}" onchange="app.updateCustomColor('border', this.value)">
                        <input type="text" value="${customColors.border || '#e5e5ea'}" onchange="app.updateCustomColor('border', this.value)" placeholder="#e5e5ea">
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 12px;">
                    <button class="btn-primary" onclick="app.applyCustomColors()">Apply Custom Colors</button>
                    <button class="btn-secondary" onclick="app.resetCustomColors()">Reset to Default</button>
                </div>
            </div>

            <div class="card">
                <h3>🖼️ Background Image</h3>
                <p style="color: #666; margin-bottom: 20px;">Add a subtle background image</p>
                
                <div class="background-options">
                    <button class="bg-option" onclick="app.setBackground('none')">None</button>
                    <button class="bg-option" onclick="app.setBackground('coffee')">☕ Coffee</button>
                    <button class="bg-option" onclick="app.setBackground('desk')">📚 Desk</button>
                    <button class="bg-option" onclick="app.setBackground('notebook')">📓 Notebook</button>
                    <button class="bg-option" onclick="app.setBackground('supplies')">✂️ Supplies</button>
                    <button class="bg-option" onclick="app.setBackground('custom')">🖼️ Custom</button>
                </div>
                
                <div style="margin-top: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Upload Your Own Background:</label>
                    <input type="file" id="bgUpload" accept="image/*" onchange="app.uploadBackground(event)" style="display: block; margin-bottom: 8px;">
                    <p style="font-size: 13px; color: #666;">Recommended: Light, subtle images work best</p>
                </div>
                
                <div style="margin-top: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Background Opacity:</label>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 14px; color: #666;">More Visible</span>
                        <input type="range" id="bgOpacity" min="0" max="100" value="${localStorage.getItem('bg_opacity') || '85'}" 
                               oninput="app.updateOpacity(this.value)" 
                               style="flex: 1; cursor: pointer;">
                        <span style="font-size: 14px; color: #666;">Less Visible</span>
                        <span id="opacityValue" style="font-weight: 600; min-width: 40px;">${localStorage.getItem('bg_opacity') || '85'}%</span>
                    </div>
                    <p style="font-size: 13px; color: #666; margin-top: 8px;">Adjust how much the background shows through</p>
                </div>
            </div>

            ${this.currentUser.role === 'admin' ? `
                <div class="card">
                    <h3>🤖 Conrad AI - Gemini API</h3>
                    <p style="color: #666; margin-bottom: 20px;">Manage the Gemini API key for Conrad AI</p>
                    <button class="btn-secondary" onclick="app.showChangeGeminiKeyModal()" style="width: auto; padding: 12px 24px;">
                        🔑 Change Conrad Gemini Key
                    </button>
                </div>
            ` : ''}

            <div class="card">
                <h3>🌙 Dark Mode</h3>
                <p style="color: #666; margin-bottom: 20px;">Eye-friendly night theme</p>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="btn-primary" onclick="app.toggleDarkMode()" style="width: auto; padding: 12px 24px;">
                        ${document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                    <span style="color: #666; font-size: 14px;">
                        ${document.body.classList.contains('dark-mode') ? 'Dark mode is ON' : 'Dark mode is OFF'}
                    </span>
                </div>
            </div>

            <div class="card">
                <h3>� Google <Calendar Sync</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">Export your assignments and tests to Google Calendar</p>
                <button class="btn-primary" onclick="app.exportToGoogleCalendar()" style="width: auto; padding: 12px 24px;">
                    📅 Export to Google Calendar
                </button>
                <p style="color: var(--text-secondary); font-size: 12px; margin-top: 12px;">
                    This will generate an .ics file that you can import into Google Calendar
                </p>
            </div>

            <div class="card">
                <h3>📊 Weekly Reports</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">Generate and download your weekly study report</p>
                <button class="btn-primary" onclick="app.generateWeeklyReport()" style="width: auto; padding: 12px 24px;">
                    📊 Generate Report
                </button>
                <p style="color: var(--text-secondary); font-size: 12px; margin-top: 12px;">
                    Download a detailed report of your study activity, grades, and progress
                </p>
            </div>

            ${this.currentUser.role === 'teacher' ? `
                <div class="card">
                    <h3>📌 Pin Websites for Students</h3>
                    <p style="color: #666; margin-bottom: 20px;">Add helpful websites that students can quickly access</p>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Website Name:</label>
                        <input type="text" id="websiteName" placeholder="e.g., Khan Academy" style="width: 100%; padding: 10px; border: 1px solid #e5e5ea; border-radius: 8px; margin-bottom: 12px;">
                        
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Website URL:</label>
                        <input type="url" id="websiteUrl" placeholder="https://example.com" style="width: 100%; padding: 10px; border: 1px solid #e5e5ea; border-radius: 8px; margin-bottom: 12px;">
                        
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Icon/Emoji:</label>
                        <input type="text" id="websiteIcon" placeholder="📚" maxlength="2" style="width: 100%; padding: 10px; border: 1px solid #e5e5ea; border-radius: 8px; margin-bottom: 12px;">
                        
                        <button class="btn-primary" onclick="app.addPinnedWebsite()" style="width: 100%; padding: 12px;">
                            ➕ Add Website
                        </button>
                    </div>
                    
                    <div style="border-top: 1px solid #e5e5ea; padding-top: 20px;">
                        <h4 style="margin-bottom: 12px;">Pinned Websites:</h4>
                        <div id="pinnedWebsitesList" style="display: flex; flex-direction: column; gap: 8px;">
                            ${this.getPinnedWebsitesList()}
                        </div>
                    </div>
                </div>
            ` : ''}

            <div class="card">
                <h3>👤 Account</h3>
                <p><strong>Name:</strong> ${this.currentUser.name}</p>
                <p><strong>Email:</strong> ${this.currentUser.email}</p>
                <p><strong>Role:</strong> ${this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1)}</p>
            </div>
        `;
    }

    updateCustomColor(key, value) {
        const customColors = JSON.parse(localStorage.getItem('custom_colors') || '{}');
        customColors[key] = value;
        localStorage.setItem('custom_colors', JSON.stringify(customColors));
    }

    applyCustomColors() {
        const customColors = JSON.parse(localStorage.getItem('custom_colors') || '{}');

        // Create custom CSS
        let customCSS = `
            .theme-custom {
                background: ${customColors.background || '#f5f5f7'} !important;
            }
            .theme-custom .sidebar {
                background: ${customColors.sidebarBg || '#ffffff'} !important;
                border-right-color: ${customColors.border || '#e5e5ea'} !important;
            }
            .theme-custom .nav-btn.active {
                background: ${customColors.primary || '#007aff'} !important;
                color: white !important;
            }
            .theme-custom .card {
                background: ${customColors.cardBg || '#ffffff'} !important;
                border-color: ${customColors.border || '#e5e5ea'} !important;
            }
            .theme-custom .stat-card {
                background: ${customColors.secondary || '#34c759'} !important;
            }
            .theme-custom .btn-primary {
                background: ${customColors.buttonPrimary || '#007aff'} !important;
            }
            .theme-custom .btn-primary:hover {
                background: ${customColors.buttonHover || '#0056cc'} !important;
            }
            .theme-custom .view-header h2,
            .theme-custom .sidebar-header h2 {
                color: ${customColors.textPrimary || '#1d1d1f'} !important;
            }
            .theme-custom .view-header p,
            .theme-custom p {
                color: ${customColors.textMuted || '#666666'} !important;
            }
        `;

        // Remove old custom style
        const oldStyle = document.getElementById('custom-theme-style');
        if (oldStyle) oldStyle.remove();

        // Add new custom style
        const style = document.createElement('style');
        style.id = 'custom-theme-style';
        style.textContent = customCSS;
        document.head.appendChild(style);

        this.setTheme('custom');
        this.showMessage('Custom colors applied!', 'success');
    }

    resetCustomColors() {
        localStorage.removeItem('custom_colors');
        const oldStyle = document.getElementById('custom-theme-style');
        if (oldStyle) oldStyle.remove();
        this.showMessage('Colors reset to default!', 'success');
        this.navigateTo('settings');
    }

    setBackground(bgType) {
        localStorage.setItem('app_background', bgType);
        document.body.setAttribute('data-background', bgType);

        const opacity = (localStorage.getItem('bg_opacity') || 85) / 100;

        // Apply custom background if it exists
        if (bgType === 'custom') {
            const customBg = localStorage.getItem('custom_background_image');
            if (customBg) {
                document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, ${opacity}), rgba(255, 255, 255, ${opacity})), url(${customBg})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
            }
        } else {
            document.body.style.backgroundImage = '';
        }

        this.showMessage(`Background set to ${bgType}!`, 'success');
    }

    uploadBackground(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showMessage('Please upload an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            localStorage.setItem('custom_background_image', imageData);
            this.setBackground('custom');
            this.showMessage('Custom background uploaded!', 'success');
        };
        reader.readAsDataURL(file);
    }

    updateOpacity(value) {
        localStorage.setItem('bg_opacity', value);
        document.getElementById('opacityValue').textContent = value + '%';

        // Apply opacity to current background
        const currentBg = localStorage.getItem('app_background');
        const opacity = value / 100;

        if (currentBg === 'custom') {
            const customBg = localStorage.getItem('custom_background_image');
            if (customBg) {
                document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, ${opacity}), rgba(255, 255, 255, ${opacity})), url(${customBg})`;
            }
        } else if (currentBg && currentBg !== 'none') {
            // Update opacity for preset backgrounds
            this.setBackground(currentBg);
        }
    }

    setTheme(theme) {
        localStorage.setItem('app_theme', theme);
        document.body.className = theme === 'default' ? '' : `theme-${theme}`;
        this.showMessage(`Theme changed to ${theme}!`, 'success');
        this.navigateTo('settings');
    }

    toggleDarkMode() {
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark_mode', 'false');
            this.showMessage('Light mode enabled', 'success');
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark_mode', 'true');
            this.unlockAchievement('dark_mode');
            this.showMessage('Dark mode enabled', 'success');
        }

        this.navigateTo('settings');
    }

    // Pinned Websites Management (Teacher Feature)
    addPinnedWebsite() {
        const name = document.getElementById('websiteName').value.trim();
        const url = document.getElementById('websiteUrl').value.trim();
        const icon = document.getElementById('websiteIcon').value.trim() || '🔗';

        if (!name || !url) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Validate URL
        try {
            new URL(url);
        } catch (error) {
            this.showMessage('Please enter a valid URL', 'error');
            return;
        }

        const websites = JSON.parse(localStorage.getItem('pinned_websites') || '[]');
        const newWebsite = {
            id: 'website_' + Math.random().toString(36).substr(2, 9),
            name,
            url,
            icon,
            addedBy: this.currentUser.id,
            addedAt: new Date().toISOString()
        };

        websites.push(newWebsite);
        localStorage.setItem('pinned_websites', JSON.stringify(websites));

        // Clear inputs
        document.getElementById('websiteName').value = '';
        document.getElementById('websiteUrl').value = '';
        document.getElementById('websiteIcon').value = '';

        this.showMessage(`Website "${name}" pinned successfully!`, 'success');
        this.navigateTo('settings');
    }

    removePinnedWebsite(websiteId) {
        if (confirm('Remove this pinned website?')) {
            let websites = JSON.parse(localStorage.getItem('pinned_websites') || '[]');
            websites = websites.filter(w => w.id !== websiteId);
            localStorage.setItem('pinned_websites', JSON.stringify(websites));
            this.showMessage('Website removed', 'success');
            this.navigateTo('settings');
        }
    }

    getPinnedWebsitesList() {
        const websites = JSON.parse(localStorage.getItem('pinned_websites') || '[]');

        if (websites.length === 0) {
            return '<p style="color: #999; font-size: 14px;">No websites pinned yet</p>';
        }

        return websites.map(website => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007aff;">
                <a href="${website.url}" target="_blank" style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: #007aff; flex: 1;">
                    <span style="font-size: 20px;">${website.icon}</span>
                    <div>
                        <strong>${website.name}</strong>
                        <p style="font-size: 12px; color: #666; margin: 0;">${website.url}</p>
                    </div>
                </a>
                <button class="btn-small" onclick="app.removePinnedWebsite('${website.id}')" style="background: #ff3b30; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                    ✕
                </button>
            </div>
        `).join('');
    }

    // Achievement system
    getAchievementBadges() {
        const achievements = this.getAllAchievements();
        const unlockedAchievements = this.currentUser?.achievements || [];

        return achievements.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return `
                <div style="text-align: center; cursor: pointer;" title="${achievement.name}: ${achievement.description}">
                    <div style="font-size: 40px; margin-bottom: 8px; opacity: ${isUnlocked ? '1' : '0.3'};">
                        ${achievement.icon}
                    </div>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">
                        ${achievement.name}
                    </p>
                    ${isUnlocked ? '<p style="font-size: 10px; color: #34c759; margin: 4px 0 0 0;">✓ Unlocked</p>' : ''}
                </div>
            `;
        }).join('');
    }

    getAllAchievements() {
        return [
            { id: 'first_login', name: 'Welcome', icon: '👋', description: 'Login for the first time' },
            { id: 'first_assignment', name: 'Task Master', icon: '📝', description: 'Complete your first assignment' },
            { id: 'first_test', name: 'Test Taker', icon: '🎯', description: 'Take your first test' },
            { id: 'study_streak_7', name: '7-Day Streak', icon: '🔥', description: 'Study 7 days in a row' },
            { id: 'study_streak_30', name: 'Month Master', icon: '🌟', description: 'Study 30 days in a row' },
            { id: 'coins_100', name: 'Coin Collector', icon: '🪙', description: 'Earn 100 study coins' },
            { id: 'coins_500', name: 'Rich Student', icon: '💰', description: 'Earn 500 study coins' },
            { id: 'perfect_score', name: 'Perfect Score', icon: '💯', description: 'Get 100% on a test' },
            { id: 'group_creator', name: 'Group Leader', icon: '👥', description: 'Create a study group' },
            { id: 'dark_mode', name: 'Night Owl', icon: '🌙', description: 'Enable dark mode' }
        ];
    }

    unlockAchievement(achievementId) {
        if (!this.currentUser) return;

        const achievements = this.currentUser.achievements || [];

        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            this.currentUser.achievements = achievements;

            // Save to Firebase if user is logged in with Firebase
            if (this.currentUser.id && auth.currentUser) {
                db.collection('users').doc(this.currentUser.id).update({
                    achievements: achievements
                }).catch(err => console.error('Error saving achievement:', err));
            }

            const achievement = this.getAllAchievements().find(a => a.id === achievementId);
            if (achievement) {
                this.showMessage(`🏆 Achievement Unlocked: ${achievement.name}!`, 'success');
            }
        }
    }

    checkAchievements() {
        // Check for various achievement conditions
        const coins = this.currentUser.studyCoins || 0;

        if (coins >= 100) this.unlockAchievement('coins_100');
        if (coins >= 500) this.unlockAchievement('coins_500');
    }

    exportToGoogleCalendar() {
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const tests = JSON.parse(localStorage.getItem('sms_tests') || '[]');

        // Create iCalendar format
        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//School Management System//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:School Management System
X-WR-TIMEZONE:UTC
X-WR-CALDESC:Assignments and Tests from School Management System
`;

        // Add assignments
        assignments.forEach(assignment => {
            const startDate = new Date(assignment.dueDate);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

            icsContent += `BEGIN:VEVENT
UID:assignment-${assignment.id}@schoolms.local
DTSTAMP:${this.formatICSDate(new Date())}
DTSTART:${this.formatICSDate(startDate)}
DTEND:${this.formatICSDate(endDate)}
SUMMARY:${assignment.title} (Assignment)
DESCRIPTION:${assignment.description || 'No description'}
LOCATION:School
STATUS:CONFIRMED
END:VEVENT
`;
        });

        // Add tests
        tests.forEach(test => {
            const startDate = new Date(test.date);
            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

            icsContent += `BEGIN:VEVENT
UID:test-${test.id}@schoolms.local
DTSTAMP:${this.formatICSDate(new Date())}
DTSTART:${this.formatICSDate(startDate)}
DTEND:${this.formatICSDate(endDate)}
SUMMARY:${test.subject} Test
DESCRIPTION:${test.subject} - ${test.questions} questions
LOCATION:School
STATUS:CONFIRMED
END:VEVENT
`;
        });

        icsContent += `END:VCALENDAR`;

        // Download the file
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'school-calendar.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.showMessage('Calendar exported! Import the .ics file into Google Calendar', 'success');
    }

    formatICSDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    }

    generateWeeklyReport() {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Collect data for the week
        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const tests = JSON.parse(localStorage.getItem('sms_tests') || '[]');
        const studySessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
        const grades = JSON.parse(localStorage.getItem('sms_grades') || '[]');

        // Filter for this week
        const weekAssignments = assignments.filter(a => {
            const date = new Date(a.dueDate);
            return date >= weekStart && date <= weekEnd;
        });

        const weekTests = tests.filter(t => {
            const date = new Date(t.date);
            return date >= weekStart && date <= weekEnd;
        });

        const weekSessions = studySessions.filter(s => {
            const date = new Date(s.date);
            return date >= weekStart && date <= weekEnd;
        });

        const weekGrades = grades.filter(g => {
            const date = new Date(g.date);
            return date >= weekStart && date <= weekEnd;
        });

        // Calculate statistics
        const totalStudyMinutes = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const avgGrade = weekGrades.length > 0
            ? (weekGrades.reduce((sum, g) => sum + g.score, 0) / weekGrades.length).toFixed(1)
            : 'N/A';

        // Generate HTML report
        const reportHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Weekly Study Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f7; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #007aff; text-align: center; margin-bottom: 10px; }
        .week-range { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #007aff; }
        .stat-value { font-size: 32px; font-weight: bold; color: #007aff; }
        .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; font-size: 18px; border-bottom: 2px solid #007aff; padding-bottom: 10px; }
        .item { background: #f9f9f9; padding: 12px; margin: 8px 0; border-radius: 6px; }
        .item-title { font-weight: 600; color: #333; }
        .item-detail { color: #666; font-size: 13px; margin-top: 4px; }
        .empty { color: #999; font-style: italic; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Weekly Study Report</h1>
        <div class="week-range">
            ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totalStudyMinutes}</div>
                <div class="stat-label">Minutes Studied</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${weekSessions.length}</div>
                <div class="stat-label">Study Sessions</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${weekAssignments.length}</div>
                <div class="stat-label">Assignments Due</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${avgGrade}</div>
                <div class="stat-label">Average Grade</div>
            </div>
        </div>

        <div class="section">
            <h2>📝 Assignments</h2>
            ${weekAssignments.length > 0
                ? weekAssignments.map(a => `
                    <div class="item">
                        <div class="item-title">${a.title}</div>
                        <div class="item-detail">Due: ${new Date(a.dueDate).toLocaleDateString()}</div>
                    </div>
                `).join('')
                : '<div class="empty">No assignments this week</div>'
            }
        </div>

        <div class="section">
            <h2>📚 Tests</h2>
            ${weekTests.length > 0
                ? weekTests.map(t => `
                    <div class="item">
                        <div class="item-title">${t.subject} Test</div>
                        <div class="item-detail">${t.questions} questions • ${new Date(t.date).toLocaleDateString()}</div>
                    </div>
                `).join('')
                : '<div class="empty">No tests this week</div>'
            }
        </div>

        <div class="section">
            <h2>🎯 Study Sessions</h2>
            ${weekSessions.length > 0
                ? weekSessions.map(s => `
                    <div class="item">
                        <div class="item-title">${s.type === 'focus' ? '🎯 Focus' : '☕ Break'} Session</div>
                        <div class="item-detail">${s.duration} minutes • ${new Date(s.date).toLocaleDateString()}</div>
                    </div>
                `).join('')
                : '<div class="empty">No study sessions this week</div>'
            }
        </div>

        <div class="section">
            <h2>📊 Grades</h2>
            ${weekGrades.length > 0
                ? weekGrades.map(g => `
                    <div class="item">
                        <div class="item-title">${g.subject || 'Test'}</div>
                        <div class="item-detail">Score: ${g.score}% • ${new Date(g.date).toLocaleDateString()}</div>
                    </div>
                `).join('')
                : '<div class="empty">No grades this week</div>'
            }
        </div>

        <div class="footer">
            Generated on ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}
            <br>
            Classeology - Your Personal Study Companion
        </div>
    </div>
</body>
</html>
        `;

        // Download the report
        const blob = new Blob([reportHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weekly-report-${weekStart.toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.showMessage('Weekly report downloaded!', 'success');
    }

    saveGeminiApiKey() {
        const apiKeyInput = document.getElementById('geminiApiKey');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            this.showMessage('Please enter an API key', 'error');
            return;
        }

        localStorage.setItem('gemini_api_key', apiKey);
        this.showMessage('Gemini API key saved successfully!', 'success');
    }

    showChangeGeminiKeyModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>🔑 Change Gemini API Key</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Current Gemini API Key</label>
                        <input type="password" id="newGeminiApiKey" placeholder="Enter new Gemini API key" value="${localStorage.getItem('gemini_api_key') || ''}" style="width: 100%; padding: 10px; border: 1px solid #e5e5ea; border-radius: 8px; font-family: monospace;">
                        <p style="font-size: 13px; color: #666; margin-top: 8px;">
                            This key is used by all students for Conrad AI's "What is" questions
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        <button class="btn-primary" onclick="app.updateGeminiApiKey()" style="flex: 1;">
                            Save Key
                        </button>
                        <button class="btn-secondary" onclick="app.testGeminiConnectionModal()" style="flex: 1;">
                            Test
                        </button>
                        <button class="btn-secondary" onclick="this.closest('.modal').remove()" style="flex: 1;">
                            Cancel
                        </button>
                    </div>
                    
                    <div id="geminiModalStatus" style="margin-top: 16px; padding: 12px; border-radius: 8px; display: none; background: #f0f0f0;">
                        <p id="geminiModalStatusText"></p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    updateGeminiApiKey() {
        const apiKeyInput = document.getElementById('newGeminiApiKey');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            this.showMessage('Please enter an API key', 'error');
            return;
        }

        localStorage.setItem('gemini_api_key', apiKey);
        this.showMessage('Gemini API key updated successfully!', 'success');
        document.querySelector('.modal').remove();
    }

    async testGeminiConnectionModal() {
        const apiKey = document.getElementById('newGeminiApiKey').value.trim();

        if (!apiKey) {
            this.showMessage('Please enter an API key first', 'error');
            return;
        }

        const statusDiv = document.getElementById('geminiModalStatus');
        const statusText = document.getElementById('geminiModalStatusText');
        statusDiv.style.display = 'block';
        statusText.textContent = '🔄 Testing connection...';

        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: 'Say "Connection successful" in one sentence.'
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 50,
                    }
                })
            });

            if (response.ok) {
                statusDiv.style.background = '#d4edda';
                statusText.textContent = '✅ Connection successful! This API key works.';
            } else if (response.status === 401) {
                statusDiv.style.background = '#f8d7da';
                statusText.textContent = '❌ Invalid API key. Please check and try again.';
            } else {
                statusDiv.style.background = '#f8d7da';
                statusText.textContent = `❌ Connection failed (Error ${response.status}). Please try again.`;
            }
        } catch (error) {
            statusDiv.style.background = '#f8d7da';
            statusText.textContent = '❌ Network error. Please check your connection.';
        }
    }

    showMessage(message, type) {
        const div = document.createElement('div');
        div.className = type === 'success' ? 'success-message' : 'error-message';
        div.textContent = message;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }

    // Notification System
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            this.showMessage('Your browser does not support notifications', 'error');
            return;
        }

        if (Notification.permission === 'granted') {
            this.showMessage('Notifications are already enabled!', 'success');
            this.setupNotifications();
            return;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showMessage('Notifications enabled successfully!', 'success');
                this.setupNotifications();
            } else {
                this.showMessage('Notification permission denied', 'error');
            }
        } else {
            this.showMessage('Notifications are blocked. Please enable them in browser settings.', 'error');
        }
    }

    setupNotifications() {
        // Check for upcoming assignments every hour
        setInterval(() => {
            this.checkUpcomingAssignments();
        }, 3600000); // 1 hour

        // Check immediately
        this.checkUpcomingAssignments();
    }

    checkUpcomingAssignments() {
        if (Notification.permission !== 'granted') return;

        const assignments = JSON.parse(localStorage.getItem('sms_assignments') || '[]');
        const today = new Date();

        assignments.forEach(assignment => {
            if (assignment.status === 'completed') return;

            const dueDate = new Date(assignment.dueDate);
            const hoursUntilDue = (dueDate - today) / (1000 * 60 * 60);

            // Notify if due within 24 hours
            if (hoursUntilDue > 0 && hoursUntilDue <= 24) {
                const notificationKey = `notified_${assignment.id}_24h`;
                if (!localStorage.getItem(notificationKey)) {
                    this.sendNotification(
                        '⏰ Assignment Due Soon!',
                        `${assignment.title} is due in ${Math.ceil(hoursUntilDue)} hours`
                    );
                    // Send email notification
                    if (this.currentUser && this.currentUser.email) {
                        emailService.sendDueDateEmail(
                            assignment,
                            this.currentUser.email,
                            this.currentUser.name,
                            hoursUntilDue
                        );
                    }
                    localStorage.setItem(notificationKey, 'true');
                }
            }

            // Notify if overdue
            if (hoursUntilDue < 0) {
                const notificationKey = `notified_${assignment.id}_overdue`;
                if (!localStorage.getItem(notificationKey)) {
                    this.sendNotification(
                        '⚠️ Assignment Overdue!',
                        `${assignment.title} was due on ${assignment.dueDate}`
                    );
                    // Send overdue email notification
                    if (this.currentUser && this.currentUser.email) {
                        emailService.sendOverdueEmail(
                            assignment,
                            this.currentUser.email,
                            this.currentUser.name,
                            Math.abs(hoursUntilDue) / 24
                        );
                    }
                    localStorage.setItem(notificationKey, 'true');
                }
            }
        });
    }

    sendNotification(title, body) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '📚',
                badge: '🔔',
                tag: 'assignment-reminder',
                requireInteraction: false
            });

            notification.onclick = () => {
                window.focus();
                this.navigateTo('assignments');
                notification.close();
            };
        }
    }
}

// Initialize app
const app = new SchoolManagementSystem();
