from data_aquisition.data_point import DataPoint
from weakref import WeakValueDictionary


class Criteria:
    _registry = WeakValueDictionary()
    all_criterias: "dict[str, Criteria]" = {}
    smallest_value: float = None
    biggest_value: float = None
    criteria_name: str
    super_category: str
    importance: int

    def __new__(cls, criteria_name, importance=20, super_category='general'):
        if criteria_name in cls._registry:
            return cls._registry[criteria_name]
        instance = super().__new__(cls)
        cls._registry[criteria_name] = instance
        return instance

    def __init__(self, criteria_name, importance=20, super_category='general') -> None:
        self.all_criterias[criteria_name] = self
        self.criteria_name = criteria_name
        self.super_category = super_category
        # importance is subjective value from 1 - 100
        self.importance = importance

        self.scoring_function = lambda x: (
            x - self.worst_score) / (self.best_score - self.worst_score)

        # update weights
        # Criteria.determineWeights()
        # update the smallest and biggest value of all the given data in this criteria
        # self.update_smallest_and_biggest_value(data_point)

    def get_normalizedScore(self):
        if self.score == None:
            return self.scoring_function(self.get_average_score(self.criteria_name))
        return self.scoring_function(self.score)

    @classmethod
    def get_average_score(cls, criteria_name):
        total = 0.
        count = 0
        for criteria in Criteria.all_criterias[criteria_name]:
            if criteria.score == None:
                continue
            total += criteria.score
            count += 1
        return total / count

    @classmethod
    def determineWeights(cls):
        sum_of_importance_scores = sum(
            c.importance for c in Criteria.all_criterias)
        for criteria in Criteria.all_criterias:
            criteria.weight = criteria.importance * 1.0 / sum_of_importance_scores

    def update_smallest_and_biggest_value(self, data_point: DataPoint):
        if data_point.value == None:
            return
        if Criteria.smallest_value == None:
            Criteria.smallest_value = data_point.value
        Criteria.smallest_value = min(
            Criteria.smallest_value, data_point.value)
        if Criteria.biggest_value == None:
            Criteria.biggest_value = data_point.value
        Criteria.biggest_value = max(Criteria.biggest_value, data_point.value)

    def __repr__(self) -> str:
        return f'{self.score} ({self.worst_score} - {self.best_score})'
