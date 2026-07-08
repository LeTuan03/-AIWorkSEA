import type { JobFilters } from "@/lib/jobs";

// SEO landing pages under /viec-lam/[slug] (Giai đoạn 2). Each page is a
// crawlable, pre-filtered job list with its own H1 + meta description + intro —
// copy is hand-written per page, never templated, so nothing reads duplicated.
// Slugs: lowercase ASCII, no diacritics, no years.

export type LandingPage = {
  slug: string;
  group: "skill" | "worktype" | "location";
  // <title> (template appends "· AIWORK SEA")
  title: string;
  h1: string;
  description: string; // meta description, ~150 chars
  intro: string; // 2-3 câu mở đầu, độc nhất cho từng trang
  filter: Pick<JobFilters, "category" | "location" | "remote">;
};

export const LANDING_PAGES: LandingPage[] = [
  // ---- Theo kỹ năng / lĩnh vực (map 1:1 với CATEGORIES) ----
  {
    slug: "ai-ml-engineering",
    group: "skill",
    title: "Việc làm freelance AI/ML Engineering",
    h1: "Việc làm freelance AI/ML Engineering ở Đông Nam Á",
    description:
      "Dự án freelance AI/ML Engineering ở Đông Nam Á: huấn luyện mô hình, fine-tuning, tích hợp ML vào sản phẩm. Remote và contract, cập nhật liên tục.",
    intro:
      "Các doanh nghiệp trong khu vực đang cần kỹ sư ML cho những dự án ngắn hạn: từ huấn luyện và fine-tune mô hình đến đưa ML vào sản phẩm thật. Phần lớn tin ở đây làm remote, trả theo dự án hoặc theo hợp đồng.",
    filter: { category: "AI/ML Engineering" },
  },
  {
    slug: "prompt-engineering",
    group: "skill",
    title: "Việc làm freelance LLM & Prompt Engineering",
    h1: "Việc làm freelance LLM & Prompt Engineering",
    description:
      "Tin tuyển freelancer LLM và Prompt Engineering: xây RAG, chatbot doanh nghiệp, tối ưu prompt. Việc remote khắp Đông Nam Á, ứng tuyển trực tiếp.",
    intro:
      "Prompt engineering và ứng dụng LLM là nhóm việc tăng nhanh nhất trên AIWORK SEA. Nhà tuyển dụng tìm người dựng pipeline RAG, đánh giá chất lượng đầu ra và tối ưu chi phí gọi mô hình — kinh nghiệm thực tế quan trọng hơn bằng cấp.",
    filter: { category: "LLM & Prompt Engineering" },
  },
  {
    slug: "ai-automation",
    group: "skill",
    title: "Việc làm freelance Automation & RPA",
    h1: "Việc làm freelance Automation / RPA",
    description:
      "Dự án tự động hóa quy trình bằng n8n, Make, Zapier và RPA cho doanh nghiệp Đông Nam Á. Việc freelance ngắn hạn, ngân sách rõ ràng, ứng tuyển miễn phí.",
    intro:
      "Tự động hóa quy trình là cách nhanh nhất để doanh nghiệp nhỏ tiết kiệm chi phí, nên nhu cầu thuê freelancer n8n, Make hay RPA luôn đều đặn. Dự án thường gọn, 1-4 tuần, phù hợp làm song song nhiều khách.",
    filter: { category: "Automation / RPA" },
  },
  {
    slug: "data-engineering",
    group: "skill",
    title: "Việc làm freelance Data Engineering",
    h1: "Việc làm freelance Data Engineering ở Đông Nam Á",
    description:
      "Tuyển freelancer Data Engineering: xây pipeline, ETL, data warehouse cho công ty ở Việt Nam, Singapore và khu vực. Remote, contract, part-time.",
    intro:
      "Trước khi có AI phải có dữ liệu sạch. Các tin ở trang này tập trung vào pipeline, ETL và hạ tầng dữ liệu — nền móng mà mọi dự án AI trong khu vực đều cần trước tiên.",
    filter: { category: "Data Engineering" },
  },
  {
    slug: "computer-vision",
    group: "skill",
    title: "Việc làm freelance Computer Vision",
    h1: "Việc làm freelance Computer Vision",
    description:
      "Dự án Computer Vision freelance: nhận diện ảnh, OCR, camera AI cho sản xuất và bán lẻ Đông Nam Á. Xem ngân sách công khai, ứng tuyển trực tiếp.",
    intro:
      "Từ OCR hóa đơn đến camera đếm khách, computer vision đang được các nhà máy và chuỗi bán lẻ trong khu vực đặt hàng ngày càng nhiều. Đây là nhóm việc thiên về sản phẩm chạy thật hơn nghiên cứu.",
    filter: { category: "Computer Vision" },
  },
  {
    slug: "chatbot",
    group: "skill",
    title: "Việc làm freelance Chatbot & Conversational AI",
    h1: "Việc làm freelance Conversational AI / Chatbot",
    description:
      "Tuyển freelancer xây chatbot bán hàng, CSKH đa kênh cho thị trường Đông Nam Á. Việc freelance và contract, làm remote, trả theo dự án.",
    intro:
      "Chatbot CSKH và bán hàng là điểm vào phổ biến nhất của doanh nghiệp Đông Nam Á khi ứng dụng AI. Tin tuyển ở đây thường yêu cầu tích hợp Zalo, WhatsApp hay Messenger — lợi thế của freelancer hiểu thị trường bản địa.",
    filter: { category: "Conversational AI / Chatbot" },
  },
  {
    slug: "mlops",
    group: "skill",
    title: "Việc làm freelance MLOps",
    h1: "Việc làm freelance MLOps ở Đông Nam Á",
    description:
      "Dự án MLOps freelance: triển khai, giám sát và tối ưu hạ tầng mô hình AI. Việc contract cho công ty ở Đông Nam Á, chủ yếu remote.",
    intro:
      "Nhiều đội AI trong khu vực dựng được mô hình nhưng thiếu người vận hành nó ổn định. MLOps freelancer được thuê để đưa mô hình lên production, theo dõi chất lượng và giữ chi phí hạ tầng trong tầm kiểm soát.",
    filter: { category: "MLOps" },
  },
  {
    slug: "ai-product",
    group: "skill",
    title: "Việc làm freelance AI Product & Strategy",
    h1: "Việc làm freelance AI Product / Strategy",
    description:
      "Tuyển cố vấn và product freelancer định hướng sản phẩm AI: khảo sát tính khả thi, viết roadmap, đào tạo đội ngũ. Việc part-time và theo dự án.",
    intro:
      "Không phải việc nào cũng là viết code: doanh nghiệp còn cần người đánh giá bài toán có đáng làm bằng AI không, và làm thì bắt đầu từ đâu. Nhóm việc này hợp với người có kinh nghiệm sản phẩm lẫn nền tảng kỹ thuật.",
    filter: { category: "AI Product / Strategy" },
  },

  // ---- Theo hình thức ----
  {
    slug: "remote",
    group: "worktype",
    title: "Việc làm AI remote",
    h1: "Việc làm AI & Automation remote",
    description:
      "Tổng hợp việc AI, ML và Automation làm remote 100% cho freelancer ở Đông Nam Á. Không cần đến văn phòng, ứng tuyển trực tiếp với nhà tuyển dụng.",
    intro:
      "Toàn bộ tin ở trang này đều làm việc từ xa 100% — bạn ở Hà Nội, Sài Gòn hay Jakarta đều ứng tuyển được như nhau. Đây là trang đáng theo dõi nhất nếu bạn muốn nhận dự án ngoài thành phố mình sống.",
    filter: { remote: true },
  },

  // ---- Theo địa điểm ----
  {
    slug: "viet-nam",
    group: "location",
    title: "Việc làm AI freelance tại Việt Nam",
    h1: "Việc làm AI & Automation tại Việt Nam",
    description:
      "Việc freelance AI, ML, Automation từ công ty tại Việt Nam: Hà Nội, TP.HCM, Đà Nẵng. Làm việc cùng múi giờ, trao đổi tiếng Việt, thanh toán nội địa.",
    intro:
      "Tin tuyển từ công ty đặt tại Việt Nam: trao đổi bằng tiếng Việt, cùng múi giờ và thanh toán nội địa đơn giản. Phù hợp cho freelancer muốn xây quan hệ khách hàng dài hạn ngay tại thị trường trong nước.",
    filter: { location: "Vietnam" },
  },
  {
    slug: "singapore",
    group: "location",
    title: "Việc làm AI freelance tại Singapore",
    h1: "Việc làm AI & Automation từ Singapore",
    description:
      "Dự án AI và Automation từ công ty Singapore tuyển freelancer Đông Nam Á. Ngân sách USD/SGD, phần lớn làm remote, ứng tuyển miễn phí.",
    intro:
      "Singapore là nơi trả ngân sách cao nhất khu vực cho dự án AI, và nhiều công ty tại đây sẵn sàng thuê freelancer remote từ Việt Nam hay Indonesia. Hồ sơ tiếng Anh tốt là lợi thế rõ rệt với nhóm tin này.",
    filter: { location: "Singapore" },
  },
  {
    slug: "indonesia",
    group: "location",
    title: "Việc làm AI freelance tại Indonesia",
    h1: "Việc làm AI & Automation từ Indonesia",
    description:
      "Tin tuyển freelancer AI từ công ty Indonesia: thị trường số lớn nhất Đông Nam Á với nhu cầu chatbot, dữ liệu và automation tăng nhanh.",
    intro:
      "Indonesia có thị trường internet lớn nhất Đông Nam Á, kéo theo nhu cầu chatbot, xử lý dữ liệu và automation tăng liên tục. Các công ty tại đây quen làm việc với freelancer khu vực qua tiếng Anh.",
    filter: { location: "Indonesia" },
  },
  {
    slug: "thailand",
    group: "location",
    title: "Việc làm AI freelance tại Thái Lan",
    h1: "Việc làm AI & Automation từ Thái Lan",
    description:
      "Dự án AI, ML và Automation từ doanh nghiệp Thái Lan tuyển freelancer trong khu vực. Xem ngân sách và cách ứng tuyển công khai trên từng tin.",
    intro:
      "Du lịch, bán lẻ và tài chính Thái Lan đang đầu tư mạnh vào AI ứng dụng. Tin từ thị trường này thường là dự án tích hợp cụ thể, thời gian rõ ràng và làm remote được.",
    filter: { location: "Thailand" },
  },
  {
    slug: "philippines",
    group: "location",
    title: "Việc làm AI freelance tại Philippines",
    h1: "Việc làm AI & Automation từ Philippines",
    description:
      "Tin tuyển freelancer AI và Automation từ công ty Philippines: nhiều dự án về CSKH tự động, xử lý tài liệu và dữ liệu. Ứng tuyển trực tiếp.",
    intro:
      "Với ngành BPO khổng lồ, Philippines có nhu cầu lớn về tự động hóa CSKH và xử lý tài liệu. Đây là mảnh đất tốt cho freelancer chuyên chatbot, OCR và workflow automation.",
    filter: { location: "Philippines" },
  },
  {
    slug: "malaysia",
    group: "location",
    title: "Việc làm AI freelance tại Malaysia",
    h1: "Việc làm AI & Automation từ Malaysia",
    description:
      "Dự án AI freelance từ công ty Malaysia: sản xuất, logistics và fintech đang cần automation và machine learning. Remote trong khu vực.",
    intro:
      "Sản xuất và logistics Malaysia đang chuyển đổi số nhanh, cần cả computer vision lẫn automation quy trình. Tin từ đây thường tuyển theo hợp đồng và chấp nhận freelancer remote trong khu vực.",
    filter: { location: "Malaysia" },
  },
];

const BY_SLUG = new Map(LANDING_PAGES.map((p) => [p.slug, p]));

export function getLandingBySlug(slug: string): LandingPage | undefined {
  return BY_SLUG.get(slug);
}

// Landing slug for a job category — target of the 301 when a job is closed
// (hết hạn không trả 404, đưa người đọc về danh mục liên quan).
export function landingSlugForCategory(category: string): string {
  const page = LANDING_PAGES.find(
    (p) => p.group === "skill" && p.filter.category === category,
  );
  return page?.slug ?? "remote";
}
