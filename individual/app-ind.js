// Individual Mode - Personal Task Organizer
// For individuals not affiliated with a school

class IndividualOrganizer {
    constructor() {
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        this.initIndividualData();
        this.showIndividualLogin();
    }

    initIndividualData() {
        if (!localStorage.getItem('ind_initialized')) {
            // Demo individual user
            const users = [
                {
                    id: 'ind1',
                    username: 'demo',
                    password: 'demo123',
                    name: 'Alex Smith',
                    email: 'alex@example.com',
                    role: 'individual',
                    avatar: '👤'
                }
            ];

            const tasks = [
                {
                    id: 'task1',
                    title: 'Complete project proposal',
                    dueDate: '2025-01-20',
                    priority: 'high',
                    status: 'pending',
                    category: 'work'
                },
                {
                    id: 'task2',
                    title: 'Grocery shopping',
                    dueDate: '2025-01-15',
                    priority: 'medium',
                    status: 'pending',
                    category: 'personal'
                }
            ];

            const schedule = {
                periods: [
                    { period: 1, startTime: '09:00', endTime: '10:00', name: 'Morning Block' },
                    { period: 2, startTime: '10:00', endTime: '11:00', name: 'Mid-Morning' },
                    { period: 3, startTime: '11:00', endTime: '12:00', name: 'Late Morning' },
                    { period: 4, startTime: '13:00', endTime: '14:00', name: 'Afternoon' }
                ]
            };

            localStorage.setItem('ind_users', JSON.stringify(users));
            localStorage.setItem('ind_tasks', JSON.stringify(tasks));
            localStorage.setItem('ind_schedule', JSON.stringify(schedule));
            localStorage.setItem('ind_initialized', 'true');
        }
    }

    showIndividualLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <h1>📋 Personal Organizer</h1>
                    <p>Organize your life, your way</p>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" onclick="indApp.switchMode('login')">Login</button>
                        <button class="auth-tab" onclick="indApp.switchMode('register')">Sign Up</button>
                    </div>

                    <div id="login-section">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" id="username" placeholder="Enter username">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="password" placeholder="Enter password">
                        </div>
                        <button class="btn-primary" onclick="indApp.login()">Sign In</button>
                        <p style="margin-top: 16px; text-align: center; color: #666; font-size: 14px;">
                            Demo: username = demo, password = demo123
                        </p>
                    </div>

                    <div id="register-section" style="display: none;">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="reg-name" placeholder="Your name">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="reg-email" placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" id="reg-username" placeholder="Choose username">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="reg-password" placeholder="Choose password">
                        </div>
                        <button class="btn-primary" onclick="indApp.register()">Create Account</button>
                    </div>

                    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e5ea;">
                        <p style="text-align: center; color: #666; font-size: 14px;">
                            <a href="index.html" style="color: #007aff; text-decoration: none;">← Back to School Mode</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    switchMode(mode) {
        const loginSection = document.getElementById('login-section');
        const registerSection = document.getElementById('register-section');
        const tabs = document.querySelectorAll('.auth-tab');

        tabs.forEach(tab => tab.classList.remove('active'));

        if (mode === 'login') {
            loginSection.style.display = 'block';
            registerSection.style.display = 'none';
            tabs[0].classList.add('active');
        } else {
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
            tabs[1].classList.add('active');
        }
    }

