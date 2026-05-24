import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, User, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { apiService } from '@/services/api';

const SITE_URL = 'https://www.calius.digital';
const SITE_NAME = 'Calius Digital';

const CATEGORY_LABELS = {
  tips: 'Tips',
  business: 'Bisnis',
  tutorial: 'Tutorial',
  news: 'Berita',
};

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left text-white font-medium hover:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? <ChevronUp size={18} className="text-[#FF4500] flex-shrink-0 ml-4" /> : <ChevronDown size={18} className="text-neutral-400 flex-shrink-0 ml-4" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-neutral-300 text-sm leading-relaxed border-t border-white/10 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="animate-pulse">
        <div className="h-[420px] bg-neutral-800 w-full" />
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
          <div className="h-6 bg-neutral-800 rounded w-1/4" />
          <div className="h-10 bg-neutral-800 rounded w-full" />
          <div className="h-10 bg-neutral-800 rounded w-3/4" />
          <div className="h-4 bg-neutral-800 rounded w-1/3 mt-4" />
          <div className="space-y-3 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-neutral-800 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundState({ navigate }) {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6 text-center px-6">
      <h1 className="text-3xl font-bold text-white">Artikel Tidak Ditemukan</h1>
      <p className="text-neutral-400 max-w-md">
        Artikel yang Anda cari tidak ada atau sudah dihapus. Cek artikel lain di halaman blog kami.
      </p>
      <button
        onClick={() => navigate('/blog')}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF4500] text-white font-medium hover:bg-[#FF5722] transition-colors"
      >
        <ArrowLeft size={18} /> Kembali ke Blog
      </button>
    </div>
  );
}

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchPost = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await apiService.getBlogPost(slug);
        if (cancelled) return;
        setPost(data);
        // fetch related posts in same category
        try {
          const related = await apiService.getBlogPosts(data.category, 4);
          if (!cancelled) {
            setRelatedPosts(related.filter(p => p.slug !== slug).slice(0, 3));
          }
        } catch (_) {
          // related posts failure is non-critical
        }
      } catch (error) {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchPost();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <LoadingSkeleton />;
  if (notFound) return <NotFoundState navigate={navigate} />;

  const pageTitle = (post.seo_title && post.seo_title.trim()) ? post.seo_title : post.title_id;
  const pageDesc = (post.seo_description && post.seo_description.trim()) ? post.seo_description : post.excerpt_id;
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.image || `${SITE_URL}/og-default.jpg`;
  const hasFaq = Array.isArray(post.faq_items) && post.faq_items.length > 0;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title_id,
    description: post.excerpt_id,
    image: ogImage,
    author: {
      '@type': 'Organization',
      name: post.author || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    url: pageUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title_id, item: pageUrl },
    ],
  };

  const faqSchema = hasFaq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq_items.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <>
      <Helmet>
        <title>{pageTitle} - {SITE_NAME}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.author || SITE_NAME} />
        <meta property="article:section" content={post.category} />
        {Array.isArray(post.tags) && post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      <div className="min-h-screen bg-[#050505]">
        {/* Hero Image */}
        {post.image && (
          <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
            <img
              src={post.image}
              alt={post.featured_image_alt || post.title_id}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-2 text-sm text-neutral-500 ${post.image ? '-mt-10 relative z-10' : 'pt-32'}`}
          >
            <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-neutral-400 line-clamp-1">{post.title_id}</span>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mb-10"
          >
            {/* Category badge */}
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#FF4500]/15 text-[#FF4500] border border-[#FF4500]/30 mb-5 uppercase tracking-wide">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {post.title_id}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-neutral-400 border-b border-white/10 pb-6">
              <div className="flex items-center gap-2">
                <User size={15} className="text-[#FF4500]" />
                <span>{post.author || SITE_NAME}</span>
              </div>
              {publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#FF4500]" />
                  <time dateTime={post.published_at}>{publishedDate}</time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#FF4500]" />
                <span>{post.read_time || 5} menit baca</span>
              </div>
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-[#FF4500]" />
                  <span>{post.tags.slice(0, 3).join(', ')}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Excerpt / Lead */}
          {post.excerpt_id && (
            <p className="text-lg text-neutral-300 leading-relaxed mb-10 border-l-4 border-[#FF4500] pl-5 italic">
              {post.excerpt_id}
            </p>
          )}

          {/* Article Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-[#FF4500] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-neutral-300 prose-ol:text-neutral-300
              prose-li:mb-2
              prose-blockquote:border-[#FF4500] prose-blockquote:text-neutral-300
              prose-img:rounded-xl prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: post.content_id }}
          />

          {/* FAQ Section */}
          {hasFaq && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-14 mb-10"
              aria-labelledby="faq-heading"
            >
              <h2
                id="faq-heading"
                className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FF4500]/15 text-[#FF4500] text-lg font-bold">?</span>
                Pertanyaan yang Sering Diajukan
              </h2>
              <div className="space-y-3">
                {post.faq_items.map((item, i) => (
                  <FaqItem key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Author Box */}
          <div className="mt-12 mb-10 p-6 rounded-2xl bg-neutral-900 border border-white/10 flex items-start gap-5">
            <div className="w-14 h-14 rounded-full bg-[#FF4500]/15 border border-[#FF4500]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#FF4500] font-bold text-lg">C</span>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">{post.author || SITE_NAME}</p>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Tim ahli <strong className="text-neutral-300">Calius Digital</strong> yang berfokus pada strategi digital marketing,
                pengembangan website profesional, dan pertumbuhan bisnis UMKM Indonesia.
                Kami membantu pelaku usaha tampil kompetitif di dunia online dengan solusi yang terjangkau dan efektif.
              </p>
            </div>
          </div>

          {/* Back + CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pb-12 border-t border-white/10 pt-8">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Semua Artikel
            </Link>
            <Link
              to="/templates"
              className="ml-auto px-6 py-3 rounded-xl bg-[#FF4500] text-white text-sm font-semibold hover:bg-[#FF5722] transition-colors"
            >
              Lihat Template Website Kami →
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-neutral-900/50 border-t border-white/10 py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-white mb-8">Artikel Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related, i) => (
                  <motion.article
                    key={related.id || i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="group rounded-xl bg-neutral-900 border border-white/10 hover:border-[#FF4500]/30 overflow-hidden transition-all"
                  >
                    <Link to={`/blog/${related.slug}`}>
                      {related.image && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={related.image}
                            alt={related.title_id}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                          <Clock size={12} />
                          <span>{related.read_time} menit baca</span>
                        </div>
                        <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-[#FF4500] transition-colors line-clamp-2">
                          {related.title_id}
                        </h3>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BlogDetailPage;
