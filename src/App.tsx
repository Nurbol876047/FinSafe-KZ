import { HelmetProvider } from 'react-helmet-async'
import { Route, BrowserRouter, Routes } from 'react-router-dom'

import { Layout } from '@/components/Layout'
import AcademyCatalogPage from '@/pages/AcademyCatalogPage'
import CoursePage from '@/pages/CoursePage'
import GamePlayPage from '@/pages/GamePlayPage'
import GamesCatalogPage from '@/pages/GamesCatalogPage'
import HomePage from '@/pages/HomePage'
import LessonPage from '@/pages/LessonPage'
import MediaPage from '@/pages/MediaPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ChampionshipPage from '@/pages/ChampionshipPage'
import ProfilePage from '@/pages/ProfilePage'

import '@/i18n'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="games" element={<GamesCatalogPage />} />
            <Route path="games/:id" element={<GamePlayPage />} />
            <Route path="academy" element={<AcademyCatalogPage />} />
            <Route path="academy/:courseId" element={<CoursePage />} />
            <Route path="academy/:courseId/:lessonId" element={<LessonPage />} />
            <Route path="championship" element={<ChampionshipPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
