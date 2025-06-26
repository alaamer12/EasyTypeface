const toggleAllBtn = document.querySelector('.toggle-all-btn');
const allCards = document.querySelectorAll('.font-card');
let allExpanded = false;

toggleAllBtn.addEventListener('click', () => {
    allExpanded = !allExpanded;
    allCards.forEach(card => {
        if (allExpanded) {
            card.classList.add('expanded');
        } else {
            card.classList.remove('expanded');
        }
    });
    toggleAllBtn.classList.toggle('expanded');
    toggleAllBtn.querySelector('.text').textContent = allExpanded ? 'Collapse All' : 'Toggle All';
});

document.querySelectorAll('.font-card').forEach(card => {
    const toggleBtn = card.querySelector('.toggle-btn');
    const content = card.querySelector('.font-card-content');
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('expanded');
    });

    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });
});

const addFontBtn = document.querySelector('.add-font-btn');
const dialog = document.querySelector('#addFontDialog');
const dialogForm = dialog.querySelector('form');
const cancelBtn = dialog.querySelector('.cancel');

addFontBtn.addEventListener('click', () => {
    dialog.showModal();
});

cancelBtn.addEventListener('click', () => {
    dialog.close();
});

dialogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fontUrl = document.getElementById('fontUrl').value;
    const isRTL = document.getElementById('isRTL').checked;

    try {
        // Handle Google Fonts URL
        if (!fontUrl.includes('fonts.googleapis.com')) {
            throw new Error('Please provide a valid Google Fonts URL');
        }

        // Parse URL and get all font families
        const urlParams = new URLSearchParams(fontUrl.split('?')[1]);
        const fontFamilies = urlParams.getAll('family');
        if (!fontFamilies.length) {
            throw new Error('Invalid Google Fonts URL format');
        }

        console.log('Found font families:', fontFamilies);

        // Process each font family
        for (const familyParam of fontFamilies) {
            console.log('Processing font family:', familyParam);
            
            // Parse font details
            const [fontFamily, variationString] = familyParam.split(':');
            const fontName = fontFamily.replace(/\+/g, ' ');
            console.log('Font name:', fontName, 'Variations:', variationString);

            // Parse variations
            let weights = ['400']; // Default weight
            let hasItalic = false;
            let italicWeights = new Set(); // Track which weights have italic

            if (variationString) {
                if (variationString.includes('@')) {
                    // Handle format: ital,wght@0,400..800;1,400..800
                    const variations = variationString.split('@')[1].split(';');
                    for (const variation of variations) {
                        const [features, range] = variation.split(',');
                        if (range && range.includes('..')) {
                            const [min, max] = range.split('..').map(Number);
                            const step = (max - min) <= 300 ? 100 : 100;
                            for (let w = min; w <= max; w += step) {
                                weights.push(w.toString());
                            }
                            if (!weights.includes(max.toString())) {
                                weights.push(max.toString());
                            }
                            // If this is an italic variation (features starts with 1)
                            if (features.startsWith('1')) {
                                weights.forEach(w => italicWeights.add(w));
                                hasItalic = true;
                            }
                        }
                    }
                    // Remove duplicates and sort weights
                    weights = [...new Set(weights)].sort((a, b) => Number(a) - Number(b));
                } else {
                    // Handle the URLSearchParams format
                    const params = new URLSearchParams(variationString);
                    if (params.has('wght')) {
                        const weightParam = params.get('wght');
                        if (weightParam.includes('..')) {
                            const [min, max] = weightParam.split('..').map(Number);
                            weights = [];
                            const step = (max - min) <= 300 ? 100 : 100;
                            for (let w = min; w <= max; w += step) {
                                weights.push(w.toString());
                            }
                            if (!weights.includes(max.toString())) {
                                weights.push(max.toString());
                            }
                        } else {
                            weights = weightParam.split(';').filter(w => w);
                        }
                    }
                    if (params.has('ital')) {
                        hasItalic = true;
                        // All weights have italic in this format
                        weights.forEach(w => italicWeights.add(w));
                    }
                }
            }

            console.log('Weights:', weights, 'Italic weights:', [...italicWeights]);

            // Add font stylesheet if not already added
            const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
            if (!existingLink) {
                console.log('Adding stylesheet:', fontUrl);
                const linkEl = document.createElement('link');
                linkEl.rel = 'stylesheet';
                linkEl.href = fontUrl;
                document.head.appendChild(linkEl);

                // Wait for font to load
                await new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('Font loading timed out'));
                    }, 5000);

                    linkEl.onload = async () => {
                        console.log('Stylesheet loaded for:', fontName);
                        clearTimeout(timeoutId);
                        
                        setTimeout(async () => {
                            try {
                                const font = new FontFaceObserver(fontName);
                                await font.load(null, 3000);
                                console.log('Font loaded successfully:', fontName);
                                resolve();
                            } catch (err) {
                                console.error('Font loading error:', err);
                                reject(new Error('Font failed to load properly'));
                            }
                        }, 100);
                    };

                    linkEl.onerror = (err) => {
                        console.error('Stylesheet loading error:', err);
                        clearTimeout(timeoutId);
                        reject(new Error('Failed to load font stylesheet'));
                    };
                });
            }

            // Create new font card
            console.log('Creating font card for:', fontName);
            const fontCard = document.createElement('div');
            fontCard.className = 'font-card';
            
            // Generate a random pastel background color
            const hue = Math.floor(Math.random() * 360);
            fontCard.style.backgroundColor = `hsl(${hue}, 60%, 90%)`;

            // Sample text based on direction
            const sampleText = isRTL ? 'مرحبا بكم في عالم الخطوط الجميلة' : 'The quick brown fox jumps over the lazy dog';

            // Create variations HTML
            const variationsHTML = weights.map(weight => `
                <div class="variation">
                    <div class="variation-label">Weight ${weight}</div>
                    <div class="font-example" style="font-family: '${fontName}'; font-weight: ${weight}; direction: ${isRTL ? 'rtl' : 'ltr'}">${sampleText}</div>
                    ${italicWeights.has(weight) ? `
                        <div class="variation-label">Italic Weight ${weight}</div>
                        <div class="font-example" style="font-family: '${fontName}'; font-weight: ${weight}; font-style: italic; direction: ${isRTL ? 'rtl' : 'ltr'}">${sampleText}</div>
                    ` : ''}
                </div>
            `).join('');

            fontCard.innerHTML = `
                <div class="font-card-header">
                    <div class="font-header-content">
                        <div class="font-name">${fontName}</div>
                        <div class="preview-text" style="font-family: '${fontName}'; direction: ${isRTL ? 'rtl' : 'ltr'}">${sampleText}</div>
                    </div>
                    <button class="toggle-btn">▼</button>
                </div>
                <div class="font-card-content">
                    <div class="font-variations">
                        ${variationsHTML}
                    </div>
                </div>
            `;

            // Add event listener to toggle button
            const toggleBtn = fontCard.querySelector('.toggle-btn');
            toggleBtn.addEventListener('click', () => {
                fontCard.classList.toggle('expanded');
            });

            // Add the new card to the showcase
            document.querySelector('.font-showcase').appendChild(fontCard);
        }

        // Reset form and close dialog
        dialogForm.reset();
        dialog.close();

    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Font loading error:', error);
    }
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const iconSun = document.querySelector('.icon-sun');
const iconMoon = document.querySelector('.icon-moon');

