export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Mon frigo">
      <rect x="9" y="3" width="30" height="42" rx="8" fill="#FBFDFD" />
      <path d="M9 19h30" stroke="#2F6F55" strokeWidth="2.5" />
      <rect x="14" y="10" width="3.5" height="5" rx="1.75" fill="#2F6F55" />
      <rect x="14" y="24" width="3.5" height="10" rx="1.75" fill="#2F6F55" />
    </svg>
  );
}
