import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { HomePage } from "../pages/HomePage/index.jsx";

// Loading spinner / placeholder tối giản, nhẹ
const PageLoader = () => (
  <div className="flex min-h-[50vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#3c6881]" />
  </div>
);

const LazyLoad = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// Lazy-load các trang công khai con
const AboutPage = lazy(() => import("../pages/AboutPage/index.jsx"));
const GalleryPage = lazy(() => import("../pages/GalleryPage/index.jsx"));
const MenuPage = lazy(() => import("../pages/MenuPage/index.jsx"));
const NewsPage = lazy(() => import("../pages/NewsPage/index.jsx"));
const NewsDetailPage = lazy(() => import("../pages/NewsDetailPage/index.jsx"));
const NotFound = lazy(() => import("../pages/NotFoundPage.jsx"));

// Lazy-load toàn bộ cụm Admin và trình soạn thảo nặng
const ProtectedRoute = lazy(() => import("../pages/Admin/ProtectedRoute.jsx"));
const LoginPage = lazy(() => import("../pages/Admin/LoginPage.jsx"));
const DashboardLayout = lazy(() => import("../pages/Admin/DashboardLayout.jsx"));
const ManagePosts = lazy(() => import("../pages/Admin/ManagePosts.jsx"));
const ManageGallery = lazy(() => import("../pages/Admin/ManageGallery.jsx"));
const UploadImages = lazy(() => import("../pages/Admin/UploadImages.jsx"));
const WritePost = lazy(() => import("../pages/Admin/WritePost.jsx"));
const EditPost = lazy(() => import("../pages/Admin/EditPost.jsx"));
const ManageContacts = lazy(() => import("../pages/Admin/ManageContacts.jsx"));
const ManageBookings = lazy(() => import("../pages/Admin/ManageBookings.jsx"));
const ManageBanners = lazy(() => import("../pages/Admin/ManageBanners.jsx"));
const ReverieBeachLanding = lazy(() => import("../components/VillaSquence.jsx"));

const router = createBrowserRouter([
  // Main Site Routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "gioi-thieu",
        element: (
          <LazyLoad>
            <AboutPage />
          </LazyLoad>
        ),
      },
      {
        path: "gallery",
        element: (
          <LazyLoad>
            <GalleryPage />
          </LazyLoad>
        ),
      },
      {
        path: "gallery/:slug",
        element: (
          <LazyLoad>
            <GalleryPage />
          </LazyLoad>
        ),
      },
      {
        path: "menu",
        element: (
          <LazyLoad>
            <MenuPage />
          </LazyLoad>
        ),
      },
      {
        path: "news",
        element: (
          <LazyLoad>
            <NewsPage />
          </LazyLoad>
        ),
      },
      {
        path: "news/:slug",
        element: (
          <LazyLoad>
            <NewsDetailPage />
          </LazyLoad>
        ),
      },
    ],
  },
  // Protected Admin Routes (Tách hoàn toàn khỏi Bundle Trang chủ)
  {
    path: "/admin",
    element: (
      <LazyLoad>
        <ProtectedRoute />
      </LazyLoad>
    ),
    children: [
      {
        path: "",
        element: (
          <LazyLoad>
            <DashboardLayout />
          </LazyLoad>
        ),
        children: [
          {
            index: true,
            element: (
              <LazyLoad>
                <ManagePosts />
              </LazyLoad>
            ),
          },
          {
            path: "gallery",
            element: (
              <LazyLoad>
                <ManageGallery />
              </LazyLoad>
            ),
          },
          {
            path: "gallery/upload",
            element: (
              <LazyLoad>
                <UploadImages />
              </LazyLoad>
            ),
          },
          {
            path: "posts",
            element: (
              <LazyLoad>
                <ManagePosts />
              </LazyLoad>
            ),
          },
          {
            path: "posts/new",
            element: (
              <LazyLoad>
                <WritePost />
              </LazyLoad>
            ),
          },
          {
            path: "posts/edit/:id",
            element: (
              <LazyLoad>
                <EditPost />
              </LazyLoad>
            ),
          },
          {
            path: "contacts",
            element: (
              <LazyLoad>
                <ManageContacts />
              </LazyLoad>
            ),
          },
          {
            path: "bookings",
            element: (
              <LazyLoad>
                <ManageBookings />
              </LazyLoad>
            ),
          },
          {
            path: "banners",
            element: (
              <LazyLoad>
                <ManageBanners />
              </LazyLoad>
            ),
          },
        ],
      },
    ],
  },
  // Public Login Route
  {
    path: "/admin/login",
    element: (
      <LazyLoad>
        <LoginPage />
      </LazyLoad>
    ),
  },
  {
    path: "/test",
    element: (
      <LazyLoad>
        <ReverieBeachLanding />
      </LazyLoad>
    ),
  },
  {
    path: "*",
    element: (
      <LazyLoad>
        <NotFound />
      </LazyLoad>
    ),
  },
]);

export default router;