// Check for saved theme preference or use system preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle icons
    if (newTheme === 'dark') {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
    } else {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
    }
});

// Toast notification system
const toastContainer = document.querySelector('.toast-container');

function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentNode === toastContainer) {
            toast.remove();
        }
    }, duration);
    
    return toast;
}

// FontManager class for handling fonts
class FontManager {
    constructor() {
        this.loadedFonts = new Set();
        this.defaultSampleText = 'The quick brown fox jumps over the lazy dog';
        this.defaultRTLText = 'مرحبا بكم في عالم الخطوط الجميلة';
        this.fontCardTemplate = document.getElementById('font-card-template');
        this.variationTemplate = document.getElementById('variation-template');
        this.fontShowcase = document.querySelector('.font-showcase');
    }

    async loadFont(url, isRTL = false) {
        try {
            // Validate URL
            if (!url.includes('fonts.googleapis.com')) {
                throw new Error('Please provide a valid Google Fonts URL');
            }

            // Parse URL and get font families
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const fontFamilies = urlParams.getAll('family');
            
            if (!fontFamilies.length) {
                throw new Error('Invalid Google Fonts URL format');
            }

            // Add stylesheet if not already added
            const existingLink = document.querySelector(`link[href="${url}"]`);
            if (!existingLink) {
                await this.addStylesheet(url);
            }

            // Process each font family
            for (const familyParam of fontFamilies) {
                await this.processFontFamily(familyParam, isRTL);
            }

            return true;
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Font loading error:', error);
            return false;
        }
    }

