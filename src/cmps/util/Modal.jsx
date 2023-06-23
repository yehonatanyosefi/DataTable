const Modal = ({ isOpen, children, onRequestClose }) => {
	if (!isOpen) {
		return null
	}

	return (
		<div className="modal-overlay" onClick={onRequestClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<button className="modal-close-btn" onClick={onRequestClose}>
					x
				</button>
				{children}
			</div>
		</div>
	)
}
export default Modal
