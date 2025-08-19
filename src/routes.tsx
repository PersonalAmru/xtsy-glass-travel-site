import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Lazy load route components
const LazyAbout = lazy(() => import('./pages/About'));
const LazyGallery = lazy(() => import('./pages/lazy/LazyGallery').then(module => ({ default: module.LazyGallery })));
const LazyDeals = lazy(() => import('./pages/lazy/LazyDeals').then(module => ({ default: module.LazyDeals })));
const LazyTravel = lazy(() => import('./pages/lazy/LazyTravel').then(module => ({ default: module.LazyTravel })));
const LazyDashboard = lazy(() => import('./pages/lazy/LazyDashboard').then(module => ({ default: module.LazyDashboard })));
const LazyFAQ = lazy(() => import('./pages/lazy/LazyFAQ').then(module => ({ default: module.LazyFAQ })));
const LazyXTSY270 = lazy(() => import('./pages/lazy/LazyXTSY270').then(module => ({ default: module.LazyXTSY270 })));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "rooms",
        element: <LazyXTSY270 />
      },
      {
        path: "about", 
        element: <LazyAbout />
      },
      {
        path: "contact",
        element: <LazyAbout />
      },
      {
        path: "booking",
        element: <Index />
      },
      {
        path: "gallery",
        element: <LazyGallery />
      },
      {
        path: "deals", 
        element: <LazyDeals />
      },
      {
        path: "travel",
        element: <LazyTravel />
      },
      {
        path: "dashboard",
        element: <LazyDashboard />
      },
      {
        path: "faq",
        element: <LazyFAQ />
      },
      {
        path: "xtsy-270",
        element: <LazyXTSY270 />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;