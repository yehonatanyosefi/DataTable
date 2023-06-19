import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { HOME } from './services/routes.service'
import './assets/scss/main.scss'
// import { useDispatch } from 'react-redux'
const Home = lazy(() => import('./views/Home'))
const NotFound = lazy(() => import('./views/NotFound'))

export default function App() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<Router>
				<section className="main-app">
					<Routes>
						<Route path={HOME} element={<Home />} />
						<Route path={'/404'} element={<NotFound />} />
						<Route path="*" element={<Navigate to="/404" replace />} />
					</Routes>
				</section>
			</Router>
		</Suspense>
	)
}
