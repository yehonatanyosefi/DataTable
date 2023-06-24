import PropTypes from 'prop-types'

const Modal = ({ isOpen, children, onRequestClose }) => {
	if (!isOpen) {
		return null
	}

	return (
		<div className="modal-overlay" onClick={onRequestClose} role="dialog">
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onRequestClose} aria-label="Close dialog">
					x
				</button>
				{children}
			</div>
		</div>
	)
}

Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	children: PropTypes.node,
}

export default Modal
