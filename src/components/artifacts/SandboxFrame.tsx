import React, { useMemo } from 'react';

interface Props {
  code: string;
  title?: string;
  className?: string;
}

export const SandboxFrame: React.FC<Props> = ({ code, title = 'Artifact Sandbox', className = '' }) => {
  // Safe HTML template wrapping
  const safeSrcDoc = useMemo(() => {
    if (!code) return '';
    if (code.trim().startsWith('<!DOCTYPE') || code.trim().startsWith('<html')) {
      return code;
    }
    // Wrap fragment
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0c0e17;
      color: #f5f6fa;
      margin: 0;
      padding: 20px;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
  }, [code]);

  return (
    <div className={`sandbox-frame-wrapper ${className}`}>
      <iframe
        title={title}
        srcDoc={safeSrcDoc}
        sandbox="allow-scripts"
        className="sandbox-iframe"
        loading="lazy"
      />
      <style>{`
        .sandbox-frame-wrapper {
          width: 100%;
          height: 100%;
          background: #0c0e17;
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
        }

        .sandbox-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: transparent;
        }
      `}</style>
    </div>
  );
};
