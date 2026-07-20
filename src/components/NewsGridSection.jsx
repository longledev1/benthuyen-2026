import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import LazyImage from "./LazyImage";
import { postService } from "../services/postService";

import { CATEGORY_LABELS, MOCK_NEWS } from "../constants/news";

const IconArrowRight = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const NewsGridSection = () => {
  const [showModal, setShowModal] = useState(false);
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
          setPosts(publishedPosts);
        } else {
          setPosts(MOCK_NEWS);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải bài viết từ Supabase:", err);
        setPosts(MOCK_NEWS);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Hiệu ứng container cho các thẻ bài viết (staggered fade-in)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Hiệu ứng cho từng thẻ bài viết
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
    <div className="container flex w-full flex-col items-center">
      {/* Section Header */}
      <div className="mb-16 max-w-2xl overflow-hidden text-center select-none">
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="font-script text-primary mt-2 mb-4 text-5xl font-normal tracking-wide md:text-7xl"
        >
          Những câu chuyện mới
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="bg-secondary mx-auto mb-4 h-[1px] w-20 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="font-normalt font-sans text-sm leading-relaxed text-slate-500"
        >
          Cập nhật những hoạt động nổi bật, câu chuyện ẩm thực tinh tế và các sự
          kiện đặc sắc diễn ra tại NS Bến Thuyền.
        </motion.p>
      </div>

      {/* Grid Container */}
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
              className="block"
            >
              <motion.div
                variants={cardVariants}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-md transition-all duration-500 hover:shadow-xl"
              >
                {/* Image Cover - Tích hợp LazyImage với Skeleton */}
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
                    <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Golden Outline Frame on hover */}
                <div className="border-secondary/0 group-hover:border-secondary/30 pointer-events-none absolute inset-0 scale-[0.99] rounded-xl border transition-all duration-500 group-hover:scale-100" />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* POPUP THÔNG BÁO CHI TIẾT */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Lớp phủ Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 cursor-pointer bg-[#1A2542]/40 backdrop-blur-md"
            />

            {/* Nội dung Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="border-secondary relative z-[101] w-full max-w-md rounded-sm border-t-[6px] bg-white p-10 text-center shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="hover:text-primary absolute top-4 right-4 cursor-pointer text-gray-400 transition-colors"
                aria-label="Đóng thông báo"
              >
                <FiX size={24} />
              </button>

              <div className="mb-8">
                <h3 className="text-primary mb-4 font-serif text-2xl tracking-widest uppercase">
                  Thông báo
                </h3>
                <p className="font-normalt text-sm leading-relaxed text-gray-500">
                  Nội dung chi tiết của bản tin này hiện đang được chúng tôi
                  biên tập để mang lại trải nghiệm tốt nhất cho quý khách.
                  <br />
                  <br />
                  NS Bến Thuyền sẽ cố gắng hoàn thiện trong thời gian nhanh nhất
                  để đăng tải lên website.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="bg-primary w-full cursor-pointer rounded-sm py-4 text-[11px] font-bold tracking-[0.3em] text-white uppercase shadow-lg transition-all hover:opacity-90 active:scale-95"
              >
                Đồng ý
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsGridSection;
