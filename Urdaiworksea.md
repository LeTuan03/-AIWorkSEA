# URD (User Requirement Document) v2 — AIWORK SEA
## Nguyên tắc: Freelancer dùng miễn phí trước — có roadmap kiếm tiền rõ ràng cho sau

**Thay đổi so với bản trước:** Toàn bộ tính năng dành cho freelancer ở giai đoạn hiện tại là **miễn phí, không paywall**. Mục tiêu ưu tiên bây giờ là tăng số lượng freelancer + nhà tuyển dụng dùng thật, tạo network effect. Việc thu phí được thiết kế sẵn trong kiến trúc nhưng **kích hoạt theo từng mốc (trigger) cụ thể**, không bật ngay.

**Căn cứ thực tế (tham khảo ngành job board 2026):**
- Phần lớn job board ngách cần khoảng 5.000–10.000 lượt truy cập/tháng thì việc thu phí mới có ý nghĩa — nhưng ngách càng hẹp, giá trị freelancer/nhà tuyển dụng càng cao thì ngưỡng này càng thấp.
- Mô hình thu phí bền vững nhất trong ngành vẫn là **thu từ nhà tuyển dụng** (đăng tin, tin nổi bật, xem hồ sơ) — **không thu phí người tìm việc/freelancer**, trừ vài trường hợp ngoại lệ hiếm.
- Trình tự triển khai được khuyến nghị: (1) đăng tin trả phí cơ bản → (2) tin nổi bật (upsell, biên lợi nhuận cao vì không tốn thêm chi phí) → (3) truy cập hồ sơ/resume database → (4) tài trợ newsletter khi đã đủ subscriber → (5) subscription cho nhà tuyển dụng thân thiết.
- Có case thực tế: 1 job board ngách chuyên AI đạt lợi nhuận chỉ sau vài tháng nhờ chi phí vận hành cực thấp, dù doanh thu tuyệt đối không lớn — đúng mô hình một-mình-vận-hành như AIWORK SEA.

---

## PHẦN A — TÍNH NĂNG MIỄN PHÍ CHO FREELANCER (làm ngay, không gắn thu phí)

**Nguyên tắc:** Toàn bộ tính năng dưới đây **miễn phí hoàn toàn, không paywall**. Mục tiêu là tăng số lượng freelancer + nhà tuyển dụng dùng thật, tạo network effect và gom đủ dữ liệu/traffic trước khi tính đến kiếm tiền (roadmap thu phí ở **Phần B**).

---

### A.1. Freelancer Profile (hồ sơ công khai)

**Mục tiêu:** Tăng giá trị cho freelancer ngay cả khi chưa apply job nào, kéo họ quay lại thường xuyên.

**User story:** Là freelancer, tôi muốn có 1 trang hồ sơ công khai để nhà tuyển dụng chủ động tìm thấy tôi, kể cả khi tôi không apply job nào.

| # | Yêu cầu | Ghi chú |
|---|---|---|
| 1 | Form tạo hồ sơ: tên, ảnh, kỹ năng (tag), mô tả ngắn, link portfolio, mức giá tham khảo | Miễn phí hoàn toàn, không giới hạn field |
| 2 | Trang public `/freelancer/[username]` — SEO-friendly | Giúp freelancer có "CV online" chia sẻ được, tăng lý do quay lại |
| 3 | Trang danh sách + filter theo kỹ năng, để nhà tuyển dụng browse | Không giới hạn số lượt xem, không paywall |
| 4 | Nút liên hệ hiển thị công khai (email/portfolio) — **không ẩn** | Mở hoàn toàn để tối đa hoá giá trị 2 chiều trước |

**Ưu tiên triển khai:** Must-have. Đây là nền tảng dữ liệu cho các bước sau (kể cả monetization sau này).

**Ước tính thời gian (2h/ngày):**
- Tuần 1–2: Form tạo hồ sơ + lưu DB + trang public profile.
- Tuần 3: Trang danh sách + filter cơ bản.

**Dữ liệu cần (DB):** dùng model `FreelancerProfile` ở **Phần D.1** (Prisma, đúng convention schema thật của repo — thay cho pseudocode cũ).

**Mục tiêu số liệu:** Đạt 50–100 hồ sơ chất lượng — đây là điều kiện tiên quyết để mở các tính năng thu phí ở Phần B sau này.

---

### A.2. AI Jobs Digest (Newsletter từ feed.xml có sẵn)

**Mục tiêu:** Tận dụng feed RSS sẵn có, tạo kênh giữ chân người dùng quay lại.

**User story:** Là freelancer, tôi muốn nhận email tổng hợp job mới hàng tuần thay vì phải vào web check thường xuyên.

| # | Yêu cầu | Công cụ gợi ý |
|---|---|---|
| 1 | Form đăng ký email ở trang chủ + footer | Miễn phí, không giới hạn |
| 2 | Script đọc feed.xml, chọn N job mới nhất trong tuần | Cron job qua GitHub Actions (free tier) |
| 3 | Template email đơn giản (HTML), gửi qua **Resend** (free-tier; cấu hình SPF/DKIM) | Chốt Resend — xem Phần L |
| 4 | Không quảng cáo/sponsor ở giai đoạn này | Ưu tiên tăng subscriber trước |

