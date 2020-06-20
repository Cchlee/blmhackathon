# From root directory run python3 webscrapers/instagram-webscraper.py <instagram-username>
# This only gets 12 recent photos
# Credits to https://medium.com/@srujana.rao2/scraping-instagram-with-python-using-selenium-and-beautiful-soup-8b72c186a058 for some of the code

from bs4 import BeautifulSoup
import json
import requests
from datetime import date
import sys

if len(sys.argv) != 2:
    print("Usage: python3 webscrapers/instagram-webscraper.py <instagram-username>")
    sys.exit(2)

username=sys.argv[1]

URL = 'https://www.instagram.com/' + username + '/'
page = requests.get(URL)
data = BeautifulSoup(page.content, 'html.parser')

links=[]
body = data.find('body')

script = body.find('script', text=lambda t: t.startswith('window._sharedData'))
page_json = script.string.split(' = ', 1)[1].rstrip(';')
data = json.loads(page_json)

artist_name = data['entry_data']['ProfilePage'][0]['graphql']['user']['full_name']

for link in data['entry_data']['ProfilePage'][0]['graphql']['user']['edge_owner_to_timeline_media']['edges']:
    title = link['node']['edge_media_to_caption']['edges'][0]['node']['text']
    title = title.replace(",", "&&&")
    link_to_work = 'https://www.instagram.com/p/'+link['node']['shortcode']+'/'
    link_to_image = 'https://www.instagram.com/p/' + link['node']['shortcode'] + '/media/?size=l'
    tmp_lst = [date.today(), link_to_image, artist_name, link_to_work, "", "Yes", "Untitled", URL]
    links.append(tmp_lst)

from csv import writer
with open('content/scraped-art.csv', 'a+', newline='') as write_obj:
    csv_writer = writer(write_obj)
    for lst_of_elem in links:
        csv_writer.writerow(lst_of_elem)
