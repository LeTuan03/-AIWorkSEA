# Glassmorphism Design System & Layout Guidelines
Version: 2026 Edition

---

# 1. Design Philosophy

Glassmorphism là phong cách giao diện mô phỏng kính mờ hiện đại:
- Trong suốt
- Blur background
- Layer depth
- Ánh sáng mềm
- Gradient hiện đại
- Cảm giác futuristic + premium

Mục tiêu:
- Clean
- Modern
- WOW visual
- High-end UX
- Responsive tốt

---

# 2. Global Design Rules

## 2.1 Background System

### Main Background
- Sử dụng gradient tối hoặc pastel mềm
- Không dùng màu phẳng đơn điệu

Ví dụ:
```css
background:
linear-gradient(
135deg,
#0f172a,
#1e293b,
#312e81
);
```

### Noise Layer
Thêm noise texture nhẹ:
- opacity: 2–4%
- blend-mode: overlay

### Animated Background
Khuyến nghị:
- Aurora gradient
- Floating blur circles
- Mesh gradient animation

---

# 3. Glass Card Rules

## 3.1 Base Glass Style

```css
.glass-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  border: 1px solid rgba(255,255,255,0.15);

  box-shadow:
    0 8px 32px rgba(0,0,0,0.25);

  border-radius: 24px;
}
```

---

## 3.2 Opacity Standards

| Component | Opacity |
|---|---|
| Main Card | 0.08 |
| Hover Card | 0.12 |
| Modal | 0.16 |
| Navbar | 0.05 |
| Sidebar | 0.10 |

---

## 3.3 Blur Standards

| Component | Blur |
|---|---|
| Small Card | 12px |
| Main Panel | 20px |
| Modal | 28px |
| Navbar | 16px |
| Sidebar | 18px |

---

# 4. Typography System

## 4.1 Recommended Fonts

### Premium Fonts
- Inter
- SF Pro Display
- Geist
- Satoshi
- General Sans

---

## 4.2 Typography Scale

| Type | Size | Weight |
|---|---|---|
| Hero Title | 72px | 700 |
| H1 | 56px | 700 |
| H2 | 40px | 600 |
| H3 | 32px | 600 |
| Body Large | 18px | 400 |
| Body | 16px | 400 |
| Caption | 14px | 400 |

---

## 4.3 Text Colors

### Primary
```css
color: rgba(255,255,255,0.95);
```

### Secondary
```css
color: rgba(255,255,255,0.70);
```

### Muted
```css
color: rgba(255,255,255,0.45);
```

---

# 5. Color System

## 5.1 Recommended Palette

### Dark Premium
- #0f172a
- #1e293b
- #312e81
- #6366f1
- #8b5cf6

### Neon Accent
- #00F5FF
- #7C3AED
- #FF4D9D
- #22D3EE

---

## 5.2 Gradient Rules

### Hero Gradient
```css
background:
linear-gradient(
135deg,
rgba(124,58,237,0.5),
rgba(34,211,238,0.3)
);
```

---

# 6. Layout Standards

# 6.1 Container Width

| Device | Width |
|---|---|
| Desktop Large | 1440px |
| Desktop | 1280px |
| Tablet | 768px |
| Mobile | 100% |

---

# 6.2 Spacing System

| Token | Value |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 96px |

---

# 6.3 Grid System

## Desktop
- 12 columns
- gap: 24px

## Tablet
- 8 columns
- gap: 20px

## Mobile
- 4 columns
- gap: 16px

---

# 7. Navbar Layout

## Desktop Navbar

### Height
- 72px

### Structure
```text
[Logo]     [Menu Center]     [CTA Button]
```

### Rules
- Sticky top
- Transparent glass
- Blur 16px
- Border bottom subtle

---

# 8. Hero Section Layout

## Recommended Layout

```text
--------------------------------
| Left Content | Right Visual |
--------------------------------
```

### Left Area
- Headline
- Description
- CTA buttons
- Social proof

### Right Area
- 3D object
- Dashboard preview
- Floating glass cards

