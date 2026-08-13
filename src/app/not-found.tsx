import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-serif text-8xl text-moss/20">404</div>
        <h1 className="font-serif text-2xl text-moss-deep -mt-4">This page isn&rsquo;t here, mama</h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-md">
          Just like those pregnancy cravings at 2am &mdash; sometimes things
          aren&rsquo;t where we expect them. Let&rsquo;s get you back home.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 bg-moss text-cream px-6 py-2.5 rounded-full text-sm hover:bg-moss-deep transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
