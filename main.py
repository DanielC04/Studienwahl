from data_aquisition.criterias.City import DistanceToErfurt
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from data_aquisition.University import University


University.initializeDriver()
print(University.getListOfAllUniverstities())


# allCriterias = [DistanceToErfurt('HPI', 10, 'transit')]
