import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { BOARD_DETAILS, NOT_FOUND } from './services/routes.service'
import './assets/scss/main.scss'
// import { useDispatch } from 'react-redux'
const BoardDetails = lazy(() => import('./views/BoardDetails'))
const NotFound = lazy(() => import('./views/NotFound'))

export default function App() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<Router>
				<section className="main-app">
					<Routes>
						<Route path={BOARD_DETAILS} element={<BoardDetails />} />
						<Route path={NOT_FOUND} element={<NotFound />} />
						<Route path="*" element={<Navigate to={NOT_FOUND} replace />} />
					</Routes>
				</section>
			</Router>
		</Suspense>
	)
}
