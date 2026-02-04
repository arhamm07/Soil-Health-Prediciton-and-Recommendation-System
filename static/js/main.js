/**
 * SOIL.AI - Main JavaScript
 * Refactored for modern dark theme and glassmorphism UI
 */

document.addEventListener('DOMContentLoaded', function() {
    const soilForm = document.getElementById('soil-form');
    const fillSampleBtn = document.getElementById('fill-sample-data');
    const parameterChartCanvas = document.getElementById('parameterChart');

    // 1. Sample Data Autofill
    if (fillSampleBtn) {
        fillSampleBtn.addEventListener('click', function() {
            const samples = {
                'N': 95.5,
                'P': 18.2,
                'K': 210.0,
                'S': 14.5,
                'Zn': 1.2,
                'Fe': 8.5,
                'Cu': 0.45,
                'Mn': 3.2,
                'B': 0.85,
                'pH': 6.8,
                'EC': 0.45,
                'OC': 1.15
            };

            Object.entries(samples).forEach(([id, val]) => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = val;
                    // Trigger focus/blur for any visual effects
                    input.dispatchEvent(new Event('input'));
                }
            });
            
            showToast('Sample data applied successfully.', 'success');
        });
    }

    // 2. Form Submission & Loading State
    if (soilForm) {
        soilForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Analyzing...';
                submitBtn.disabled = true;
            }
        });
    }

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 4. Toast Notifications
    window.showToast = function(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(container);
        }

        const bgClass = type === 'success' ? 'bg-success' : 'bg-primary';
        const toastId = 'toast-' + Date.now();
        const html = `
            <div id="${toastId}" class="toast" role="alert">
                <div class="toast-header ${bgClass} text-white">
                    <strong class="me-auto">SOIL.AI</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body bg-dark text-white border-top border-secondary">
                    ${message}
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);
        const element = document.getElementById(toastId);
        const toast = new bootstrap.Toast(element);
        toast.show();
        
        element.addEventListener('hidden.bs.toast', () => element.remove());
    };

    if (parameterChartCanvas && window.Chart) {
        const raw = parameterChartCanvas.getAttribute('data-input');
        if (!raw) return;

        let inputData;
        try {
            inputData = JSON.parse(raw);
        } catch (e) {
            return;
        }

        const labels = Object.keys(inputData);
        const values = Object.values(inputData);
        let parameterChart = null;

        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

        function createRadarChart() {
            const ctx = parameterChartCanvas.getContext('2d');
            if (parameterChart) parameterChart.destroy();

            parameterChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Soil Chemical Composition',
                        data: values,
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { display: false }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        function createBarChart() {
            const ctx = parameterChartCanvas.getContext('2d');
            if (parameterChart) parameterChart.destroy();

            parameterChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true },
                        x: { grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        createRadarChart();

        const radarChartBtn = document.getElementById('radarChartBtn');
        const barChartBtn = document.getElementById('barChartBtn');

        if (radarChartBtn && barChartBtn) {
            radarChartBtn.addEventListener('click', function() {
                this.classList.add('active');
                barChartBtn.classList.remove('active');
                createRadarChart();
            });

            barChartBtn.addEventListener('click', function() {
                this.classList.add('active');
                radarChartBtn.classList.remove('active');
                createBarChart();
            });
        }
    }
});
