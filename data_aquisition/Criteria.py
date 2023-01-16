class Criteria:
	allCriterias = []

	def __init__(self, university_name, importance) -> None:
		self.university_name = university_name
		# importance is subjective value from 1 - 10
		self.importance = importance
		self.score = None
		self.worstScore = 0
		self.bestScore = 1
		self.scoringFunction = lambda x: (x - self.worstScore) / (self.bestScore - self.worstScore)
		self.totalAverage = 0
		Criteria.allCriterias.append(self)

		# update weights
		Criteria.determineWeights()
	

	def getNormalizedScore(self):
		if self.score == None:
			return self.scoringFunction(self.getAverageScore())
		return self.scoringFunction(self.score)

	@classmethod
	def getAverageScore(cls):
		total = 0
		count = 0
		for criteria in Criteria.allCriterias:
			if criteria.score != None:
				total += criteria.score
				count += 1
		return total / count

	@classmethod
	def determineWeights(cls):
		sumOfImportanceScores = sum(c.importance for c in Criteria.allCriterias)
		for criteria in Criteria.allCriterias:
			criteria.weight = criteria.importance * 1.0 /sumOfImportanceScores


	def __repr__(self) -> str:
		return f'{self.score} ({self.worstScore} - {self.bestScore})'