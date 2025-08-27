# Things to note down in my notion

1. How to add a div with a background image and background overlay with gradient:

```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="relative w-full max-w-4xl overflow-hidden rounded-2xl group cursor-pointer"
>
  <div className="relative w-full h-[500px]">
    <Image
      src={imageUrl}
      alt="Design card background"
      fill
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-black/50 group-hover:via-black/30 transition duration-500"></div>
  </div>
</motion.div>
```
2. Turbo Pack doesnt support importing static images
3. How does the import in react project work? Like importing images and importing components?
4. What is build time? Fill layout? Compile time? Optimze the image? static optimization?
5. What does the `fill` layout do in Next.js Image component?
6. What does rel="noopener noreferrer" mean
7. Study why useState doesnt update immediately in nextjs. Something about fast reload but it updates when the project is built. Updates on the live site. Example can be found in the buy your ticket component
8. How to convert google drive link to direct download link?
   - Use the format: `https://drive.google.com/uc?export=download&id=FILE_ID`
   - Replace `FILE_ID` with the actual file ID from the Google Drive shareable link.
9. What is bandwidth
10. What is S3 Bucket
11. What is blob storage/images
12. What is hydration mismatch in Next.js: https://chatgpt.com/c/687c35f8-011c-800c-90fd-86733fc08749
13. How does google crawling work? How does SEO work in Next.js?
14. How is it best for content like blogs, landing pages, etc. that don’t change often. Understanding generateStaticParams() - [search for: Analogy: You’re a cake shop preparing an event] at https://chatgpt.com/g/g-p-685c0bdf48fc819198313452374eb85c-eni-brand-architect/c/686d0ca1-0f48-800c-a92f-c486451dbc64
15. getServerSideProps: getServerSideProps is a Next.js function used for data fetching in server-side rendered (SSR) pages. It allows you to fetch data on the server at request time and pass it as props to your page component. This is useful for dynamic data that needs to be up-to-date on every request, such as user-specific data or frequently changing content.
16. What the hell is Row Level security to a 5 years old?