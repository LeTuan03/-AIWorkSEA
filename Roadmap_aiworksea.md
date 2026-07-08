# CHỈ THỊ THỰC THI LIÊN TỤC — AIWORK SEA
**Đây là file lệnh vận hành cho AI (Claude Code hoặc agent tương đương). Dán file này vào đầu mỗi phiên làm việc và ra lệnh: "Đọc file này, thực hiện đúng theo quy trình, không dừng cho đến khi hoàn thiện."**

---

## QUY TẮC VẬN HÀNH BẮT BUỘC CHO AI

1. **Không hỏi lại người dùng những gì đã có trong file này.** Chỉ hỏi khi cần quyết định mang tính kinh doanh không thể tự suy ra (VD: giá tiền cụ thể, tên miền phụ).
2. **Luôn làm theo vòng lặp:** `Thực hiện task → Tự kiểm tra (self-check) → Ghi log trạng thái → Task tiếp theo`. Không dừng lại giữa chừng để chờ xác nhận nếu task nằm trong phạm vi đã cho phép ở dưới.
3. **Không chuyển sang Giai đoạn kế tiếp nếu Giai đoạn hiện tại chưa đạt DoD (Definition of Done).** Nếu chưa đạt, quay lại làm tiếp task còn thiếu của giai đoạn đó — không nhảy cóc.
4. **Sau mỗi task hoàn thành, cập nhật bảng TRẠNG THÁI ở cuối file này** (đánh dấu ✅/⚠️/❌) để phiên làm việc sau (kể cả người khác hoặc AI khác) biết chính xác đang ở đâu, không cần hỏi lại từ đầu.
5. **Khi hết task trong giai đoạn hiện tại nhưng gate (điều kiện số liệu) chưa đạt** (ví dụ cần đủ traffic, đủ số hồ sơ) — đây là việc **cần thời gian thực tế trôi qua**, không phải việc AI có thể tự làm xong ngay. AI ghi rõ trạng thái "Đang chờ đạt gate — cần theo dõi số liệu" và chuyển sang phần "Việc có thể làm trong lúc chờ" thay vì đứng im.
6. **Không tự ý bật tính năng thu phí nào ở Giai đoạn 4 khi gate chưa đạt**, kể cả khi code đã sẵn sàng về mặt kỹ thuật.
7. **Hoàn thiện = tất cả các giai đoạn 0–4 đạt DoD + Gate, và Giai đoạn 5 đã có ít nhất 1 hướng mở rộng được lên kế hoạch cụ thể.** Chỉ dừng vòng lặp khi đạt điều kiện này.

---

## VÒNG LẶP THỰC THI CHÍNH (AI chạy lại điều này mỗi phiên)

```
BẮT ĐẦU
  Đọc bảng TRẠNG THÁI cuối file → xác định giai đoạn hiện tại
  WHILE (chưa đạt điều kiện "Hoàn thiện" ở Quy tắc #7):
      task_list = Lấy danh sách task CHƯA ✅ của giai đoạn hiện tại
      IF task_list rỗng:
          IF gate của giai đoạn hiện tại đã đạt:
              Chuyển sang giai đoạn kế tiếp
              CONTINUE
          ELSE:
              Chuyển sang mục "Việc có thể làm trong lúc chờ gate"
              Thực hiện các việc đó (networking, content, outreach...)
              Ghi log "Đang chờ số liệu X đạt Y" 
              CONTINUE (không dừng hẳn, vẫn có việc để làm)
      ELSE:
          Lấy task đầu tiên trong task_list
          Thực hiện task (code, cấu hình, viết nội dung...)
          Tự kiểm tra kết quả (chạy thử, xem log, kiểm tra hiển thị)
          IF kiểm tra OK:
              Đánh dấu ✅, cập nhật bảng TRẠNG THÁI
          ELSE:
              Sửa lỗi, thử lại (tối đa 3 lần), nếu vẫn lỗi → ghi log chi tiết lỗi, đánh dấu ⚠️, chuyển sang task tiếp theo (không kẹt vô hạn ở 1 task)
  KẾT THÚC — Báo cáo tổng kết toàn bộ roadmap đã hoàn thiện
```

---

## GIAI ĐOẠN 0 — NỀN TẢNG ĐO LƯỜNG

**DoD:** Trang `/admin/stats` hiển thị đủ 5 số liệu, cập nhật hàng ngày.

