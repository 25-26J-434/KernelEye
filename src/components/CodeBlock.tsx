"use client";

import { useState } from "react";

export function CodeBlock({ title, code, lang }: { title?: string; code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <figure className="code-block">
      <figcaption>
        <span className="dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="code-title">{title}</span>
        {lang && <span className="code-lang">{lang}</span>}
        <button type="button" onClick={copy} className="code-copy">
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