**Ưu tiên triển khai:** Must-have, nên làm **sớm nhất trong cả Phần A** — nhẹ, tận dụng sẵn feed.xml.

**Ước tính thời gian:** 3–5 buổi (2h/ngày).

**Mục tiêu số liệu:** 500–1.000 subscriber — mốc để mở sponsor slot sau này.

---

### A.3. Tool tạo báo giá/hợp đồng nhanh

**Mục tiêu:** Giải quyết nỗi đau thực tế — freelancer AI thường yếu về soạn báo giá/proposal chuyên nghiệp.

**User story:** Là freelancer, tôi muốn tạo nhanh 1 bản báo giá hoặc đề xuất dự án trông chuyên nghiệp để gửi khách trong vài phút.

| # | Yêu cầu | Ưu tiên |
|---|---|---|
| 1 | Form nhập: tên khách, hạng mục công việc, đơn giá, số lượng, ghi chú | Must-have |
| 2 | Tự tính tổng tiền, có thể thêm thuế/chiết khấu | Must-have |
| 3 | Xuất PDF chuyên nghiệp — **không watermark ép buộc** | Must-have — ưu tiên trải nghiệm tốt để freelancer giới thiệu cho người khác |
| 4 | Template proposal mẫu theo ngành AI/Automation | Should-have — điểm khác biệt so với tool báo giá chung chung |
| 5 | Lưu trữ lịch sử báo giá đã tạo (cần tài khoản) | Should-have |
| 6 | Chia sẻ báo giá qua link xem online | Nice-to-have |

**Gợi ý kỹ thuật:**
- Frontend: React/Next.js (tái dùng stack hiện tại của AIWORK SEA)
- Xuất PDF: **print-to-PDF của trình duyệt** (`window.print()` + print stylesheet) — 0 dependency, tiếng Việt luôn đúng dấu; xem lý do đổi ở Phần L
- Bản đầu có thể lưu local (localStorage) cho user chưa đăng nhập

**Ghi chú:** Có thể gắn dòng nhỏ "Tạo bởi AIWORK SEA" cuối PDF — đây là kênh marketing miễn phí, không phải rào cản trả phí.

---

### A.4. Tool theo dõi ứng tuyển (Mini Kanban)

**Mục tiêu:** Giúp freelancer quản lý nhiều job đang apply cùng lúc, tăng lý do quay lại nền tảng thường xuyên.

**User story:** Là freelancer, tôi muốn theo dõi trạng thái các job mình đã ứng tuyển để không bỏ sót.

| # | Yêu cầu | Ưu tiên |
|---|---|---|
| 1 | Board 4 cột: Đã gửi / Đang trao đổi / Đã nhận / Từ chối | Must-have |
| 2 | Thêm card thủ công (tên job, khách, link, ghi chú) | Must-have |
| 3 | Kéo-thả card giữa các cột | Must-have |
| 4 | Tự động tạo card khi freelancer apply job ngay trên AIWORK SEA | Điểm khác biệt lớn nhất — nên làm sau khi có sẵn A.1 |
| 5 | Nhắc follow-up (VD: 3 ngày chưa phản hồi thì nhắc) | Nice-to-have |

**Gợi ý kỹ thuật:** **`dnd-kit`** cho kéo-thả (`react-beautiful-dnd` đã ngừng bảo trì). Dùng chung tài khoản đăng nhập với AIWORK SEA, không bắt tạo tài khoản mới.

**Vì sao miễn phí:** đây là công cụ giữ chân (retention) — giữ freelancer quay lại AIWORK SEA thường xuyên, gián tiếp tăng traffic để đạt ngưỡng mở monetization ở Phần B nhanh hơn.

---

### THỨ TỰ TRIỂN KHAI ĐỀ XUẤT (2h/ngày)

| Thứ tự | Tính năng | Thời gian ước tính | Lý do |
|---|---|---|---|
| 1 | A.2 — AI Jobs Digest | 1 tuần | Ít công sức nhất, tận dụng feed.xml có sẵn |
| 2 | A.1 — Freelancer Profile | 3–4 tuần | Nền tảng dữ liệu quan trọng nhất, cần nhiều thời gian nhất |
| 3 | A.3 — Tool báo giá/hợp đồng | 2–3 tuần | Độc lập, có thể làm song song với A.1 nếu có thời gian |
| 4 | A.4 — Mini Kanban | 3–4 tuần | Giá trị cao nhất khi tích hợp với A.1, nên làm sau cùng |

---

### GHI CHÚ KỸ THUẬT CHUNG

