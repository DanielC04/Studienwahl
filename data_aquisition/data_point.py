class DataPoint:
    value: float
    score: float  # is score between 0 - 1
    is_data_fetched: bool

    def __init__(self, criteria, value, is_parent_class = False) -> None:
        self.criteria = criteria
        self.value = value
        self.score = 0
        if not is_parent_class:
            self.register_with_criteria()
    
    def register_with_criteria(self):
            self.criteria.update_average_in_criteria(self.value)
            self.criteria.update_smallest_and_biggest_value(self.value)
            self.is_data_fetched = type(self.value) == float

    def calculate_score(self):
        self.score = self.criteria.calculate_weighted_score(self)
        return self.score

    def __repr__(self) -> str:
        return f"{self.value} {round(self.normalized_value, 2)}"
