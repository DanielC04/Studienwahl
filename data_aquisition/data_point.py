class DataPoint:
	value: float
	score: float # is score between 0 - 1

	def __init__(self, criteria, value) -> None:
		self.criteria = criteria
		self.value = value
		self.score = 0
		criteria.update_average_in_criteria(self.value)
		criteria.update_smallest_and_biggest_value(self.value)
	
	def calculate_score(self):
		self.score = self.criteria.calculate_weighted_score(self)
		return self.score