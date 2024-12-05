// Settings management
class Settings {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    loadSettings() {
        const defaultSettings = {
            unit: 'C',
            darkMode: false
        };
        return JSON.parse(localStorage.getItem('weatherSettings')) || defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('weatherSettings', JSON.stringify(this.settings));
    }

    init() {
        // Initialize toggles
        document.getElementById('unitToggle').checked = this.settings.unit === 'F';
        document.getElementById('darkModeToggle').checked = this.settings.darkMode;

        // Apply initial settings
        this.applyDarkMode(this.settings.darkMode);

        // Add event listeners
        document.getElementById('unitToggle').addEventListener('change', (e) => {
            this.settings.unit = e.target.checked ? 'F' : 'C';
            this.saveSettings();
            updateTemperatureDisplay();
        });

        document.getElementById('darkModeToggle').addEventListener('change', (e) => {
            this.settings.darkMode = e.target.checked;
            this.saveSettings();
            this.applyDarkMode(e.target.checked);
        });
    }

    applyDarkMode(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    getUnit() {
        return this.settings.unit;
    }
}

// Settings modal management
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
}

// Initialize settings
const settingsManager = new Settings();