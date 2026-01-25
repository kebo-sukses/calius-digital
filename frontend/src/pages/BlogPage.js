import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiService } from '@/services/api';

const BlogPage = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiService.getBlogPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('blog.title')}</h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">{t('blog.subtitle')}</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-neutral-800 h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`blog-post-${post.slug}`}
                  className="group overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#FF4500]/30 transition-all"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={language === 'id' ? post.title_id : post.title_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-[#FF4500]/20 text-[#FF4500] border border-[#FF4500]/30">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-neutral-500 mb-3">
                        <span>{post.published_at}</span>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.read_time} {t('blog.minRead')}</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF4500] transition-colors">
                        {language === 'id' ? post.title_id : post.title_en}
                      </h2>

                      <p className="text-neutral-400 line-clamp-2 mb-4">
                        {language === 'id' ? post.excerpt_id : post.excerpt_en}
                      </p>

                      <div className="flex items-center text-[#FF4500] font-medium group-hover:gap-3 transition-all">
                        <span>{t('blog.readMore')}</span>
                        <ArrowRight size={18} className="ml-2" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
