class DataPoint:
	value: float

	def __init__(self, criteria, value) -> None:
		self.criteria = criteria
		self.value = value