    async addStylesheet(url) {
        return new Promise((resolve, reject) => {
            const linkEl = document.createElement('link');
            linkEl.rel = 'stylesheet';
            linkEl.href = url;
            
            const timeoutId = setTimeout(() => {
                reject(new Error('Font stylesheet loading timed out'));
            }, 5000);

            linkEl.onload = () => {
                clearTimeout(timeoutId);
                resolve();
            };

            linkEl.onerror = () => {
                clearTimeout(timeoutId);
                reject(new Error('Failed to load font stylesheet'));
            };

            document.head.appendChild(linkEl);
        });
    }

    async processFontFamily(familyParam, isRTL) {
        try {
            // Parse font details
            const [fontFamily, variationString] = familyParam.split(':');
            const fontName = fontFamily.replace(/\+/g, ' ');
            
            // Check if font is already loaded
            if (this.loadedFonts.has(fontName)) {
                showToast(`Font "${fontName}" is already loaded`, 'info');
                return;
            }

            // Parse variations
            const variations = this.parseVariations(variationString);
            
            // Wait for font to load
            await this.waitForFontLoad(fontName);
            
            // Create font card
            this.createFontCard(fontName, variations, isRTL);
            
            // Mark font as loaded
            this.loadedFonts.add(fontName);
            
            showToast(`Font "${fontName}" loaded successfully`, 'success');
        } catch (error) {
            throw new Error(`Failed to process font family: ${error.message}`);
        }
    }

    parseVariations(variationString) {
        let weights = ['400']; // Default weight
        let hasItalic = false;
        let italicWeights = new Set(); // Track which weights have italic

        if (!variationString) {
            return { weights, hasItalic, italicWeights };
        }

        if (variationString.includes('@')) {
            // Handle format: ital,wght@0,400..800;1,400..800
            const variations = variationString.split('@')[1].split(';');
            for (const variation of variations) {
                const [features, range] = variation.split(',');
                if (range && range.includes('..')) {
                    const [min, max] = range.split('..').map(Number);
                    const step = (max - min) <= 300 ? 100 : 100;
                    for (let w = min; w <= max; w += step) {
                        weights.push(w.toString());
                    }
                    if (!weights.includes(max.toString())) {
                        weights.push(max.toString());
                    }
                    // If this is an italic variation (features starts with 1)
                    if (features.startsWith('1')) {
                        weights.forEach(w => italicWeights.add(w));
                        hasItalic = true;
                    }
                }
            }
        } else {
            // Handle the URLSearchParams format
            const params = new URLSearchParams(variationString);
            if (params.has('wght')) {
                const weightParam = params.get('wght');
                if (weightParam.includes('..')) {
                    const [min, max] = weightParam.split('..').map(Number);
                    weights = [];
                    const step = (max - min) <= 300 ? 100 : 100;
                    for (let w = min; w <= max; w += step) {
                        weights.push(w.toString());
                    }
                    if (!weights.includes(max.toString())) {
                        weights.push(max.toString());
                    }
                } else {
                    weights = weightParam.split(';').filter(w => w);
                }
            }
            if (params.has('ital')) {
                hasItalic = true;
                // All weights have italic in this format
                weights.forEach(w => italicWeights.add(w));
            }
        }

        // Remove duplicates and sort weights
        weights = [...new Set(weights)].sort((a, b) => Number(a) - Number(b));
        
        return { weights, hasItalic, italicWeights: [...italicWeights] };
    }

