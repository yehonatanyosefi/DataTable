import PropTypes from 'prop-types'
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

SortIcon.propTypes = {
	sortField: PropTypes.string,
	sortOrder: PropTypes.string,
	columnId: PropTypes.string.isRequired,
	onSortChange: PropTypes.func.isRequired,
}

export default SortIcon
