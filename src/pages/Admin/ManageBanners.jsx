import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FiTrash2, FiUploadCloud, FiPlus, FiList, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { bannerService } from "../../services/bannerService";

export const ManageBanners = () => {
  const { showConfirm, showToast } = useOutletContext();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Form Upload
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [title, setTitle] = useState("");
  const [uploadStatus, setUploadStatus] = useState(""); // "", "compressing", "uploading", "success", "error"
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState("");

  // Chuẩn hóa và làm sạch số thứ tự hiển thị để đảm bảo là 1, 2, 3 không trùng lặp
  const cleanBannerOrders = async (data) => {
    let changed = false;
    const sortedData = [...data].sort((a, b) => a.display_order - b.display_order);
    
    const promises = sortedData.map((banner, index) => {
      const correctOrder = index + 1;
      if (banner.display_order !== correctOrder) {
        changed = true;
        return bannerService.updateBannerOrder(banner.id, correctOrder);
      }
      return Promise.resolve();
    });

    if (changed) {
      await Promise.all(promises);
      const refreshed = await bannerService.fetchAllBanners();
      setBanners(refreshed);
    } else {
      setBanners(sortedData);
    }
  };

  // Tải danh sách banner và chuẩn hóa
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.fetchAllBanners();
      await cleanBannerOrders(data);
    } catch (err) {
      console.error("Lỗi tải danh sách banner:", err);
      showToast("Không thể tải danh sách banner", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Đọc file và kiểm tra kích thước ảnh
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setValidationError("");
    
    // Thu hồi URL cũ để tránh rò rỉ bộ nhớ
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview("");

    // Kiểm tra định dạng ảnh
    if (!selectedFile.type.startsWith("image/")) {
      setValidationError("Tệp tin được chọn phải là hình ảnh.");
      return;
    }

    // Đọc kích thước ảnh
    const objectUrl = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.src = objectUrl;
    
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // Validate kích thước 1920x1080
      if (width === 1920 && height === 1080) {
        setFile(selectedFile);
        setFilePreview(objectUrl); // Giữ lại URL để hiển thị preview
        setValidationError("");
      } else {
        setValidationError(
          `Kích thước ảnh không hợp lệ: ${width}x${height}px. Hệ thống chỉ chấp nhận ảnh kích thước chính xác là 1920x1080 px (Canva 16:9).`
        );
        URL.revokeObjectURL(objectUrl); // Xóa URL nếu ảnh sai kích thước
        e.target.value = null; // Reset input file
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setValidationError("Không thể đọc tệp hình ảnh này. Hãy thử ảnh khác.");
      e.target.value = null;
    };
  };

  // Xử lý nộp form upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setValidationError("Vui lòng chọn tệp ảnh hợp lệ.");
      return;
    }

    if (banners.length >= 3) {
      showToast("Đã đạt giới hạn tối đa 3 banner. Vui lòng xóa bớt trước khi tải lên.", "warning");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(20);
      
      // Auto-assign display order as the next index (1, 2, or 3)
      await bannerService.uploadBanner(
        file,
        title,
        banners.length + 1,
        (status, progress) => {
          setUploadStatus(status);
          setUploadProgress(progress);
        }
      );

      showToast("Tải lên banner thành công", "success");
      // Reset form
      setFile(null);
      setFilePreview("");
      setTitle("");
      setUploadStatus("");
      setUploadProgress(0);
      
      // Reload danh sách
      fetchBanners();
    } catch (err) {
      console.error("Lỗi upload banner:", err);
      showToast("Tải lên banner thất bại: " + err.message, "danger");
      setUploadStatus("error");
    }
  };

  // Xử lý xóa banner
  const handleDeleteClick = (banner) => {
    showConfirm(
      `Bạn có chắc chắn muốn xóa banner này không? Bức ảnh này sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống.`,
      async () => {
        try {
          await bannerService.deleteBanner(banner.id, banner.storage_path);
          showToast("Xóa banner thành công", "success");
          fetchBanners();
        } catch (err) {
          console.error("Lỗi xóa banner:", err);
          showToast("Xóa banner thất bại", "danger");
        }
      },
      "danger",
      "Xác nhận xóa Banner"
    );
  };

  // Hoán đổi thứ tự hiển thị bằng cách cập nhật Database
  const handleMove = async (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const currentBanner = banners[index];
    const targetBanner = banners[newIndex];

    try {
      // Hoán đổi display_order trong database
      await Promise.all([
        bannerService.updateBannerOrder(currentBanner.id, targetBanner.display_order),
        bannerService.updateBannerOrder(targetBanner.id, currentBanner.display_order)
      ]);

      showToast("Thay đổi thứ tự hiển thị thành công", "success");
      fetchBanners(); // Reload & Sắp xếp lại
    } catch (err) {
      console.error("Lỗi hoán đổi thứ tự hiển thị:", err);
      showToast("Lỗi thay đổi thứ tự hiển thị", "danger");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER PAGE */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="font-sans text-2xl font-bold tracking-wide text-primary uppercase">
            Quản Lý Banner Trang Chủ
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold self-start sm:self-auto">
          <FiList />
          <span>Số lượng hiện tại: {banners.length} / 3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* CỘT TRÁI: DƠN VỊ TẢI LÊN BANNER (FORM) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-sans text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FiUploadCloud />
              Tải Lên Banner Mới
            </h2>

            {banners.length >= 3 ? (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                <p className="font-semibold mb-1">⚠️ Đã đạt giới hạn tối đa</p>
                <p>Website chỉ hiển thị tối đa **3 slide banner** trên trang chủ. Bạn vui lòng xóa bớt banner cũ trước khi tải thêm banner mới.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Drag and Drop / Input File Zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Hình ảnh banner (Yêu cầu 1920 x 1080 px) <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-primary bg-slate-50/50 hover:bg-white transition-all cursor-pointer overflow-hidden min-h-[160px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={!!uploadStatus}
                    />

                    {filePreview ? (
                      <div className="absolute inset-0 w-full h-full p-2 bg-white">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <p className="text-white text-xs font-semibold">Nhấn để thay đổi ảnh</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FiUploadCloud className="text-slate-400 group-hover:text-primary mb-3" size={36} />
                        <p className="text-sm font-semibold text-slate-700">Chọn hoặc Kéo ảnh vào đây</p>
                        <p className="text-xs text-slate-400 mt-1">Hỗ trợ PNG, JPG, JPEG, WEBP</p>
                        <p className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-2">Kích thước bắt buộc: 1920 x 1080</p>
                      </>
                    )}
                  </div>

                  {validationError && (
                    <p className="mt-2 text-xs font-medium text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                      {validationError}
                    </p>
                  )}
                </div>



                {/* Ghi chú / Tiêu đề ẩn */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Ghi chú / Tên slide (Không bắt buộc)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Banner chương trình khai trương"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    disabled={!!uploadStatus}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Để lưu ý quản lý trong Admin.</p>
                </div>

                {/* Nút bấm Submit và Tiến trình */}
                <div className="pt-2">
                  {uploadStatus ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium text-slate-600">
                        <span>
                          Đang tải ảnh lên máy chủ...
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!file}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold tracking-wide text-white transition-all shadow ${
                        file
                          ? "bg-primary hover:bg-primary/95 cursor-pointer"
                          : "bg-slate-300 cursor-not-allowed"
                      }`}
                    >
                      <FiPlus />
                      Thêm Banner mới
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH BANNER ĐANG CÓ */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-sans text-lg font-bold text-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FiList />
              Danh Sách Banner Hiện Tại
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <p className="text-sm">Đang tải danh sách banner...</p>
              </div>
            ) : banners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <FiUploadCloud size={48} className="text-slate-300 mb-3" />
                <p className="text-sm font-semibold">Chưa có banner nào được tải lên</p>
                <p className="text-xs mt-1 text-slate-400">Tải lên banner ở khung bên trái để hiển thị trên trang chủ.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {banners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50/30 transition-all bg-white shadow-sm"
                  >
                    {/* Ảnh Preview */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-28 sm:w-36 aspect-[16/9] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                        <img
                          src={banner.image_url}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-medium">Slide #{index + 1}</p>
                        <h4 className="text-sm font-bold text-slate-800 truncate mt-0.5">
                          {banner.title || "Không có tên ghi chú"}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono truncate max-w-[200px] sm:max-w-xs">
                          {banner.storage_path.replace("banners/", "")}
                        </p>
                      </div>
                    </div>

                    {/* Sắp xếp và Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
                      {/* Thay đổi thứ tự bằng nút mũi tên Up/Down */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                          className={`p-1.5 rounded-md transition-colors ${
                            index === 0
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm cursor-pointer"
                          }`}
                          title="Di chuyển lên"
                        >
                          <FiArrowUp size={14} />
                        </button>
                        <span className="text-xs font-bold text-slate-700 px-2 min-w-[70px] text-center select-none">
                          Vị trí {banner.display_order}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMove(index, "down")}
                          disabled={index === banners.length - 1}
                          className={`p-1.5 rounded-md transition-colors ${
                            index === banners.length - 1
                              ? "text-slate-300 cursor-not-allowed"
                              : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm cursor-pointer"
                          }`}
                          title="Di chuyển xuống"
                        >
                          <FiArrowDown size={14} />
                        </button>
                      </div>

                      {/* Nút xóa */}
                      <button
                        onClick={() => handleDeleteClick(banner)}
                        className="cursor-pointer text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                        title="Xóa banner này"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBanners;