    async waitForFontLoad(fontName) {
        try {
            const font = new FontFaceObserver(fontName);
            await font.load(null, 3000);
        } catch (error) {
            throw new Error(`Font "${fontName}" failed to load properly`);
        }
    }

    createFontCard(fontName, variations, isRTL) {
        // Clone the template
        const fontCard = this.fontCardTemplate.content.cloneNode(true);
        const card = fontCard.querySelector('.font-card');
        
        // Generate a random pastel background color
        const hue = Math.floor(Math.random() * 360);
        card.style.backgroundColor = `hsl(${hue}, 60%, 90%)`;
        
        // Sample text based on direction
        const sampleText = isRTL ? this.defaultRTLText : this.defaultSampleText;
        const direction = isRTL ? 'rtl' : 'ltr';
        
        // Set font name and preview text
        card.querySelector('.font-name').textContent = fontName;
        const previewText = card.querySelector('.preview-text');
        previewText.textContent = isRTL ? this.defaultRTLText.split(' ').slice(0, 3).join(' ') : 'The quick brown fox';
        previewText.style.fontFamily = `'${fontName}'`;
        previewText.style.direction = direction;
        
        // Set main example text
        const fontExample = card.querySelector('.font-example');
        fontExample.textContent = sampleText;
        fontExample.style.fontFamily = `'${fontName}'`;
        fontExample.style.direction = direction;
        
        // Set RTL text if applicable
        const rtlText = card.querySelector('.rtl-text');
        if (isRTL) {
            rtlText.textContent = this.defaultRTLText;
            rtlText.style.fontFamily = `'${fontName}'`;
        } else {
            rtlText.style.display = 'none';
        }
        
        // Create variations
        this.createVariations(card, fontName, variations, sampleText, direction);
        
        // Add details and license info
        card.querySelector('.font-details').textContent = this.getFontDescription(fontName);
        card.querySelector('.font-license').textContent = 'License: Google Fonts';
        
        // Add event listeners
        this.addCardEventListeners(card);
        
        // Add to showcase
        this.fontShowcase.appendChild(card);
    }

    createVariations(card, fontName, variations, sampleText, direction) {
        const variationsContainer = card.querySelector('.font-variations');
        const { weights, hasItalic, italicWeights } = variations;
        
        weights.forEach(weight => {
            // Regular weight
            const regularVariation = this.variationTemplate.content.cloneNode(true);
            const regularLabel = regularVariation.querySelector('.variation-label');
            regularLabel.textContent = `Weight ${weight}`;
            
            const regularExample = regularVariation.querySelector('.font-example');
            regularExample.textContent = sampleText;
            regularExample.style.fontFamily = `'${fontName}'`;
            regularExample.style.fontWeight = weight;
            regularExample.style.direction = direction;
            
            variationsContainer.appendChild(regularVariation);
            
            // Italic version if available
            if (hasItalic && italicWeights.includes(weight)) {
                const italicVariation = this.variationTemplate.content.cloneNode(true);
                const italicLabel = italicVariation.querySelector('.variation-label');
                italicLabel.textContent = `Italic Weight ${weight}`;
                
                const italicExample = italicVariation.querySelector('.font-example');
                italicExample.textContent = sampleText;
                italicExample.style.fontFamily = `'${fontName}'`;
                italicExample.style.fontWeight = weight;
                italicExample.style.fontStyle = 'italic';
                italicExample.style.direction = direction;
                
                variationsContainer.appendChild(italicVariation);
            }
        });
    }