### Task queue
1. Cài Plausible Analytics (hoặc GA4 nếu Plausible không khả thi) — thêm script tracking vào layout chung.
2. Track event `job_view` khi user mở trang chi tiết job.
3. Track event `job_apply_click` khi user bấm nút ứng tuyển.
4. Track event `profile_created` khi freelancer submit form tạo hồ sơ.
5. Track event `newsletter_signup` khi submit form đăng ký email.
6. Track event `quote_tool_used` khi user xuất PDF báo giá.
7. Tạo route `/admin/stats` — bảo vệ bằng auth đơn giản (chỉ chủ sở hữu truy cập).
8. Trang `/admin/stats` gọi API/DB để hiển thị: tổng traffic tháng này, số tin đăng mới tháng này, tổng số hồ sơ freelancer, tổng subscriber, số lượt dùng tool báo giá tháng này.
9. Kiểm tra cron gửi Newsletter: chạy thử 1 lần, xác nhận email thực sự được gửi (không chỉ lưu DB).

**Việc có thể làm trong lúc chờ gate:** Không có gate số liệu ở giai đoạn này — chỉ cần hoàn thành task queue là xong, chuyển ngay sang Giai đoạn 1.

---

## GIAI ĐOẠN 1 — SEED CUNG (FREELANCER)

**DoD kỹ thuật:** Mini Kanban hoạt động, CTA tạo hồ sơ nổi bật ở trang chủ, có cơ chế gợi ý tạo hồ sơ sau khi dùng tool báo giá.
**Gate để qua Giai đoạn 2:** ≥ 50 hồ sơ freelancer HOẶC ≥ 200 lượt dùng tool báo giá/tháng.

### Task queue (kỹ thuật)
1. Thêm section CTA lớn ở trang chủ: "Tạo hồ sơ miễn phí — được nhà tuyển dụng chủ động liên hệ", link thẳng đến `/freelancer/edit`.
2. Sau khi tool báo giá xuất PDF thành công, hiện modal: "Muốn được nhà tuyển dụng tìm thấy? Tạo hồ sơ miễn phí trong 2 phút" + nút CTA.
3. Xây Mini Kanban: board 4 cột (Đã gửi/Đang trao đổi/Đã nhận/Từ chối), cho phép thêm card thủ công, kéo-thả giữa cột (dùng `dnd-kit`).
4. Tích hợp: khi freelancer bấm "Ứng tuyển" 1 job trên chính AIWORK SEA, tự động tạo card tương ứng trong Kanban của họ.
5. Thêm field `is_verified` (boolean) trong bảng freelancers — hiển thị badge "Đã xác thực" khi true.
6. Tạo route admin đơn giản để tự tay set `is_verified = true` cho hồ sơ đạt chất lượng.

### Việc có thể làm trong lúc chờ gate (không phải code — networking thủ công)
- Nhắn tin trực tiếp mời 20–30 freelancer quen biết tạo hồ sơ, theo dõi ai đã tạo trong bảng theo dõi riêng.
- Đăng bài trong 2–3 group Facebook/cộng đồng freelancer AI Việt Nam giới thiệu tool báo giá miễn phí (kênh vào để họ biết đến platform).
- Mỗi tuần kiểm tra `/admin/stats`, so với ngưỡng gate.

---

## GIAI ĐOẠN 2 — SEO NỀN TẢNG

**DoD:** Toàn bộ task queue hoàn thành, Google Search Console đã verify site.
**Gate để qua Giai đoạn 3:** ≥ 20 trang được Google index có impression thật.

### Task queue
1. Thêm structured data `JobPosting` (schema.org) vào template trang chi tiết job (title, datePosted, validThrough, hiringOrganization, jobLocation, employmentType).
2. Tạo `sitemap.xml` tự động sinh lại khi có job mới/job hết hạn (không phải file tĩnh cứng).
3. Xử lý tin hết hạn: thay vì trả 404, redirect 301 về trang danh mục liên quan (VD: hết hạn → redirect về `/viec-lam/ai-automation`).
4. Kiểm tra toàn bộ URL: chuyển về chữ thường, bỏ ký tự thừa, không chứa năm.
5. Tạo các trang danh mục tĩnh crawl được cho tổ hợp có khả năng tìm kiếm cao: theo kỹ năng (VD: `/viec-lam/prompt-engineering`), theo hình thức (`/viec-lam/remote`), theo địa điểm (`/viec-lam/ho-chi-minh`, `/viec-lam/ha-noi`).
6. Mỗi trang danh mục: viết H1 + meta description + đoạn intro 2-3 câu riêng biệt, không copy-paste giữa các trang.
7. Verify site trên Google Search Console, submit sitemap.
8. Viết 1 bài content dạng dữ liệu ("Xu hướng tuyển dụng AI/Automation freelancer Đông Nam Á") dựa trên chính dữ liệu tin đăng trên platform — nội dung dễ được backlink.

