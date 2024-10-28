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
        features = property.get("features", {})

        # Check for internal features
        internal_features = features.get("internal", [])
        for feature in internal_features:
            if isinstance(feature, dict) and 'id' in feature:
                unique_internal_ids.add(feature['nombre'])

        # Check for external features
        external_features = features.get("external", [])
        for feature in external_features:
            if isinstance(feature, dict) and 'id' in feature:
                unique_external_ids.add(feature['nombre'])

    # Convert the sets to lists to get the unique keys
    unique_internal = list(unique_internal_ids)
    unique_external = list(unique_external_ids)

    # Print the results
    print("Unique internal IDs:", unique_internal)
    print("Unique external IDs:", unique_external)

if __name__ == "__main__":
    run_main()
