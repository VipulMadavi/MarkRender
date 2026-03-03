function App() {
  return (
    <div className="app">
      {/* Toolbar */}
      <div className="toolbar">
        <span className="toolbar-brand">MarkRender</span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn">Toggle View</button>
          <button className="btn">Focus</button>
          <button className="btn">Export PDF</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span className="word-count">1,243 words · 6 min · ~4 pages</span>
          <span className="autosave-indicator">Autosaved ✓</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Editor Panel */}
        <div className="editor-panel">
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              lineHeight: "1.5",
              opacity: 0.6,
            }}
          >
            <p style={{ color: "var(--text-dim)", fontStyle: "italic" }}>
              # Start writing Markdown...
            </p>
            <br />
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
              CodeMirror 6 editor will replace this placeholder in Phase 4.
            </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-page">
            <h1>Welcome to MarkRender</h1>
            <p>
              A calm, distraction-free Markdown-to-PDF writing tool. Built with
              the <strong>Calm Night</strong> design system.
            </p>

            <h2>Typography</h2>
            <p>
              This preview demonstrates the design system. Body text uses{" "}
              <em>Inter</em> for readability, while code uses{" "}
              <code>JetBrains Mono</code>.
            </p>

            <h3>Code Block</h3>
            <pre>
              <code>{`function hello(name) {
  const greeting = \`Hello, \${name}!\`;
  console.log(greeting);
  return greeting;
}`}</code>
            </pre>

            <h3>Blockquote</h3>
            <blockquote>
              <p>
                The design should feel like Notion at night — calm, focused, and
                minimal.
              </p>
            </blockquote>

            <h3>Table</h3>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Status</th>
                  <th>Phase</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Design System</td>
                  <td>✅ Active</td>
                  <td>Phase 2</td>
                </tr>
                <tr>
                  <td>Markdown Pipeline</td>
                  <td>⬜ Next</td>
                  <td>Phase 3</td>
                </tr>
                <tr>
                  <td>CodeMirror Editor</td>
                  <td>⬜ Upcoming</td>
                  <td>Phase 4</td>
                </tr>
              </tbody>
            </table>

            <h3>Lists</h3>
            <ul>
              <li>Gradient background with night-sky depth</li>
              <li>Glassmorphism toolbar with blur effect</li>
              <li>Custom scrollbar styling</li>
              <li>Responsive split layout</li>
            </ul>

            <hr />

            <h4>Math Rendering (Phase 3)</h4>
            <p>
              Math will render inline like{" "}
              <span className="math-error">KaTeX not loaded yet</span> — this is
              expected until Phase 3.
            </p>

            <h5>Heading Level 5</h5>
            <p>Used for sub-sections within content.</p>

            <h6>Heading Level 6</h6>
            <p>The smallest heading level, for fine-grained structure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