- Dù chưa thu phí, nên thiết kế sẵn các field liên quan (VD: `payment_status`, `is_featured` mặc định `null`/`free`) trong DB ngay từ đầu — để sau này bật monetization (xem roadmap Phần B) không phải build lại schema.
- Toàn bộ Phần A nên dùng chung 1 hệ thống tài khoản với AIWORK SEA hiện tại, không tạo tài khoản riêng cho từng tool.

---

## PHẦN B — ROADMAP KIẾM TIỀN (kích hoạt theo mốc, không làm ngay)

> Nguyên tắc: **Không thu phí freelancer.** Toàn bộ doanh thu nhắm vào phía nhà tuyển dụng — đúng chuẩn phổ biến nhất của ngành job board.

### Giai đoạn 0 — Điều kiện kích hoạt chung
Trước khi bật bất kỳ tính năng thu phí nào ở dưới, cần đạt tối thiểu **1 trong 2 mốc**:
- ≥ 20–30 lượt đăng tin/tháng từ nhà tuyển dụng (chứng tỏ nhu cầu thật), **hoặc**
- ≥ 3.000–5.000 lượt truy cập/tháng (traffic đủ để nhà tuyển dụng thấy giá trị trả phí)

Nếu chưa đạt, **chưa nên** bật monetization — vì thu phí quá sớm khi chưa đủ traffic/tin đăng sẽ làm nhà tuyển dụng đầu tiên trải nghiệm xấu và rời bỏ vĩnh viễn.

---

### Giai đoạn 1 — Đăng tin trả phí (Paid Job Posting)
**Kích hoạt khi:** đạt Giai đoạn 0.

| Yêu cầu | Ghi chú |
|---|---|
| Nhà tuyển dụng trả phí để đăng 1 tin, hiển thị trong X ngày (30/60 ngày) | Mô hình phổ biến nhất, dễ triển khai nhất |
| Vẫn giữ 1 lựa chọn đăng miễn phí, giới hạn hơn (VD: hiển thị ngắn hơn, 7 ngày) | Freemium — giảm rào cản cho nhà tuyển dụng mới, giống mô hình nhiều job board áp dụng |
| Thanh toán qua QR/chuyển khoản, đối soát thủ công hoặc webhook | Xây 1 module dùng chung cho tất cả tính năng trả phí ở Phần B |

**Mức giá tham khảo để bắt đầu (có thể điều chỉnh theo phản hồi thị trường):** thấp hơn 20–30% mức bạn muốn đạt về sau, sau đó tăng dần khi đã có nhà tuyển dụng quay lại đăng tin lần 2.

---

### Giai đoạn 2 — Tin nổi bật (Featured Listing)
**Kích hoạt khi:** đã có ≥ 5–10 nhà tuyển dụng trả phí ổn định ở Giai đoạn 1.

| Yêu cầu | Ghi chú |
|---|---|
| Tùy chọn "ghim/nổi bật" thêm cho tin đã đăng | Biên lợi nhuận cao — không tốn thêm chi phí kỹ thuật đáng kể |
| Badge riêng, ghim đầu danh sách hoặc xen kẽ mỗi 3–5 tin | Tránh làm loãng trải nghiệm freelancer |

---

### Giai đoạn 3 — Nhà tuyển dụng xem hồ sơ freelancer (Employer Profile Access)
**Kích hoạt khi:** Phần A.1 đã có ≥ 50–100 hồ sơ freelancer chất lượng.

| Yêu cầu | Ghi chú |
|---|---|
| Hồ sơ vẫn công khai xem preview (tên, kỹ năng, mức giá) — **không đóng lại thông tin đã mở miễn phí trước đó** | Tránh phản ứng ngược từ freelancer đã tin tưởng tạo hồ sơ khi biết sẽ bị paywall |
| Tính năng trả phí thêm: bộ lọc nâng cao, xem lịch sử hoạt động, gắn "ưu tiên liên hệ" | Đây là lớp giá trị tăng thêm (add-on), không phải khoá lại cái đã cho miễn phí |

**Lưu ý quan trọng:** Vì Phần A.1 đã mở hoàn toàn thông tin liên hệ miễn phí, Giai đoạn 3 **không thể** quay lại đóng thông tin liên hệ cơ bản — chỉ nên bán thêm lớp tiện ích nâng cao (lọc thông minh, xem ai đang "sẵn sàng nhận việc ngay", v.v.), giữ đúng cam kết "freelancer luôn miễn phí, minh bạch" đã đặt ra từ đầu.

---

### Giai đoạn 4 — Tài trợ Newsletter (Sponsor Slot)
**Kích hoạt khi:** AI Jobs Digest đạt ≥ 500–1.000 subscriber.

| Yêu cầu | Ghi chú |
|---|---|
| 1 slot "Sponsor tuần này" trong email | Bán cho công ty tuyển dụng hoặc dịch vụ liên quan (khoá học AI, công cụ freelancer) |
| Ghi rõ nhãn "Được tài trợ bởi" | Minh bạch, giữ uy tín với subscriber |

---

