import PropTypes from 'prop-types'
import Resizer from './Resizer'
import SortIcon from './SortIcon'

function GridHeader({
	tableData,
	hiddenColumns,
	gridTemplateColumns,
	sortField,
	sortOrder,
	onSortChange,
	onMouseDown,
}) {
	return (
		<div className="grid-header" style={{ gridTemplateColumns }}>
			{tableData.columns
				.filter((column) => !hiddenColumns.includes(column.id))
				.map((column) => (
					<div key={column.id} className="grid-cell" style={{ position: 'relative' }}>
						{column.title}
						<SortIcon
							sortField={sortField}
							sortOrder={sortOrder}
							columnId={column.id}
							onSortChange={onSortChange}
						/>
						<Resizer columnId={column.id} onMouseDown={onMouseDown} />
					</div>
				))}
		</div>
	)
}

GridHeader.propTypes = {
	tableData: PropTypes.object.isRequired,
	hiddenColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
	gridTemplateColumns: PropTypes.string.isRequired,
	sortField: PropTypes.string.isRequired,
	sortOrder: PropTypes.string.isRequired,
	onSortChange: PropTypes.func.isRequired,
	onMouseDown: PropTypes.func.isRequired,
}

export default GridHeader
