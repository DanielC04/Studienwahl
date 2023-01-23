from selenium import webdriver
from selenium.webdriver.common.by import By
from data_aquisition.criteria import Criteria
from data_aquisition.utils import extract_first_data_field_as_int
from data_aquisition.data_point import DataPoint
from prettytable import PrettyTable, SINGLE_BORDER

DRIVER_PATH = '/snap/bin/chromium.chromedriver'


class University:
    USE_HEADLESS = False
    driver = None
    name: str
    score: float
    zeit_online_link: str
    # criterias: "list[Criteria]"
    data: "list[DataPoint]"
    all_universities: "list[University]" = []

    def __init__(self, name, zeitOnlineLink='') -> None:
        self.initialize_driver()
        self.name = name
        self.zeit_online_link = zeitOnlineLink
        self.data = []
        # self.fetchData()
        # self.criterias: list[type[Criteria]] = []
        University.all_universities.append(self)
        self.score = 0.0

    #
    # fetch the data from the internet
    #

    def fetchData(self):
        self.fetch_info_from_zeit()

    def fetch_info_from_zeit(self):
        d = self.driver
        # equivalent of clicking the 'accept-ads-button' by setting the needed coockie
        d.get(url=self.zeit_online_link)
        all_data_fields = d.find_elements(By.CSS_SELECTOR, 'td.checol2_rank')

        self.make_and_scrape_criteria('Studenten insgesamt', 'University', 5, all_data_fields)
        self.make_and_scrape_criteria('Anzahl Masterstudenten', 'University', 10, all_data_fields)
        self.make_and_scrape_criteria('Anzahl Lehre durch Praktiker', 'University', 2, all_data_fields)
        self.make_and_scrape_criteria('Anzahl Lehre durch Praktiker (im Master)', 'University', 1, all_data_fields)
        self.make_and_scrape_criteria('Unterstützung am Studienanfang', 'University', 20, all_data_fields)
        self.make_and_scrape_criteria('Abschlüsse in angemessener Zeit', 'University', 5, all_data_fields)
        self.make_and_scrape_criteria('Abschlüsse in angemessener Zeit (Master)', 'University', 2, all_data_fields)
        self.make_and_scrape_criteria('Abschlüsse in kooperation mit der Praxis', 'University', 10, all_data_fields)
        self.make_and_scrape_criteria('Abschlüsse in kooperation mit der Praxis (Master)', 'University', 2, all_data_fields)
        self.make_and_scrape_criteria('Veröffentlichungen pro Wissenschaftler', 'University', 10, all_data_fields)
        self.make_and_scrape_criteria('Forschungsgelder je Wissenschaftler', 'University', 25, all_data_fields)
        self.make_and_scrape_criteria('Promotionen pro Professor', 'University', 15, all_data_fields)
        self.make_and_scrape_criteria('Betreuung durch Lehrende', 'University', 2, all_data_fields)
        self.make_and_scrape_criteria('Unterstützung im Studium', 'University', 5, all_data_fields)
        self.make_and_scrape_criteria('Lehrangebot', 'University', 2, all_data_fields)
        self.make_and_scrape_criteria('Studienorganisation', 'University', 2, all_data_fields)
        self.make_and_scrape_criteria('Prüfungen (Wiederholbarkeit, Termine, ...)', 'University', 5, all_data_fields)
        self.make_and_scrape_criteria('Wissenschaftsbezug', 'University', 3, all_data_fields)
        self.make_and_scrape_criteria('Angebot zur Berufsorientierung', 'University', 3, all_data_fields)
        self.make_and_scrape_criteria('Unterstützung Auslandsstudium', 'University', 50, all_data_fields)
        self.make_and_scrape_criteria('Räume', 'University', 5, all_data_fields)
        self.make_and_scrape_criteria('Bibliotheksausstattung', 'University', 10, all_data_fields)
        self.make_and_scrape_criteria('IT-Infrastruktur', 'University', 10, all_data_fields)
        self.make_and_scrape_criteria('Ausstattung der Arbeitsplätze', 'University', 10, all_data_fields)
        self.make_and_scrape_criteria('Allgemeine Studiensituation', 'University', 10, all_data_fields)

    def make_and_scrape_criteria(self, name, super_category, importance, all_data_fields):
        new_criteria = Criteria(
            criteria_name=name, importance=importance, super_category=super_category)

        extracted_value = extract_first_data_field_as_int(all_data_fields)
        new_data = DataPoint(criteria=new_criteria, value=extracted_value)
        self.data.append(new_data)

    @ classmethod
    def initialize_driver(cls):
        # initialize driver if not done yet
        if cls.driver == None:
            options = webdriver.FirefoxOptions()
            if cls.USE_HEADLESS:
                options.add_argument('--headless')
            cls.driver = webdriver.Firefox(options=options)
            cls.set_consent_cookies()

    @ classmethod
    def order_by_my_ranking(cls):
        # assumption:
        #    all the university data has already been read from CASH or from the web
        for uni in cls.all_universities:
            uni.evaluate_score()

        cls.all_universities = sorted(
            cls.all_universities, key=lambda x: x.score)

        pass

    @ classmethod
    def get_list_of_all_universities(cls):
        return cls.getListOfZeitRankingUniviersities()

    @ classmethod
    def getListOfZeitRankingUniviersities(cls):
        cls.driver.get(
            "file:///media/daniel/external_disk/Documents/Studium/semester_0/find_university/data/CHE Hochschulranking für Informatik ZEIT Campus.html")

        uni_links = cls.driver.find_elements(By.CLASS_NAME, 'unis a')
        res = [University(uni_link.text, uni_link.get_attribute('href'))
               for uni_link in uni_links]
        return res

    @ classmethod
    def set_consent_cookies(cls):
        cls.driver.get(
            'https://www.zeit.de/gesellschaft/zeitgeschehen/2023-01/elon-musk-tesla-aktie-gericht-verfahren')
        cls.driver.add_cookie(
            {'name': 'zonconsent', 'value': '2023-01-21T02:31:29.903Z'})

    @ classmethod
    def destroy_driver(cls):
        cls.driver and cls.driver.close()

    #
    # do magic to find the score of the university -> describes how good the university is
    #

    def evaluate_score(self):
        # if self.data == None:
        #     raise ValueError('The university data was not fetched properly')
        total_score = 0
        for criteria in self.criterias:
            total_score += criteria.get_normalizedScore()

    #
    # functionality to print table 🤘
    #
    @ classmethod
    def get_table_string(cls) -> str:
        # order data by some criteria -> now it's name of the university, later it will be the score of the university
        table = PrettyTable()
        table.set_style(SINGLE_BORDER)
        # set headers -> names of universities
        field_names = ['Uni']
        field_names.extend(
            [data.criteria.criteria_name for data in cls.all_universities[0].data])
        table.field_names = field_names
        # set all the rows
        for university in cls.all_universities:
            table.add_row(university.get_row())

        return table.get_string()

    def get_row(self):
        row = [self.name]
        row.extend([i.value for i in self.data])
        return row

    @ classmethod
    def order_data_by_university_name(cls):
        for university in cls.all_universities:
            university.data = sorted(
                university.data, key=lambda x: x.criteria.criteria_name)

    #
    # damit json-pickle die Klassenvariablen auch speichert
    #

    def __getstate__(self):
        ret = self.__dict__.copy()
        ret['all_universities'] = University.all_universities
        return ret

    def __setstate__(self, state):
        University.all_universities = state.pop('all_universities')
        self.__dict__.update(state)

    def __repr__(self) -> str:
        return self.name
        # res = f"{self.name}\n"
        # for criteria in self.criterias:
        # 	res += f"{criteria}\t"
        # return res
