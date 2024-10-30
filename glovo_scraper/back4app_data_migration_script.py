import json
import uuid


def main():
    address_dict = {}

    b4app_address_list = []
    b4app_restaurant_list = []
    b4app_menu_list = []
    b4app_dish_list = []
    b4app_category_list = []
    b4app_restaurant_category_relation_list = []

    def make_b4a_address(address: str) -> str:
        objectId = str(uuid.uuid4())
        b4app_address_list.append({
            "objectId": objectId,
            "address": address,
            "location": {
                "__type": "GeoPoint",
                "latitude": address_dict[address]["latitude"],
                "longitude": address_dict[address]["longitude"]
            }
        })
        return objectId

    def make_b4a_category(category_list: list[str], restaurant_id: str) -> None:
        for category in category_list:
            b4app_restaurant_category_relation_list.append({
                "objectId": str(uuid.uuid4()),
                "owningId": restaurant_id,
                "relatedId": [ct for ct in b4app_category_list if category == ct["name"]][0]["objectId"]
            })

    def make_b4a_restaurant(restaurant_name: str, restaurant_info: dict, address_id: str) -> str:
        objectId = str(uuid.uuid4())
        b4app_restaurant_list.append({
            "objectId": objectId,
            "name": restaurant_name,
            "link": restaurant_info["link"],
            "image": restaurant_info["image_link"],
            "categories": {
                "__type": "Relation",
                "className": "Category"
            },
            "address": {
                "__type": "Pointer",
                "className": "Address",
                "objectId": address_id
            }
        })
        return objectId

    def make_b4a_menu(menu: dict, restaurant_id: str):
        for key, val in menu.items():
            objectId = str(uuid.uuid4())
            b4app_menu_list.append({
                "objectId": objectId,
                "name": key,
                "restaurant": {
                    "__type": "Pointer",
                    "className": "Restaurant",
                    "objectId": restaurant_id
                }
            })
            for dish in val:
                b4app_dish_list.append({
                    "objectId": str(uuid.uuid4()),
                    "name": dish["jed"],
                    "price": dish["cena"],
                    "description": dish["opis"],
                    "photo": dish["fotografija"],
                    "menu": {
                        "__type": "Pointer",
                        "className": "Menu",
                        "objectId": objectId
                    }
                })

    with open('glovo_mb.json', 'r', encoding="utf-8") as f:
        json_dict = json.load(f)
    for k, v in json_dict.items():
        address_dict[json_dict[k]["info"]["address"]] = {
            "latitude": v["info"]["latitude"],
            "longitude": v["info"]["longitude"]
        }
    # print(json_dict)

    category_set = set()
    for cat in [json_dict[k]["info"]["categories"] for k, v in json_dict.items()]:
        for c in cat:
            category_set.add(c)

    for category in category_set:
        objectId = str(uuid.uuid4())
        b4app_category_list.append({
            "objectId": objectId,
            "name": category
        })

    for key, val in json_dict.items():
        address_objectId = make_b4a_address(val["info"]["address"])
        restaurant_objectId = make_b4a_restaurant(key, val["info"], address_objectId)
        make_b4a_category(val["info"]["categories"], restaurant_objectId)
        make_b4a_menu(val["menu"], restaurant_objectId)

    json.dump({"results": b4app_address_list}, open("b4app_address.json", "w", encoding="utf-8"), indent=4,
              ensure_ascii=False)
    json.dump({"results": b4app_restaurant_list}, open("b4app_restaurant.json", "w", encoding="utf-8"), indent=4,
              ensure_ascii=False)
    json.dump({"results": b4app_menu_list}, open("b4app_menu.json", "w", encoding="utf-8"), indent=4,
              ensure_ascii=False)
    json.dump({"results": b4app_dish_list}, open("b4app_dish.json", "w", encoding="utf-8"), indent=4,
              ensure_ascii=False)
    json.dump({"results": b4app_category_list}, open("b4app_category.json", "w", encoding="utf-8"), indent=4,
              ensure_ascii=False)
    json.dump({"results": b4app_restaurant_category_relation_list},
              open("b4app_restaurant_category_relation.json", "w", encoding="utf-8"), indent=4, ensure_ascii=False)


if __name__ == '__main__':
    main()
