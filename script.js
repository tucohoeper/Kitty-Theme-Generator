document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const saveBtn = document.getElementById('save-btn');
    const colorPaletteDiv = document.getElementById('color-palette');
    const terminalPreview = document.getElementById('terminal-preview');

    let currentThemeColors = {}; // Store the currently generated theme

    // Helper function to convert HSL to Hex
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and pad with 0
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    // Function to generate colors with golden ratio harmony
    function generateGoldenRatioColors(baseHue, count, saturation, lightness) {
        const colors = [];
        const goldenRatioConjugate = 0.618033988749895; // 1 / golden ratio
        let hue = baseHue;

        for (let i = 0; i < count; i++) {
            hue = (hue + goldenRatioConjugate * 360) % 360;
            colors.push(hslToHex(hue, saturation, lightness));
        }
        return colors;
    }

    // Function to generate a very dark background color
    function generateDarkBackgroundColor() {
        const h = Math.floor(Math.random() * 360); // Random hue
        const s = Math.floor(Math.random() * 20) + 10; // Low saturation (10-30)
        const l = Math.floor(Math.random() * 10) + 5; // Very low lightness (5-15)
        return hslToHex(h, s, l);
    }

    // Function to update the color palette display
    function updateColorPaletteUI(colors) {
        colorPaletteDiv.innerHTML = ''; // Clear existing colors
        Object.entries(colors).forEach(([name, hex]) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'w-20 h-20 rounded-lg cursor-pointer flex items-center justify-center text-xs font-semibold relative';
            colorBox.style.backgroundColor = hex;
            colorBox.title = `${name}: ${hex}`; // Show name and hex on hover
            colorBox.textContent = name; // Display color name
            colorBox.style.color = (parseInt(hex.substring(1), 16) > 0xffffff / 2) ? '#000000' : '#ffffff'; // Adjust text color for contrast

            colorBox.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from propagating to document

                // If a color input already exists, remove it first
                const existingColorInput = colorBox.querySelector('input[type="color"]');
                if (existingColorInput) {
                    colorBox.removeChild(existingColorInput);
                }

                // Create a hidden color input
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = hex;
                colorInput.style.position = 'absolute';
                colorInput.style.top = '0';
                colorInput.style.left = '0';
                colorInput.style.width = '100%';
                colorInput.style.height = '100%';
                colorInput.style.opacity = '0';
                colorInput.style.cursor = 'pointer';

                colorBox.appendChild(colorInput);
                colorInput.focus(); // Focus the input to ensure it's active
                colorInput.click(); // Programmatically click the color input to open the picker

                // Add a visual cue when the color picker is active
                colorBox.style.border = '2px solid #3B82F6'; // Tailwind blue-500

                const handleColorChange = (e) => {
                    const newColor = e.target.value;
                    colorBox.style.backgroundColor = newColor;
                    colorBox.title = `${name}: ${newColor}`;
                    colorBox.style.color = (parseInt(newColor.substring(1), 16) > 0xffffff / 2) ? '#000000' : '#ffffff';
                    currentThemeColors[name] = newColor;
                    updateTerminalPreview(currentThemeColors);
                };

                colorInput.addEventListener('input', handleColorChange);
                colorInput.addEventListener('change', handleColorChange); // Also listen to change for final value

                // Remove the color input when it loses focus (e.g., picker is closed)
                const removeInputOnBlur = () => {
                    if (colorBox.contains(colorInput)) {
                        colorBox.removeChild(colorInput);
                    }
                    colorInput.removeEventListener('input', handleColorChange);
                    colorInput.removeEventListener('change', handleColorChange);
                    colorInput.removeEventListener('blur', removeInputOnBlur);
                    colorBox.style.border = 'none'; // Remove the visual cue
                };
                colorInput.addEventListener('blur', removeInputOnBlur);
            });
            colorPaletteDiv.appendChild(colorBox);
        });
    }

    // Function to update the terminal preview
    function updateTerminalPreview(colors) {
        terminalPreview.style.backgroundColor = colors.background;
        terminalPreview.style.color = colors.foreground;

        // Update specific color spans in the preview
        const previewSpans = terminalPreview.querySelectorAll('span');
        previewSpans.forEach(span => {
            if (span.classList.contains('text-green-400')) span.style.color = colors.color2; // green
            else if (span.classList.contains('text-blue-400')) span.style.color = colors.color4; // blue
            else if (span.classList.contains('text-red-400')) span.style.color = colors.color1; // red
            else if (span.classList.contains('text-yellow-400')) span.style.color = colors.color3; // yellow
            else if (span.classList.contains('text-cyan-400')) span.style.color = colors.color6; // cyan
            else if (span.classList.contains('text-purple-400')) span.style.color = colors.color5; // magenta
            else if (span.classList.contains('text-gray-300')) span.style.color = colors.color7; // light gray
            else if (span.classList.contains('text-white')) span.style.color = colors.foreground; // white/foreground
        });
    }

    // Main function to generate a theme
    function generateTheme() {
        console.log('Generating theme...');

        const baseHue = Math.floor(Math.random() * 360); // Random starting hue
        const pastelSaturation = Math.floor(Math.random() * 30) + 60; // Pastel saturation (60-90)
        const pastelLightness = Math.floor(Math.random() * 20) + 70; // Pastel lightness (70-90)

        const goldenColors = generateGoldenRatioColors(baseHue, 16, pastelSaturation, pastelLightness);

        const themeColors = {
            background: generateDarkBackgroundColor(),
            foreground: goldenColors[0], // Use one of the golden ratio colors for foreground
            color0: generateDarkBackgroundColor(), // Black (darker than background)
            color1: goldenColors[1], // Red
            color2: goldenColors[2], // Green
            color3: goldenColors[3], // Yellow
            color4: goldenColors[4], // Blue
            color5: goldenColors[5], // Magenta
            color6: goldenColors[6], // Cyan
            color7: goldenColors[7], // White (lightest pastel)
            color8: goldenColors[8], // Bright Black
            color9: goldenColors[9], // Bright Red
            color10: goldenColors[10], // Bright Green
            color11: goldenColors[11], // Bright Yellow
            color12: goldenColors[12], // Bright Blue
            color13: goldenColors[13], // Bright Magenta
            color14: goldenColors[14], // Bright Cyan
            color15: goldenColors[15]  // Bright White
        };

        currentThemeColors = themeColors; // Store the generated theme
        updateColorPaletteUI(currentThemeColors);
        updateTerminalPreview(currentThemeColors);
    }

    // Main function to save the theme
    function saveTheme() {
        if (Object.keys(currentThemeColors).length === 0) {
            alert('Please generate a theme first!');
            return;
        }

        let kittyConfigContent = '';
        for (const [key, value] of Object.entries(currentThemeColors)) {
            kittyConfigContent += `${key} ${value}\n`;
        }

        const randomChars = Math.random().toString(36).substring(2, 5); // 3 random alphanumeric chars
        const filename = `current-theme-${randomChars}.conf`;

        const blob = new Blob([kittyConfigContent], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert(`Theme saved as ${filename}`);
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateTheme);
    saveBtn.addEventListener('click', saveTheme);

    // Generate a theme on initial load
    generateTheme();
});