---

## Hero Height
- Desktop: 100vh
- Tablet: auto
- Mobile: auto

---

# 9. Sidebar Layout

## Width
- Expanded: 280px
- Collapsed: 88px

## Style
- Glass background
- Blur 18px
- Floating shadow

---

# 10. Card Layout Rules

## Dashboard Cards

### Padding
- 24px

### Gap
- 24px

### Radius
- 24px

### Hover
```css
transform: translateY(-4px);
transition: all .3s ease;
```

---

# 11. Modal Standards

## Modal Width

| Type | Width |
|---|---|
| Small | 420px |
| Medium | 640px |
| Large | 920px |

---

## Modal Style

```css
background: rgba(255,255,255,0.12);
backdrop-filter: blur(28px);
border-radius: 32px;
```

---

# 12. Button System

## Primary Button

```css
background:
linear-gradient(
135deg,
#7C3AED,
#22D3EE
);

border-radius: 18px;
height: 52px;
padding: 0 28px;
```

---

## Secondary Button

```css
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.15);
```

---

# 13. Input Field Standards

## Input Style

```css
background: rgba(255,255,255,0.06);

border:
1px solid rgba(255,255,255,0.12);

height: 56px;

border-radius: 18px;
```

---

# 14. Motion & Animation Rules

## Transition Timing

| Type | Duration |
|---|---|
| Hover | 200ms |
| Page Transition | 500ms |
| Modal | 350ms |
| Microinteraction | 150ms |

---

## Recommended Motion
- Floating animation
- Parallax
- Glow pulse
- Smooth fade
- Glass hover light

---

# 15. Responsive Rules

# 15.1 Mobile

## Mobile Adjustments
- Reduce blur
- Reduce shadows
- Stack layout vertical
- Avoid excessive transparency

---

## Mobile Hero

```text
----------------
| Headline     |
| Description  |
| CTA          |
| Visual       |
----------------
```

---

# 16. Accessibility Rules

## Contrast
- Text contrast tối thiểu WCAG AA

## Blur
- Không làm text khó đọc

## Motion
- Hỗ trợ prefers-reduced-motion

---

# 17. Performance Optimization

## Recommended
- Use backdrop-filter carefully
- Avoid too many glass layers
- Use GPU acceleration
- Compress gradients

## Maximum Recommended
- <= 6 active blur layers per viewport

---

# 18. Recommended Tech Stack

## Frontend
- Next.js
- React
- TailwindCSS

## Animation
- Framer Motion
- GSAP

## 3D
- Three.js
- React Three Fiber

---

# 19. Recommended Tailwind Tokens

```js
theme: {
  extend: {
    borderRadius: {
      glass: '24px'
    },
    backdropBlur: {
      glass: '20px'
    }
  }
}
```

---

# 20. UI Composition Examples

## SaaS Landing Page

```text
Navbar
Hero
Logo Cloud
Features Grid
Dashboard Preview
Testimonials
Pricing
FAQ
Footer
```

---

## Dashboard Layout

```text
Sidebar
Topbar
Analytics Grid
Charts
Recent Activity
Settings
```

---

# 21. Modern WOW Effects

## Effects
- Neon glow
- Mouse tracking light
- Dynamic blur
- Floating gradients
- Animated mesh
- Glass reflections

---

# 22. Avoid These Mistakes

❌ Too much blur  
❌ Too many colors  
❌ Low contrast text  
❌ Heavy shadows  
❌ Over-animation  
❌ Tiny typography  
❌ Excessive transparency  

---

# 23. Final Visual Direction

Glassmorphism hiện đại nên:
- Premium
- Soft
- Futuristic
- Clean
- Spacious
- Interactive
- Cinematic

Không nên:
- Cluttered
- Flat
- Heavy
- Over-decorated

---

# 24. Recommended Inspirations

- Apple
- Linear
- Stripe
- Arc Browser
- Framer
- Raycast
- Vercel
- Nothing

---

END OF DESIGN SYSTEM
