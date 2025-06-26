# EasyTypeface

<div align="center">
  <img src="assets/logo.svg" alt="EasyTypeface Logo" width="100" height="100">
</div>

A beautiful, responsive showcase for exploring and testing web fonts. EasyTypeface allows you to visualize and compare different typefaces with support for multiple weights, styles, and RTL languages.

## Features

- 🎨 **Beautiful Font Cards**: Visually appealing cards with sample text for each font
- 🌓 **Dark/Light Theme**: Toggle between dark and light modes for different viewing experiences
- 🔍 **Font Details**: View font variations, weights, and styles
- 🌐 **RTL Support**: Full support for right-to-left languages
- ➕ **Add Custom Fonts**: Easily add Google Fonts to your showcase
- 📱 **Fully Responsive**: Works beautifully on all screen sizes
- ♿ **Accessibility**: Built with accessibility in mind

## Getting Started

### Prerequisites

No special prerequisites are needed. The application runs directly in the browser.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/alaamer12/EasyTypefacee.git
   ```

2. Open `index.html` in your web browser.

### Usage

- **View Font Details**: Click on any font card to expand and see all variations
- **Toggle All Cards**: Use the "Toggle All" button to expand or collapse all font cards
- **Add New Fonts**: Click "Add Font" and enter a Google Fonts URL
- **Switch Themes**: Use the theme toggle button in the bottom right corner

## Adding Custom Fonts

To add a new font from Google Fonts:

1. Visit [Google Fonts](https://fonts.google.com/)
2. Select your desired font and variations
3. Copy the provided URL (from the "link" tab in the Google Fonts interface)
4. In EasyTypeface, click "Add Font" and paste the URL
5. Check "RTL" if the font is for right-to-left languages
6. Click "Add Font" to add it to your showcase

## Project Structure

```
EasyTypefacee/
├── index.html        # Main HTML file
├── style.css         # Styles and theming
├── script.js         # JavaScript functionality
├── logo.svg          # Project logo
├── favicon.svg       # Favicon
├── fonts/            # Custom font files
│   └── GentyDemo-Regular.ttf
└── README.md         # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Fonts](https://fonts.google.com/) for providing free, open-source fonts
- [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) for font loading detection 