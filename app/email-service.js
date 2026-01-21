// Email Notification Service
// Integrates with EmailJS to send email notifications for due dates

class EmailNotificationService {
    constructor() {
        // Initialize EmailJS (you need to set up an account at emailjs.com)
        this.serviceID = 'service_school_mgmt'; // Replace with your EmailJS service ID
        this.templateID = 'template_due_date'; // Replace with your EmailJS template ID
        this.userID = 'YOUR_EMAILJS_USER_ID'; // Replace with your EmailJS user ID
        this.initialized = false;
        this.init();
    }

    init() {
        // Load EmailJS library with CORS support from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js';
        script.crossOrigin = 'anonymous';
        script.integrity = 'sha384-2VF/yozMrcMwXrzsDmb12B7xnJJHhKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK';
        script.onload = () => {
            if (window.emailjs) {
                emailjs.init(this.userID);
                this.initialized = true;
                console.log('✅ EmailJS initialized successfully');
            }
        };
        script.onerror = () => {
            console.warn('Failed to load EmailJS library - will retry');
            // Retry loading
            setTimeout(() => this.init(), 2000);
        };
        document.head.appendChild(script);
    }

    /**
     * Send email notification for upcoming assignment
     * @param {Object} assignment - Assignment object
     * @param {string} userEmail - User's email address
     * @param {string} userName - User's name
     * @param {number} hoursUntilDue - Hours until due date
     */
    async sendDueDateEmail(assignment, userEmail, userName, hoursUntilDue) {
        if (!this.initialized) {
            console.warn('EmailJS not initialized yet');
            return false;
        }

        try {
            const dueDate = new Date(assignment.dueDate);
            const templateParams = {
                to_email: userEmail,
                user_name: userName,
                assignment_title: assignment.title,
                assignment_description: assignment.description || 'No description provided',
                due_date: dueDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                due_time: dueDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                hours_until_due: Math.ceil(hoursUntilDue),
                subject_name: assignment.subjectName || 'Unknown Subject',
                urgency: hoursUntilDue <= 6 ? 'URGENT' : hoursUntilDue <= 24 ? 'HIGH' : 'MEDIUM'
            };

            const response = await emailjs.send(
                this.serviceID,
                this.templateID,
                templateParams
            );

            console.log('Email sent successfully:', response);
            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }

    /**
     * Send email notification for overdue assignment
     * @param {Object} assignment - Assignment object
     * @param {string} userEmail - User's email address
     * @param {string} userName - User's name
     * @param {number} daysSinceOverdue - Days since assignment was due
     */
    async sendOverdueEmail(assignment, userEmail, userName, daysSinceOverdue) {
        if (!this.initialized) {
            console.warn('EmailJS not initialized yet');
            return false;
        }

        try {
            const dueDate = new Date(assignment.dueDate);
            const templateParams = {
                to_email: userEmail,
                user_name: userName,
                assignment_title: assignment.title,
                assignment_description: assignment.description || 'No description provided',
                due_date: dueDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                days_overdue: Math.ceil(daysSinceOverdue),
                subject_name: assignment.subjectName || 'Unknown Subject',
                email_type: 'overdue'
            };

            const response = await emailjs.send(
                this.serviceID,
                'template_overdue_assignment', // Different template for overdue
                templateParams
            );

            console.log('Overdue email sent successfully:', response);
            return true;
        } catch (error) {
            console.error('Failed to send overdue email:', error);
            return false;
        }
    }

    /**
     * Send batch email to multiple users (for teachers/admins)
     * @param {Array} recipients - Array of {email, name} objects
     * @param {Object} assignment - Assignment object
     * @param {string} messageType - 'upcoming' or 'overdue'
     */
    async sendBatchEmail(recipients, assignment, messageType = 'upcoming') {
        const results = [];
        for (const recipient of recipients) {
            const result = await this.sendDueDateEmail(
                assignment,
                recipient.email,
                recipient.name,
                messageType === 'overdue' ? -1 : 24
            );
            results.push({
                email: recipient.email,
                success: result
            });
        }
        return results;
    }
}

// Create global instance
const emailService = new EmailNotificationService();
