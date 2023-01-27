import sys
sys.path.append('data_aquisition')
from data.io import *
from data_aquisition.university import University
from data_aquisition.criteria import Criteria
import config

USE_CASH = config.USE_CASH
if len(sys.argv) > 1 and sys.argv[1] == 'USE_CASH':
    USE_CASH = True



if USE_CASH:
    load_cashed_object('data/university_list.json')
    Criteria.all_criterias = load_cashed_object('data/criterias.json')
    # scoring function of every criteria couldn't be stored/loaded -> initialize now
    # for criteria in Criteria.all_criterias.values():
    #     criteria.scoring_function = lambda x : x
    University.calculate_scores()
    University.sort_universities_by_score()
    save_string_to_file(University.get_table_string(), 'data/table_output.txt')
else:
    University.initialize_driver()
    University.fetch_all_data()
    University.calculate_scores()
    University.sort_universities_by_score()

    save_object(University.all_universities, 'data/university_list.json')
    save_object(Criteria.all_criterias, 'data/criterias.json')
    University.destroy_driver()

    save_string_to_file(University.get_table_string(), 'data/table_output.txt')
    save_string_to_file(University.get_table_csv(), 'data/table_output.csv')

# print(len(University.all_universities))
