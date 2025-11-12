'use client';

import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Page with Client Directive (Single Quotes)</h1>
      <p>This should trigger an error because pages should be server components.</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}