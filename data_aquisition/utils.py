from data_aquisition.criteria import Criteria
from data_aquisition.data_point import DataPoint


def extract_first_data_field_as_int(all_data_fields):
    return make_html_text_to_float(all_data_fields.pop(0).text)


def make_html_text_to_float(html_text):
    without_text = remove_all_except_digits(html_text)
    try:
        return float(without_text)
    except:
        # print(f"VERDAMMT, '{html_text}' konnte nicht in eine Zahl umgewandelt werden")
        return html_text
        # raise ValueError(f"Komische Zahlenangabe auf Website konnte nicht umgewandelt werden: {html_text}")



def remove_all_except_digits(number_string: str):
    # big ints are written in format 4.440 -> remove point
    number_string = number_string.replace(".", "")
    # deal with percentages-format 5,0% -> remove '%' and make comma to point
    number_string = number_string.replace(",", ".")
    number_string = number_string.replace("%", "")
    # format  '12/14 Punkten' -> only use the first part until the /
    if "/" in number_string:
        number_string = number_string[: number_string.index("/")]
    # format '172,0 T€'
    if "€" in number_string:
        number_string = f"{number_string[:number_string.index('T') - 1]}00"
        number_string = number_string.replace('.', '')
    # now remove any letters that a left, like '*'
    number_string = number_string.replace('*', '')

    return number_string