from data_aquisition.University import University
import jsonpickle


def save_university_list(university_list, file_name: str = 'data/university_list.json'):
    with open(file_name, 'w') as file:
        as_json_string = jsonpickle.encode(university_list)
        file.write(as_json_string)


def load_cashed_university_list(file_name: str = 'data/university_list.json'):
    with open(file_name, 'r') as file:
        json_string = file.read()
        return jsonpickle.decode(json_string)
