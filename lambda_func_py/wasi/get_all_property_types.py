import json


def run_main():
    # Load properties from all_properties.json
    with open("all_properties.json", "r") as json_file:
        all_properties = json.load(json_file)

    # Use sets to store unique internal and external feature keys
    unique_internal_ids = set()
    unique_external_ids = set()

    # Iterate through each property and collect keys from 'features'
    for property in all_properties:

        print(property)
        quit()
if __name__ == "__main__":
    run_main()
