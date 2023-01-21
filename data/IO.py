from dataclasses_json import dataclass_json
from dataclasses import dataclass
from data_aquisition.University import University


def save_university_list(university_list, file_name: str = 'data/university_list.json'):
    with open(file_name, 'w') as file:
        as_json_string = University.schema().dumps(university_list, many=True)
        file.write(as_json_string)


def load_cashed_university_list(file_name: str = 'data/university_list.json'):
    with open(file_name, 'r') as file:
        json_string = file.read()
        return University.schema().loads(json_string, many=True)
