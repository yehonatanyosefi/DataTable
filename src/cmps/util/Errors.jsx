const Errors = ({ errors }) => {
	return (
		<div className="errors">
			{errors.map((err, i) => (
				<p key={i}>{err}</p>
			))}
		</div>
	)
}

export default Errors
