# AIWork SEA

Job board ngách cho freelancer **AI & Automation** ở **Đông Nam Á**.

Mô hình một chiều (không marketplace hai chiều): nhà tuyển dụng đăng tin, freelancer
tìm và ứng tuyển **trực tiếp** qua link/email. Nền tảng **không** giữ tiền, không trung
gian thanh toán → rủi ro pháp lý/tranh chấp thấp.

## Tính năng

**Công khai**
- Trang chủ (`/`) — hero + **duyệt theo lĩnh vực** (có đếm), khu **Tin nổi bật**, dải số liệu.
- Tìm kiếm & lọc ở **DB-level**: từ khóa, lĩnh vực, địa điểm, **sắp xếp** (mới nhất / ngân sách), toggle **Remote**, **phân trang có số trang**.
- Chi tiết việc (`/jobs/[id]`) — SSR, **JSON-LD JobPosting** (Google Jobs), canonical, breadcrumb, **việc tương tự**, nút **chia sẻ**, nút ứng tuyển.
- **Hồ sơ công ty** (`/companies`, `/companies/[name]`) — gom tin theo nhà tuyển dụng.
- **RSS** (`/feed.xml`), `sitemap.xml`, `robots.txt`, favicon, manifest.

**Giao diện / UX**
- Brand mới: gradient **violet→fuchsia**, khối tối có glow, font display **Space Grotesk** (next/font).
- **Header có menu mobile**, active state; **Toast** thông báo; **modal xác nhận** khi đóng/từ chối/gỡ tin.
- Skeleton loading cho bảng điều khiển & quản trị; a11y (aria-label, focus ring).

**Nhà tuyển dụng** (cần đăng nhập)
- Đăng ký / đăng nhập (email + mật khẩu).
- Đăng tin (`/post`) — validate chặt, chống spam (rate-limit + honeypot), giữ dữ liệu khi lỗi.
- Bảng điều khiển (`/dashboard`) — quản lý, sửa, đóng tin của mình (kiểm tra quyền sở hữu).

**Admin**
- Kiểm duyệt (`/admin`) — duyệt/từ chối tin `PENDING`, bật/tắt **Featured** (kiếm tiền, admin-gated).

## Bảo mật & chống lạm dụng

- Đăng tin **bắt buộc đăng nhập**; tin mới ở trạng thái `PENDING`, chỉ hiển thị sau kiểm duyệt.
- **Rate-limit**: tối đa 10 tin/user/giờ; giới hạn signup/login theo IP; honeypot chống bot.
- **Validate server-side**: giới hạn độ dài mọi trường, ngân sách ≥ 0, allowlist lĩnh vực/địa điểm/tiền tệ, URL phải `http(s)`.
- **Featured** không thể tự bật qua form công khai — chỉ admin.
- Middleware chặn `/post`, `/dashboard` (đăng nhập) và `/admin` (role ADMIN).

## Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Ngôn ngữ | TypeScript |
| UI | Tailwind CSS v4 |
| DB | **Supabase Postgres** + Prisma (migrations) |
| Auth | Auth.js v5 (Credentials, JWT, bcrypt) |
| Mutations | Server Actions |

## Chạy local

**1. Yêu cầu:** Node 20+, pnpm, một project Supabase (Postgres).

**2. Cấu hình env** — copy `.env.example` → `.env`, lấy connection string từ
Supabase dashboard (Project Settings → Database → Connection string) và điền:
```
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:5432/postgres"
AUTH_SECRET="<openssl rand -base64 32>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```
> `DATABASE_URL` dùng transaction pooler (6543) cho runtime; `DIRECT_URL` dùng
> session pooler (5432) cho `prisma migrate`. URL-encode ký tự đặc biệt trong
> password (vd `@` → `%40`).

**3. Cài & khởi tạo:**
```bash
pnpm install
pnpm prisma migrate dev   # tạo bảng
pnpm db:seed              # nạp dữ liệu mẫu + tài khoản demo
pnpm dev                  # http://localhost:3000
```

### Tài khoản demo (từ seed — đổi/xóa trước production)
| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | `admin@aiworksea.local` | `admin123456` |
| Recruiter | `demo@aiworksea.local` | `demo123456` |

### Scripts
```bash
pnpm db:migrate   # prisma migrate dev
pnpm db:deploy    # prisma migrate deploy (production)
pnpm db:seed      # seed dữ liệu
pnpm db:reset     # reset + seed lại
pnpm db:studio    # Prisma Studio
pnpm lint         # ESLint
pnpm build        # build production
```

## Cấu trúc

```
app/
  page.tsx                       # duyệt việc (lọc DB + phân trang)
  jobs/[id]/page.tsx             # chi tiết + JSON-LD + canonical
  post/{page,actions}.tsx        # đăng tin (auth + validate + rate-limit)
  dashboard/{page,actions}.tsx   # bảng điều khiển recruiter (sửa/đóng)
  dashboard/jobs/[id]/edit/      # trang sửa tin (ownership)
  admin/{page,actions}.tsx       # kiểm duyệt + featured (ADMIN)
  login, signup, (auth)/actions  # xác thực
  api/auth/[...nextauth]         # Auth.js handlers
  sitemap.ts, robots.ts, manifest.ts, icon.svg
  error.tsx, global-error.tsx, loading.tsx
auth.ts, auth.config.ts, middleware.ts   # Auth.js + bảo vệ route
lib/
  db.ts, session.ts, rate-limit.ts
  jobs.ts            # query + phân trang + format
  job-validation.ts  # validate dùng chung create/edit
  constants.ts       # taxonomy, limits, mã quốc gia
  seo.ts             # JSON-LD JobPosting
components/          # Header, Footer, JobCard, Filters, Pagination, JobForm, ...
prisma/              # schema.prisma, migrations/, seed.ts
```

## Ghi chú
- Cảnh báo build `jose ... CompressionStream ... Edge Runtime` là **vô hại** (nhánh nén JWE không dùng của Auth.js v5).
- `.env` đã ở trong `.gitignore` — không commit secret. Đổi `AUTH_SECRET` và mật khẩu DB khi lên production.

### Lộ trình tiếp theo
- [ ] Thanh toán thật cho Featured (Stripe / cổng nội địa VN).
- [ ] Rate-limit phân tán (Redis/Upstash) khi chạy nhiều instance.
- [ ] Email thông báo (duyệt tin, ứng tuyển) + OAuth đăng nhập.
- [ ] OG image động, trang company, lọc nâng cao.
