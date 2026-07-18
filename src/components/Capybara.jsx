// Capy, das Capybara-Maskottchen
// Stimmungen: normal | start | proud | wrong | happy | cheer | sad | think
//
// Es werden echte Posen-Bilder aus bilder/capy/ verwendet (vom Character-Sheet).
// Fehlen die Bilder, springt automatisch die gezeichnete SVG-Version ein.

import { useState } from 'react'

const MOOD_IMG = {
  normal: 'normal',   // Frontansicht, freundlich
  happy: 'happy',     // Winken / fröhlich
  cheer: 'cheer',     // Jubeln / Konfetti-Pose
  sad: 'sad',         // Schulterzucken / traurig
  think: 'think'      // Erklärbär-Pose mit erhobenem Finger
}

export default function Capybara({ mood = 'normal', size = 110 }) {
  const [imgFailed, setImgFailed] = useState(false)

  // Start und Proud teilen sich dasselbe 3x2-Sprite-Sheet. In der
  // Startposition bleibt der erste Frame stehen, Proud spielt alle Frames ab.
  if (mood === 'start' || mood === 'proud' || mood === 'wrong') {
    return (
      <span
        className={`capy-reaction-sprite capy-reaction-${mood}`}
        aria-hidden="true"
        style={{ width: size, height: size }}
      />
    )
  }

  if (!imgFailed) {
    const name = MOOD_IMG[mood] || MOOD_IMG.normal
    return (
      <img
        className={`capy-img capy-anim-${mood}`}
        src={`bilder/capy/${name}.png`}
        alt=""
        aria-hidden="true"
        style={{ width: size, height: size }}
        onError={() => setImgFailed(true)}
        draggable={false}
      />
    )
  }
  return <CapySvg mood={mood} size={size} />
}

function CapySvg({ mood = 'normal', size = 110 }) {
  const happy = mood === 'happy' || mood === 'cheer'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`capy capy-${mood}`}
      aria-hidden="true"
    >
      {/* Körper */}
      <ellipse cx="60" cy="88" rx="34" ry="24" fill="#a9785a" />
      {/* Beine */}
      <rect x="38" y="100" width="10" height="14" rx="5" fill="#8f6248" />
      <rect x="72" y="100" width="10" height="14" rx="5" fill="#8f6248" />
      {/* Arme (jubeln bei cheer) */}
      {mood === 'cheer' ? (
        <>
          <rect x="22" y="62" width="9" height="22" rx="4.5" fill="#8f6248" transform="rotate(-35 26 73)" />
          <rect x="89" y="62" width="9" height="22" rx="4.5" fill="#8f6248" transform="rotate(35 94 73)" />
        </>
      ) : (
        <>
          <rect x="30" y="82" width="9" height="18" rx="4.5" fill="#8f6248" />
          <rect x="81" y="82" width="9" height="18" rx="4.5" fill="#8f6248" />
        </>
      )}
      {/* Kopf */}
      <path
        d="M28 52 Q28 26 60 26 Q92 26 92 52 L90 66 Q88 78 60 78 Q32 78 30 66 Z"
        fill="#b58868"
      />
      {/* Ohren */}
      <circle cx="36" cy="30" r="8" fill="#a9785a" />
      <circle cx="84" cy="30" r="8" fill="#a9785a" />
      <circle cx="36" cy="30" r="4" fill="#8f6248" />
      <circle cx="84" cy="30" r="4" fill="#8f6248" />
      {/* Schnauze */}
      <ellipse cx="60" cy="62" rx="20" ry="14" fill="#caa183" />
      {/* Nase */}
      <ellipse cx="60" cy="56" rx="6" ry="4" fill="#5d4030" />
      {/* Augen */}
      {mood === 'sad' ? (
        <>
          <path d="M42 42 q4 5 8 2" stroke="#3a2a1e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M78 42 q-4 5 -8 2" stroke="#3a2a1e" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : happy ? (
        <>
          <path d="M42 44 q4 -6 8 0" stroke="#3a2a1e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M70 44 q4 -6 8 0" stroke="#3a2a1e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="46" cy="43" r="3.6" fill="#3a2a1e" />
          <circle cx="74" cy="43" r="3.6" fill="#3a2a1e" />
        </>
      )}
      {/* Mund */}
      {mood === 'sad' ? (
        <path d="M52 70 q8 -6 16 0" stroke="#5d4030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : happy ? (
        <path d="M50 66 q10 9 20 0" stroke="#5d4030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M54 68 q6 4 12 0" stroke="#5d4030" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {/* Wangen */}
      {happy && (
        <>
          <ellipse cx="38" cy="54" rx="5" ry="3.5" fill="#e8a" opacity="0.45" />
          <ellipse cx="82" cy="54" rx="5" ry="3.5" fill="#e8a" opacity="0.45" />
        </>
      )}
      {/* Denkblase-Fragezeichen */}
      {mood === 'think' && (
        <text x="94" y="24" fontSize="20" fill="#5d4030" fontWeight="bold">?</text>
      )}
      {/* Partyhut bei cheer */}
      {mood === 'cheer' && (
        <>
          <path d="M52 12 L68 12 L60 -4 Z" transform="translate(0 16)" fill="#ff8f5c" />
          <circle cx="60" cy="12" r="3.5" fill="#ffd93d" />
        </>
      )}
    </svg>
  )
}
