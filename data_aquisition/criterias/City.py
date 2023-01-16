import sys
sys.path.append('data_aquisition')
from Criteria import Criteria
import requests

URL_ENDPOINT = 'https://maps.googleapis.com/maps/api/distancematrix'
API_KEY = 'AIzaSyAxnItFp5IWVWENpzCUUj5qQ_3nKGd3XHw'

class DistanceToErfurt(Criteria):
	myCity = 'Erfurt'

	def __init__(self, university_name, importance, mode_of_transportation) -> None:
		super().__init__(university_name, importance)
		# should be transit or driving
		self.mode_of_transportation = mode_of_transportation

		self.getDistance()
	

	def getDistance(self):
		url = f"{URL_ENDPOINT}/json?origins={DistanceToErfurt.myCity}&destinations={self.university_name}&units=metric&mode={self.mode_of_transportation}&key={API_KEY}"

		payload={}

		headers = {}
		
		response = requests.request("GET", url, headers=headers, data=payload)
		
		print(response.text)

if __name__ == '__main__':
	DistanceToErfurt('HPI', 10, 'driving')
	# DistanceToErfurt('HPI Potsdam')



