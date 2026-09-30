import type { BowlEllipse } from "@/features/singing-bowl/lib/rim";

export const VIEW_WIDTH = 600;
export const VIEW_HEIGHT = 480;
/** The rim, in SVG units. Shared with the interaction maths. */
export const RIM: BowlEllipse = { cx: 300, cy: 210, rx: 190, ry: 58 };
export const RIPPLE_COUNT = 3;

/** Elements the interaction animates; reported to the parent as React attaches them. */
export type BowlPartName = "svg" | "bowl" | "glow" | "song" | "contact" | "mallet" | `ripple-${number}`;
export type OnBowlPart = (name: BowlPartName, element: Element | null) => void;

const { cx, cy, rx, ry } = RIM;
/** Lip thickness: the inside of the bowl starts this far in from the outer rim. */
const LIP = 8;
const CUSHION = { cx: 300, cy: 354, rx: 156, ry: 34, depth: 16 };
/** The hole in the ring the bowl's base sits in; its front edge hides the very bottom of the bowl. */
const HOLE = { rx: 92, ry: 15 };

/** Front edge of the body follows the lower half of the rim, then curves down to the base. */
const BODY_PATH = `M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy}
  C${cx + rx - 3},302 ${cx + 122},370 ${cx},373 C${cx - 124},369 ${cx - rx + 4},300 ${cx - rx},${cy} Z`;

/** The lower (front) half of an ellipse as an open arc. */
const frontArc = (ex: number, ey: number, erx: number, ery: number) => `M${ex - erx},${ey} A${erx},${ery} 0 0 0 ${ex + erx},${ey}`;
/** The upper (back) half of an ellipse as an open arc. */
const backArc = (ex: number, ey: number, erx: number, ery: number) => `M${ex - erx},${ey} A${erx},${ery} 0 0 1 ${ex + erx},${ey}`;

/** Front half of the ring's top surface, between the hole and the outer edge: in front of the bowl's base. */
const CUSHION_FRONT_TOP = `M${CUSHION.cx - CUSHION.rx},${CUSHION.cy} A${CUSHION.rx},${CUSHION.ry} 0 0 0 ${CUSHION.cx + CUSHION.rx},${CUSHION.cy}
  L${CUSHION.cx + HOLE.rx},${CUSHION.cy} A${HOLE.rx},${HOLE.ry} 0 0 1 ${CUSHION.cx - HOLE.rx},${CUSHION.cy} Z`;

/** Front band of the cushion ring: its visible outer side below the top surface. */
const CUSHION_FRONT = `${frontArc(CUSHION.cx, CUSHION.cy, CUSHION.rx, CUSHION.ry)}
  L${CUSHION.cx + CUSHION.rx},${CUSHION.cy + CUSHION.depth}
  A${CUSHION.rx},${CUSHION.ry} 0 0 1 ${CUSHION.cx - CUSHION.rx},${CUSHION.cy + CUSHION.depth} Z`;

