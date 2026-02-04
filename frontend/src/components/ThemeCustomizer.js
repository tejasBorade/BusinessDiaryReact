import React, { useState, useEffect } from 'react';
import './ThemeCustomizer.css';

const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  console.log('🎨 ThemeCustomizer component rendered!');
  
  // Default theme settings
  const defaultTheme = {
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    headerColor: '#10b981',
    buttonRadius: '8',
    fontSize: '16',
    hideAIChat: false,
    hideNavbar: false,
    hideFooter: false,
  };

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('businessDiaryTheme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--bg-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--header-color', theme.headerColor);
    root.style.setProperty('--button-radius', `${theme.buttonRadius}px`);
    root.style.setProperty('--font-size', `${theme.fontSize}px`);

    // Hide/show elements
    const aiChat = document.querySelector('.ai-chat-button');
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');

    if (aiChat) aiChat.style.display = theme.hideAIChat ? 'none' : 'flex';
    if (navbar) navbar.style.display = theme.hideNavbar ? 'none' : 'flex';
    if (footer) footer.style.display = theme.hideFooter ? 'none' : 'block';

    // Save to localStorage
    localStorage.setItem('businessDiaryTheme', JSON.stringify(theme));
  }, [theme]);

  const handleChange = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setTheme(defaultTheme);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme-config.json';
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          setTheme({ ...defaultTheme, ...imported });
        } catch (error) {
          alert('Invalid theme file!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Floating Settings Button */}
      <button
        className="theme-customizer-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Theme Customizer"
      >
        ⚙️
      </button>

      {/* Customizer Panel */}
      {isOpen && (
        <div className="theme-customizer-panel">
          <div className="theme-customizer-header">
            <h3>🎨 Theme Customizer</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="theme-customizer-content">
            {/* Colors Section */}
            <div className="section">
              <h4>🎨 Colors</h4>
              
              <div className="setting-item">
                <label>Primary Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="setting-item">
                <label>Secondary Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="setting-item">
                <label>Header Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={theme.headerColor}
                    onChange={(e) => handleChange('headerColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.headerColor}
                    onChange={(e) => handleChange('headerColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="setting-item">
                <label>Background Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  />
                </div>
              </div>

              <div className="setting-item">
                <label>Text Color</label>
                <div className="color-input">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                  />
                  <input
                    type="text"
                    value={theme.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="section">
              <h4>📝 Typography</h4>
              
              <div className="setting-item">
                <label>Font Size: {theme.fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={theme.fontSize}
                  onChange={(e) => handleChange('fontSize', e.target.value)}
                />
              </div>

              <div className="setting-item">
                <label>Button Radius: {theme.buttonRadius}px</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={theme.buttonRadius}
                  onChange={(e) => handleChange('buttonRadius', e.target.value)}
                />
              </div>
            </div>

            {/* Visibility Section */}
            <div className="section">
              <h4>👁️ Show/Hide Elements</h4>
              
              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={theme.hideAIChat}
                    onChange={(e) => handleChange('hideAIChat', e.target.checked)}
                  />
                  Hide AI Chat Button
                </label>
              </div>

              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={theme.hideNavbar}
                    onChange={(e) => handleChange('hideNavbar', e.target.checked)}
                  />
                  Hide Navigation Bar
                </label>
              </div>

              <div className="setting-item checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={theme.hideFooter}
                    onChange={(e) => handleChange('hideFooter', e.target.checked)}
                  />
                  Hide Footer
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button className="btn-reset" onClick={handleReset}>
                🔄 Reset to Default
              </button>
              <button className="btn-export" onClick={handleExport}>
                💾 Export Theme
              </button>
              <label className="btn-import">
                📂 Import Theme
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Preview */}
            <div className="preview">
              <h4>Preview</h4>
              <div className="preview-box" style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                padding: '20px',
                borderRadius: `${theme.buttonRadius}px`,
                fontSize: `${theme.fontSize}px`
              }}>
                <button style={{
                  backgroundColor: theme.primaryColor,
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: `${theme.buttonRadius}px`,
                  cursor: 'pointer'
                }}>
                  Sample Button
                </button>
                <p style={{ marginTop: '10px' }}>Sample Text</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThemeCustomizer;
