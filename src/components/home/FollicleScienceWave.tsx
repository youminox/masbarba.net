/** SVG animado: microesferas dermo-hidratantes de Crema-Gel You Minox 5% + Oxothiazolidinecarboxylate que nutren el folículo sin resecar la piel. Solo corre en pantalla. */
export default function FollicleScienceWave() {
  const drops = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      x: 200 + Math.cos(a) * 46,
      y: 210 + Math.sin(a) * 46,
      dx: `${Math.cos(a) * 150}px`,
      dy: `${Math.sin(a) * 150}px`,
      d: `${(i % 6) * 0.65}s`,
      r: 7 + (i % 3) * 2,
    };
  });
  const strands = Array.from({ length: 7 }).map((_, i) => {
    const a = (i / 7) * Math.PI * 2 + 0.3;
    const x1 = 200 + Math.cos(a) * 30,
      y1 = 210 + Math.sin(a) * 30;
    const x2 = 200 + Math.cos(a) * 124,
      y2 = 210 + Math.sin(a) * 124;
    const mx = 200 + Math.cos(a + 0.5) * 82,
      my = 210 + Math.sin(a + 0.5) * 82;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  });

  return (
    <div className="gel-scene relative mx-auto aspect-square w-full max-w-[460px]">
      <svg
        viewBox="0 0 400 420"
        className="h-full w-full"
        role="img"
        aria-label="Ilustración: la base en Crema-Gel de You Minox 5% libera activos vasodilatadores hacia el folículo sin evaporación alcohólica"
      >
        <defs>
          <filter id="mb-fg-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" />
            <feColorMatrix
              in="b"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            />
          </filter>
          <radialGradient id="mb-fg-gel" cx="45%" cy="40%" r="60%">
            <stop offset="0" stopColor="#a7f3d0" />
            <stop offset="0.55" stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </radialGradient>
          <radialGradient id="mb-fg-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#34d399" stopOpacity="0.38" />
            <stop offset="1" stopColor="#047857" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="210" r="190" fill="url(#mb-fg-halo)" />
        <circle
          cx="200"
          cy="210"
          r="152"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeDasharray="4 7"
        />
        <circle
          cx="200"
          cy="210"
          r="116"
          fill="none"
          stroke="rgba(52,211,153,0.22)"
          strokeDasharray="8 6"
        />

        {strands.map((d, i) => (
          <path
            key={i}
            d={d}
            className="fiber-strand"
            fill="none"
            stroke="#34d399"
            strokeOpacity="0.7"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        <g filter="url(#mb-fg-goo)">
          <circle
            className="gel-blob"
            cx="200"
            cy="210"
            r="46"
            fill="url(#mb-fg-gel)"
          />
          <circle
            className="gel-blob"
            cx="178"
            cy="196"
            r="26"
            fill="#10b981"
            style={{ animationDelay: "0.4s" }}
          />
          <circle
            className="gel-blob"
            cx="224"
            cy="226"
            r="24"
            fill="#059669"
            style={{ animationDelay: "0.9s" }}
          />
          {drops.map((p, i) => (
            <circle
              key={i}
              className="drop"
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="#6ee7b7"
              style={{
                ["--dx" as string]: p.dx,
                ["--dy" as string]: p.dy,
                animationDelay: p.d,
              }}
            />
          ))}
        </g>

        <g fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700">
          <g transform="translate(10 40)">
            <rect
              width="142"
              height="26"
              rx="13"
              fill="rgba(52,211,153,0.18)"
              stroke="rgba(52,211,153,0.55)"
            />
            <text x="71" y="17" textAnchor="middle" fill="#d1fae5">
              Minoxidil 5% Crema-Gel
            </text>
          </g>
          <g transform="translate(242 58)">
            <rect
              width="148"
              height="26"
              rx="13"
              fill="rgba(251,191,36,0.18)"
              stroke="rgba(251,191,36,0.6)"
            />
            <text x="74" y="17" textAnchor="middle" fill="#fde68a">
              0% Propilenglicol
            </text>
          </g>
          <g transform="translate(106 372)">
            <rect
              width="188"
              height="26"
              rx="13"
              fill="rgba(5,150,105,0.28)"
              stroke="rgba(52,211,153,0.6)"
            />
            <text x="94" y="17" textAnchor="middle" fill="#a7f3d0">
              Oxothiazolidinecarboxylate
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
