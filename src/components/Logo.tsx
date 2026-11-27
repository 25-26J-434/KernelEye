import Link from "next/link";

/**
 * KernelEye mark: a Kubernetes-style hexagon with an eye cut out of it,
 * i.e. the cluster seen from the kernel. Colours come from theme tokens
 * (.logo-* in globals.css), so it inverts cleanly in dark mode.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo-mark">
      <path
        className="logo-hex"
        d="M16 2.2 27.9 9.1v13.8L16 29.8 4.1 22.9V9.1L16 2.2Z"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
      <path className="logo-eye" d="M7.6 16c2.4-3.9 5.2-5.8 8.4-5.8s6 1.9 8.4 5.8c-2.4 3.9-5.2 5.8-8.4 5.8S10 19.9 7.6 16Z" />
      <circle className="logo-pupil" cx="16" cy="16" r="3.3" />
      <circle className="logo-glint" cx="17.25" cy="14.75" r="0.95" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="KernelEye home">
      <LogoMark />
      <span>
        Kernel<b>Eye</b>
      </span>
    </Link>
  );
}
