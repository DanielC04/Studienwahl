from data_aquisition.criteria import Criteria
from data_aquisition.data_point import DataPoint


def extract_first_data_field_as_int(all_data_fields):
    return make_html_text_to_int(all_data_fields.pop(0).text)


def make_html_text_to_int(html_text):
    without_text = remove_all_except_digits(html_text)
    if without_text == '':
        print(f"VERDAMMT, '{html_text}' konnte nicht in eine Zahl umgewandelt werden")
        return html_text
        # raise ValueError(f"Komische Zahlenangabe auf Website konnte nicht umgewandelt werden: {html_text}")

    return int(remove_all_except_digits(html_text))


def remove_all_except_digits(number_string):
    return ''.join(filter(str.isdigit, number_string))