### Giai đoạn 5 — Gói Subscription cho nhà tuyển dụng thân thiết
**Kích hoạt khi:** đã có ≥ 20 nhà tuyển dụng quay lại đăng tin từ 2 lần trở lên.

| Yêu cầu | Ghi chú |
|---|---|
| Gói tháng: đăng không giới hạn tin + tự động featured + ưu tiên hỗ trợ | Chỉ nên chào cho nhà tuyển dụng đã có hành vi quay lại thật, không chào đại trà |

---

## TÓM TẮT TRÌNH TỰ

| Giai đoạn | Đối tượng thu phí | Điều kiện kích hoạt | Freelancer có bị ảnh hưởng? |
|---|---|---|---|
| A (ngay bây giờ) | Không ai — tất cả miễn phí | Không cần điều kiện | Trải nghiệm tốt hơn, không mất gì |
| 1. Paid Job Posting | Nhà tuyển dụng | 20–30 tin/tháng hoặc 3–5k traffic/tháng | Không |
| 2. Featured Listing | Nhà tuyển dụng | 5–10 nhà tuyển dụng trả phí ổn định | Không (chỉ thêm badge trên tin) |
| 3. Employer Profile Access | Nhà tuyển dụng | 50–100 hồ sơ freelancer | Không mất quyền lợi đã có, chỉ thêm lớp add-on |
| 4. Newsletter Sponsor | Bên thứ 3 (sponsor) | 500–1.000 subscriber | Không |
| 5. Employer Subscription | Nhà tuyển dụng | 20+ nhà tuyển dụng quay lại | Không |

**Ghi chú cuối:** Toàn bộ roadmap ở Phần B chỉ là "công tắc đã lắp sẵn trong kiến trúc" — về mặt kỹ thuật nên thiết kế DB và flow thanh toán ngay từ Phần A (VD: field `is_paid`, `payment_status` có sẵn nhưng mặc định `null`/`free`), để khi đủ điều kiện chỉ cần bật UI thu phí, không phải build lại từ đầu.

---
---

# PHẦN C — HIỆN TRẠNG NỀN TẢNG (đối chiếu với code thật)

> Mục tiêu của phần này: neo toàn bộ URD vào **những gì đã có sẵn trong repo**, để phần build không lặp lại hạ tầng đã tồn tại và không mâu thuẫn với kiến trúc hiện tại.

### C.1. Stack thực tế (đã chạy production)

| Layer | Công nghệ đang dùng | Ảnh hưởng tới Phần A/B |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript | Mọi tính năng mới là route/segment trong `app/`, dùng **Server Actions** cho mutation (không cần dựng REST riêng) |
| UI | Tailwind CSS v4, design system retro/vintage trong `app/Retro.css` | Tính năng mới **bắt buộc** dùng lại token màu/shadow/font Space Mono có sẵn — không tạo skin mới |
| DB | Supabase Postgres + Prisma 6 | Thêm model vào `prisma/schema.prisma`, chạy `pnpm db:migrate` — **không** đẻ DB thứ 2 |
| Auth | Auth.js v5 (Credentials, JWT, bcrypt) | Đã có `User` + đăng nhập email/mật khẩu → tái dùng làm tài khoản chung cho freelancer, quote, kanban |
| Deploy | Netlify build (Ubuntu) + runtime AWS Lambda; Prisma `binaryTargets` đã cấu hình cho cả 3 môi trường | Cron/newsletter nên chạy qua **GitHub Actions** hoặc **Netlify Scheduled Functions**, tránh long-running trên Lambda |
| SEO | Đã có JSON-LD `JobPosting`, `sitemap.xml`, `robots.ts`, RSS, manifest | Trang `/freelancer/[username]` phải nối vào `sitemap.ts` + thêm JSON-LD `Person`/`ProfilePage` |

### C.2. Model dữ liệu đang có

- `User`: `id (cuid)`, `email (unique)`, `passwordHash`, `name?`, `role ("USER"|"ADMIN")`, `createdAt`, `jobs[]`.
- `Job`: đã có sẵn 2 field kiếm tiền — `featured (Boolean, admin-gated)` và `status ("PENDING"|"PUBLISHED"|"CLOSED")`. **Đây chính là "công tắc" mà Phần B nhắc tới, một phần đã lắp sẵn.**

### C.3. Ba điểm cần đính chính so với bản nháp Phần A

1. **A.2 — "Script đọc feed.xml":** `app/feed.xml/route.ts` hiện **sinh RSS động từ DB** (không phải file tĩnh). Newsletter nên **truy vấn Prisma trực tiếp** (`Job` where `status = PUBLISHED`, `createdAt` trong 7 ngày) thay vì parse lại XML — cùng nguồn dữ liệu, bớt 1 vòng chuyển đổi.
2. **A.4 — kéo-thả:** `react-beautiful-dnd` đã ngừng bảo trì → dùng **`dnd-kit`** (React 19 tương thích tốt).
3. **Vai trò freelancer:** không tạo bảng account riêng. Freelancer = một `User` có thêm quan hệ 1–1 `FreelancerProfile` (xem Phần D). Một tài khoản có thể vừa đăng tin (recruiter) vừa có hồ sơ (freelancer).

