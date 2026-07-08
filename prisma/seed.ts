import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type SeedJob = {
  title: string;
  company: string;
  companyUrl?: string;
  category: string;
  location: string;
  workType: string;
  engagement: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  description: string;
  skills: string;
  applyUrl?: string;
  applyEmail?: string;
  featured?: boolean;
};

const jobs: SeedJob[] = [
  {
    title: "LLM Engineer — build a RAG chatbot over legal docs",
    company: "Lexa AI",
    companyUrl: "https://example.com/lexa",
    category: "LLM & Prompt Engineering",
    location: "Singapore",
    workType: "Remote",
    engagement: "Contract",
    budgetMin: 5000,
    budgetMax: 8000,
    currency: "USD",
    description:
      "We need an experienced LLM engineer to build a production-grade retrieval-augmented generation (RAG) pipeline over ~50k legal documents. You'll own chunking strategy, embedding + vector store selection, retrieval evaluation, and prompt design. Bonus if you've shipped guardrails and citation/grounding for a regulated domain.",
    skills: "Python,LangChain,LlamaIndex,RAG,pgvector,OpenAI,Evaluation",
    applyEmail: "talent@example.com",
    featured: true,
  },
  {
    title: "n8n / Make automation specialist for a growth team",
    company: "Grovio",
    category: "Automation / RPA",
    location: "Vietnam",
    workType: "Remote",
    engagement: "Freelance",
    budgetMin: 1500,
    budgetMax: 3000,
    currency: "USD",
    description:
      "Our marketing team drowns in manual work. Design and ship 10–15 automations connecting HubSpot, Slack, Google Sheets, and our internal API using n8n (self-hosted). You should be comfortable with webhooks, retries, and error handling, and able to document flows so non-engineers can maintain them.",
    skills: "n8n,Make,Zapier,Webhooks,REST APIs,JavaScript,Google Sheets",
    applyUrl: "https://example.com/apply/grovio",
    featured: true,
  },
  {
    title: "Computer Vision engineer — defect detection on a factory line",
    company: "Nusantara Robotics",
    category: "Computer Vision",
    location: "Indonesia",
    workType: "Hybrid",
    engagement: "Project-based",
    budgetMin: 6000,
    budgetMax: 12000,
    currency: "USD",
    description:
      "Build a real-time visual inspection model for a packaging line (Jakarta). Scope: dataset labeling workflow, training a detection/segmentation model, and deploying to an edge device (Jetson). You'll work 2 days/week on-site during the pilot.",
    skills: "PyTorch,YOLO,OpenCV,ONNX,Jetson,Edge AI,Docker",
    applyEmail: "hiring@example.com",
  },
  {
    title: "Prompt engineer for an AI customer-support agent",
    company: "Kirimin",
    category: "Conversational AI / Chatbot",
    location: "Philippines",
    workType: "Remote",
    engagement: "Part-time",
    budgetMin: 25,
    budgetMax: 45,
    currency: "USD",
    description:
      "Part-time (20 hrs/week) role tuning prompts and building eval sets for a multilingual (EN/TL) support agent. You'll craft system prompts, design tool-calling flows, and run A/B evals to reduce hallucination and escalation rate. Rate shown is hourly USD.",
    skills: "Prompt Engineering,Tool Calling,Evals,Claude,GPT-4o,Tagalog",
    applyUrl: "https://example.com/apply/kirimin",
  },
  {
    title: "Data engineer — build an analytics warehouse (dbt + BigQuery)",
    company: "Siam Data Co.",
    category: "Data Engineering",
    location: "Thailand",
    workType: "Remote",
    engagement: "Contract",
    budgetMin: 4000,
    budgetMax: 7000,
    currency: "USD",
    description:
      "Set up our modern data stack from scratch: ingestion (Fivetran/Airbyte), transformations in dbt, and a clean semantic layer in BigQuery powering Looker. 3-month contract with option to extend.",
    skills: "dbt,BigQuery,SQL,Airbyte,Python,Looker,Data Modeling",
    applyEmail: "data@example.com",
  },
  {
    title: "MLOps freelancer — productionize model serving on AWS",
    company: "Cerah Labs",
    category: "MLOps",
    location: "Malaysia",
    workType: "Remote",
    engagement: "Freelance",
    budgetMin: 3500,
    budgetMax: 6000,
    currency: "USD",
    description:
      "Help us move three ML models from notebooks to reliable services. Scope includes containerization, CI/CD, autoscaling inference (SageMaker or ECS), monitoring, and a model registry. Prefer someone who has been on-call for ML systems before.",
    skills: "AWS,SageMaker,Docker,Terraform,CI/CD,MLflow,Monitoring",
    applyUrl: "https://example.com/apply/cerah",
  },
  {
    title: "AI automation consultant for an e-commerce SMB",
    company: "Chợ Xanh",
    category: "Automation / RPA",
    location: "Vietnam",
    workType: "Remote",
    engagement: "Project-based",
    budgetMin: 2000,
    budgetMax: 4000,
    currency: "USD",
    description:
      "We sell on Shopee, Lazada, and TikTok Shop. Map our repetitive ops (order sync, inventory, customer replies) and implement AI + automation to cut manual work by half. Deliverables: process audit, automation build, and a short training for our team.",
    skills: "Automation,LLM,Google Apps Script,Shopee API,Airtable,Vietnamese",
    applyEmail: "tuyendung@example.com",
  },
  {
    title: "Fine-tuning engineer — small language model for on-device use",
    company: "Merlion AI",
    companyUrl: "https://example.com/merlion",
    category: "AI/ML Engineering",
    location: "Singapore",
    workType: "Remote",
    engagement: "Contract",
    budgetMin: 8000,
    budgetMax: 15000,
    currency: "USD",
    description:
      "Fine-tune and quantize a <3B parameter model for an offline mobile assistant. You'll handle dataset curation, LoRA/QLoRA training, evaluation, and GGUF export for llama.cpp. Strong ML fundamentals required.",
    skills: "PyTorch,LoRA,QLoRA,Quantization,llama.cpp,Hugging Face,GGUF",
    applyEmail: "research@example.com",
    featured: true,
  },
  {
    title: "Chatbot builder — WhatsApp booking flow for clinics",
    company: "SehatBot",
    category: "Conversational AI / Chatbot",
    location: "Indonesia",
    workType: "Remote",
    engagement: "Freelance",
    budgetMin: 1200,
    budgetMax: 2500,
    currency: "USD",
    description:
      "Build a WhatsApp Business chatbot that handles appointment booking, reminders, and FAQ for a network of clinics. Integrate with their calendar system and a simple admin dashboard. Bahasa Indonesia support required.",
    skills: "WhatsApp API,Node.js,Dialogflow,Twilio,Webhooks,Bahasa Indonesia",
    applyUrl: "https://example.com/apply/sehatbot",
  },
  {
    title: "AI Product Manager (fractional) for a fintech pilot",
    company: "Baht & Co.",
    category: "AI Product / Strategy",
    location: "Thailand",
    workType: "Hybrid",
    engagement: "Part-time",
    budgetMin: 40,
    budgetMax: 70,
    currency: "USD",
    description:
      "Fractional AI PM (10–15 hrs/week) to shape our first AI feature: an assistant for SME accounting. Own discovery, write specs, coordinate a small eng team, and define success metrics. Rate shown is hourly USD.",
    skills: "Product Management,AI Strategy,Discovery,Roadmapping,Fintech",
    applyEmail: "founders@example.com",
  },
  {
    title: "Voice AI engineer — Vietnamese speech-to-text pipeline",
    company: "Tiếng Nói Lab",
    category: "AI/ML Engineering",
    location: "Vietnam",
    workType: "Remote",
    engagement: "Contract",
    budgetMin: 4500,
    budgetMax: 9000,
    currency: "USD",
    description:
      "Build a Vietnamese ASR pipeline (streaming) with speaker diarization and punctuation restoration. Evaluate Whisper-based and commercial options, then deploy the winner behind a low-latency API.",
    skills: "Whisper,ASR,PyTorch,FastAPI,Diarization,Vietnamese NLP",
    applyUrl: "https://example.com/apply/tiengnoi",
  },
  {
    title: "RPA developer — invoice processing with UiPath",
    company: "Pinoy BPO Solutions",
    category: "Automation / RPA",
    location: "Philippines",
    workType: "Remote",
    engagement: "Freelance",
    budgetMin: 2000,
    budgetMax: 3500,
    currency: "USD",
    description:
      "Automate accounts-payable: read PDFs/emails, extract invoice fields with OCR + LLM, validate against POs, and post to the ERP. Build in UiPath with an LLM step for messy documents.",
    skills: "UiPath,RPA,OCR,LLM,Document AI,Python,ERP",
    applyEmail: "rpa@example.com",
  },
];

