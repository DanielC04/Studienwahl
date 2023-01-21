from data_aquisition.criterias.City import DistanceToErfurt
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from data_aquisition.University import University


University.initialize_driver()
allUniversities = University.get_list_of_all_universities()
print(allUniversities)

allUniversities[0].fetch_info_from_zeit()


University.destruct_driver()
