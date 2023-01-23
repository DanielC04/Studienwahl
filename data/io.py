import jsonpickle


def save_object(object_to_cash, file_name: str = 'data/university_list.json'):
    with open(file_name, 'w') as file:
        as_json_string = jsonpickle.encode(object_to_cash)
        file.write(as_json_string)


def load_cashed_object(file_name: str):
    with open(file_name, 'r') as file:
        json_string = file.read()
        return jsonpickle.decode(json_string)

def save_string_to_file(s: str, file_name: str):
    with open(file_name, 'w') as file:
        file.write(s)