import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { HomePage } from "../pages/HomePage/index.jsx";
import NotFound from "../pages/NotFoundPage.jsx";
import VillaSequence from "../components/VillaSquence.jsx";
import ReverieBeachLanding from "../components/VillaSquence.jsx";
import AboutPage from "../pages/AboutPage/index.jsx";
import GalleryPage from "../pages/GalleryPage/index.jsx";
import MenuPage from "../pages/MenuPage/index.jsx";
import NewsPage from "../pages/NewsPage/index.jsx";
import NewsDetailPage from "../pages/NewsDetailPage/index.jsx";
import DashboardLayout from "../pages/Admin/DashboardLayout.jsx";
import ManageGallery from "../pages/Admin/ManageGallery.jsx";
import UploadImages from "../pages/Admin/UploadImages.jsx";
import ManagePosts from "../pages/Admin/ManagePosts.jsx";
import WritePost from "../pages/Admin/WritePost.jsx";
import EditPost from "../pages/Admin/EditPost.jsx";
import ManageContacts from "../pages/Admin/ManageContacts.jsx";
import ManageBookings from "../pages/Admin/ManageBookings.jsx";
import ProtectedRoute from "../pages/Admin/ProtectedRoute.jsx";
import LoginPage from "../pages/Admin/LoginPage.jsx";

const router = createBrowserRouter([
  // Main Site Routes
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "gioi-thieu", element: <AboutPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "gallery/:slug", element: <GalleryPage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "news/:slug", element: <NewsDetailPage /> }
    ],
  },
  // Protected Admin Routes
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <ManagePosts /> },
          { path: "gallery", element: <ManageGallery /> },
          { path: "gallery/upload", element: <UploadImages /> },
          { path: "posts", element: <ManagePosts /> },
          { path: "posts/new", element: <WritePost /> },
          { path: "posts/edit/:id", element: <EditPost /> },
          { path: "contacts", element: <ManageContacts /> },
          { path: "bookings", element: <ManageBookings /> }
        ]
      }
    ]
  },
  // Public Login Route
  {
    path: "/admin/login",
    element: <LoginPage />
  },
  {
    path: "/test",
    element: <ReverieBeachLanding />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