// Demo accounts (documented in README). Change/remove before production.
const ADMIN = { email: "admin@AIWORKSEA.local", name: "Admin", password: "admin123456" };
const RECRUITER = { email: "demo@AIWORKSEA.local", name: "Demo Recruiter", password: "demo123456" };

async function main() {
  console.log("🌱 Seeding database...");

  // Idempotent reseed: clear jobs + demo users so `db:seed` is safe to re-run.
  await prisma.job.deleteMany();
  await prisma.user.deleteMany({
    where: { email: { in: [ADMIN.email, RECRUITER.email] } },
  });

  const admin = await prisma.user.create({
    data: {
      email: ADMIN.email,
      name: ADMIN.name,
      role: "ADMIN",
      passwordHash: bcrypt.hashSync(ADMIN.password, 10),
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      email: RECRUITER.email,
      name: RECRUITER.name,
      role: "USER",
      passwordHash: bcrypt.hashSync(RECRUITER.password, 10),
    },
  });

  // Seeded jobs are owned by the demo recruiter and pre-approved (PUBLISHED)
  // so the site has visible content immediately.
  for (const job of jobs) {
    await prisma.job.create({
      data: { ...job, userId: recruiter.id, status: "PUBLISHED" },
    });
  }

  const jobCount = await prisma.job.count();
  console.log(`✅ Seeded ${jobCount} jobs.`);
  console.log(`👤 Admin:     ${admin.email} / ${ADMIN.password}`);
  console.log(`👤 Recruiter: ${recruiter.email} / ${RECRUITER.password}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
