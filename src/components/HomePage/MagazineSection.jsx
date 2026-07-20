import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LazyImage from "../LazyImage";
import { postService } from "../../services/postService";
import { CATEGORY_LABELS, MOCK_NEWS } from "../../constants/news";

const IconChevronRight = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const MagazineSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const dbPosts = await postService.fetchPosts();
        // Lọc các bài viết đã xuất bản
        const publishedPosts = dbPosts.filter((p) => p.isPublished);
        if (publishedPosts.length > 0) {
          // Lấy tối đa 3 bài viết mới nhất
          setPosts(publishedPosts.slice(0, 3));
        } else {
          setPosts(MOCK_NEWS.slice(0, 3));
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải bài viết từ Supabase:", err);
        setPosts(MOCK_NEWS.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 md:pt-12 md:pb-24">
      <div className="container mx-auto px-6">
        {/* HEADER SECTION - Centered layout */}
        <div className="relative mb-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl text-center"
          >
            <h3 className="text-secondary font-anton mb-4 text-2xl tracking-widest uppercase md:text-4xl">
              Tạp Chí Bến Thuyền
            </h3>
            <h2 className="text-primary font-kanit md:font-script text-xl sm:text-2xl md:text-[52px] font-light md:font-normal leading-relaxed md:leading-[60px] pb-1">
              Nơi lưu giữ những câu chuyện ẩm thực <span className="whitespace-nowrap">và sự kiện đặc sắc</span>
            </h2>
          </motion.div>
        </div>

        {/* GRID CONTAINER */}
        {loading ? (
          <div className="flex w-full justify-center py-20">
            <div className="border-secondary h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-transparent"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid w-full grid-cols-1 gap-8 md:grid-cols-3"
          >
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/news/${post.slug || post.id}`}
                className="block group"
              >
                <motion.div
                  variants={cardVariants}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition-all duration-500 hover:shadow-xl hover:border-secondary/20"
                >
                  {/* Image Cover */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <LazyImage
                      src={post.cover_image_url || post.image}
                      alt={post.title}
                      className="object-cover brightness-95 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-100"
                    />
                    {/* Category Tag */}
                    <span className="text-secondary absolute top-4 left-4 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[9px] font-medium tracking-wider uppercase backdrop-blur-xs">
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-secondary/85 mb-2 font-sans text-[10px] tracking-widest">
                      {post.date}
                    </span>

                    <h3 className="text-primary group-hover:text-secondary mb-3 line-clamp-2 font-serif text-lg leading-snug font-normal transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="font-normalt mb-6 line-clamp-3 text-xs leading-relaxed text-slate-500">
                      {post.excerpt}
                    </p>

                    {/* Read More Link */}
                    <div className="text-secondary mt-auto flex items-center space-x-1.5 text-[10px] font-bold tracking-[0.2em] uppercase">
                      <span>Xem Chi Tiết</span>
                      <IconChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Golden Outline Frame on hover */}
                  <div className="border-secondary/0 group-hover:border-secondary/30 pointer-events-none absolute inset-0 scale-[0.99] rounded-2xl border transition-all duration-500 group-hover:scale-100" />
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}

        {/* BOTTOM CTA BUTTON */}
        <div className="mt-12 flex justify-center">
          <Link to="/news">
            <button className="bg-primary text-white flex items-center justify-center space-x-3 rounded-full px-8 py-4 text-xs font-bold uppercase shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl active:scale-95 cursor-pointer">
              <span className="tracking-[0.2em] mr-[-0.2em]">Xem Tất Cả Bài Viết</span>
              <IconChevronRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
