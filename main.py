from data.IO import save_university_list, load_cashed_university_list
from data_aquisition.criterias.City import DistanceToErfurt
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from data_aquisition.University import University
import sys
sys.path.append('data_aquisition')

USE_CASH = True


University.initialize_driver()


if USE_CASH:
    allUniversities = load_cashed_university_list()
else:
    allUniversities = University.get_list_of_all_universities()
    save_university_list(allUniversities)

allUniversities[0].fetch_info_from_zeit()


University.destroy_driver()
