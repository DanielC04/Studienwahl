from data_aquisition.data_point import DataPoint
from weakref import WeakValueDictionary
import config


class Criteria:
    _registry = WeakValueDictionary()
    all_criterias: "dict[str, Criteria]" = {}
    smallest_value: float = float("Inf")
    biggest_value: float = -float("Inf")
    criteria_name: str
    super_category: str
    importance: int
    is_smaller_score_better: bool
    _sum_for_average: float = 0.0
    _count_for_average: int = 0
    average: float = 0.0
    scoring_function: "callable[float, float]"
    weight: float

    def __new__(cls, criteria_name, importance=20, super_category="general", is_smaller_score_better=True):
        if criteria_name in cls._registry:
            return cls._registry[criteria_name]
        instance = super().__new__(cls)
        cls._registry[criteria_name] = instance
        return instance

    def __init__(self, criteria_name, importance=20, super_category="general", is_smaller_score_better=True) -> None:
        self.all_criterias[criteria_name] = self
        self.criteria_name = criteria_name
        self.super_category = super_category
        # importance is subjective value from 1 - 100
        self.importance = importance
        self.is_smaller_score_better = is_smaller_score_better

        # scoring function maps normalized value (0 - 1) to new
        self.scoring_function = lambda x: x
        # update weights
        Criteria.determineWeights()

    def calculate_weighted_score(self, data_point: DataPoint) -> float:
        value = data_point.value
        if value == None or type(value) != float:
            data_point.normalized_value = 0
            return 0
        if not data_point.is_data_fetched:
            value = self.average
        normalized_value = (value - self.smallest_value) / (self.biggest_value - self.smallest_value)
        if data_point.is_data_fetched:
            normalized_value *= config.LOSS_FACTOR_FROM_AVERAGE_IF_DATA_NOT_FETCHED
        if self.is_smaller_score_better:
            normalized_value = 1 - normalized_value
        data_point.normalized_value = normalized_value
        return self.scoring_function(normalized_value) * self.weight

    def update_average_in_criteria(self, value: float):
        if value != None and type(value) == float:
            self._sum_for_average += value
            self._count_for_average += 1
            self.average = self._sum_for_average / self._count_for_average

    def update_smallest_and_biggest_value(self, value: float):
        if value == None or type(value) != float:
            return
        # if self.smallest_value == None:
        #     self.smallest_value = data_point.value
        self.smallest_value = min(self.smallest_value, value)
        # if self.biggest_value == None:
        #     self.biggest_value = data_point.value
        self.biggest_value = max(self.biggest_value, value)

    @classmethod
    def determineWeights(cls):
        sum_of_importance_scores = sum(c.importance for c in Criteria.all_criterias.values())
        for criteria in Criteria.all_criterias.values():
            criteria.weight = criteria.importance * 1.0 / sum_of_importance_scores

    def scoring_function(self, x):
        return x

    #
    # to make sure json-pickle stores class variables too
    #
    def __getstate__(self):
        ret = self.__dict__.copy()
        ret["all_criterias"] = Criteria.all_criterias
        return ret

    def __setstate__(self, state):
        Criteria.all_criterias = state.pop("all_criterias")
        self.__dict__.update(state)

    def __repr__(self) -> str:
        return f"{self.score} ({self.worst_score} - {self.best_score})"

if __name__ == "__main__":
    criteria_1 = Criteria("Distanz zu Erfurt", 10, "City")
    criteria_2 = Criteria("Distanz zu Erfurt", 10, "City")
    criteria_3 = Criteria("Distanz zu Halle", 10, "City")