    getFontDescription(fontName) {
        // Simple description based on font name
        if (fontName.toLowerCase().includes('serif')) {
            return 'A beautiful serif font with elegant character shapes';
        } else if (fontName.toLowerCase().includes('sans')) {
            return 'A clean sans-serif font perfect for modern designs';
        } else if (fontName.toLowerCase().includes('mono')) {
            return 'A monospace font ideal for code and technical content';
        } else if (fontName.toLowerCase().includes('display')) {
            return 'A display font designed for headlines and attention-grabbing text';
        } else {
            return 'A versatile font suitable for various design applications';
        }
    }

    addCardEventListeners(card) {
        const toggleBtn = card.querySelector('.toggle-btn');
        
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.toggle('expanded');
        });

        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    }
}

// Initialize FontManager
const fontManager = new FontManager();

// Default fonts data
const defaultFonts = [
    {
        name: 'Genty Demo',
        className: 'genty',
        details: 'A beautiful custom font with unique characteristics',
        license: 'Personal Use Only (Commercial license available)',
        isCustom: true
    },
    {
        name: 'Playfair Display',
        className: 'playfair',
        details: 'A sophisticated serif font perfect for headlines and editorial design',
        license: 'Open Source (SIL Open Font License)'
    },
    {
        name: 'Roboto',
        className: 'roboto',
        details: 'Google\'s signature font, known for its clean and modern appearance',
        license: 'Open Source (Apache License 2.0)'
    },
    {
        name: 'Inter',
        className: 'inter',
        details: 'A versatile sans-serif designed for computer screens',
        license: 'Open Source (SIL Open Font License)'
    },
    {
        name: 'Lora',
        className: 'lora',
        details: 'An elegant serif font with brushed curves and balanced contrast',
        license: 'Open Source (SIL Open Font License)'
    },
    {
        name: 'Montserrat',
        className: 'montserrat',
        details: 'A geometric sans-serif with a contemporary feel',
        license: 'Open Source (SIL Open Font License)'
    },
    {
        name: 'Noto Naskh Arabic',
        className: 'naskh',
        details: 'A beautiful Arabic font optimized for excellent readability',
        license: 'Open Source (SIL Open Font License)',
        isRTL: true
    },
    {
        name: 'Cairo',
        className: 'cairo',
        details: 'A contemporary Arabic font with a modern feel',
        license: 'Open Source (SIL Open Font License)',
        isRTL: true
    }
];

// Load default fonts
function loadDefaultFonts() {
    defaultFonts.forEach(font => {
        createDefaultFontCard(font);
    });
}

