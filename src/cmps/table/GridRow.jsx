import PropTypes from 'prop-types'
import Checkbox from '../dynamicCmps/Checkbox'
import Input from '../dynamicCmps/Input'
import DeleteButton from './DeleteButton'
function GridRow({
	row,
	tableData,
	hiddenColumns,
	gridTemplateColumns,
	onInputChange,
	onBlur,
	onDeleteRow,
}) {
	return (
		<div className="grid-row" style={{ gridTemplateColumns }}>
			<DeleteButton rowId={row.id} onDeleteRow={onDeleteRow} />
			{tableData.columns
				.filter((column) => !hiddenColumns.includes(column.id))
				.map((column) => (
					<div key={column.id} className="grid-cell">
						<TableInput row={row} column={column} onInputChange={onInputChange} onBlur={onBlur} />
					</div>
				))}
		</div>
	)
}

GridRow.propTypes = {
	row: PropTypes.object.isRequired,
	tableData: PropTypes.object.isRequired,
	hiddenColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
	gridTemplateColumns: PropTypes.string.isRequired,
	onInputChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	onDeleteRow: PropTypes.func.isRequired,
}

export default GridRow

function TableInput({ row, column, onInputChange, onBlur }) {
	if (column.type === 'boolean') {
		return <Checkbox row={row} column={column} onInputChange={onInputChange} />
	}

	return <Input row={row} column={column} onInputChange={onInputChange} onBlur={onBlur} />
}
