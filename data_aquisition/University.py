import Criteria
import criterias.City as City
from selenium import webdriver
from selenium.webdriver.common.by import By


DRIVER_PATH = '/snap/bin/chromium.chromedriver'


class University:
    criterias = [City, City]
    driver = None

    def __init__(self, name, zeitOnlineLink='') -> None:
        self.initializeDriver()
        self.name = name
        self.data = None
        self.zeitOnlineLink = zeitOnlineLink
        # self.fetchData()

    def fetchData(self):
        self.data = []
        for criteria in University.criterias:
            self.data.append(criteria(self.name))

    def evaluateScore(self):
        if self.data == None:
            raise ValueError('The university data was not fetched properly')
        totalScore = 0
        for criteria in self.data:
            totalScore += criteria.getNormalizedScore()

    @classmethod
    def initializeDriver(cls):
        # initialize driver if not done yet
        if cls.driver == None:
            options = webdriver.FirefoxOptions()
            options.add_argument('--headless')
            cls.driver = webdriver.Firefox(options=options)

    @classmethod
    def findBestUniversity(cls):
        pass

    @classmethod
    def getListOfAllUniverstities(cls):
        return [cls.getListOfZeitRankingUniviersities()]

    @classmethod
    def getListOfZeitRankingUniviersities(cls):
        cls.driver.get("file:///media/daniel/731b3c4a-95a1-4c1e-9e8d-bc789f0b6d3a/Documents/Studium/semester_0/find_university/data/CHE Hochschulranking für Informatik ZEIT Campus.html")

        uni_links = cls.driver.find_elements(By.CLASS_NAME, 'unis a')
        res = [University(uni_link.text, uni_link.get_attribute('href'))
               for uni_link in uni_links]
        cls.driver.close()
        return res

    def __repr__(self) -> str:
        return self.name
        # res = f"{self.name}\n"
        # for criteria in self.criterias:
        # 	res += f"{criteria}\t"
        # return res
