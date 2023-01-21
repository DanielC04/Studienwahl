from selenium import webdriver
from selenium.webdriver.common.by import By
from dataclasses import dataclass
from dataclasses_json import dataclass_json
from data_aquisition.Criteria import Criteria
from data_aquisition.utils import make_html_text_to_int
import json

DRIVER_PATH = '/snap/bin/chromium.chromedriver'


@dataclass_json
@dataclass
class University:
    driver = None
    name: str
    zeit_online_link: str
    criterias: "list[Criteria]"
    USE_HEADLESS = False
    # data: list[]

    def __init__(self, name, zeitOnlineLink='') -> None:
        self.initialize_driver()
        self.name = name
        self.zeit_online_link = zeitOnlineLink
        # self.fetchData()
        # self.criterias: list[type[Criteria]] = []
        self.criterias = []

    def fetchData(self):
        self.fetch_info_from_zeit()

    def evaluateScore(self):
        # if self.data == None:
        #     raise ValueError('The university data was not fetched properly')
        totalScore = 0
        for criteria in self.data:
            totalScore += criteria.getNormalizedScore()

    def fetch_info_from_zeit(self):
        d = self.driver
        # equivalent of clicking the 'accept-ads-button' by setting the needed coockie
        d.get(url=self.zeit_online_link)
        #
        # Criteria:'Studenten insgesamt'
        #
        self.criterias.append(Criteria(
            'Studenten insgesamt', self.name, importance=5, super_category='Universität'))
        self.criterias[-1].bestScore = 100
        self.criterias[-1].worstScore = 10_000
        student_count_as_string = d.find_element(
            By.CSS_SELECTOR, 'td.checol2_rank').text
        student_count = make_html_text_to_int(student_count_as_string)
        self.criterias[-1].score = student_count

        #
        # Criteria: 'Anzahl Masterstudenten'
        #
        self.criterias.append(Criteria(
            'Anteil Masterstudenten', self.name, importance=20, super_category='Universität'))
        print(d.find_element(By.CSS_SELECTOR, 'td.checol2_rank').text)

        # print(info)
    @classmethod
    def initialize_driver(cls):
        # initialize driver if not done yet
        if cls.driver == None:
            options = webdriver.FirefoxOptions()
            if cls.USE_HEADLESS:
                options.add_argument('--headless')
            cls.driver = webdriver.Firefox(options=options)
            cls.set_consent_cookies()

    @classmethod
    def set_consent_cookies(cls):
        cls.driver.get(
            'https://www.zeit.de/gesellschaft/zeitgeschehen/2023-01/elon-musk-tesla-aktie-gericht-verfahren')
        cls.driver.add_cookie(
            {'name': 'zonconsent', 'value': '2023-01-21T02:31:29.903Z'})

    @classmethod
    def findBestUniversity(cls):
        pass

    @classmethod
    def get_list_of_all_universities(cls):
        return cls.getListOfZeitRankingUniviersities()

    @classmethod
    def getListOfZeitRankingUniviersities(cls):
        cls.driver.get(
            "file:///media/daniel/external_disk/Documents/Studium/semester_0/find_university/data/CHE Hochschulranking für Informatik ZEIT Campus.html")

        uni_links = cls.driver.find_elements(By.CLASS_NAME, 'unis a')
        res = [University(uni_link.text, uni_link.get_attribute('href'))
               for uni_link in uni_links]
        return res

    @classmethod
    def destroy_driver(cls):
        cls.driver and cls.driver.close()

    def __repr__(self) -> str:
        return self.name
        # res = f"{self.name}\n"
        # for criteria in self.criterias:
        # 	res += f"{criteria}\t"
        # return res


    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)