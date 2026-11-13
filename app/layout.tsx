// Load order is load-bearing: atmosphere comes last so its type rules win over the
// media-query rules in the earlier sheets at equal specificity.
import '../src/portfolio-base.css'
import '../src/portfolio-cases.css'
import '../src/portfolio-contact.css'
import '../src/portfolio-brief.css'
import '../src/portfolio-photography.css'
import '../src/portfolio-atmosphere.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: '袁宗苡 Zoey｜产品作品集',
  description: '关注 AI 与移动端体验。从工业设计出发，把对人、场景和影像的观察带进产品实践。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09080b',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>
}
