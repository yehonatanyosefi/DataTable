import PropTypes from 'prop-types'
function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<div className="pagination">
			<button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
				Previous
			</button>
			<span>
				{currentPage} / {totalPages}
			</span>
			<button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
				Next
			</button>
		</div>
	)
}

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
}

export default Pagination
