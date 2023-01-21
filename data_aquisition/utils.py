
def make_html_text_to_int(html_text):
	return int(remove_all_except_digits(html_text))

def remove_all_except_digits(number_string):
	return ''.join(filter(str.isdigit, number_string))
