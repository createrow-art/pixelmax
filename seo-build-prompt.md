You are building SEO content for PixelMax (pixelmaxupscaler.com) — an AI image upscaler SaaS. The repo is at ~/Desktop/PixelMax. The site is a static HTML site deployed on Netlify with auto-deploy on git push.

## Your Mission
Build out a full SEO content architecture: long-tail landing pages, a blog section, a sitemap, and robots.txt. Then git commit and push everything.

## Step 1: Read the design system
Read ~/Desktop/PixelMax/index.html first to understand: nav HTML, footer HTML, color palette, font imports, button classes, card styles. Every new page must share the same design — copy the nav and footer verbatim.

Key tokens:
- Fonts: Inter (body), Playfair Display italic (hero accent) — same Google Fonts link tag
- Colors: bg #FAFAF8, text #1A1A1A, muted #888, amber accent #F5A623, border #F0F0F0
- Buttons: dark (bg #1A1A1A, white text), amber (bg #F5A623, white text)
- Border-radius 8px, cards have border 1px solid #F0F0F0, border-radius 12px, padding 24px

## Step 2: Create 15 Long-Tail Landing Pages
Each file is a fully self-contained HTML page (inline CSS only — no external .css files). Copy nav+footer from index.html verbatim. Each page needs:
- head: title, meta description, canonical, og:title, og:description, og:url
- Breadcrumb: Home > [Page Name]
- Hero: overline + H1 (keyword-rich) + subhead + CTA button (amber, links to /)
- Why PixelMax section: 3 feature cards
- How To section: 3 numbered steps
- FAQ: 4-5 Q&As + FAQPage JSON-LD schema
- Final CTA before footer

Files to create:

**1. midjourney-upscaler.html**
Title: Midjourney Image Upscaler — Upscale to 4K | PixelMax
Meta: Upscale your Midjourney images to print-ready 4K resolution in seconds. PixelMax uses Real-ESRGAN AI — perfect for prints, posters, and Etsy wall art.
H1: Upscale Midjourney Images to Print-Ready 4K
Angle: MJ max output is 1024-2048px — too small for quality prints. Real-ESRGAN 4x upscale gets to 4K. Compare to Topaz ($199/yr) — PixelMax is just $1/image.

**2. gemini-upscaler.html**
Title: Google Gemini Image Upscaler — Enhance Gemini AI Art | PixelMax
Meta: Upscale Google Gemini and Imagen AI images to high resolution instantly. Get crisp, print-ready results from your Gemini-generated art.
H1: Upscale Google Gemini AI Images to High Resolution
Angle: Gemini/Imagen AI outputs are web-resolution (1024px). PixelMax upscales to 4K for print, Etsy, and wall art.

**3. chatgpt-image-upscaler.html**
Title: ChatGPT & DALL-E Image Upscaler — Upscale to 4K | PixelMax
Meta: Upscale ChatGPT DALL-E and GPT-4o images to 4K resolution for printing, Etsy, and professional use. Takes 30 seconds.
H1: Upscale ChatGPT & DALL-E Images to 4K
Angle: GPT Image and DALL-E output at 1024x1024 — that's only 3.4 inches at 300 DPI. PixelMax gets you to 13+ inches at 300 DPI.

**4. stable-diffusion-upscaler.html**
Title: Stable Diffusion Image Upscaler — Online HD Upscaling | PixelMax
Meta: Upscale Stable Diffusion AI images to HD and 4K without ComfyUI or local install. PixelMax is the easiest online upscaler for SD — no setup needed.
H1: Upscale Stable Diffusion Images Online — No Setup Needed
Angle: SD users normally need ComfyUI or Automatic1111 hires.fix — complex. PixelMax is drag-drop, 30 seconds.

**5. adobe-firefly-upscaler.html**
Title: Adobe Firefly Image Upscaler — Enhance Firefly AI Art | PixelMax
Meta: Upscale Adobe Firefly images to print resolution instantly. PixelMax AI upscaler enhances Firefly-generated art for posters, merchandise, and professional design.
H1: Upscale Adobe Firefly Images to Print Resolution
Angle: Firefly is great for commercial-safe AI art but web-resolution. PixelMax makes it print-ready.

**6. etsy-print-upscaler.html**
Title: AI Image Upscaler for Etsy Sellers — Print-Ready Digital Art | PixelMax
Meta: Upscale AI art for Etsy digital downloads and print-on-demand. PixelMax makes your AI images 300 DPI print-ready — perfect for wall art, posters, and printable files.
H1: Make Your AI Art Print-Ready for Etsy in Seconds
Angle: Etsy digital download sellers need 300 DPI / 4000px+ images. AI art is usually 1024px. PixelMax bridges that in 30 seconds for $1.

**7. print-on-demand-upscaler.html**
Title: AI Image Upscaler for Print-on-Demand — Redbubble, Merch & More | PixelMax
Meta: Upscale AI images for Redbubble, Merch by Amazon, TeePublic, and Society6. PixelMax delivers print-ready files that meet POD platform resolution requirements.
H1: Upscale AI Images for Print-on-Demand Platforms
Angle: Include a mini-table of POD platform requirements. AI art is undersized — PixelMax fixes this.

**8. flux-ai-upscaler.html**
Title: Flux AI Image Upscaler — Upscale Flux Images to 4K | PixelMax
Meta: Upscale Flux AI-generated images (Flux 1.1 Pro, Flux Dev, Schnell) to 4K resolution. Powered by Real-ESRGAN.
H1: Upscale Flux AI Images to 4K Resolution
Angle: Flux 1.1 Pro outputs at 1024px. PixelMax 4x upscale gets to 4K.

**9. leonardo-ai-upscaler.html**
Title: Leonardo AI Image Upscaler — HD Enhancement Online | PixelMax
Meta: Upscale Leonardo AI images to high resolution for printing, Etsy, and commercial use.
H1: Upscale Leonardo AI Art to High Resolution

**10. runway-upscaler.html**
Title: Runway AI Image Upscaler — Upscale Gen-3 Stills | PixelMax
Meta: Upscale Runway AI-generated images and Gen-3/Gen-4 still frames to high resolution for print, posters, and professional use.
H1: Upscale Runway AI Art to Print Resolution

**11. ideogram-upscaler.html**
Title: Ideogram Image Upscaler — Upscale Ideogram AI Art | PixelMax
Meta: Upscale Ideogram AI images to high resolution for printing, Etsy, and commercial use.
H1: Upscale Ideogram AI Images for Print and Etsy

**12. ai-art-upscaler-for-print.html**
Title: AI Art Upscaler for Print — 300 DPI Ready | PixelMax
Meta: Upscale any AI-generated art for high-quality printing at 300 DPI. Works with Midjourney, DALL-E, Gemini, Stable Diffusion, Firefly, and any AI generator.
H1: Upscale Any AI Art to Print-Ready 300 DPI Quality
Angle: Broad catch-all — name all the generators, explain the DPI math (1024px / 300dpi = 3.4 inches)

**13. image-upscaler-for-posters.html**
Title: AI Image Upscaler for Posters — Large Format Print Ready | PixelMax
Meta: Upscale AI images for large-format poster printing (24x36, 18x24, A1). PixelMax enhances resolution for crisp, detailed large-format prints.
H1: Upscale Images for Large-Format Poster Printing
Angle: Show DPI math for common poster sizes — 24x36 at 300dpi needs 7200x10800px, etc.

**14. upscale-image-to-4k.html**
Title: Upscale Image to 4K Online — Free AI Upscaler | PixelMax
Meta: Upscale any image to 4K resolution online with PixelMax AI. Powered by Real-ESRGAN — enhance photos, AI art, and illustrations to 4K quality instantly.
H1: Upscale Any Image to 4K Online — AI-Powered

**15. photo-upscaler.html**
Title: AI Photo Upscaler — Enhance Photo Resolution Online | PixelMax
Meta: Upscale and enhance photo resolution online with PixelMax AI. Restore clarity, sharpen details, and enlarge photos to 4K — perfect for printing and enlargements.
H1: AI Photo Upscaler — Sharpen and Enlarge Photos Online

## Step 3: Create Blog
Create a blog/ directory.

### blog/index.html
Title: PixelMax Blog — AI Image Upscaling Guides
Simple listing page: nav, hero ("Guides and Resources"), then article cards (title, date Feb 22 2025, 1-sentence excerpt, Read More link), footer.

### blog/how-to-upscale-midjourney-images.html (800-1000 words)
Title: How to Upscale Midjourney Images to 4K (2025 Guide) | PixelMax Blog
Include: why MJ has a resolution limit, 3 upscaling options (MJ built-in V6 upscale, Topaz Gigapixel at $199/yr, PixelMax at $1/image), step-by-step PixelMax walkthrough, FAQ with JSON-LD schema, final CTA.

### blog/best-ai-image-upscaler-for-etsy-sellers.html (800-1000 words)
Title: Best AI Image Upscaler for Etsy Sellers in 2025 | PixelMax Blog
Include: Why Etsy needs 300 DPI, what happens with low-res listings, comparison (Topaz vs Magnific vs Let's Enhance vs PixelMax), step-by-step prep with PixelMax, FAQ.

### blog/chatgpt-image-resolution-fix.html (800-1000 words)
Title: How to Fix ChatGPT Image Resolution for Print (2025) | PixelMax Blog
Include: Why ChatGPT/DALL-E outputs at 1024px, DPI math (1024px / 300 DPI = 3.4 inches — smaller than your palm), how upscaling solves this, step-by-step PixelMax guide, FAQ.

### blog/stable-diffusion-upscaling-guide.html (800-1000 words)
Title: Stable Diffusion Upscaling: Online vs Local Pipelines (2025) | PixelMax Blog
Include: SD native options (hires.fix in A1111, ComfyUI upscale nodes), pros/cons (complex, GPU required), vs PixelMax (no setup, $1/image), when each makes sense, step-by-step.

### blog/ai-image-upscaling-print-on-demand-guide.html (800-1000 words)
Title: AI Image Upscaling for Print-on-Demand: The Complete Guide (2025) | PixelMax Blog
Include: POD platform requirements table (Redbubble 7632x6480, Merch by Amazon 4500x5400, TeePublic 5400x5400, Society6 various), why AI art fails POD checks, how PixelMax fixes most cases, step-by-step, FAQ.

## Step 4: sitemap.xml
Create ~/Desktop/PixelMax/sitemap.xml listing all pages:
- https://pixelmaxupscaler.com/ (priority 1.0)
- All 15 landing pages (priority 0.8)  
- https://pixelmaxupscaler.com/blog/ (priority 0.7)
- All 5 blog posts (priority 0.6)
Use lastmod 2025-02-22, changefreq weekly for main pages, monthly for others.

## Step 5: robots.txt
Create ~/Desktop/PixelMax/robots.txt:
```
User-agent: *
Allow: /

Sitemap: https://pixelmaxupscaler.com/sitemap.xml
```

## Step 6: Update index.html
In the nav, add a "Blog" link pointing to /blog/ between existing nav links.
In the footer, add a "Popular Pages" column with links to the top 5 landing pages.
Look at the footer structure carefully in index.html first.

## Step 7: Git push
```
cd ~/Desktop/PixelMax
git add -A
git commit -m "feat: SEO content build — 15 landing pages, 5 blog posts, sitemap, robots.txt"
git push origin main
```

## Quality Rules
- All inline CSS (no separate .css files) — static HTML only
- Copy nav and footer verbatim from index.html for every page
- Write real, useful content (not filler)
- Mention competitors by name (Topaz Gigapixel $199/yr, Magnific AI, Let's Enhance) — always position PixelMax as simpler and cheaper ($1/image, 30 seconds)
- Use specific numbers: 4x upscale, 1024px to 4096px, $1 per image, ~30 seconds, 300 DPI
- Mention Real-ESRGAN by name (credibility)
- FAQ answers: 2-4 sentences, specific and helpful
- No markdown in output — pure HTML files

When completely finished with all files created, committed, and pushed, run this exact command:
openclaw system event --text "PixelMax SEO build done: 15 landing pages + 5 blog posts + sitemap.xml + robots.txt — all pushed to GitHub. Ready for Shan to review." --mode now