---

# PHẦN D — LƯỢC ĐỒ DỮ LIỆU (Prisma) — thay cho pseudocode

> Viết theo đúng convention của `schema.prisma` hiện tại (id `cuid`, quan hệ `onDelete`, `@@index`). Toàn bộ field kiếm tiền để **mặc định free/null** — đúng nguyên tắc "lắp công tắc sẵn" của Phần B.

### D.1. FreelancerProfile (A.1)

```prisma
model FreelancerProfile {
  id       String @id @default(cuid())
  userId   String @unique
  user     User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  username      String  @unique          // slug cho URL /freelancer/[username]
  displayName   String
  avatarUrl     String?
  headline      String?                  // 1 dòng pitch
  bio           String
  skills        String                   // CSV — cùng convention với Job.skills
  portfolioUrl  String?
  rateReference String?                  // vd "500k-1tr/dự án"

  contactEmail String?
  contactPhone String?

  // Hooks Phần B — mặc định mở/free, siết sau mà không đổi schema
  availability String  @default("OPEN")   // "OPEN" | "BUSY" | "HIDDEN"
  visibility   String  @default("PUBLIC") // "PUBLIC" | "UNLISTED"
  isFeatured   Boolean @default(false)    // tương lai: recruiter trả phí đẩy hồ sơ

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([availability])
  @@index([isFeatured])
}
```

### D.2. Subscriber + DigestLog (A.2)

```prisma
model Subscriber {
  id           String  @id @default(cuid())
  email        String  @unique
  status       String  @default("PENDING")  // "PENDING" | "CONFIRMED" | "UNSUBSCRIBED"
  confirmToken String? @unique               // double opt-in
  unsubToken   String  @unique @default(cuid())
  source       String?                       // "home" | "footer" | "job-page"
  createdAt    DateTime  @default(now())
  confirmedAt  DateTime?

  @@index([status])
}

model DigestLog {                             // audit mỗi lần gửi digest
  id         String   @id @default(cuid())
  sentAt     DateTime @default(now())
  jobCount   Int
  recipients Int
  subject    String
}
```

### D.3. Quote + QuoteItem (A.3)

```prisma
model Quote {
  id         String  @id @default(cuid())
  userId     String?                          // null = khách vãng lai (lưu localStorage)
  user       User?   @relation(fields: [userId], references: [id], onDelete: SetNull)

  clientName String
  currency   String  @default("VND")
  taxRate    Float?  @default(0)              // %
  discount   Float?  @default(0)              // %
  notes      String?
  total      Int                              // tổng đã tính, cache lại
  publicSlug String? @unique                  // link xem online /quote/[slug]

  items     QuoteItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model QuoteItem {
  id        String @id @default(cuid())
  quoteId   String
  quote     Quote  @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  label     String
  unitPrice Int
  quantity  Int    @default(1)
  order     Int    @default(0)
}
```

### D.4. ApplicationCard — Mini Kanban (A.4)

```prisma
model ApplicationCard {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  jobId  String?                              // set khi auto-tạo từ apply on-platform
  job    Job?   @relation(fields: [jobId], references: [id], onDelete: SetNull)

  title          String                       // snapshot tên job
  company        String?
  link           String?
  notes          String?
  column         String   @default("SENT")    // "SENT" | "TALKING" | "OFFER" | "REJECTED"
  order          Int      @default(0)         // vị trí trong cột
  nextFollowUpAt DateTime?                     // cho nhắc follow-up (nice-to-have)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, column])
}
```

### D.5. Payment — module dùng chung cho toàn bộ Phần B

```prisma
model Payment {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id])

  purpose   String                            // "JOB_POST" | "FEATURED" | "PROFILE_ACCESS" | "SUBSCRIPTION"
  refId     String?                           // vd Job.id đang được trả phí
  amount    Int
  currency  String  @default("VND")
  method    String  @default("BANK_QR")       // "BANK_QR" | "MOMO" | "GATEWAY"
  status    String  @default("PENDING")       // "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  reference String?                           // nội dung CK / mã giao dịch cổng
  paidAt    DateTime?
  createdAt DateTime @default(now())

  @@index([status])
  @@index([purpose])
}
```

### D.6. Bổ sung quan hệ vào model có sẵn

```prisma
// User — thêm các quan hệ ngược:
//   profile   FreelancerProfile?
//   quotes    Quote[]
//   cards     ApplicationCard[]
//   payments  Payment[]

// Job — hooks Phần B (giữ mặc định "free", chỉ bật UI sau):
//   plan      String    @default("FREE")   // "FREE" | "PAID_30" | "PAID_60"
//   expiresAt DateTime?                     // hết hạn hiển thị tin trả phí
//   cards     ApplicationCard[]
//   (featured Boolean — ĐÃ CÓ, dùng lại cho Giai đoạn 2)
```

---

