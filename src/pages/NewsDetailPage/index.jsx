import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiTag,
  FiClock,
  FiChevronLeft,
  FiShare2,
  FiUser,
  FiLoader,
} from "react-icons/fi";
import LazyImage from "../../components/LazyImage";
import { postService } from "../../services/postService";
import SEO from "../../components/SEO";

const CATEGORY_MAP = {
  "su-kien": "Sự Kiện",
  "am-thuc": "Ẩm Thực",
  "dich-vu": "Dịch Vụ",
};

const calculateReadTime = (content) => {
  if (!content) return "1 phút đọc";
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} phút đọc`;
};

// Mock dữ liệu tin tức chi tiết (bao gồm nội dung Rich Text giả lập từ React Quill)
const MOCK_NEWS_DETAILS = {
  "grand-reopening-hanh-trinh-moi": {
    id: 1,
    slug: "grand-reopening-hanh-trinh-moi",
    title: "NS Bến Thuyền - Grand Re-Opening: Hành Trình Mới, Trải Nghiệm Mới",
    date: "15 Tháng 06, 2026",
    category: "Sự Kiện",
    author: "Ban Biên Tập",
    readTime: "5 phút đọc",
    image: "/images/about/bg.png",
    excerpt:
      "NS Bến Thuyền chính thức mở cửa trở lại với không gian Indochine sang trọng được làm mới hoàn toàn cùng thực đơn hải sản Cam Ranh tinh tuyển.",
    // Nội dung HTML giả lập đầu ra của react-quill
    contentHtml: `
      <p>Sau nhiều tháng ấp ủ và chuẩn bị tỉ mỉ, <strong>NS Bến Thuyền</strong> chính thức đánh dấu sự trở lại đầy ấn tượng với sự kiện Grand Re-Opening. Lần lột xác này không chỉ là sự thay đổi về diện mạo không gian, mà còn là một bước chuyển mình mạnh mẽ trong định hướng trải nghiệm ẩm thực hải sản cao cấp tại vịnh Cam Ranh.</p>
      
      <h2>Không gian Đông Dương (Indochine) độc bản bên bờ vịnh</h2>
      <p>Lấy cảm hứng từ nét đẹp lãng mạn của kiến trúc Pháp cổ kết hợp tinh tế với chất liệu văn hóa bản địa mộc mạc, không gian mới của NS Bến Thuyền mang đậm dấu ấn Indochine sang trọng. Từng viên gạch bông, mảng tường màu vàng kem ấm áp cho đến những chi tiết gỗ tối màu đều được thiết kế thủ công nhằm tạo nên sự thư thái tối đa cho thực khách.</p>
      
      <div class="my-8 text-center">
        <img src="/images/about/bg.png" alt="Không gian Indochine sang trọng" class="rounded-xl mx-auto max-h-[450px] object-cover shadow-md" />
        <span class="block text-center text-xs text-slate-500 mt-2 italic">Không gian sảnh tiệc chính ngập tràn ánh sáng tự nhiên tại NS Bến Thuyền</span>
      </div>
 
      <p>Đặc biệt, hệ thống kính kịch trần mở ra góc nhìn 180 độ hướng thẳng ra vịnh Cam Ranh lộng gió. Thực khách khi đến đây có thể vừa thưởng thức mỹ vị đại dương, vừa ngắm nhìn trọn vẹn khoảnh hoàng hôn buông xuống mặt biển phẳng lặng.</p>
 
      <blockquote>
        "Chúng tôi không chỉ bán món ăn, chúng tôi kiến tạo những khoảnh khắc đáng nhớ. Mỗi thực khách đến với Bến Thuyền đều là một vị khách quý bước lên con thuyền di sản."
        <br/>
        <span class="text-xs font-semibold not-italic text-secondary uppercase tracking-wider block mt-2">— Đại diện NS Bến Thuyền chia sẻ</span>
      </blockquote>
 
      <h2>Hải sản Cam Ranh tinh tuyển - Tươi ngon từ đại dương đến bàn ăn</h2>
      <p>Trọng tâm của hành trình mới này chính là thực đơn hải sản thượng hạng. Nguồn nguyên liệu được chúng tôi đánh bắt trực tiếp từ vịnh Cam Ranh và các vùng biển lân cận, vận chuyển thần tốc và nuôi giữ trong hệ thống bể kính đạt chuẩn quốc tế ngay tại nhà hàng.</p>
 
      <div class="my-8 text-center">
        <img src="/images/home/food-1.png" alt="Món ăn hải sản tinh tế" class="rounded-xl mx-auto max-h-[400px] object-cover shadow-md" />
        <span class="block text-center text-xs text-slate-500 mt-2 italic">Món tôm hùm Cam Ranh sốt đặc chế bởi đầu bếp trưởng 5 sao</span>
      </div>
 
      <p>Dưới bàn tay chế biến điêu luyện của đội ngũ đầu bếp giàu kinh nghiệm, thực khách sẽ được thưởng thức những món ăn vừa giữ trọn vị ngọt tự nhiên của biển cả, vừa mang nét chấm phá sáng tạo của ẩm thực hiện đại. Các món ăn đặc sắc như <em>Tôm hùm Cam Ranh đút lò sốt bơ tỏi</em>, <em>Cua huỳnh đế hấp nước dừa</em> hay <em>Cá mú đỏ sốt Hong Kong</em> chắc chắn sẽ làm hài lòng những thực khách khó tính nhất.</p>
 
      <h3>Nhiều ưu đãi đặc biệt nhân dịp khai trương lại</h3>
      <ul>
        <li>Giảm ngay 10% trên tổng hóa đơn thức ăn cho khách hàng đặt bàn trước.</li>
        <li>Tặng kèm 01 đơn vị đồ uống đặc chế (Welcome Drink) cho mỗi thực khách.</li>
        <li>Chương trình hòa tấu nhạc cụ dân tộc trực tiếp vào các buổi tối cuối tuần.</li>
      </ul>
      
      <p>NS Bến Thuyền trân trọng kính mời quý thực khách ghé thăm và trải nghiệm chương mới đầy cảm xúc ẩm thực của chúng tôi.</p>
    `,
  },
  "huong-vi-hai-san-thuong-hang": {
    id: 2,
    slug: "huong-vi-hai-san-thuong-hang",
    title: "Khám Phá Hương Vị Hải Sản Thượng Hạng Tại Vịnh Cam Ranh",
    date: "10 Tháng 06, 2026",
    category: "Ẩm Thực",
    author: "Bếp Trưởng Nguyễn Quốc",
    readTime: "4 phút đọc",
    image: "/images/home/food-1.png",
    excerpt:
      "Trải nghiệm ẩm thực độc đáo kết hợp giữa nguồn nguyên liệu tươi ngon bản địa và nghệ thuật chế biến đỉnh cao từ các đầu bếp hàng đầu.",
    contentHtml: `
      <p>Vịnh Cam Ranh không chỉ nổi tiếng với những bãi cát trắng mịn lộng gió mà còn được thiên nhiên ưu ái ban tặng nguồn hải sản phong phú và có chất lượng ngon hàng đầu cả nước. Hãy cùng bếp trưởng của <strong>NS Bến Thuyền</strong> đi sâu tìm hiểu văn hóa ẩm thực độc đáo này.</p>
      
      <h2>Nguồn nguyên liệu quý giá từ lòng biển sâu</h2>
      <p>Đặc trưng của vùng nước vịnh Cam Ranh là độ mặn ổn định và nguồn nước trong lành, tạo điều kiện lý tưởng cho các loài tôm hùm, cá mú, mực lá và các loại ốc phát triển vượt trội về độ săn chắc cũng như vị ngọt đậm đà của thịt.</p>
 
      <div class="my-8 text-center">
        <img src="/images/home/food-1.png" alt="Hải sản thượng hạng" class="rounded-xl mx-auto max-h-[400px] object-cover shadow-md" />
        <span class="block text-center text-xs text-slate-500 mt-2 italic">Mỹ vị biển cả được chăm chút tỉ mỉ từ khâu chọn lọc đến bày trí</span>
      </div>
 
      <p>Tại NS Bến Thuyền, chúng tôi áp dụng quy trình kiểm tra nghiêm ngặt từ khâu thu mua trực tiếp tại thuyền thúng của ngư dân vào sáng sớm. Chỉ những cá thể hải sản khỏe mạnh nhất, đạt kích thước tiêu chuẩn mới được đưa vào phục vụ.</p>
      
      <blockquote>
        "Hải sản ngon nhất khi giữ được hương vị mộc mạc nguyên bản của nó. Công việc của người đầu bếp là tôn vinh vị ngọt đại dương ấy bằng sự kết hợp gia vị tinh tế nhất."
      </blockquote>
 
      <h2>Nghệ thuật chế biến nâng tầm di sản</h2>
      <p>Bên cạnh các món hấp, nướng truyền thống để giữ vị ngọt tự nhiên, các đầu bếp của chúng tôi còn không ngừng sáng tạo ra những công thức sốt độc quyền, hòa quyện hương vị truyền thống Việt Nam và ẩm thực phương Tây đương đại.</p>
    `,
  },
  "xu-huong-tiec-ngoai-troi-2026": {
    id: 3,
    slug: "xu-huong-tiec-ngoai-troi-2026",
    title: "Xu Hướng Tổ Chức Tiệc Ngoài Trời Bên Bờ Vịnh Năm 2026",
    date: "05 Tháng 06, 2026",
    category: "Dịch Vụ",
    author: "Bộ Phận Sự Kiện",
    readTime: "6 phút đọc",
    image: "/images/about/phucvu.webp",
    excerpt:
      "Không gian tiệc lãng mạn lộng gió biển, hệ thống âm thanh ánh sáng hiện đại và phong cách phục vụ chuẩn năm sao tại vịnh Cam Ranh.",
    contentHtml: `
      <p>Năm 2026 chứng kiến sự lên ngôi mạnh mẽ của xu hướng tổ chức tiệc cưới, hội nghị ngoài trời. Rời xa những bức tường bê tông gò bó của trung tâm tiệc cưới truyền thống, khách hàng ngày càng tìm kiếm những không gian khoáng đạt, lãng mạn bên bờ biển.</p>
      
      <h2>Tại sao vịnh Cam Ranh là địa điểm hoàn hảo?</h2>
      <p>Với lợi thế sóng êm, gió nhẹ và thời tiết ôn hòa quanh năm, vịnh Cam Ranh mang đến một bối cảnh tuyệt mỹ cho những bữa tiệc hoàng hôn bên bờ biển đầy chất thơ.</p>
 
      <div class="my-8 text-center">
        <img src="/images/about/phucvu.webp" alt="Phục vụ tiệc chuyên nghiệp" class="rounded-xl mx-auto max-h-[400px] object-cover shadow-md" />
        <span class="block text-center text-xs text-slate-500 mt-2 italic">Đội ngũ nhân sự chuyên nghiệp luôn sẵn sàng phục vụ các bữa tiệc quy mô lớn</span>
      </div>
 
      <p>Hiểu được nhu cầu đó, <strong>NS Bến Thuyền</strong> đã đầu tư nâng cấp toàn diện khu vực sảnh tiệc ngoài trời sát biển với sức chứa lên tới 300 khách. Hệ thống âm thanh, ánh sáng hiện đại được bố trí ẩn giấu tinh tế, tôn lên vẻ đẹp tự nhiên của biển khơi.</p>
    `,
  },
};

export const NewsDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách bài viết liên quan (loại trừ bài viết hiện tại)
  const relatedPosts = Object.values(MOCK_NEWS_DETAILS).filter(
    (p) => String(p.slug) !== String(slug),
  );

  useEffect(() => {
    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        // 1. Thử tải từ database Supabase
        const dbPost = await postService.fetchPostBySlug(slug);
        if (dbPost) {
          setPost({
            id: dbPost.id,
            slug: dbPost.slug,
            title: dbPost.title,
            date: dbPost.date,
            category: CATEGORY_MAP[dbPost.category] || dbPost.category,
            author: dbPost.author || "Quản trị viên",
            readTime: calculateReadTime(dbPost.content),
            image: dbPost.cover_image_url || "/images/about/bg.png",
            excerpt: dbPost.excerpt || "",
            contentHtml: dbPost.content || "",
          });
        } else {
          // 2. Không tìm thấy thì fallback sang mock
          const mockPost =
            MOCK_NEWS_DETAILS[slug] ||
            MOCK_NEWS_DETAILS["grand-reopening-hanh-trinh-moi"];
          setPost(mockPost);
        }
      } catch (err) {
        console.warn("⚠️ Lỗi tải bài viết từ Supabase, chuyển sang Mock:", err);
        const mockPost =
          MOCK_NEWS_DETAILS[slug] ||
          MOCK_NEWS_DETAILS["grand-reopening-hanh-trinh-moi"];
        setPost(mockPost);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#FAF9F5] pt-40 pb-20">
        <FiLoader className="text-secondary mb-4 animate-spin" size={32} />
        <p className="font-sans text-sm tracking-widest text-slate-500 uppercase">
          Đang tải bài viết...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#FAF9F5] pt-40 pb-20">
        <p className="mb-4 font-sans text-sm tracking-widest text-slate-500 uppercase">
          Không tìm thấy bài viết
        </p>
        <Link
          to="/news"
          className="hover:text-primary text-secondary text-xs font-bold tracking-[0.2em] uppercase transition-colors"
        >
          Quay lại Góc chuyện trò
        </Link>
      </div>
    );
  }

  const articleSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: [
          post.image?.startsWith("http")
            ? post.image
            : `https://nsbenthuyen.com${post.image?.startsWith("/") ? "" : "/"}${post.image || "images/home/food-1.png"}`,
        ],
        author: {
          "@type": "Person",
          name: post.author || "NS Bến Thuyền",
        },
        publisher: {
          "@type": "Organization",
          name: "NS Bến Thuyền",
          logo: {
            "@type": "ImageObject",
            url: "https://nsbenthuyen.com/logo/nsbenthuyen_white.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://nsbenthuyen.com/news/${post.slug || slug}`,
        },
      }
    : null;

  return (
    <div className="mt-12 w-full border-t border-black/5 bg-[#FAF9F5] px-4 pt-28 pb-20 md:px-8">
      <SEO
        title={post.title}
        description={post.excerpt}
        ogImage={post.image}
        ogType="article"
        canonical={`/news/${post.slug || slug}`}
        schema={articleSchema}
      />
      <div className="mx-auto max-w-[1200px]">
        {/* Nút quay lại danh sách tin tức */}
        <Link
          to="/news"
          className="hover:text-primary text-secondary mb-8 inline-flex items-center space-x-2 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300"
        >
          <FiChevronLeft className="h-4 w-4" />
          <span>Quay lại Góc chuyện trò</span>
        </Link>

        {/* Cấu trúc Layout bài viết */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* CỘT TRÁI: Nội dung bài viết chi tiết (Spans 8 columns) */}
          <article className="flex min-w-0 flex-col lg:col-span-8">
            {/* Header bài viết */}
            <div className="mb-6">
              <div className="text-secondary mb-3 flex flex-wrap items-center gap-4 font-sans text-xs tracking-wider uppercase">
                <span className="bg-primary/5 border-primary/10 text-primary rounded-full border px-3 py-1 font-medium">
                  {post.category}
                </span>
                <span className="flex items-center text-slate-400">
                  <FiCalendar className="mr-1.5" />
                  {post.date}
                </span>
                <span className="flex items-center text-slate-400">
                  <FiClock className="mr-1.5" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="text-primary mb-4 font-serif text-3xl leading-tight font-normal md:text-5xl md:leading-snug">
                {post.title}
              </h1>

              <div className="flex items-center space-x-3 border-b border-slate-200 pb-6 text-xs text-slate-500">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <FiUser size={14} />
                </div>
                <div>
                  <p className="text-primary font-semibold">{post.author}</p>
                  <p className="text-[10px] text-slate-400">Tác giả</p>
                </div>
              </div>
            </div>

            {/* Nội dung bài viết - Hộp giấy trắng sang trọng với bóng đổ nhẹ */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-10">
              {/* Tóm tắt bài viết (Excerpt) */}
              <p className="border-secondary mb-8 border-l-2 pl-4 font-sans text-base leading-relaxed font-normal text-slate-600 italic md:text-lg">
                {post.excerpt}
              </p>

              {/* KHU VỰC RENDER NỘI DUNG RICH TEXT (REACT QUILL OUTPUT) */}
              {/* Sử dụng class custom 'prose-custom' để định dạng chuẩn cho HTML động */}
              <div
                className="prose-custom font-nomral space-y-6 text-left font-sans text-sm leading-[1.8] text-slate-700 md:text-base"
                dangerouslySetInnerHTML={{
                  __html: post.contentHtml
                    ? post.contentHtml
                        .replace(/&nbsp;/g, " ")
                        .replace(/\u00A0/g, " ")
                    : "",
                }}
              />
            </div>

            {/* Nút chia sẻ bài viết */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <span className="font-sans text-xs tracking-widest text-slate-400 uppercase">
                Chia sẻ bài viết này:
              </span>
              <div className="flex space-x-3">
                <button
                  className="hover:bg-primary hover:border-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-white"
                  aria-label="Share Facebook"
                >
                  <span className="text-sm font-semibold">F</span>
                </button>
                <button
                  className="hover:bg-primary hover:border-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-white"
                  aria-label="Share Twitter"
                >
                  <span className="text-sm font-semibold">T</span>
                </button>
                <button
                  className="hover:bg-primary hover:border-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:text-white"
                  aria-label="Copy Link"
                >
                  <FiShare2 size={13} />
                </button>
              </div>
            </div>
          </article>

          {/* CỘT PHẢI: Sidebar phụ trợ (Spans 4 columns) */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Widget 1: Giới thiệu Bến Thuyền */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <h4 className="text-primary mb-4 border-b border-slate-100 pb-3 font-serif text-lg font-normal">
                Về NS Bến Thuyền
              </h4>
              <p className="font-normalt mb-4 text-xs leading-relaxed text-slate-500">
                Tọa lạc tại vịnh Cam Ranh thơ mộng, NS Bến Thuyền là điểm đến ẩm
                thực hải sản thượng hạng, kết hợp tinh hoa ẩm thực đương đại
                trong không gian kiến trúc Indochine lãng mạn.
              </p>
              <Link
                to="/gioi-thieu"
                className="hover:text-primary text-secondary text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
              >
                Khám phá ngay ➔
              </Link>
            </div>

            {/* Widget 2: Các bài viết liên quan */}
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <h4 className="text-primary mb-4 border-b border-slate-100 pb-3 font-serif text-lg font-normal">
                Tin tức liên quan
              </h4>
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/news/${relatedPost.slug || relatedPost.id}`}
                    className="group flex items-start space-x-3"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <LazyImage
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-secondary/85 mb-1 block font-sans text-[9px] tracking-widest uppercase">
                        {relatedPost.date}
                      </span>
                      <h5 className="group-hover:text-secondary line-clamp-2 font-serif text-xs leading-snug font-medium text-slate-700 transition-colors duration-300">
                        {relatedPost.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Widget 3: Thông tin Đặt Bàn */}
            <div className="bg-primary relative overflow-hidden rounded-2xl p-6 text-center text-white shadow-lg">
              {/* Decorative light effect */}
              <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

              <span className="text-secondary mb-1 block text-[9px] font-semibold tracking-[0.25em] uppercase">
                Trải Nghiệm Mỹ Vị
              </span>
              <h4 className="mb-3 text-3xl font-bold">Đặt Bàn Ngay</h4>
              <p className="font-normalt mx-auto mb-6 max-w-[200px] text-xs leading-relaxed text-white/70">
                Hãy để chúng tôi chuẩn bị một vị trí đẹp nhất hướng vịnh dành
                riêng cho quý khách.
              </p>
              <a
                href="tel:0901234567"
                className="bg-secondary block rounded-lg py-3.5 text-xs font-bold tracking-[0.2em] text-[#0F1524] uppercase shadow-md transition-all hover:bg-white active:scale-98"
              >
                Gọi Ngay: 0901.234.567
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* CSS Nhúng trực tiếp để tạo kiểu cho các thẻ HTML được sinh ra từ React Quill */}
      <style>{`
        /* Style các thẻ HTML động trong bài viết */
        .prose-custom {
          word-break: normal;
          overflow-wrap: break-word;
          text-align: left !important;
        }
        .prose-custom p,
        .prose-custom span,
        .prose-custom li {
          text-align: left !important;
        }
        .prose-custom img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
        }
        .prose-custom h2 {
          font-family: "Montserrat", sans-serif !important;
          font-size: 1.35rem;
          color: #3c6881 !important;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.4;
          letter-spacing: 0.02em;
        }
        .prose-custom h2 * {
          color: inherit !important;
          font-family: inherit !important;
        }
        @media (min-width: 768px) {
          .prose-custom h2 {
            font-size: 1.6rem;
          }
        }
        .prose-custom h3 {
          font-family: "Montserrat", sans-serif !important;
          font-size: 1.15rem;
          color: #3c6881 !important;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        .prose-custom h3 * {
          color: inherit !important;
          font-family: inherit !important;
        }
        .prose-custom p {
          margin-bottom: 1.25rem;
        }
        .prose-custom blockquote {
          position: relative;
          border-left: 3px solid #cfb26e;
          padding-left: 1.5rem;
          font-style: italic;
          font-size: 1.05rem;
          color: #475569;
          margin: 2rem 0;
          line-height: 1.6;
        }
        .prose-custom ul {
          list-style-type: none;
          margin: 1.5rem 0;
          padding-left: 0.5rem;
        }
        .prose-custom ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }
        .prose-custom ul li::before {
          content: "•";
          color: #cfb26e;
          font-weight: bold;
          font-size: 1.2rem;
          position: absolute;
          left: 0.25rem;
          top: -0.1rem;
        }
        .prose-custom strong {
          color: #0f172a;
          font-weight: 600;
        }
        .prose-custom em {
          color: #263260;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default NewsDetailPage;