export function BowlArt({ onPart }: { onPart: OnBowlPart }) {
  return (
    <svg
      ref={(el) => onPart("svg", el)}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role="img"
      aria-label="A bronze Tibetan singing bowl resting on a cushion"
      className="block h-full w-full overflow-visible"
    >
      <defs>
        <radialGradient id="bowl-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#d4af37" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>

        {/* Bronze body: a warm key light from the upper left, falling off into shadow on the right. */}
        <linearGradient id="bowl-body" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#2d1908" />
          <stop offset="0.12" stopColor="#6b431a" />
          <stop offset="0.3" stopColor="#b07b37" />
          <stop offset="0.42" stopColor="#dcb265" />
          <stop offset="0.5" stopColor="#c89a50" />
          <stop offset="0.68" stopColor="#8f6027" />
          <stop offset="0.88" stopColor="#4d2f11" />
          <stop offset="1" stopColor="#24140a" />
        </linearGradient>
        <linearGradient id="bowl-body-shade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#120700" stopOpacity="0" />
          <stop offset="0.5" stopColor="#120700" stopOpacity="0.1" />
          <stop offset="1" stopColor="#120700" stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id="bowl-lip" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#5e3b16" />
          <stop offset="0.3" stopColor="#d9b068" />
          <stop offset="0.45" stopColor="#f6dc9c" />
          <stop offset="0.62" stopColor="#c69348" />
          <stop offset="1" stopColor="#4a2d10" />
        </linearGradient>
        <linearGradient id="bowl-inside" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a87638" />
          <stop offset="0.35" stopColor="#6b4519" />
          <stop offset="0.75" stopColor="#3a220c" />
          <stop offset="1" stopColor="#1f1107" />
        </linearGradient>
        <radialGradient id="bowl-well" cx="50%" cy="70%" r="55%">
          <stop offset="0" stopColor="#120700" stopOpacity="0.55" />
          <stop offset="1" stopColor="#120700" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="cushion-top" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6d2672" />
          <stop offset="1" stopColor="#3f0f43" />
        </linearGradient>
        <linearGradient id="cushion-side" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3a0c3d" />
          <stop offset="1" stopColor="#1b041c" />
        </linearGradient>

        <linearGradient id="mallet-wood" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#dcae70" />
          <stop offset="0.35" stopColor="#b98348" />
          <stop offset="0.7" stopColor="#8a5a2b" />
          <stop offset="1" stopColor="#5c3a1b" />
        </linearGradient>
        <linearGradient id="mallet-suede" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#9a7555" />
          <stop offset="0.5" stopColor="#6e4e35" />
          <stop offset="1" stopColor="#3f2a1b" />
        </linearGradient>
        <radialGradient id="contact-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f3d58f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f3d58f" stopOpacity="0" />
        </radialGradient>

        {/* Hand-hammered dimples: a noise height map lit by a point light (specular only). */}
        <filter id="bowl-hammer" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.075" numOctaves="2" seed="11" result="dents" />
          <feGaussianBlur in="dents" stdDeviation="0.9" result="soft" />
          <feSpecularLighting in="soft" surfaceScale="3.2" specularConstant="0.9" specularExponent="42" lightingColor="#fff1cf" result="shine">
            <fePointLight x="170" y="40" z="240" />
          </feSpecularLighting>
          <feComposite in="shine" in2="SourceAlpha" operator="in" />
        </filter>
        <filter id="bowl-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="suede" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="soft-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="blur-2" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="mallet-shadow" x="-20%" y="-80%" width="140%" height="260%">
          <feDropShadow dx="2" dy="7" stdDeviation="4.5" floodColor="#120700" floodOpacity="0.38" />
        </filter>
        <clipPath id="bowl-body-clip">
          <path d={BODY_PATH} />
        </clipPath>
        <clipPath id="bowl-inside-clip">
          <ellipse cx={cx} cy={cy + 1} rx={rx - LIP} ry={ry - 6} />
        </clipPath>
      </defs>

      {/* Warm aura: brightens as the bowl sings. */}
      <ellipse ref={(el) => onPart("glow", el)} cx={cx} cy={cy + 30} rx={285} ry={180} fill="url(#bowl-glow)" opacity={0} />

      {/* Ground shadow, then the back of the ring cushion. */}
      <ellipse cx={CUSHION.cx} cy={CUSHION.cy + CUSHION.depth + 16} rx={185} ry={20} fill="#000" opacity={0.3} filter="url(#soft-blur)" />
      <ellipse cx={CUSHION.cx} cy={CUSHION.cy + CUSHION.depth} rx={CUSHION.rx} ry={CUSHION.ry} fill="url(#cushion-side)" />
      <ellipse cx={CUSHION.cx} cy={CUSHION.cy} rx={CUSHION.rx} ry={CUSHION.ry} fill="url(#cushion-top)" />
      {/* The hole in the ring, in shadow under the bowl. */}
      <ellipse cx={CUSHION.cx} cy={CUSHION.cy} rx={HOLE.rx} ry={HOLE.ry} fill="#12020f" opacity={0.8} filter="url(#blur-2)" />

      <g ref={(el) => onPart("bowl", el)} transform="rotate(-0.6 300 372)">

        {/* Body */}
        <path d={BODY_PATH} fill="url(#bowl-body)" />
        <path d={BODY_PATH} fill="url(#bowl-body-shade)" />
        <g clipPath="url(#bowl-body-clip)">
          {/* Hammer dimples catching the light, and fine casting grain. */}
          <rect x={100} y={150} width={400} height={240} filter="url(#bowl-hammer)" opacity={0.09} style={{ mixBlendMode: "screen" }} />
          <rect x={100} y={150} width={400} height={240} filter="url(#bowl-grain)" opacity={0.1} style={{ mixBlendMode: "overlay" }} />
          {/* Reflections: a bright band just under the rim, a dark band of the room below it. */}
          <ellipse cx={cx - 18} cy={cy + 36} rx={175} ry={13} fill="#ffe8b4" opacity={0.16} filter="url(#blur-2)" />
          <ellipse cx={cx} cy={cy + 96} rx={230} ry={26} fill="#1a0c02" opacity={0.2} filter="url(#soft-blur)" />
          {/* Key-light sheen down the left of the body, and a faint rim light on the right. */}
          <ellipse cx={218} cy={292} rx={20} ry={64} fill="#fff4dc" opacity={0.24} filter="url(#soft-blur)" />
          <ellipse cx={462} cy={262} rx={7} ry={40} fill="#ffd58f" opacity={0.14} filter="url(#blur-2)" />
        </g>
        {/* Engraved bands just below the rim, as on traditional bowls. */}
        <path d={frontArc(cx, cy + 24, rx - 7, ry - 2)} fill="none" stroke="#2a1606" strokeOpacity={0.45} strokeWidth={1.2} />
        <path d={frontArc(cx, cy + 25.5, rx - 7, ry - 2)} fill="none" stroke="#f3d18c" strokeOpacity={0.14} strokeWidth={0.8} />
        <path d={frontArc(cx, cy + 32, rx - 9, ry - 3)} fill="none" stroke="#2a1606" strokeOpacity={0.3} strokeWidth={0.9} />

        {/* Lip: the rim's thickness, lit on its front edge. */}
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#bowl-lip)" />
        <path d={frontArc(cx, cy, rx - 0.6, ry - 0.6)} fill="none" stroke="#fff3cf" strokeOpacity={0.55} strokeWidth={1.3} />

        {/* Inside of the bowl: lit back wall, darker well, a soft reflection of the opposite rim. */}
        <ellipse cx={cx} cy={cy + 1} rx={rx - LIP} ry={ry - 6} fill="url(#bowl-inside)" />
        <g clipPath="url(#bowl-inside-clip)">
          <ellipse cx={cx} cy={cy + 20} rx={rx - 30} ry={ry - 12} fill="url(#bowl-well)" />
          <path d={backArc(cx, cy + 9, rx - 26, ry - 20)} fill="none" stroke="#ffe3a6" strokeOpacity={0.28} strokeWidth={3} filter="url(#blur-2)" />
          <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} filter="url(#bowl-grain)" opacity={0.08} style={{ mixBlendMode: "overlay" }} />
        </g>
        {/* Inner edge of the lip, in shadow. */}
        <path d={backArc(cx, cy + 1, rx - LIP, ry - 6)} fill="none" stroke="#2a1606" strokeOpacity={0.45} strokeWidth={1} />

        {/* Faint standing-wave rings inside, visible only while the bowl sings. */}
        <g ref={(el) => onPart("song", el)} opacity={0} fill="none" stroke="#f0cf8a">
          <ellipse cx={cx} cy={cy + 12} rx={128} ry={33} strokeWidth={1} strokeOpacity={0.55} />
          <ellipse cx={cx} cy={cy + 16} rx={76} ry={19} strokeWidth={0.8} strokeOpacity={0.4} />
        </g>
      </g>

      {/* Front of the cushion ring, in front of the bowl's base, with gold brocade stitching. */}
      <path d={CUSHION_FRONT} fill="url(#cushion-side)" />
      <path d={CUSHION_FRONT_TOP} fill="url(#cushion-top)" />
      {/* Soft padded sheen along the top of the ring, and the bowl's shadow falling onto it. */}
      <path d={frontArc(CUSHION.cx, CUSHION.cy + 4, (CUSHION.rx + HOLE.rx) / 2, (CUSHION.ry + HOLE.ry) / 2)} fill="none" stroke="#b060b5" strokeOpacity={0.35} strokeWidth={5} filter="url(#blur-2)" />
      <path d={frontArc(CUSHION.cx, CUSHION.cy + 1, HOLE.rx + 4, HOLE.ry + 3)} fill="none" stroke="#12020f" strokeOpacity={0.55} strokeWidth={5} filter="url(#blur-2)" />
      <path d={frontArc(CUSHION.cx, CUSHION.cy, CUSHION.rx, CUSHION.ry)} fill="none" stroke="#8e3d93" strokeOpacity={0.5} strokeWidth={1.5} />
      <path
        d={frontArc(CUSHION.cx, CUSHION.cy + 7, CUSHION.rx - 2, CUSHION.ry)}
        fill="none"
        stroke="#d4af37"
        strokeOpacity={0.55}
        strokeWidth={1}
        strokeDasharray="5 4"
      />

      {/* Contact glow and resonance ripples where the mallet touches the rim. */}
      <circle ref={(el) => onPart("contact", el)} cx={cx} cy={cy} r={20} fill="url(#contact-glow)" opacity={0} />
      {Array.from({ length: RIPPLE_COUNT }, (_, i) => (
        <ellipse
          key={i}
          ref={(el) => onPart(`ripple-${i}`, el)}
          cx={cx}
          cy={cy}
          rx={4}
          ry={2}
          fill="none"
          stroke="#f0cf8a"
          strokeWidth={1}
          opacity={0}
        />
      ))}

      {/* The mallet. Its tip is at (0,0) with the handle along +x; the interaction moves and turns it. */}
      <g ref={(el) => onPart("mallet", el)} opacity={0} style={{ pointerEvents: "none" }}>
        <g filter="url(#mallet-shadow)">
          {/* Turned wooden handle, slightly tapered, with a rounded end. */}
          <path d="M27,-6.4 C70,-6 120,-5 152,-4.6 Q159,-4.3 159,0 Q159,4.3 152,4.6 C120,5 70,6 27,6.4 Z" fill="url(#mallet-wood)" />
          <path d="M34,-2.4 C80,-2.8 120,-2 150,-2.2" fill="none" stroke="#5a3718" strokeOpacity={0.22} strokeWidth={0.6} />
          <path d="M40,1.6 C82,1 118,2.2 148,1.4" fill="none" stroke="#5a3718" strokeOpacity={0.18} strokeWidth={0.5} />
          <path d="M60,-0.6 C95,-1 125,0 146,-0.4" fill="none" stroke="#3f250f" strokeOpacity={0.14} strokeWidth={0.5} />
          <path d="M30,-4.8 C80,-4.6 120,-3.8 152,-3.4" fill="none" stroke="#fff1d6" strokeOpacity={0.3} strokeWidth={0.9} />
          {/* Suede-wrapped striking end, with its seam. */}
          <rect x={-2.5} y={-9} width={33} height={18} rx={9} fill="url(#mallet-suede)" />
          <rect x={-2.5} y={-9} width={33} height={18} rx={9} filter="url(#suede)" opacity={0.16} style={{ mixBlendMode: "overlay" }} />
          <path d="M2,-5.5 Q14,-7 26,-5.5" fill="none" stroke="#e6cdb1" strokeOpacity={0.22} strokeWidth={0.8} />
          <path d="M27.5,-8.4 L27.5,8.4" stroke="#2b1a10" strokeOpacity={0.55} strokeWidth={1.1} />
        </g>
      </g>
    </svg>
  );
}