    login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('ind_users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            this.showDashboard();
            this.showMessage('Welcome back, ' + user.name + '!', 'success');
        } else {
            this.showMessage('Invalid credentials', 'error');
        }
    }

    register() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        if (!name || !email || !username || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('ind_users') || '[]');

        if (users.find(u => u.username === username)) {
            this.showMessage('Username already exists', 'error');
            return;
        }

        const newUser = {
            id: 'ind_' + Date.now(),
            username,
            password,
            name,
            email,
            role: 'individual',
            avatar: '👤'
        };

        users.push(newUser);
        localStorage.setItem('ind_users', JSON.stringify(users));

        this.showMessage('Account created! Please login.', 'success');
        this.switchMode('login');
    }

    showDashboard() {
        // Apply saved theme
        const savedTheme = localStorage.getItem('app_theme') || 'default';
        document.body.className = savedTheme === 'default' ? 'individual-mode' : `individual-mode theme-${savedTheme}`;

        // Apply saved background
        const savedBg = localStorage.getItem('app_background') || 'none';
        document.body.setAttribute('data-background', savedBg);

        // Apply custom colors if custom theme
        if (savedTheme === 'custom') {
            setTimeout(() => this.applyCustomColors(), 100);
        }

        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard">
                <div class="sidebar">
                    <div class="sidebar-header">
                        <h2>${this.currentUser.avatar} ${this.currentUser.name}</h2>
                        <p>Personal Organizer</p>
                    </div>
                    
                    <div class="nav-menu">
                        <button class="nav-btn active" onclick="indApp.navigateTo('dashboard', event)">
                            📊 Dashboard
                        </button>
                        <button class="nav-btn" onclick="indApp.navigateTo('schedule', event)">
                            📅 Schedule
                        </button>
                        <button class="nav-btn" onclick="indApp.navigateTo('tasks', event)">
                            ✅ Tasks
                        </button>
                        <button class="nav-btn" onclick="indApp.navigateTo('notes', event)">
                            📝 Notes
                        </button>
                        <button class="nav-btn" onclick="indApp.navigateTo('files', event)">
                            📁 Files
                        </button>
                        <button class="nav-btn" onclick="indApp.navigateTo('settings', event)">
                            ⚙️ Settings
                        </button>
                    </div>
                    
                    <button class="logout-btn" onclick="indApp.logout()">
                        🚪 Logout
                    </button>
                </div>
                
                <div class="main-content" id="main-content">
                    ${this.getDashboardContent()}
                </div>
            </div>
        `;
    }

    navigateTo(view, event) {
        this.currentView = view;

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (event && event.target) {
            event.target.classList.add('active');
        }

        const content = document.getElementById('main-content');
        switch (view) {
            case 'dashboard':
                content.innerHTML = this.getDashboardContent();
                break;
            case 'schedule':
                content.innerHTML = this.getScheduleContent();
                break;
            case 'tasks':
                content.innerHTML = this.getTasksContent();
                break;
            case 'notes':
                content.innerHTML = this.getNotesContent();
                break;
            case 'files':
                content.innerHTML = this.getFilesContent();
                break;
            case 'settings':
                content.innerHTML = this.getSettingsContent();
                break;
        }
    }

    getDashboardContent() {
        const tasks = JSON.parse(localStorage.getItem('ind_tasks') || '[]');
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const completedTasks = tasks.filter(t => t.status === 'completed');

        return `
            <div class="view-header">
                <h2>📊 Dashboard</h2>
                <p>Welcome back, ${this.currentUser.name}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-info">
                        <h3>${tasks.length}</h3>
                        <p>Total Tasks</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⏰</div>
                    <div class="stat-info">
                        <h3>${pendingTasks.length}</h3>
                        <p>Pending</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✔️</div>
                    <div class="stat-info">
                        <h3>${completedTasks.length}</h3>
                        <p>Completed</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-info">
                        <h3>${tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</h3>
                        <p>Progress</p>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>📋 Today's Tasks</h3>
                ${pendingTasks.slice(0, 5).map(t => `
                    <div class="task-item">
                        <div class="task-info">
                            <h4>${t.title}</h4>
                            <span class="task-category">${t.category}</span>
                            <span class="task-due">Due: ${t.dueDate}</span>
                        </div>
                        <span class="task-priority priority-${t.priority}">${t.priority}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getScheduleContent() {
        const schedule = JSON.parse(localStorage.getItem('ind_schedule') || '{}');
        const periods = schedule.periods || [];
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        return `
            <div class="view-header">
                <h2>📅 My Schedule</h2>
                <p>Plan your week</p>
                <div class="header-actions">
                    <button class="btn-primary" onclick="indApp.addPeriod()">➕ Add Time Block</button>
                    <button class="btn-secondary" onclick="indApp.managePeriods()">⏰ Manage Blocks</button>
                </div>
            </div>

            <div class="card">
                <div class="schedule-blocks">
                    ${periods.map(period => `
                        <div class="schedule-block">
                            <div class="block-time">
                                <strong>${period.name}</strong>
                                <span>${period.startTime} - ${period.endTime}</span>
                            </div>
                            <button class="btn-danger btn-small" onclick="indApp.deletePeriod(${period.period})">🗑️ Delete</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getTasksContent() {
        const tasks = JSON.parse(localStorage.getItem('ind_tasks') || '[]');

        return `
            <div class="view-header">
                <h2>✅ My Tasks</h2>
                <p>Manage your to-do list</p>
                <button class="btn-primary" onclick="indApp.addTask()">➕ Add Task</button>
            </div>

            <div class="card">
                <h3>All Tasks</h3>
                ${tasks.map(t => `
                    <div class="task-item">
                        <div class="task-info">
                            <h4>${t.title}</h4>
                            <div class="task-meta">
                                <span class="task-category">${t.category}</span>
                                <span class="task-due">Due: ${t.dueDate}</span>
                            </div>
                        </div>
                        <div class="task-actions">
                            <span class="task-priority priority-${t.priority}">${t.priority}</span>
                            <button class="btn-small btn-secondary" onclick="indApp.toggleTask('${t.id}')">
                                ${t.status === 'completed' ? '↶ Undo' : '✓ Complete'}
                            </button>
                            <button class="btn-small btn-danger" onclick="indApp.deleteTask('${t.id}')">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getNotesContent() {
        const savedNotes = localStorage.getItem('ind_notes') || '';

        setTimeout(() => {
            const textarea = document.getElementById('notesArea');
            if (textarea) textarea.value = savedNotes;
        }, 100);

        return `
            <div class="view-header">
                <h2>📝 Notes</h2>
                <p>Capture your thoughts</p>
            </div>

            <div class="card">
                <textarea id="notesArea" placeholder="Start typing your notes..." style="width: 100%; min-height: 400px; padding: 16px; border: 1px solid #e5e5ea; border-radius: 8px; font-family: inherit; font-size: 15px;"></textarea>
                <button class="btn-primary" onclick="indApp.saveNotes()" style="margin-top: 16px;">💾 Save Notes</button>
            </div>
        `;
    }

    getFilesContent() {
        const files = JSON.parse(localStorage.getItem('ind_files') || '[]');

        setTimeout(() => {
            const fileInput = document.getElementById('indFileInput');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => indApp.handleIndFileUpload(e));
            }
        }, 100);

        return `
            <div class="view-header">
                <h2>📁 My Files</h2>
                <p>Upload and organize your files</p>
            </div>

            <div class="card">
                <div class="upload-area" onclick="document.getElementById('indFileInput').click()">
                    <div class="upload-icon">📤</div>
                    <p>Click to upload files</p>
                    <small style="color: #666;">Supported: Images, PDFs, Documents</small>
                </div>
                <input type="file" id="indFileInput" style="display: none;" multiple accept="image/*,.pdf,.doc,.docx,.txt">
            </div>
            
            ${files.length > 0 ? `
                <div class="card">
                    <h3>📂 Your Files (${files.length})</h3>
                    <div class="files-list">
                        ${files.map(file => `
                            <div class="file-item">
                                <div class="file-icon">${this.getFileIcon(file.type)}</div>
                                <div class="file-info">
                                    <strong>${file.name}</strong>
                                    <span>${file.size} • ${file.uploadDate}</span>
                                </div>
                                <button class="btn-delete" onclick="indApp.deleteIndFile('${file.id}')" title="Delete file">
                                    🗑️
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    getFileIcon(type) {
        if (type.startsWith('image/')) return '🖼️';
        if (type.includes('pdf')) return '📄';
        if (type.includes('word') || type.includes('doc')) return '📝';
        if (type.includes('text')) return '📃';
        return '📁';
    }

    handleIndFileUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const storedFiles = JSON.parse(localStorage.getItem('ind_files') || '[]');

        Array.from(files).forEach(file => {
            const fileData = {
                id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: this.formatFileSize(file.size),
                type: file.type || 'application/octet-stream',
                uploadDate: new Date().toLocaleDateString(),
                uploadTime: new Date().toLocaleTimeString()
            };
            storedFiles.push(fileData);
        });

        localStorage.setItem('ind_files', JSON.stringify(storedFiles));
        this.showMessage(`${files.length} file(s) uploaded successfully!`, 'success');
        this.navigateTo('files');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    deleteIndFile(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;

        const files = JSON.parse(localStorage.getItem('ind_files') || '[]');
        const filteredFiles = files.filter(f => f.id !== fileId);
        localStorage.setItem('ind_files', JSON.stringify(filteredFiles));

        this.showMessage('File deleted successfully!', 'success');
        this.navigateTo('files');
    }

    addPeriod() {
        const schedule = JSON.parse(localStorage.getItem('ind_schedule') || '{}');
        const periods = schedule.periods || [];
        const newPeriodNumber = periods.length > 0 ? periods[periods.length - 1].period + 1 : 1;

        const newPeriod = {
            period: newPeriodNumber,
            startTime: '14:00',
            endTime: '15:00',
            name: `Block ${newPeriodNumber}`
        };

        periods.push(newPeriod);
        schedule.periods = periods;
        localStorage.setItem('ind_schedule', JSON.stringify(schedule));

        this.showMessage('Time block added!', 'success');
        this.navigateTo('schedule');
    }

    deletePeriod(periodNumber) {
        if (!confirm('Delete this time block?')) return;

        const schedule = JSON.parse(localStorage.getItem('ind_schedule') || '{}');
        schedule.periods = schedule.periods.filter(p => p.period !== periodNumber);
        localStorage.setItem('ind_schedule', JSON.stringify(schedule));

        this.showMessage('Time block deleted!', 'success');
        this.navigateTo('schedule');
    }

    managePeriods() {
        const schedule = JSON.parse(localStorage.getItem('ind_schedule') || '{}');
        const periods = schedule.periods || [];

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⏰ Manage Time Blocks</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="modal-body">
                    ${periods.map(p => `
                        <div class="period-item">
                            <span>${p.name}: ${p.startTime} - ${p.endTime}</span>
                            <button class="btn-danger btn-small" onclick="indApp.deletePeriod(${p.period}); this.closest('.modal').remove();">Delete</button>
                        </div>
                    `).join('')}
                    <button class="btn-primary" onclick="indApp.addPeriod(); this.closest('.modal').remove();">Add New Block</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    addTask() {
        this.showMessage('Task creation coming soon!', 'success');
    }

    toggleTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('ind_tasks') || '[]');
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            localStorage.setItem('ind_tasks', JSON.stringify(tasks));
            this.navigateTo('tasks');
        }
    }

    deleteTask(taskId) {
        if (!confirm('Delete this task?')) return;
        const tasks = JSON.parse(localStorage.getItem('ind_tasks') || '[]');
        const filtered = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('ind_tasks', JSON.stringify(filtered));
        this.showMessage('Task deleted!', 'success');
        this.navigateTo('tasks');
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
                    <div class="theme-card ${currentTheme === 'default' ? 'active' : ''}" onclick="indApp.setTheme('default')">
                        <div class="theme-preview default-preview">
                            <div class="preview-bar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <h4>Default</h4>
                        <p>Clean & Professional</p>
                    </div>

                    <div class="theme-card ${currentTheme === 'coffee' ? 'active' : ''}" onclick="indApp.setTheme('coffee')">
                        <div class="theme-preview coffee-preview">
                            <div class="preview-bar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <h4>☕ Coffee & Focus</h4>
                        <p>Warm & Cozy</p>
                    </div>

                    <div class="theme-card ${currentTheme === 'student' ? 'active' : ''}" onclick="indApp.setTheme('student')">
                        <div class="theme-preview student-preview">
                            <div class="preview-bar"></div>
                            <div class="preview-content"></div>
                        </div>
                        <h4>✂️ Creativity & Motion</h4>
                        <p>Playful & Energetic</p>
                    </div>

                    <div class="theme-card ${currentTheme === 'custom' ? 'active' : ''}" onclick="indApp.setTheme('custom')">
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
                        <input type="color" value="${customColors.background || '#f5f5f7'}" onchange="indApp.updateCustomColor('background', this.value)">
                        <input type="text" value="${customColors.background || '#f5f5f7'}" onchange="indApp.updateCustomColor('background', this.value)" placeholder="#f5f5f7">
                    </div>
                    
                    <div class="color-row">
                        <label>Sidebar Background</label>
                        <input type="color" value="${customColors.sidebarBg || '#ffffff'}" onchange="indApp.updateCustomColor('sidebarBg', this.value)">
                        <input type="text" value="${customColors.sidebarBg || '#ffffff'}" onchange="indApp.updateCustomColor('sidebarBg', this.value)" placeholder="#ffffff">
                    </div>
                    
                    <div class="color-row">
                        <label>Primary Accent</label>
                        <input type="color" value="${customColors.primary || '#007aff'}" onchange="indApp.updateCustomColor('primary', this.value)">
                        <input type="text" value="${customColors.primary || '#007aff'}" onchange="indApp.updateCustomColor('primary', this.value)" placeholder="#007aff">
                    </div>
                    
                    <div class="color-row">
                        <label>Secondary Accent</label>
                        <input type="color" value="${customColors.secondary || '#34c759'}" onchange="indApp.updateCustomColor('secondary', this.value)">
                        <input type="text" value="${customColors.secondary || '#34c759'}" onchange="indApp.updateCustomColor('secondary', this.value)" placeholder="#34c759">
                    </div>
                    
                    <div class="color-row">
                        <label>Card Background</label>
                        <input type="color" value="${customColors.cardBg || '#ffffff'}" onchange="indApp.updateCustomColor('cardBg', this.value)">
                        <input type="text" value="${customColors.cardBg || '#ffffff'}" onchange="indApp.updateCustomColor('cardBg', this.value)" placeholder="#ffffff">
                    </div>
                    
                    <div class="color-row">
                        <label>Text Primary</label>
                        <input type="color" value="${customColors.textPrimary || '#1d1d1f'}" onchange="indApp.updateCustomColor('textPrimary', this.value)">
                        <input type="text" value="${customColors.textPrimary || '#1d1d1f'}" onchange="indApp.updateCustomColor('textPrimary', this.value)" placeholder="#1d1d1f">
                    </div>
                    
                    <div class="color-row">
                        <label>Text Muted</label>
                        <input type="color" value="${customColors.textMuted || '#666666'}" onchange="indApp.updateCustomColor('textMuted', this.value)">
                        <input type="text" value="${customColors.textMuted || '#666666'}" onchange="indApp.updateCustomColor('textMuted', this.value)" placeholder="#666666">
                    </div>
                    
                    <div class="color-row">
                        <label>Button Primary</label>
                        <input type="color" value="${customColors.buttonPrimary || '#007aff'}" onchange="indApp.updateCustomColor('buttonPrimary', this.value)">
                        <input type="text" value="${customColors.buttonPrimary || '#007aff'}" onchange="indApp.updateCustomColor('buttonPrimary', this.value)" placeholder="#007aff">
                    </div>
                    
                    <div class="color-row">
                        <label>Button Hover</label>
                        <input type="color" value="${customColors.buttonHover || '#0056cc'}" onchange="indApp.updateCustomColor('buttonHover', this.value)">
                        <input type="text" value="${customColors.buttonHover || '#0056cc'}" onchange="indApp.updateCustomColor('buttonHover', this.value)" placeholder="#0056cc">
                    </div>
                    
                    <div class="color-row">
                        <label>Border Color</label>
                        <input type="color" value="${customColors.border || '#e5e5ea'}" onchange="indApp.updateCustomColor('border', this.value)">
                        <input type="text" value="${customColors.border || '#e5e5ea'}" onchange="indApp.updateCustomColor('border', this.value)" placeholder="#e5e5ea">
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 12px;">
                    <button class="btn-primary" onclick="indApp.applyCustomColors()">Apply Custom Colors</button>
                    <button class="btn-secondary" onclick="indApp.resetCustomColors()">Reset to Default</button>
                </div>
            </div>

            <div class="card">
                <h3>🖼️ Background Image</h3>
                <p style="color: #666; margin-bottom: 20px;">Add a subtle background image</p>
                
                <div class="background-options">
                    <button class="bg-option" onclick="indApp.setBackground('none')">None</button>
                    <button class="bg-option" onclick="indApp.setBackground('coffee')">☕ Coffee</button>
                    <button class="bg-option" onclick="indApp.setBackground('desk')">📚 Desk</button>
                    <button class="bg-option" onclick="indApp.setBackground('notebook')">📓 Notebook</button>
                    <button class="bg-option" onclick="indApp.setBackground('supplies')">✂️ Supplies</button>
                    <button class="bg-option" onclick="indApp.setBackground('custom')">🖼️ Custom</button>
                </div>
                
                <div style="margin-top: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Upload Your Own Background:</label>
                    <input type="file" id="bgUpload" accept="image/*" onchange="indApp.uploadBackground(event)" style="display: block; margin-bottom: 8px;">
                    <p style="font-size: 13px; color: #666;">Recommended: Light, subtle images work best</p>
                </div>
                
                <div style="margin-top: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Background Opacity:</label>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 14px; color: #666;">More Visible</span>
                        <input type="range" id="bgOpacity" min="0" max="100" value="${localStorage.getItem('bg_opacity') || '85'}" 
                               oninput="indApp.updateOpacity(this.value)" 
                               style="flex: 1; cursor: pointer;">
                        <span style="font-size: 14px; color: #666;">Less Visible</span>
                        <span id="opacityValue" style="font-weight: 600; min-width: 40px;">${localStorage.getItem('bg_opacity') || '85'}%</span>
                    </div>
                    <p style="font-size: 13px; color: #666; margin-top: 8px;">Adjust how much the background shows through</p>
                </div>
            </div>


            <div class="card">
                <h3>👤 Account</h3>
                <p><strong>Name:</strong> ${this.currentUser.name}</p>
                <p><strong>Email:</strong> ${this.currentUser.email}</p>
                <p><strong>Username:</strong> ${this.currentUser.username}</p>
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
        } else if (bgType === 'none') {
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

    toggleFeature(feature) {
        const settings = JSON.parse(localStorage.getItem('ind_settings') || '{}');
        settings[feature] = !settings[feature];
        localStorage.setItem('ind_settings', JSON.stringify(settings));

        const featureNames = {
            enableNotesSaving: 'Notes Saving',
            enableFileUploads: 'File Uploads',
            enableStudyCoins: 'Study Coins & Shop'
        };

        this.showMessage(`${featureNames[feature]} ${settings[feature] ? 'enabled' : 'disabled'}!`, 'success');
        this.navigateTo('settings');
    }

    setTheme(theme) {
        localStorage.setItem('app_theme', theme);
        document.body.className = theme === 'default' ? 'individual-mode' : `individual-mode theme-${theme}`;
        this.showMessage(`Theme changed to ${theme}!`, 'success');
        this.navigateTo('settings');
    }

    saveNotes() {
        const notes = document.getElementById('notesArea').value;
        localStorage.setItem('ind_notes', notes);
        this.showMessage('Notes saved successfully!', 'success');
    }

    logout() {
        this.currentUser = null;
        this.showIndividualLogin();
    }

    showMessage(message, type) {
        const div = document.createElement('div');
        div.className = type === 'success' ? 'success-message' : 'error-message';
        div.textContent = message;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
}

// Initialize Individual App
const indApp = new IndividualOrganizer();