# PHẦN E — TIÊU CHÍ NGHIỆM THU (Definition of Done)

> Mỗi tính năng chỉ coi là "xong" khi thoả **tất cả** tiêu chí dưới. Dùng làm checklist review + QA.

### E.1. Freelancer Profile
- [ ] Tạo/sửa hồ sơ qua Server Action, validate server-side (độ dài field, URL `http(s)`, `username` `^[a-z0-9-]{3,30}$` unique).
- [ ] `/freelancer/[username]` SSR, có `<title>`/meta/canonical + JSON-LD `ProfilePage`, index được bởi Google.
- [ ] Có trong `sitemap.ts`; hồ sơ `visibility = UNLISTED` bị loại khỏi sitemap và trang danh sách.
- [ ] Danh sách `/freelancers` lọc theo kỹ năng ở **DB-level** (không lọc client), có phân trang giống trang job.
- [ ] Nút liên hệ (email/portfolio) hiển thị công khai; email bọc chống scrape cơ bản.
- [ ] Chống spam: rate-limit tạo hồ sơ theo user/IP; 1 user = 1 hồ sơ.

### E.2. AI Jobs Digest
- [ ] Form đăng ký (home + footer) → tạo `Subscriber` `PENDING`, gửi email **double opt-in**.
- [ ] Link confirm đổi trạng thái `CONFIRMED`; mỗi email có link **unsubscribe 1-click** (dùng `unsubToken`).
- [ ] Cron hằng tuần: query job 7 ngày, render template HTML, gửi qua email provider, ghi `DigestLog`.
- [ ] Không gửi cho `PENDING`/`UNSUBSCRIBED`; xử lý bounce cơ bản.
- [ ] Chống double-submit + honeypot ở form.

### E.3. Tool báo giá
- [ ] Thêm/xoá/sửa hạng mục, tự tính tổng + thuế + chiết khấu, cập nhật realtime.
- [ ] Xuất PDF client-side, layout theo skin retro, có dòng "Tạo bởi AIWORK SEA" cuối trang (không watermark chặn).
- [ ] Khách chưa đăng nhập: lưu `localStorage`; đã đăng nhập: lưu DB + xem lại lịch sử.
- [ ] (Should) Link chia sẻ `/quote/[slug]` xem online, read-only.

### E.4. Mini Kanban
- [ ] 4 cột cố định; thêm card thủ công; kéo-thả (dnd-kit) lưu `column` + `order` qua Server Action.
- [ ] Auto-tạo card khi apply job on-platform (link `jobId`), snapshot `title`/`company`.
- [ ] Dữ liệu gắn theo `userId`, không rò rỉ card giữa user; xoá tài khoản → cascade.

---

# PHẦN F — ĐO LƯỜNG & KPI (điều kiện kích hoạt Phần B)

> **Đây là mắt xích còn thiếu của Phần B:** mọi "trigger" đều dựa trên số liệu, nhưng chưa định nghĩa cách đo. Không đo được thì không bao giờ biết khi nào bật thu phí.

### F.1. Công cụ đo
- **Traffic:** dùng **Umami** (self-host, không cookie) — nhẹ, tôn trọng quyền riêng tư, nhất quán cam kết minh bạch với freelancer. Tránh GA.
- **Số liệu nội bộ:** thêm trang `/admin/metrics` (role ADMIN) đọc trực tiếp từ DB.

### F.2. Bảng số liệu cần theo dõi và cách tính

| KPI | Cách tính (nguồn) | Ngưỡng mở tính năng |
|---|---|---|
| Tin đăng/tháng | `count(Job where createdAt ≥ now-30d and status != PENDING)` | ≥ 20–30 → Giai đoạn 1 |
| Traffic/tháng | Unique visitors từ analytics | ≥ 3–5k → Giai đoạn 1 |
| Nhà tuyển dụng trả phí | `count(distinct Payment.userId where purpose='JOB_POST' and status='PAID')` | ≥ 5–10 → Giai đoạn 2 |
| Hồ sơ chất lượng | `count(FreelancerProfile where bio != '' and skills != '' and portfolioUrl not null)` | ≥ 50–100 → Giai đoạn 3 |
| Subscriber xác nhận | `count(Subscriber where status='CONFIRMED')` | ≥ 500–1.000 → Giai đoạn 4 |
| Recruiter quay lại | `count(User có ≥ 2 Job ở 2 mốc thời gian khác nhau)` | ≥ 20 → Giai đoạn 5 |

### F.3. Sự kiện cần bắt (event tracking tối thiểu)
`profile_created`, `profile_viewed`, `contact_clicked`, `newsletter_subscribed`, `newsletter_confirmed`, `quote_created`, `quote_pdf_exported`, `kanban_card_created`, `job_apply_clicked`. → Đây là dữ liệu để chứng minh "giá trị 2 chiều" trước khi chào thu phí.

---

# PHẦN G — MODULE THANH TOÁN DÙNG CHUNG (chi tiết cho Phần B)