**Việc có thể làm trong lúc chờ gate:** Chia sẻ các trang danh mục mới lên mạng xã hội, group cộng đồng để tạo tín hiệu ban đầu cho Google; theo dõi Search Console hàng tuần.

---

## GIAI ĐOẠN 3 — KÍCH HOẠT CẦU (NHÀ TUYỂN DỤNG) + GROWTH LOOP

**DoD kỹ thuật:** Quy trình kiểm duyệt tin hoạt động, nút chia sẻ mạng xã hội có mặt trên job/profile.
**Gate để qua Giai đoạn 4:** ≥ 20–30 tin đăng/tháng thật HOẶC ≥ 3.000–5.000 traffic/tháng.

### Task queue (kỹ thuật)
1. Thêm field `status` (`pending`/`approved`/`rejected`) cho bảng jobs.
2. Tạo trang `/admin/jobs/review` — danh sách tin `pending`, nút duyệt/từ chối.
3. Khi tin được duyệt, gửi email tự động cho nhà tuyển dụng (dùng lại hạ tầng email của Newsletter).
4. Thêm nút "Chia sẻ" (LinkedIn, Facebook) trên trang chi tiết job và trang hồ sơ freelancer.
5. Sau khi freelancer đánh dấu "Đã nhận việc" trong Kanban, hiện gợi ý chia sẻ platform cho bạn bè (referral nhẹ, không cần cơ chế thưởng phức tạp ban đầu).

### Việc có thể làm trong lúc chờ gate (không phải code)
- Outreach trực tiếp 10–20 công ty/agency AI-Automation qua LinkedIn/email, mời đăng tin miễn phí đợt đầu, theo dõi trong bảng riêng ai đã liên hệ/đã đăng.
- Theo dõi `/admin/stats` hàng tuần so với ngưỡng gate.

---

## GIAI ĐOẠN 4 — KÍCH HOẠT MONETIZATION

**Chỉ bắt đầu khi Giai đoạn 3 đạt gate.** Thực hiện tuần tự, mỗi bước có gate riêng — không bật bước sau khi bước trước chưa đạt gate của chính nó.

### Task queue — Bước 4.1: Đăng tin trả phí
1. Thêm field `payment_status` (`free`/`paid`/`expired`) cho bảng jobs.
2. Xây module tạo mã QR thanh toán (VietQR hoặc tương tự) dùng chung cho toàn bộ tính năng trả phí.
3. Form đăng tin: thêm lựa chọn "Đăng thường (miễn phí, 7 ngày)" hoặc "Đăng trả phí (30 ngày)".
4. Cơ chế đối soát: thủ công (kiểm tra nội dung chuyển khoản) hoặc webhook nếu ngân hàng hỗ trợ.
**Gate bước 4.1 → 4.2:** ≥ 5–10 nhà tuyển dụng đã trả phí thành công.

### Task queue — Bước 4.2: Tin nổi bật
1. Thêm field `is_featured`, `featured_until` cho bảng jobs.
2. UI: badge "Nổi bật" (đã có sẵn theo khảo sát trước — chỉ cần gắn logic thu phí vào).
3. Logic hiển thị: ghim đầu danh sách hoặc xen kẽ mỗi 3–5 tin thường.
**Gate bước 4.2 → 4.3:** Có doanh thu ổn định từ 4.1 + 4.2 trong ≥ 2 tháng liên tiếp.

### Task queue — Bước 4.3: Employer xem hồ sơ nâng cao
1. **Không đóng lại thông tin liên hệ cơ bản đã mở miễn phí trước đó** — chỉ bán thêm lớp add-on (bộ lọc nâng cao, xem "sẵn sàng nhận việc ngay").
2. Thêm hệ thống credit cho nhà tuyển dụng mua để unlock tính năng nâng cao.
**Gate bước 4.3 → 4.4:** ≥ 50–100 hồ sơ freelancer đã có sẵn (từ Giai đoạn 1).

