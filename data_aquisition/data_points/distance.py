import sys

sys.path.append("/media/daniel/external_disk/Documents/Studium/semester_0/find_university/")
from data_aquisition.data_point import DataPoint
from data_aquisition.criteria import Criteria
import requests
import random

URL_ENDPOINT = "https://maps.googleapis.com/maps/api/distancematrix"
API_KEY = "AIzaSyAxnItFp5IWVWENpzCUUj5qQ_3nKGd3XHw"

# the google maps api can't handle some of the university names
NAMES_FOR_API = {
    "RPTU Kaiserslautern-Landau": "Kaiserslautern-Landau",
    "Karlsruher Inst. f. Technologie KIT": "Karlsruhe",
}

user_agent_list = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36", "Mozilla/5.0 (iPad; CPU OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/104.0.5112.99 Mobile/15E148 Safari/604.1"]
reffer_list = ["https://stackoverflow.com/", "https://twitter.com/", "https://www.google.co.in/", "https://gem.gov.in/"]


class Distance(DataPoint):
    def __init__(self, criteria, origin, destination, mode_of_transportation) -> None:
        super().__init__(criteria, None, is_parent_class=True)
        # should be transit or driving
        self.origin = origin
        self.destination = destination
        self.mode_of_transportation = mode_of_transportation
        self.value = self.getDistance()
        self.register_with_criteria()

    def getDistance(self):

        headers = {"Connection": "keep-alive", "Cache-Control": "max-age=0", "Upgrade-Insecure-Requests": "1", "User-Agent": random.choice(user_agent_list), "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-US,en;q=0.9,fr;q=0.8", "referer": random.choice(reffer_list)}
        response = None
        try:
            if self.destination in NAMES_FOR_API.keys():
                self.destination = NAMES_FOR_API[self.destination]
            url = f"{URL_ENDPOINT}/json?origins={self.origin}&destinations={self.destination}&units=metric&mode={self.mode_of_transportation}&key={API_KEY}"

            response = requests.request("GET", url, headers=headers)
            response_as_json = response.json()
            print(response_as_json)
            return float(response_as_json["rows"][0]["elements"][0]["duration"]["value"])
        except:
            print("couldn't fetch data for city: ", self.origin, self.destination)
            print("The response was: ", response.text)
            return None

    def __str__(self) -> str:
        hours = round(self.value / 3600, 2)
        return f"{hours}h min"

if __name__ == "__main__":
    criteria = Criteria("Distanz zu Erfurt", 100, "City", True)
    d = Distance(criteria, "Erfurt", "Uni Marburg", "driving")
    print(d.value)
    # DistanceToErfurt('HPI Potsdam')
