import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// Deelafbeelding (1200×630) voor links op LinkedIn, WhatsApp, X enz. Geldt voor alle pagina's.
export const alt = 'Unlisted: find jobs and internships in the Netherlands before they are posted';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/images/brand/logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #f7f6f1 0%, #eaf5ee 100%)',
          color: '#101820',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={88} height={88} alt="" />
          <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: -2 }}>Unlisted</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Find opportunities before they become job listings.
          </span>
          <span style={{ fontSize: 30, color: '#5f6b66', maxWidth: 940 }}>
            Company signals, smart matches and personal outreach for international students in the Netherlands.
          </span>
        </div>
        <span style={{ fontSize: 24, color: '#087f63', fontWeight: 600 }}>First search free · No subscription</span>
      </div>
    ),
    size,
  );
}
