# Hello! This should work on any carrd -- you might have to replace the id on
# line 15 with whatever id your carrd content is in. Just replace the URL with
# your URL and change the type of content you're looking for.

import requests
from bs4 import BeautifulSoup

URL = 'https://blacklivesmatters.carrd.co/#educate'
# type = "Petition"
type = "Donation fund"
# type = "Learning resource (book or article or instagram post or twitter post etc)"

page = requests.get(URL)

soup = BeautifulSoup(page.content, 'html.parser')

results = soup.find(id='business-section')

petition_links = results.find_all('a', class_='button')

from csv import writer
with open('../content/resources.csv', 'a+', newline='') as write_obj:
    csv_writer = writer(write_obj)
    for link in petition_links:
        lst_of_elem = ['',type,link.text,link['href'],'','','','']
        csv_writer.writerow(lst_of_elem)
