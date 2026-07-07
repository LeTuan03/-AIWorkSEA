# CONFIG — AIWork SEA (Phần A: Freelancer features)

Hướng dẫn cấu hình để chạy toàn bộ tính năng Phần A (hồ sơ freelancer, báo giá,
kanban theo dõi ứng tuyển, newsletter). Bám sát code đã build — xem roadmap ở
[Urdaiworksea.md](./Urdaiworksea.md).

> **Nguyên tắc:** app **degrade an toàn**. Thiếu key newsletter/analytics vẫn chạy
> bình thường, chỉ tắt phần liên quan (chi tiết ở [§6](#6-ma-trận-tính-năng--config)).

---

## 0. TL;DR — tối thiểu để chạy

| Việc | Lệnh / biến |
|---|---|
| Cài | `pnpm install` |
| Env tối thiểu | `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` |
| Tạo bảng | `pnpm db:migrate` (local) hoặc `pnpm db:deploy` (prod) |
| Dữ liệu mẫu | `pnpm db:seed` |
| Chạy | `pnpm dev` → http://localhost:3000 |

Newsletter gửi thật, cron digest, analytics là **tùy chọn** — bật sau khi cần.

---

## 1. Yêu cầu

- **Node 20+**, **pnpm** (`npm i -g pnpm`).
- Một project **Supabase** (Postgres). Không cần dịch vụ nào khác để chạy Phần A cơ bản.

---

## 2. Biến môi trường (đầy đủ)

Copy `.env.example` → `.env` rồi điền. Bảng dưới liệt kê **tất cả** biến app dùng:

| Biến | Bắt buộc | Dùng cho | Lấy ở đâu |
|---|:---:|---|---|
| `DATABASE_URL` | ✅ | Mọi truy vấn DB (runtime) | Supabase → Settings → Database → Connection string, **transaction pooler** (port `6543`, có `?pgbouncer=true`) |
| `DIRECT_URL` | ✅ | `prisma migrate` (không pool) | Cùng nơi, **session pooler** (port `5432`) |
| `AUTH_SECRET` | ✅ | Ký session (Auth.js) | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical, sitemap, link trong email | VD `http://localhost:3000` (local) / `https://aiworksea.com` (prod) |
| `RESEND_API_KEY` | ⬜ | Gửi email newsletter | [resend.com](https://resend.com) → API Keys. **Trống = không gửi, chỉ log link xác nhận ra console** |
| `RESEND_FROM` | ⬜ | Địa chỉ gửi | VD `AIWork SEA <digest@yourdomain.com>`. Trống = dùng `onboarding@resend.dev` |
| `CRON_SECRET` | ⬜ | Bảo vệ endpoint `/api/digest` | `openssl rand -base64 32`. **Trống = endpoint trả 503, không gửi digest** |
| `SEPAY_WEBHOOK_SECRET` | ⬜ | Thanh toán (Phần B, **chưa bật**) | Để trống tới M5 |

> ⚠️ URL-encode ký tự đặc biệt trong password Supabase (vd `@` → `%40`).

### `.env` mẫu

```bash
# --- Database: Supabase Postgres ---
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-1-[REGION].pooler.supabase.com:5432/postgres"

# --- Auth.js ---
AUTH_SECRET="<openssl rand -base64 32>"

# --- Public base URL ---
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# --- Newsletter (tùy chọn) ---
RESEND_API_KEY=""
RESEND_FROM=""
CRON_SECRET=""

# --- Payments (Phần B, chưa bật) ---
SEPAY_WEBHOOK_SECRET=""
```

---

## 3. Thiết lập từng bước

### 3.1. Database + migration

Migration cho toàn bộ model Phần A đã có sẵn tại
`prisma/migrations/20260707120000_add_part_a_models/` (tạo `FreelancerProfile`,
`Subscriber`, `DigestLog`, `Quote`, `QuoteItem`, `ApplicationCard`, `Payment` +
2 cột `plan`/`expiresAt` trên `Job`). **Chưa apply lên DB** — chạy khi sẵn sàng:

```bash
pnpm db:migrate    # local: prisma migrate dev (tạo + apply, có shadow DB)
# hoặc
pnpm db:deploy     # production: prisma migrate deploy (chỉ apply, an toàn)
pnpm db:seed       # (tùy chọn) nạp dữ liệu mẫu + tài khoản demo
```

Các script khác: `pnpm db:reset` (reset + seed), `pnpm db:studio` (mở Prisma Studio).

> **Tài khoản admin** (để vào `/admin` + `/admin/metrics`): tạo user rồi đổi
> `role` thành `ADMIN` trong DB (Prisma Studio hoặc SQL: `UPDATE "User" SET role='ADMIN' WHERE email='ban@email.com';`).

### 3.2. Auth

Chỉ cần `AUTH_SECRET`. Đăng ký/đăng nhập bằng email + mật khẩu đã hoạt động sẵn.
Cùng 1 tài khoản dùng cho recruiter (đăng tin), freelancer (hồ sơ), báo giá và kanban.

### 3.3. Newsletter (Resend)

App gọi Resend qua REST (`fetch`) — **không cần cài SDK**.

1. Tạo tài khoản [resend.com](https://resend.com), lấy **API Key** → `RESEND_API_KEY`.
2. Xác thực domain gửi (thêm bản ghi **SPF + DKIM** Resend cung cấp vào DNS) rồi đặt
   `RESEND_FROM="AIWork SEA <digest@yourdomain.com>"`. Chưa có domain thì bỏ trống
   (dùng `onboarding@resend.dev` để test).
3. **Không set key vẫn test được luồng double opt-in:** app bỏ qua bước gửi và
   **in link xác nhận ra console** (`[newsletter] confirm link for ...`).

Luồng: đăng ký → email xác nhận → `/newsletter/confirm?token=…` → `CONFIRMED`.
Mỗi email digest có link **hủy 1-click** `/newsletter/unsubscribe?token=…`.

### 3.4. Cron gửi digest hằng tuần (GitHub Action)

Endpoint: `POST /api/digest` với header `x-cron-secret: <CRON_SECRET>`. Gửi tổng hợp
job 7 ngày cho subscriber đã `CONFIRMED`, ghi log vào bảng `DigestLog`.

1. Đặt `CRON_SECRET` trong env của app (Netlify).
2. Trong GitHub repo → **Settings → Secrets and variables → Actions** thêm 2 secret:
   - `SITE_URL` = URL production (vd `https://aiworksea.com`)
   - `CRON_SECRET` = **đúng bằng** giá trị env app
3. Workflow [.github/workflows/digest.yml](.github/workflows/digest.yml) chạy **Thứ 2 ~08:00 VN**
   (01:00 UTC). Chạy tay để test: tab **Actions → Weekly AI Jobs Digest → Run workflow**.

Test nhanh bằng curl:

```bash
curl -X POST "$NEXT_PUBLIC_SITE_URL/api/digest" -H "x-cron-secret: $CRON_SECRET"
# → {"sent":N,...} hoặc {"sent":0,"reason":"no new jobs this week"}
```

### 3.5. Analytics / traffic (Umami — tùy chọn)

Cần cho mốc **Giai đoạn 1** (≥ 3–5k traffic/tháng) ở `/admin/metrics` — số này **không**
đo được từ DB. Self-host Umami hoặc dùng Umami Cloud (free), rồi nhúng script tracking
vào `app/layout.tsx`. Chưa cấu hình thì trang metrics vẫn chạy, chỉ ô traffic để trống.

### 3.6. Payments (SePay — Phần B, chưa bật)

Schema `Payment` đã sẵn nhưng **không có UI thu phí**. Để trống `SEPAY_WEBHOOK_SECRET`
tới khi metrics chạm ngưỡng Giai đoạn 0 (xem Phần B/G của URD).

---

## 4. Chạy local

```bash
pnpm install
cp .env.example .env      # rồi điền DATABASE_URL, DIRECT_URL, AUTH_SECRET, NEXT_PUBLIC_SITE_URL
pnpm db:migrate
pnpm db:seed              # tùy chọn
pnpm dev                  # http://localhost:3000
```

Kiểm tra chất lượng trước khi push:

```bash
pnpm lint                 # ESLint
npx tsc --noEmit          # typecheck
pnpm build                # build thật (cần DB truy cập được)
```

---

## 5. Deploy production (Netlify)

Build chạy trên Ubuntu, runtime là AWS Lambda — Prisma `binaryTargets` đã cấu hình sẵn
cho cả hai (không cần chỉnh).

1. **Netlify → Site settings → Environment variables**: thêm tất cả biến `.env`
   (`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL` + các biến
   newsletter/cron nếu bật). Đặt `NEXT_PUBLIC_SITE_URL` = domain thật.
2. Build command: `pnpm build` (đã gồm `prisma generate`). Publish: mặc định của Next.
3. **Apply migration lên DB production**: `pnpm db:deploy` (chạy 1 lần khi schema đổi —
   có thể chạy local trỏ vào `DIRECT_URL` prod, hoặc trong CI).
4. GitHub secrets cho cron: `SITE_URL`, `CRON_SECRET` (xem [§3.4](#34-cron-gửi-digest-hằng-tuần-github-action)).

---

## 6. Ma trận tính năng ↔ config

| Tính năng | Route | Cần config | Nếu thiếu |
|---|---|---|---|
| Hồ sơ freelancer | `/freelancers`, `/freelancer/[username]`, `/freelancer/edit` | DB + Auth | Không chạy (cần DB) |
| Tool báo giá | `/tools/quote` | **Không cần gì** (client + localStorage, print-to-PDF) | Luôn chạy |
| Kanban theo dõi | `/tracker` | DB + Auth | Không chạy (cần đăng nhập) |
| Newsletter — đăng ký/xác nhận | form + `/newsletter/*` | DB | Đăng ký được; **không có key thì link xác nhận chỉ log ra console** |
| Newsletter — gửi digest | `/api/digest` + Action | DB + `RESEND_API_KEY` + `CRON_SECRET` + GitHub secrets | Endpoint trả 503 nếu thiếu `CRON_SECRET`; không gửi nếu thiếu key |
| Trang số liệu | `/admin/metrics` | DB + tài khoản `ADMIN` | Ô traffic trống nếu chưa có Umami |

---

## 7. Checklist smoke test

Sau khi migrate + seed, đăng nhập rồi kiểm:

- [ ] `/freelancer/edit` → tạo hồ sơ → redirect sang `/freelancer/[username]`, có nút liên hệ.
- [ ] `/freelancers` → thấy hồ sơ, lọc theo kỹ năng chạy.
- [ ] `/tools/quote` → thêm hạng mục, tổng tự tính, bấm **In / Lưu PDF** ra bản tiếng Việt đúng dấu.
- [ ] Trang tin `/jobs/[id]` → **Lưu vào bảng theo dõi** → thẻ xuất hiện ở `/tracker`.
- [ ] `/tracker` → kéo-thả thẻ giữa các cột, reload vẫn giữ trạng thái.
- [ ] Footer/trang chủ → đăng ký email → (không có key) link xác nhận in ra console → mở link → toast "Đã xác nhận".
- [ ] `/admin/metrics` (tài khoản admin) → các mốc hiển thị đúng số.

---

## 8. Troubleshooting

| Triệu chứng | Nguyên nhân thường gặp |
|---|---|
| `prisma migrate` treo/timeout | Dùng nhầm `DATABASE_URL` (pooler 6543) cho migrate — phải là `DIRECT_URL` (5432); Prisma đã đọc `directUrl` sẵn, kiểm tra biến này |
| Email không tới | Chưa set `RESEND_API_KEY`, hoặc `RESEND_FROM` chưa xác thực domain (SPF/DKIM) → vào spam |
| `/api/digest` trả 401 | Header `x-cron-secret` không khớp env `CRON_SECRET` |
| `/api/digest` trả 503 | Chưa set `CRON_SECRET` trong env app |
| `{"sent":0,"reason":"no new jobs"}` | Không có tin PUBLISHED trong 7 ngày — bình thường |
| Build lỗi kết nối DB | `pnpm build` render trang phụ thuộc DB → cần DB truy cập được lúc build |
| Kéo-thả kanban không lưu | Kiểm tra đã đăng nhập; `moveCard` chỉ ghi khi mọi card thuộc về user |