> Phần B nhắc "xây 1 module dùng chung" nhưng chưa spec. Đây là bản thiết kế tối giản, hợp mô hình **một-mình-vận-hành** và **nền tảng không giữ tiền** (đúng README hiện tại).

| # | Yêu cầu | Ghi chú |
|---|---|---|
| 1 | Tạo bản ghi `Payment` `PENDING` khi user chọn tính năng trả phí | `purpose` + `refId` trỏ tới đối tượng (Job/Profile…) |
| 2 | Hiển thị **VietQR/QR ngân hàng** với nội dung CK = mã `Payment.id` rút gọn | Không tích hợp cổng phức tạp ở v1 |
| 3 | Đối soát: (a) thủ công qua `/admin/payments`, hoặc (b) **webhook** từ dịch vụ như SePay đọc biến động số dư | Bắt đầu bằng thủ công, lên webhook khi đủ volume |
| 4 | Khi `PAID`: kích hoạt hệ quả (đổi `Job.plan`/`expiresAt`, bật `featured`, mở add-on hồ sơ) | Logic kích hoạt tách riêng theo `purpose` |
| 5 | Idempotent: 1 giao dịch không kích hoạt 2 lần; lưu `reference` chống trùng | |
| 6 | Không lưu thông tin thẻ; nền tảng **không custody tiền** giữa recruiter–freelancer | Giữ rủi ro pháp lý thấp như mô hình hiện tại |

---

# PHẦN H — YÊU CẦU PHI CHỨC NĂNG (NFR)

| Nhóm | Yêu cầu |
|---|---|
| Hiệu năng | Trang public SSR/ISR, LCP < 2.5s; danh sách lọc/tìm ở DB-level (đã là chuẩn của repo); ảnh avatar tối ưu qua `next/image` |
| SEO | Mọi trang public có canonical + meta; hồ sơ freelancer JSON-LD `ProfilePage`; nối sitemap; giữ chuẩn JSON-LD `JobPosting` đã có |
| A11y | WCAG 2.1 AA: aria-label, focus ring, tương phản màu đạt chuẩn kể cả trên nền giấy retro; kéo-thả kanban có fallback bàn phím |
| Bảo mật | Tái dùng rate-limit + honeypot + validate server-side đã có; mọi mutation qua Server Action (CSRF-safe); phân quyền theo `userId`/`role` |
| Riêng tư | Double opt-in cho email; unsubscribe 1-click; freelancer tự bật/tắt `visibility`; ẩn liên hệ được nếu muốn (dù mặc định mở) |
| i18n | `vi` là ngôn ngữ chính; tách chuỗi để thêm `en` sau (nhiều freelancer AI SEA đọc tiếng Anh) |
| Vận hành | Cron qua GitHub Actions/Netlify Scheduled Functions (free tier); log gửi mail vào `DigestLog`; backup DB dựa hạ tầng Supabase |

---

# PHẦN I — PHÁP LÝ & QUYỀN RIÊNG TƯ

| Chủ đề | Cần làm |
|---|---|
| Hồ sơ công khai = lộ PII | Có checkbox đồng ý công khai khi tạo hồ sơ; cho phép ẩn/xoá hồ sơ bất cứ lúc nào (quyền được lãng quên) |
| Email marketing | Double opt-in + unsubscribe theo thông lệ CAN-SPAM/PDPD (Nghị định 13/2023 VN về bảo vệ dữ liệu cá nhân) |
| Trang pháp lý | Bổ sung `/privacy` và `/terms`; nêu rõ nền tảng **không** trung gian thanh toán/không giữ tiền (giảm rủi ro tranh chấp) |
| Cam kết "freelancer luôn free" | Ghi thành chính sách công khai; Phần B chỉ bán **add-on cho recruiter**, không đóng lại dữ liệu đã mở miễn phí (nhất quán với Giai đoạn 3) |

---

# PHẦN J — RỦI RO & GIẢM THIỂU

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Traffic không đạt ngưỡng → Phần B không bao giờ kích hoạt | Cao | Ưu tiên A.2 (newsletter) + A.1 (SEO profiles) để bơm traffic hữu cơ; đo hằng tuần ở `/admin/metrics` |
| Hồ sơ giả/spam làm loãng chất lượng | Trung bình | Bắt đăng nhập, rate-limit, tiêu chí "hồ sơ chất lượng" ở F.2, admin có thể ẩn |
| Email vào spam / deliverability kém | Trung bình | Dùng provider có domain reputation (Resend/Brevo), cấu hình SPF/DKIM, double opt-in |
| Freelancer mất lòng tin nếu tưởng bị paywall | Cao | Truyền thông rõ "add-on cho recruiter", không đụng dữ liệu miễn phí đã mở (Giai đoạn 3) |
| Một-mình-vận-hành (bus factor) | Cao | Ưu tiên tính năng ít bảo trì; cron tự động; tài liệu hoá; tránh tích hợp nặng ở v1 |
| Đối soát thanh toán thủ công tốn thời gian | Thấp→TB | Lên webhook (SePay) khi volume tăng; giữ thủ công khi còn ít |

