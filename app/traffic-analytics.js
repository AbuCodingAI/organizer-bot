// Traffic Analytics - DevTools Command
// Usage: traffic(days) - shows user count for specified days

class TrafficAnalytics {
    constructor() {
        this.storageKey = 'traffic_data';
        this.init();
    }

    init() {
        // Initialize traffic tracking
        this.trackUserVisit();

        // Expose traffic command to window for devtools access
        window.traffic = (days = 1) => this.getTraffic(days);

        console.log('%c📊 Traffic Analytics Ready', 'color: #007aff; font-weight: bold;');
        console.log('%cUsage: traffic(days) - Example: traffic(7) for last 7 days', 'color: #666;');
    }

    /**
     * Track user visit with timestamp
     */
    trackUserVisit() {
        const today = this.getDateKey(new Date());
        const trafficData = this.getTrafficData();

        if (!trafficData[today]) {
            trafficData[today] = {
                date: today,
                uniqueUsers: new Set(),
                sessions: 0,
                firstVisit: new Date().toISOString()
            };
        }

        // Get or create user ID
        let userId = localStorage.getItem('user_traffic_id');
        if (!userId) {
            userId = this.generateUserId();
            localStorage.setItem('user_traffic_id', userId);
        }

        // Track unique user
        if (!trafficData[today].uniqueUsers) {
            trafficData[today].uniqueUsers = new Set();
        }
        trafficData[today].uniqueUsers.add(userId);
        trafficData[today].sessions = (trafficData[today].sessions || 0) + 1;

        this.saveTrafficData(trafficData);
    }

    /**
     * Get traffic data for specified number of days
     * @param {number} days - Number of days to retrieve
     * @returns {Object} Traffic statistics
     */
    getTraffic(days = 1) {
        const trafficData = this.getTrafficData();
        const result = {
            period: `Last ${days} day${days !== 1 ? 's' : ''}`,
            totalUsers: 0,
            totalSessions: 0,
            dailyBreakdown: [],
            averageUsersPerDay: 0
        };

        // Get dates for the period
        const dates = this.getDateRange(days);

        dates.forEach(date => {
            const dateKey = this.getDateKey(date);
            const dayData = trafficData[dateKey];

            if (dayData) {
                const uniqueCount = dayData.uniqueUsers instanceof Set
                    ? dayData.uniqueUsers.size
                    : (Array.isArray(dayData.uniqueUsers) ? dayData.uniqueUsers.length : 0);

                result.dailyBreakdown.push({
                    date: dateKey,
                    users: uniqueCount,
                    sessions: dayData.sessions || 0
                });

                result.totalUsers += uniqueCount;
                result.totalSessions += (dayData.sessions || 0);
            }
        });

        result.averageUsersPerDay = result.dailyBreakdown.length > 0
            ? Math.round(result.totalUsers / result.dailyBreakdown.length)
            : 0;

        // Pretty print to console
        this.printTrafficReport(result);

        return result;
    }

    /**
     * Get traffic data from localStorage
     */
    getTrafficData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return {};

            const parsed = JSON.parse(data);

            // Convert Sets back from arrays
            Object.keys(parsed).forEach(key => {
                if (parsed[key].uniqueUsers && Array.isArray(parsed[key].uniqueUsers)) {
                    parsed[key].uniqueUsers = new Set(parsed[key].uniqueUsers);
                }
            });

            return parsed;
        } catch (error) {
            console.error('Error reading traffic data:', error);
            return {};
        }
    }

    /**
     * Save traffic data to localStorage
     */
    saveTrafficData(data) {
        try {
            // Convert Sets to arrays for JSON serialization
            const serializable = {};
            Object.keys(data).forEach(key => {
                serializable[key] = {
                    ...data[key],
                    uniqueUsers: data[key].uniqueUsers instanceof Set
                        ? Array.from(data[key].uniqueUsers)
                        : data[key].uniqueUsers
                };
            });

            localStorage.setItem(this.storageKey, JSON.stringify(serializable));
        } catch (error) {
            console.error('Error saving traffic data:', error);
        }
    }

    /**
     * Generate unique user ID
     */
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    /**
     * Get date key in YYYY-MM-DD format
     */
    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    /**
     * Get array of dates for the period
     */
    getDateRange(days) {
        const dates = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        return dates;
    }

    /**
     * Pretty print traffic report to console
     */
    printTrafficReport(result) {
        console.clear();
        console.log('%c═══════════════════════════════════════', 'color: #007aff; font-weight: bold;');
        console.log('%c📊 TRAFFIC ANALYTICS REPORT', 'color: #007aff; font-weight: bold; font-size: 16px;');
        console.log('%c═══════════════════════════════════════', 'color: #007aff; font-weight: bold;');
        console.log('');
        console.log(`%cPeriod: ${result.period}`, 'color: #666; font-weight: bold;');
        console.log('');
        console.log(`%c👥 Total Unique Users: ${result.totalUsers}`, 'color: #34c759; font-weight: bold; font-size: 14px;');
        console.log(`%c📈 Total Sessions: ${result.totalSessions}`, 'color: #007aff; font-weight: bold; font-size: 14px;');
        console.log(`%c📊 Average Users/Day: ${result.averageUsersPerDay}`, 'color: #ff9500; font-weight: bold; font-size: 14px;');
        console.log('');
        console.log('%c─── Daily Breakdown ───', 'color: #666; font-weight: bold;');

        result.dailyBreakdown.forEach(day => {
            const bar = '█'.repeat(Math.ceil(day.users / 2));
            console.log(`%c${day.date}: ${bar} ${day.users} users | ${day.sessions} sessions`, 'color: #007aff;');
        });

        console.log('');
        console.log('%c═══════════════════════════════════════', 'color: #007aff; font-weight: bold;');
        console.log('%cCommands:', 'color: #666; font-weight: bold;');
        console.log('%ctraffic()     - Last 1 day', 'color: #666;');
        console.log('%ctraffic(7)    - Last 7 days', 'color: #666;');
        console.log('%ctraffic(30)   - Last 30 days', 'color: #666;');
        console.log('%ctraffic(365)  - Last year', 'color: #666;');
        console.log('%c═══════════════════════════════════════', 'color: #007aff; font-weight: bold;');
    }

    /**
     * Clear all traffic data (admin only)
     */
    clearTrafficData() {
        if (confirm('Are you sure you want to clear all traffic data?')) {
            localStorage.removeItem(this.storageKey);
            console.log('%c✅ Traffic data cleared', 'color: #34c759;');
        }
    }

    /**
     * Export traffic data as JSON
     */
    exportTrafficData() {
        const data = this.getTrafficData();
        const serializable = {};

        Object.keys(data).forEach(key => {
            serializable[key] = {
                ...data[key],
                uniqueUsers: data[key].uniqueUsers instanceof Set
                    ? Array.from(data[key].uniqueUsers)
                    : data[key].uniqueUsers
            };
        });

        const json = JSON.stringify(serializable, null, 2);
        console.log('%cTraffic Data Export:', 'color: #007aff; font-weight: bold;');
        console.log(json);

        // Copy to clipboard
        navigator.clipboard.writeText(json).then(() => {
            console.log('%c✅ Copied to clipboard', 'color: #34c759;');
        });
    }
}

// Initialize traffic analytics
const trafficAnalytics = new TrafficAnalytics();