// Create a font card for default fonts
function createDefaultFontCard(fontData) {
    const { name, className, details, license, isRTL = false, isCustom = false } = fontData;
    
    // Clone the template
    const fontCard = document.getElementById('font-card-template').content.cloneNode(true);
    const card = fontCard.querySelector('.font-card');
    
    // Sample text based on direction
    const sampleText = isRTL 
        ? 'ولما كان تناسي حقوق الإنسان وازدراؤها قد أفضيا إلى أعمال همجية'
        : 'The quick brown fox jumps over the lazy dog';
    const shortText = isRTL ? 'ولما كان تناسي' : 'The quick brown fox';
    
    // Set font name and preview text
    card.querySelector('.font-name').textContent = name;
    const previewText = card.querySelector('.preview-text');
    previewText.textContent = shortText;
    previewText.classList.add(className);
    if (isRTL) {
        previewText.style.direction = 'rtl';
    }
    
    // Set main example text
    const fontExample = card.querySelector('.font-example');
    fontExample.textContent = sampleText;
    fontExample.classList.add(className);
    if (isRTL) {
        fontExample.classList.add('rtl-text');
    }
    
    // Set RTL text if applicable
    const rtlText = card.querySelector('.rtl-text');
    if (isRTL) {
        rtlText.textContent = sampleText;
        rtlText.classList.add(className);
    } else {
        rtlText.textContent = 'ولما كان تناسي حقوق الإنسان وازدراؤها قد أفضيا إلى أعمال همجية';
        rtlText.classList.add(className);
    }
    
    // Create variations
    const variationsContainer = card.querySelector('.font-variations');
    
    // Regular weight
    const regularVariation = document.getElementById('variation-template').content.cloneNode(true);
    regularVariation.querySelector('.variation-label').textContent = 'Regular';
    const regularExample = regularVariation.querySelector('.font-example');
    regularExample.textContent = sampleText;
    regularExample.classList.add(className);
    regularExample.style.fontWeight = '400';
    if (isRTL) regularExample.style.direction = 'rtl';
    variationsContainer.appendChild(regularVariation);
    
    // Bold weight
    if (!isCustom || className !== 'genty') {
        const boldVariation = document.getElementById('variation-template').content.cloneNode(true);
        boldVariation.querySelector('.variation-label').textContent = 'Bold';
        const boldExample = boldVariation.querySelector('.font-example');
        boldExample.textContent = sampleText;
        boldExample.classList.add(className);
        boldExample.style.fontWeight = '700';
        if (isRTL) boldExample.style.direction = 'rtl';
        variationsContainer.appendChild(boldVariation);
    }
    
    // Italic
    const italicVariation = document.getElementById('variation-template').content.cloneNode(true);
    italicVariation.querySelector('.variation-label').textContent = 'Italic';
    const italicExample = italicVariation.querySelector('.font-example');
    italicExample.textContent = sampleText;
    italicExample.classList.add(className);
    italicExample.style.fontStyle = 'italic';
    if (isRTL) italicExample.style.direction = 'rtl';
    variationsContainer.appendChild(italicVariation);
    
    // Bold Italic
    if (!isCustom || className !== 'genty') {
        const boldItalicVariation = document.getElementById('variation-template').content.cloneNode(true);
        boldItalicVariation.querySelector('.variation-label').textContent = 'Bold Italic';
        const boldItalicExample = boldItalicVariation.querySelector('.font-example');
        boldItalicExample.textContent = sampleText;
        boldItalicExample.classList.add(className);
        boldItalicExample.style.fontWeight = '700';
        boldItalicExample.style.fontStyle = 'italic';
        if (isRTL) boldItalicExample.style.direction = 'rtl';
        variationsContainer.appendChild(boldItalicVariation);
    }
    
    // Add details and license info
    card.querySelector('.font-details').textContent = details;
    card.querySelector('.font-license').textContent = `License: ${license}`;
    
    // Add event listeners
    const toggleBtn = card.querySelector('.toggle-btn');
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('expanded');
    });

    card.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });
    
    // Add to showcase
    document.querySelector('.font-showcase').appendChild(card);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadDefaultFonts();
    
    // Setup add font dialog
    const addFontBtn = document.querySelector('.add-font-btn');
    const dialog = document.querySelector('#addFontDialog');
    const dialogForm = dialog.querySelector('form');
    const cancelBtn = dialog.querySelector('.cancel');

    addFontBtn.addEventListener('click', () => {
        dialog.showModal();
    });

    cancelBtn.addEventListener('click', () => {
        dialog.close();
    });

    dialogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fontUrl = document.getElementById('fontUrl').value;
        const isRTL = document.getElementById('isRTL').checked;

        // Show loading toast
        const loadingToast = showToast('Loading font...', 'info');
        
        try {
            const success = await fontManager.loadFont(fontUrl, isRTL);
            
            if (success) {
                // Reset form and close dialog
                dialogForm.reset();
                dialog.close();
            }
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Font loading error:', error);
        } finally {
            // Remove loading toast
            loadingToast.remove();
        }
    });
    
    // Setup toggle all button
    const toggleAllBtn = document.querySelector('.toggle-all-btn');
    let allExpanded = false;

    toggleAllBtn.addEventListener('click', () => {
        allExpanded = !allExpanded;
        document.querySelectorAll('.font-card').forEach(card => {
            if (allExpanded) {
                card.classList.add('expanded');
            } else {
                card.classList.remove('expanded');
            }
        });
        toggleAllBtn.classList.toggle('expanded');
        toggleAllBtn.querySelector('.text').textContent = allExpanded ? 'Collapse All' : 'Toggle All';
    });
});