---

# PHẦN K — BACKLOG & MILESTONE TỔNG HỢP

| Milestone | Trạng thái | Nội dung | Cổng chuyển tiếp |
|---|---|---|---|
| **M0 — Nền** | ✅ Đã build | Thêm **toàn bộ** model D.1–D.6 + quan hệ, migration SQL sẵn; `/admin/metrics` (Phần F) | Schema sẵn cho mọi tính năng Phần A |
| **M2 — Profiles (A.1)** | ✅ Đã build | Form + `/freelancer/[username]` + `/freelancers` + SEO (JSON-LD ProfilePage, sitemap) | Bắt đầu tích hồ sơ |
| **M3 — Báo giá (A.3)** | ✅ Đã build | Builder + tính tổng/thuế/chiết khấu + xuất PDF (print-to-PDF) + lưu localStorage | Tăng retention |
| **M4 — Kanban (A.4)** | ✅ Đã build | `/tracker` board 4 cột + kéo-thả dnd-kit + nút "Lưu vào bảng theo dõi" trên tin việc | Khoá chân freelancer |
| **M1 — Newsletter (A.2)** | ✅ Đã build | Form (home + footer) + double opt-in + confirm/unsub + `/api/digest` + GitHub Action tuần | Bắt đầu tích subscriber |
| **M5 — Monetization prep** | 🔒 Chưa mở | Payment module (Phần G) + hooks Job đã có sẵn, UI ẩn | Chỉ **bật** khi F.2 chạm ngưỡng Giai đoạn 0 |

> **Toàn bộ Phần A (M0–M4) đã build xong.** Còn lại là cấu hình vận hành, không phải code:
> 1. **Migration** ở `prisma/migrations/20260707120000_add_part_a_models/` **chưa** apply lên Supabase (tránh đụng DB production). Chạy `pnpm db:deploy` (prod) / `pnpm db:migrate` (local) khi sẵn sàng.
> 2. **Newsletter gửi thật** cần env `RESEND_API_KEY` + `RESEND_FROM` (không có key thì app vẫn chạy, chỉ log link xác nhận ra console để test).
> 3. **Cron digest** cần secret repo `SITE_URL` + `CRON_SECRET` (khớp env app) cho GitHub Action `.github/workflows/digest.yml`.
> 4. **Umami** (analytics/traffic) cài riêng khi cần đo mốc Giai đoạn 1.

---

# PHẦN L — QUYẾT ĐỊNH KỸ THUẬT ĐÃ CHỐT

> Chốt theo bộ mặc định đã đề xuất — đều free/nhẹ, hợp mô hình một-mình-vận-hành. Các phần A / F / G ở trên đã được cập nhật khớp với bảng này (không còn lựa chọn treo).

| # | Hạng mục | Quyết định | Lý do |
|---|---|---|---|
| 1 | Email provider (M1) | **Resend** | API/DX gọn cho Next.js, domain reputation tốt, free-tier đủ giai đoạn đầu; cấu hình SPF/DKIM chống spam |
| 2 | Analytics (F.1) | **Umami** (self-host) | Nhẹ, không cookie, tôn trọng quyền riêng tư — nhất quán cam kết minh bạch với freelancer |
| 3 | Xuất PDF (A.3) | **Print-to-PDF của trình duyệt** (đã build) | Phát hiện khi build: `@react-pdf/renderer` render **sai dấu tiếng Việt** với font mặc định (cần nhúng font TTF Việt, nặng + mong manh). Print-to-PDF: 0 dependency, tiếng Việt luôn đúng (dùng font hệ thống), khớp skin retro sẵn. `@react-pdf/renderer` để dành khi cần template PDF phức tạp + đã nhúng font Việt |
| 4 | Payment provider (G) | **SePay** (khi lên webhook) | Đọc biến động số dư ngân hàng VN, hợp đối soát tự động; v1 vẫn đối soát thủ công |
| 5 | Vai trò freelancer | Giữ **`role = "USER"` + `FreelancerProfile?` 1–1** | Không đẻ account mới; 1 user vừa là recruiter vừa là freelancer; đơn giản hoá auth |
| 6 | Kéo-thả Kanban (A.4) | **dnd-kit** | `react-beautiful-dnd` đã ngừng bảo trì; dnd-kit tương thích React 19 |
| 7 | Ngôn ngữ | `vi` trước, **`en` để sau M4** | Tách chuỗi (i18n-ready) sẵn để thêm `en` không phải refactor |

**Dependency đã cài:** `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` (M4). M1 gọi Resend qua REST bằng `fetch` nên **không** cần SDK `resend`; M3 dùng print-to-PDF nên cũng không cần thêm gì. Env đã thêm sẵn vào `.env.example`: `RESEND_API_KEY`, `RESEND_FROM`, `CRON_SECRET`, `SEPAY_WEBHOOK_SECRET` (để trống tới M5). Còn lại: self-host Umami khi cần đo traffic.