import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/container'
import { Reveal } from '@/components/reveal'

/* Figma 3055:11349 — the snippet is product documentation, not copy, so it
   stays untranslated. Colours are the panel's own syntax theme. */
const CODE: { text: string; color: string }[][] = [
  [['WiiAds', '#61afef'], ['.', '#e2e8f0'], ['init', '#61afef'], ['({', '#e2e8f0']],
  [['  appId', '#e5c07b'], [': ', '#e2e8f0'], ['"YOUR_APP_ID"', '#98c379'], [',', '#e2e8f0']],
  [['  adUnitId', '#e5c07b'], [': ', '#e2e8f0'], ['"YOUR_AD_UNIT_ID"', '#98c379'], [',', '#e2e8f0']],
  [['  environment', '#e5c07b'], [': ', '#e2e8f0'], ['"production"', '#98c379']],
  [['});', '#e2e8f0']],
  [],
  [['WiiAds', '#61afef'], ['.', '#e2e8f0'], ['loadAd', '#61afef'], ['(', '#e2e8f0'], ['adUnitId', '#abb2bf'], [');', '#e2e8f0']],
  [],
  [['WiiAds', '#61afef'], ['.', '#e2e8f0'], ['showAd', '#61afef'], ['(', '#e2e8f0'], ['adUnitId', '#abb2bf'], [', {', '#e2e8f0']],
  [['  onAdShow', '#e5c07b'], [': () ', '#e2e8f0'], ['=>', '#61afef'], [' {},', '#e2e8f0']],
  [['  onAdClick', '#e5c07b'], [': () ', '#e2e8f0'], ['=>', '#61afef'], [' {},', '#e2e8f0']],
  [['  onAdClosed', '#e5c07b'], [': () ', '#e2e8f0'], ['=>', '#61afef'], [' {}', '#e2e8f0']],
  [['});', '#e2e8f0']],
].map((line) => line.map(([text, color]) => ({ text, color })))

const PLATFORMS = [
  { key: 'sdk_platform_web', icon: '/icon-network.svg' },
  { key: 'sdk_platform_app', icon: '/icon-smartphone.svg' },
  { key: 'sdk_platform_tv', icon: '/icon-tv.svg' },
] as const

/* Connector styling shared by the three dashed runs (Figma 3055:11389+). */
const STROKE = '#7d88f2'
const DASH = '4 4'

function ArrowMarker({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6.5"
      markerHeight="6.5"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 Z" fill={STROKE} />
    </marker>
  )
}

export function SdkDiagram() {
  const t = useTranslations()
  return (
    <section className="bg-white px-0 pb-[60px] pt-8">
      <Container>
        <Reveal>
          <div className="flex justify-center rounded-2xl bg-gradient-to-r from-[#fafbff] to-[#eff1fe] px-8 py-[60px]">
            <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-center lg:gap-0">
              {/* Code panel with its floating SDK badge */}
              <div className="relative w-full max-w-[378px] shrink-0">
                <pre className="h-[427px] w-full overflow-hidden rounded-[17.5px] bg-[#11162b] px-[22px] py-[31px] font-[family-name:var(--font-mono)] text-[14.25px] leading-[19.7px] shadow-[0_13px_13px_rgba(15,23,42,0.15)]">
                  <code>
                    {CODE.map((line, index) => (
                      <span key={index} className="block min-h-[19.7px]">
                        {line.map((part, partIndex) => (
                          <span key={partIndex} style={{ color: part.color }}>{part.text}</span>
                        ))}
                      </span>
                    ))}
                  </code>
                </pre>
                <div className="absolute -right-3 -top-8 flex size-[92px] h-[101px] flex-col items-center justify-center gap-2 rounded-[17.5px] bg-[#5d45f9] p-3 shadow-[0_11px_9px_rgba(79,70,229,0.25)]">
                  <span className="text-[17.5px] font-bold text-white">SDK</span>
                  <Image src="/icon-box.svg" alt="" width={28} height={28} />
                </div>
              </div>

              {/* Panel <-> server: double-headed dashed run at the server
                  card's centre. The server column sits 64px below the panel
                  top as drawn, and the run's right end tucks under the card
                  itself, not the column edge (the column is 379px wide but
                  the card only 230px, so it overlaps (379-230)/2 = 74px and
                  lets the white card cover the joint). */}
              <svg
                className="z-0 hidden h-2 min-w-[60px] flex-1 shrink lg:mt-[120px] lg:block lg:-mr-[70px] xl:max-w-[220px]"
                aria-hidden
              >
                <defs><ArrowMarker id="sdk-ah-h" /></defs>
                <line
                  x1="8" y1="4" x2="98%" y2="4"
                  stroke={STROKE} strokeWidth="1.5" strokeDasharray={DASH}
                  markerStart="url(#sdk-ah-h)" markerEnd="url(#sdk-ah-h)"
                />
              </svg>

              {/* Server card wired down into the three platform cards. */}
              <div className="relative z-10 flex w-full max-w-[379px] flex-col items-center lg:mt-16">
                <div className="flex h-[120px] w-full max-w-[230px] flex-col items-center justify-center gap-1 rounded-[15px] border border-[#e2e8f0] bg-white p-4 shadow-[0_9px_9px_rgba(99,102,241,0.07)]">
                  <p className="text-[28px] font-bold leading-none">
                    <span className="text-[#5d45f9]">WII</span>
                    <span className="text-[#1e293b]">ADS</span>
                  </p>
                  <p className="text-[13px] font-bold text-[#1e293b] opacity-70">{t('sdk_server_label')}</p>
                </div>

                {/* Server <-> rail: double-headed vertical run. */}
                <svg className="h-[54px] w-2" aria-hidden>
                  <defs><ArrowMarker id="sdk-ah-v" /></defs>
                  <line
                    x1="4" y1="8" x2="4" y2="46"
                    stroke={STROKE} strokeWidth="1.5" strokeDasharray={DASH}
                    markerStart="url(#sdk-ah-v)" markerEnd="url(#sdk-ah-v)"
                  />
                </svg>

                {/* Distribution rail: one horizontal run dropping into each card. */}
                <svg className="w-full" height="26" aria-hidden>
                  <defs><ArrowMarker id="sdk-ah-r" /></defs>
                  <line x1="16.7%" y1="2" x2="83.3%" y2="2" stroke={STROKE} strokeWidth="1.5" strokeDasharray={DASH} />
                  {['16.7%', '50%', '83.3%'].map((x) => (
                    <line
                      key={x}
                      x1={x} y1="2" x2={x} y2="20"
                      stroke={STROKE} strokeWidth="1.5" strokeDasharray={DASH}
                      markerEnd="url(#sdk-ah-r)"
                    />
                  ))}
                </svg>

                <div className="mt-1 flex w-full gap-3">
                  {PLATFORMS.map(({ key, icon }) => (
                    <div
                      key={key}
                      className="flex h-[126px] min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-[13px] bg-white pb-4 pt-5 shadow-[0_7px_7px_rgba(15,23,42,0.05)]"
                    >
                      <Image src={icon} alt="" width={35} height={35} />
                      <p className="whitespace-pre-line text-center text-[12px] font-semibold leading-4 text-[#1e293b]">
                        {t(key)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
