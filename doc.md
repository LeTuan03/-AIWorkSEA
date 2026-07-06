# Ý tưởng sản phẩm cho freelancer — & quyết định

## Các hướng đã cân nhắc

1. **Tool tạo báo giá/hợp đồng tự động** cho freelancer — rủi ro thấp, ra tiền nhanh.
2. **Tool theo dõi thời gian + xuất hóa đơn** cho freelancer VN (thuế, VAT, hóa đơn
   điện tử) — bán được giá nhưng khó, dính pháp lý → **để giai đoạn sau**.
3. **Job board ngách một chiều** — chỉ tổng hợp & đăng tin tuyển freelancer IT theo
   ngách, thu tiền nhà tuyển dụng (giống VietnamWorks nhưng ngách hẹp). Không xử lý
   thanh toán/tranh chấp → rủi ro thấp nhất.

## Quyết định (chiến lược wedge)

Bắt đầu bằng **#3 — Job board ngách: "freelancer AI/Automation ở Đông Nam Á"**.
→ Sau đó cross-sell **#1** cho tệp freelancer đã có. → Để dành **#2** làm sản phẩm
cao cấp về sau.

## Đã build (MVP)

Đã dựng xong và chạy được tại `http://localhost:3000`:

- Duyệt việc + tìm kiếm + lọc (lĩnh vực / địa điểm), tin **Nổi bật** ghim đầu.
- Trang chi tiết việc (SSR + SEO), nút ứng tuyển trực tiếp (link/email).
- Trang đăng tin cho nhà tuyển dụng + validation + gói Featured (mô hình doanh thu).
- 12 tin mẫu AI/Automation khắp SEA.

Stack: Next.js 15 + TypeScript + Tailwind v4 + Prisma/PostgreSQL. Chi tiết cách chạy &
lộ trình production xem **[README.md](README.md)**.

## Bản nâng cấp sẵn sàng triển khai (hardening)

Sau khi audit khách quan (bảo mật, SEO/scale, UX/độ bền), đã nâng MVP thành ứng dụng
có kiểm soát:

- **Tài khoản nhà tuyển dụng** (Auth.js v5, email+mật khẩu) + bảng điều khiển quản lý tin.
- **Kiểm duyệt**: tin mới `PENDING`, admin duyệt tại `/admin` mới hiển thị.
- **Chống lạm dụng**: rate-limit, honeypot, giới hạn độ dài, validate ngân sách/tiền tệ, Featured chỉ admin.
- **PostgreSQL** + Prisma migrations (thay SQLite).
- **SEO**: JSON-LD JobPosting (Google Jobs), sitemap, robots, canonical, metadata, favicon.
- **Scale**: lọc + phân trang ở DB (bỏ lọc in-memory).
- **Độ bền/UX**: error boundaries, loading skeleton, giữ dữ liệu form khi lỗi, ESLint, a11y.
