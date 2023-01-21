import sys
sys.path.append('data_aquisition')
import University

def save_json_string(json_string:str, file_name:str='data.json'):
    with open(file_name) as file:
       file.write(json_string) 

