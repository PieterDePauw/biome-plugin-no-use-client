import { ReactNode } from 'react';

interface PageProps {
  children?: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <div>
      <h1>Server Component Page</h1>
      <p>This page should remain a server component.</p>
      {children}
    </div>
  );
}