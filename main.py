from data.io import *
from data_aquisition.criterias.city import DistanceToErfurt
from data_aquisition.university import University
from data_aquisition.criteria import Criteria
import sys
sys.path.append('data_aquisition')


USE_CASH = False
if len(sys.argv) > 1 and sys.argv[1] == 'USE_CASH':
    USE_CASH = True





if USE_CASH:
    load_cashed_object('data/university_list.json')
    Criteria.all_criterias = load_cashed_object('data/criterias.json')
else:
    University.initialize_driver()
    University.get_list_of_all_universities()
    for university in University.all_universities:
        university.fetch_info_from_zeit()

    save_object(University.all_universities, 'data/university_list.json')
    save_object(Criteria.all_criterias, 'data/criterias.json')
    University.destroy_driver()

save_string_to_file(University.get_table_string(), 'data/table_output.txt')
# print(len(University.all_universities))


