import json
import googlemaps
import httpx
from bs4 import BeautifulSoup

# import win32com.client as win32


API_KEY = "AIzaSyCsJdBbYxpyS5U198_DyNtCaujs21IsQ_o"


def main(mesto: str):
    gmaps = googlemaps.Client(key=API_KEY)

    with open('glovo_res.json', 'r', encoding="utf-8") as f:
        json_dict = json.load(f)
        # print(json_dict)
    with httpx.Client() as client:
        for k, v in json_dict.items():
            rez = client.get(v['info']['link'], headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'})
            rez_soup = BeautifulSoup(rez.content, 'html.parser')
            try:
                categories_container = rez_soup.find('ul', class_='inline-list__entries')
                categories = categories_container.find_all('li', class_='inline-list__entries__item')
                categories_list = []
                for category in categories:
                    category_name = category.find('a').text.strip()
                    categories_list.append(category_name)

                json_dict[k]['info'] = {**json_dict[k]['info'], "categories": categories_list}
            except AttributeError:
                pass

            location_name = k + " " + mesto
            response = gmaps.places(query=location_name)
            results = response['results'][0]
            json_dict[k]['info'] = {**json_dict[k]['info'], "latitude": results["geometry"]["location"]["lat"],
                                    "longitude": results["geometry"]["location"]["lng"],
                                    "address": results["formatted_address"]}
    with open(f'glovo_{mesto}.json', 'w', encoding="utf-8") as f:
        json.dump(json_dict, f, indent=4, ensure_ascii=False)


if __name__ == '__main__':
    main("Maribor")
