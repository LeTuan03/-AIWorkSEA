import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin,
  ArrowRight,
  Globe,
  Briefcase,
  Brain,
  Workflow,
  Rocket,
  ExternalLink,
} from "lucide-react";

// ---------------------------------------------------------------------------
// EDIT ME — mọi thông tin cá nhân nằm gọn trong object này. Sửa tự do.
// ---------------------------------------------------------------------------
const profile = {
  name: "Lê Tuấn",
  monogram: "LT",
  role: "Developer · AI & Automation",
  location: "Việt Nam · Đông Nam Á",
  email: "leetuaans03@gmail.com",
  github: "https://github.com/LeTuan03",
  available: "Đang nhận dự án freelance & hợp tác",
  tagline:
    "Mình xây sản phẩm web và tự động hóa cho các dự án AI ở Đông Nam Á — trong đó có chính AIWORK SEA.",
  bio: [
    "Xin chào, mình là Tuấn. Mình là lập trình viên tập trung vào web hiện đại (Next.js, React, TypeScript) và các luồng tự động hóa dựa trên AI/LLM.",
    "AIWORK SEA là dự án cá nhân của mình: một job board ngách kết nối freelancer AI & Automation với nhà tuyển dụng trong khu vực. Mình tự thiết kế, code và vận hành toàn bộ từ giao diện đến hạ tầng.",
    "Mình thích những sản phẩm gọn, nhanh và dùng được ngay — ít trung gian, ít ma sát. Nếu bạn có dự án AI hoặc automation cần người triển khai, cứ liên hệ nhé.",
  ],
  focuses: [
    {
      Icon: Brain,
      title: "AI / LLM Engineering",
      body: "Tích hợp mô hình ngôn ngữ, RAG, và các tính năng AI vào sản phẩm thực tế.",
    },
    {
      Icon: Workflow,
      title: "Automation / RPA",
      body: "Nối các công cụ và quy trình lại với nhau để bớt việc tay, chạy tự động.",
    },
    {
      Icon: Globe,
      title: "Web hiện đại",
      body: "Next.js, React, TypeScript — giao diện nhanh, SEO tốt, chuẩn responsive.",
    },
    {
      Icon: Rocket,
      title: "Ship & vận hành",
      body: "Đưa sản phẩm lên production, đo đạc và cải thiện liên tục.",
    },
  ],
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Prisma",
    "PostgreSQL",
    "TailwindCSS",
    "LLM / RAG",
    "n8n",
    "Automation",
    "SEO",
    "UI/UX",
  ],
};

export const metadata: Metadata = {
  title: "Về tôi",
  description: `${profile.name} — ${profile.role}. Người xây dựng AIWORK SEA.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `Về tôi · ${profile.name}`,
    description: profile.tagline,
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: intro */}
          <div>
            <span className="chip chip-accent">
              <Globe size={14} strokeWidth={1.75} />
              Về tôi
            </span>
            <h1 className="font-display mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            <p className="font-display mt-3 text-lg text-accent">{profile.role}</p>
            <p className="mt-5 max-w-xl text-lg text-muted">{profile.tagline}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${profile.email}`} className="btn btn-primary">
                Gửi email
                <ArrowRight size={16} strokeWidth={2} aria-hidden />
              </a>
              <Link href="/" className="btn btn-secondary">
                Xem việc làm
              </Link>
            </div>
          </div>

          {/* Right: profile card */}
          <div className="glass p-6">
            <div className="flex items-center gap-4">
              <span className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent-solid text-2xl font-bold text-accent-solid-fg">
                {profile.monogram}
              </span>
              <div className="min-w-0">
                <div className="font-display truncate font-bold text-fg">
                  {profile.name}
                </div>
                <div className="truncate text-sm text-muted">{profile.role}</div>
              </div>
            </div>

            <dl className="mt-6 flex flex-col gap-4 border-t border-line pt-6 text-sm">
              <div className="flex items-center gap-3">
                <MapPin size={18} strokeWidth={1.75} className="text-subtle" aria-hidden />
                <dd className="text-muted">{profile.location}</dd>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={18} strokeWidth={1.75} className="text-subtle" aria-hidden />
                <dd className="text-muted">{profile.available}</dd>
              </div>
              <div className="flex items-center gap-3">
                <ExternalLink size={18} strokeWidth={1.75} className="text-subtle" aria-hidden />
                <dd className="min-w-0">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-accent transition hover:underline"
                  >
                    GitHub
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          Giới thiệu
        </h2>
        <div className="mt-5 flex max-w-3xl flex-col gap-4 text-muted">
          {profile.bio.map((para, i) => (
            <p key={i} className="text-base leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Focus areas */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          Điều tôi làm
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {profile.focuses.map((f) => (
            <div key={f.title} className="glass p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-weak text-accent-weak-fg">
                <f.Icon size={22} strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="font-display mt-4 font-semibold text-fg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          Kỹ năng
        </h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {profile.skills.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Cùng làm việc nhé
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Có dự án AI hoặc automation cần triển khai? Gửi mình vài dòng, mình sẽ
            phản hồi sớm.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${profile.email}`} className="btn btn-primary">
              {profile.email}
              <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              GitHub
              <ExternalLink size={16} strokeWidth={1.75} aria-hidden />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
