# 📸 Image Assets

Place your images in this folder for your portfolio.

## Required Images

### 1. Profile Photo
- **Filename:** `profile.jpg` or `profile.png`
- **Size:** 400x400px (square)
- **Format:** JPG or PNG
- **Used in:** Hero section
- **Tips:** 
  - Use a professional headshot with good lighting
  - Plain background works best
  - Make sure face is clearly visible
  - File size: Keep under 500KB

### 2. OG Image (Social Media Share)
- **Filename:** `og-image.jpg`
- **Size:** 1200x630px
- **Format:** JPG
- **Used in:** Social media sharing (Twitter, Facebook, LinkedIn)
- **Tips:**
  - Add your name and title text to the image
  - Use your brand colors
  - Keep text readable
  - File size: Keep under 1MB

### 3. Project Images
- **Location:** `projects/` folder
- **Filenames:** `project-1.jpg`, `project-2.jpg`, etc.
- **Size:** 800x600px (4:3 ratio) or 1200x675px (16:9 ratio)
- **Format:** JPG or PNG
- **Used in:** Projects section cards
- **Tips:**
  - Use screenshots of your actual projects
  - Or use mockups showing your work
  - Make sure UI/design is clearly visible
  - File size: Keep each under 500KB

## Example Structure

```
images/
├── profile.jpg              # Your profile photo
├── og-image.jpg             # Social media share image
└── projects/
    ├── project-1.jpg        # E-Commerce Platform screenshot
    ├── project-2.jpg        # Company Profile screenshot
    ├── project-3.jpg        # Task Management App screenshot
    ├── project-4.jpg        # Weather Dashboard screenshot
    ├── project-5.jpg        # Blog Platform screenshot
    └── project-6.jpg        # Landing Page Builder screenshot
```

## Need Placeholder Images?

If you don't have images yet, you can use placeholder services:

- **Unsplash:** https://unsplash.com (free high-quality photos)
- **Pexels:** https://pexels.com (free stock photos)
- **UI Faces:** https://uifaces.co (profile avatars)
- **Placeholder.com:** https://placeholder.com (quick placeholders)

## Image Optimization Tips

1. **Compress images** before uploading:
   - Use: TinyPNG (https://tinypng.com)
   - Or: Squoosh (https://squoosh.app)

2. **Resize images** to exact dimensions:
   - Don't upload 4000x3000px images
   - Resize to the recommended sizes above
   - Saves bandwidth and improves performance

3. **Use WebP format** (optional):
   - Better compression than JPG
   - Smaller file sizes
   - Supported by modern browsers
   - Convert with Squoosh

## Next.js Image Component

This template uses Next.js `<Image>` component which:
- ✅ Automatically optimizes images
- ✅ Lazy loads images (better performance)
- ✅ Serves WebP when supported
- ✅ Responsive images
- ✅ Prevents layout shift

So don't worry too much about perfect optimization - Next.js handles it!

## Having Trouble?

If images don't show up:
1. Make sure filenames match exactly (case-sensitive)
2. Check file is in correct folder (`public/images/`)
3. Restart dev server (`npm run dev`)
4. Clear browser cache

## Still Need Help?

Contact us: hello@calius.digital
