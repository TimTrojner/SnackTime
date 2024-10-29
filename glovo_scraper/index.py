import json
import re
import time

import httpx
from bs4 import BeautifulSoup

DEFAULT_URL = f"https://glovoapp.com/si/sl/ljubljana/restavracije_1/"
GLOVO_URL = f"https://glovoapp.com"


def main():
    with httpx.Client() as client:
        r = client.get(DEFAULT_URL, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'})
        glovo_soup = BeautifulSoup(r.content, 'html.parser')

        final_page_number = 1

        nav = glovo_soup.select(
            '#default-wrapper > div > div > div.category-page__wrapper > div.category-page__body > div.category-page__results > div.category-page__pagination-wrapper > nav')

        if nav:
            pages = glovo_soup.select(
                '#default-wrapper > div > div > div.category-page__wrapper > div.category-page__body > div.category-page__results > div.category-page__pagination-wrapper > nav > div > span.current-page-text')
            # regex what is between > </span>
            final_page_number = int(re.findall(r'(?<=>)\s |.?| \s(?=</span>)', pages[0].text.strip())[-2])

            res_dict = {}

            for page in range(1, final_page_number + 1):
                url = f"https://glovoapp.com/si/sl/maribor/restavracije_1/?page={page}" if page != 1 else DEFAULT_URL
                r = client.get(url, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'})
                glovo_soup = BeautifulSoup(r.content, 'html.parser')
                restaurants_containers = glovo_soup.select(
                    "#default-wrapper > div > div > div.category-page__wrapper > div.category-page__body > div.category-page__results > div.category-page__pagination-wrapper > div")
                restaurants = glovo_soup.find_all('a', class_='collection-item')
                for restaurant in restaurants:
                    image_full_link = restaurant.find('div', class_='card-image-inner').get('style').split(' ')[0]
                    image_link = re.findall(r'(?<=\().*?(?=\))', image_full_link)[0]
                    overlay_container = restaurant.find('div', class_='card-overlay')
                    h3_text = overlay_container.find('h3', class_='card-title').text

                    print(GLOVO_URL + restaurant["href"])
                    print(image_link)
                    res_dict[h3_text] = {
                        'link': GLOVO_URL + restaurant["href"],
                        'image_link': image_link.strip()
                    }

            time.sleep(2)

        new_res_dict = {}

        for k, v in res_dict.items():

            new_res_dict[k] = {}
            new_res_dict[k]['info'] = v

            r = client.get(v['link'], headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'})
            glovo_soup = BeautifulSoup(r.content, 'html.parser')

            a_tags = glovo_soup.find_all('a',
                                         class_='collection__child__button collection__child__button--selected')

            menij = {}
            ff = {}
            for a_tag in a_tags:
                menu_link = a_tag.get('href')
                mark = a_tag.find('span', class_='collection__child-label collection__child-label--selected')
                menu = mark.find('span').text.strip()  # ime menija
                if 'najbolj prodajani' in menu.lower() or 'pijače' in menu.lower():
                    pass
                elif 'menu' == menu.lower().strip():
                    menu_items = glovo_soup.find_all('div', type='LIST')  # list vseh menijev
                    dishes_in_menu = {}
                    for menu_item in menu_items:

                        menu_name = menu_item.find('p', class_='list__title').text.strip()  # ime menija
                        if 'najbolj prodajani' in menu_name.lower() or 'pijače' in menu_name.lower():
                            pass
                        menu_container = menu_item.find('div', class_='list__container')
                        menu_item = menu_item.find_all('div', type='PRODUCT_ROW')
                        arr = []
                        for menu in menu_item:
                            dish_name = menu.find('div', class_='product-row__info').find('div',
                                                                                          class_='product-row__name').find(
                                'span').find('span').text
                            dish_price = menu.find('div', class_='product-row__bottom').find('span',
                                                                                             class_='product-price__effective').text
                            try:
                                dish_image = menu.find('div', class_='product-row__content').find('img').get('src')
                            except AttributeError:
                                dish_image = 'Ta jed nima slike'
                            dish_description_container = \
                                menu.find('div', class_='product-row__info').find_all('div')[
                                    -1]
                            if dish_description_container.find('span'):
                                dish_description = dish_description_container.find('span',
                                                                                   class_='product-row__info__description').find(
                                    'span').text
                            else:
                                dish_description = 'Ta jed nima opisa'
                            print(menu_name)
                            print(dish_name)
                            print(dish_price)
                            print(dish_image)
                            print(dish_description)
                            arr.append({
                                'jed': dish_name.strip(),
                                'cena': dish_price.strip(),
                                'fotografija': dish_image.strip(),
                                'opis': dish_description.strip()
                            })

                        menij[menu_name] = arr

                else:
                    r = client.get(GLOVO_URL + menu_link, headers={
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'})
                    glovo_soup = BeautifulSoup(r.content, 'html.parser')

                    menu_items = glovo_soup.find_all('div', type='PRODUCT_ROW')
                    arr = []
                    for menu_item in menu_items:
                        dish_name = menu_item.find('div', class_='product-row__info').find('div',
                                                                                           class_='product-row__name').find(
                            'span').find('span').text
                        dish_price = menu_item.find('div', class_='product-row__bottom').find('span',
                                                                                              class_='product-price__effective').text
                        try:
                            dish_image = menu_item.find('div', class_='product-row__content').find('img').get('src')
                        except AttributeError:
                            dish_image = 'Ta jed nima slike'
                        dish_description_container = \
                            menu_item.find('div', class_='product-row__info').find_all('div')[-1]
                        if dish_description_container.find('span'):
                            dish_description = dish_description_container.find('span',
                                                                               class_='product-row__info__description').find(
                                'span').text
                        else:
                            dish_description = 'Ta jed nima opisa'
                        print(dish_name)
                        print(dish_price)
                        print(dish_image)
                        print(dish_description)
                        arr.append({
                            'jed': dish_name.strip(),
                            'cena': dish_price.strip(),
                            'fotografija': dish_image.strip(),
                            'opis': dish_description.strip()
                        })

                    menij[menu] = arr
            new_res_dict[k]['menu'] = menij

        json.dump(new_res_dict, open('glovo_lj_res.json', 'w', encoding='utf-8'), indent=4, ensure_ascii=False)


if __name__ == '__main__':
    main()
