import SvgIcon from '../util/SvgIcon'
function DeleteButton({ rowId, onDeleteRow }) {
	return (
		<div className="delete-btn-wrapper">
			<SvgIcon
				iconName="delete"
				className="delete-btn"
				title="Delete Row"
				onClick={() => onDeleteRow(rowId)}
			/>
		</div>
	)
}
export default DeleteButton
