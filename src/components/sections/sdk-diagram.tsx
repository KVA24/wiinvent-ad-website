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

export function SdkDiagram() {
  const t = useTranslations()
  return (
    <section className="bg-white px-0 pb-[60px] pt-8">
      <Container>
        <Reveal>
          <div className="flex justify-center rounded-2xl bg-gradient-to-r from-[#fafbff] to-[#eff1fe] px-8 py-[60px]">
            <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-6">
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

              {/* Server card above the three platform cards, wired with the
                  dashed connectors Figma draws as line assets (3055:11389 onward). */}
              <div className="flex w-full items-center justify-center">
                <span
                  aria-hidden
                  className="hidden h-px w-[99px] self-start border-t border-dashed border-[#94a3b8] lg:block lg:mt-[55px]"
                />
                <div className="flex flex-col items-center">
                  <div className="flex h-[120px] w-full max-w-[230px] flex-col items-center justify-center gap-1 rounded-[15px] border border-[#e2e8f0] bg-white p-4 shadow-[0_9px_9px_rgba(99,102,241,0.07)]">
                    <p className="text-[28px] font-bold leading-none">
                      <span className="text-[#5d45f9]">WII</span>
                      <span className="text-[#1e293b]">ADS</span>
                    </p>
                    <p className="text-[13px] font-bold text-[#1e293b] opacity-70">{t('sdk_server_label')}</p>
                  </div>
                  <span aria-hidden className="h-[50px] w-px border-l border-dashed border-[#94a3b8]" />
                  {/* Distribution rail: one horizontal run with a drop into each card. */}
                  <div className="flex w-full max-w-[379px] justify-between px-[18%]">
                    {PLATFORMS.map(({ key }) => (
                      <span key={key} aria-hidden className="h-[22px] w-px border-l border-dashed border-[#94a3b8]" />
                    ))}
                  </div>
                  <div className="-mt-[22px] w-[64%] max-w-[263px] border-t border-dashed border-[#94a3b8]" aria-hidden />
                  <div className="mt-[22px] flex w-full max-w-[379px] gap-3">
                    {PLATFORMS.map(({ key, icon }) => (
                      <div
                        key={key}
                        className="flex h-[126px] min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-[13px] bg-white pb-4 pt-5 shadow-[0_7px_7px_rgba(15,23,42,0.05)] md:w-[117px] md:flex-none"
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
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
