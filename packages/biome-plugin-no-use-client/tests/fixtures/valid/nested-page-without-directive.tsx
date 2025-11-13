import { ReactNode } from 'react';

interface NestedPageProps {
  params: { slug: string };
  children?: ReactNode;
}

export default function NestedPage({ params, children }: NestedPageProps) {
  return (
    <div>
      <h1>Nested Page: {params.slug}</h1>
      <p>This is a nested page component that should remain a server component.</p>
      {children}
    </div>
  );
}