import SvgIcon from '../util/SvgIcon'
function SortIcon({ sortField, sortOrder, columnId, onSortChange }) {
	return (
		<SvgIcon
			iconName={
				sortField === columnId ? (sortOrder === 'asc' ? 'chevronUp' : 'chevronDown') : 'chevronSort'
			}
			className="sort-icon"
			onClick={() => onSortChange(columnId)}
		/>
	)
}

export default SortIcon