### Task queue — Bước 4.4: Sponsor Newsletter
1. Thêm 1 slot "Được tài trợ bởi" trong template email.
2. Trang liên hệ đặt sponsor đơn giản.
**Gate:** ≥ 500–1.000 subscriber.

### Task queue — Bước 4.5: Subscription nhà tuyển dụng
1. Gói tháng: đăng không giới hạn + tự động featured + hỗ trợ ưu tiên.
**Gate:** ≥ 20 nhà tuyển dụng đã quay lại đăng tin ≥ 2 lần.

---

## GIAI ĐOẠN 5 — MỞ RỘNG

**Điều kiện bắt đầu:** Toàn bộ Giai đoạn 0–4 đạt DoD/Gate, ngách hiện tại có mật độ ổn định (freelancer tìm được job, nhà tuyển dụng tìm được người mà không cần bạn can thiệp thủ công).

### Task queue
1. Phân tích số liệu đã thu thập suốt Giai đoạn 0–4 để chọn 1 hướng mở rộng cụ thể (ngách liền kề, địa lý, hoặc B2B2C) — dựa trên dữ liệu thật, không đoán.
2. Viết URD riêng cho hướng mở rộng đã chọn (lặp lại toàn bộ quy trình từ Giai đoạn 0 cho hướng mới, không chia sẻ hạ tầng thu phí/dữ liệu người dùng đã có nếu tạo xung đột lòng tin — tham khảo bài học Carta đã từng gặp).

**Khi hoàn thành task 1–2 ở Giai đoạn 5 → ROADMAP NÀY HOÀN THIỆN. Dừng vòng lặp, báo cáo tổng kết.**

---

## BẢNG TRẠNG THÁI (AI cập nhật sau MỖI task hoàn thành — đây là nguồn sự thật duy nhất)

| Giai đoạn | Trạng thái | Task đang làm / Gate đang chờ | Cập nhật lần cuối |
|---|---|---|---|
| 0 — Đo lường | ✅ DoD đạt (analytics first-party tự xây thay Plausible — không cần tài khoản ngoài; đủ 5 số liệu trên /admin/stats; đã test event ghi vào DB thật) | ⚠️ Gửi email thật cần cấu hình RESEND_API_KEY + CRON_SECRET trên môi trường deploy (code đã kiểm tra, endpoint từ chối đúng khi thiếu secret) | 08/07/2026 |
| 1 — Seed cung | ✅ DoD kỹ thuật đạt (CTA trang chủ, modal sau xuất PDF báo giá, Kanban dnd-kit, ứng tuyển tự tạo card, badge isVerified + trang /admin/freelancers) | Gate: ≥ 50 hồ sơ HOẶC ≥ 200 lượt dùng tool báo giá/tháng — cần networking thủ công + thời gian | 08/07/2026 |
| 2 — SEO | ✅ Task queue đạt (JobPosting JSON-LD có sẵn; sitemap động; 15 trang /viec-lam/* copy riêng từng trang; tin CLOSED trả 308 về danh mục — đã sửa lỗi soft-404 do loading.tsx; bài báo cáo dữ liệu /insights) | Thủ công: submit sitemap trong Google Search Console (meta verify đã có trong layout). Gate: ≥ 20 trang được index có impression | 08/07/2026 |
| 3 — Kích hoạt cầu | ✅ DoD kỹ thuật đạt (kiểm duyệt PENDING/PUBLISHED có sẵn; email tự động khi duyệt/từ chối; nút chia sẻ trên job + hồ sơ; gợi ý chia sẻ khi kéo card vào "Đã nhận") | Gate: ≥ 20-30 tin/tháng HOẶC ≥ 3.000-5.000 traffic/tháng — cần outreach thủ công + thời gian | 08/07/2026 |
| 4 — Monetization | ❌ Chưa bật (đúng kế hoạch — schema Payment/plan đã sẵn, KHÔNG bật UI thu phí khi Gate GĐ3 chưa đạt, theo Quy tắc #6) | Chờ Gate GĐ3 | 08/07/2026 |
| 5 — Mở rộng | ❌ Chưa bắt đầu (chờ GĐ0-4 đạt gate) | — | 08/07/2026 |

**Lệnh cho AI:** Bắt đầu ngay từ Giai đoạn 0, Task 1. Sau mỗi task, quay lại cập nhật bảng này, rồi tiếp tục task kế tiếp theo đúng vòng lặp đã mô tả ở trên. Không dừng lại chờ xác nhận trừ khi gặp quyết định kinh doanh ngoài phạm vi kỹ thuật.