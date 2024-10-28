import json

import requests

# export const homeSchema = z.object({
#   id: z.number().int(),
#   ownerId: z.string().trim().min(1, "Cannot be empty"),
#   title: z.string().trim().min(1).nullable(),
#   description: z.string().trim().min(1).nullable(),
#   address: z.string().optional().nullable(),
#   municipality: z.string().optional().nullable(),
#   subRegion: z.string().optional().nullable(),
#   region: z.string().optional().nullable(),
#   country: z.string().nullable(),
#   latitude: z.number(),
#   longitude: z.number(),
#   type: z.array(z.string()),
#   features: z.array(z.string()),
#   bedrooms: z.number().int(),
#   bathrooms: z.number().int(),
#   livingrooms: z.number().int(),
#   kitchens: z.number().int(),
#   capacity: z.number().int(),
#   photos: z.array(z.string()),
#   price: z.number(),
#   currency: z.string().nullable(),
#   language: z.string().nullable(),
#   priceUsd: z.number(),
#   priceNegotiable: z.boolean(),
#   contactName: z.string().nullable(),
#   contactEmail: z.string().nullable(),
#   contactPhone: z.string().nullable(),
#   listingType: z.string().nullable(),
#   areaSqm: z.number(),
#   isActive: z.boolean(),
#   isComplete: z.boolean(),
#   completedAt: z.date().nullable(),
#   listingFlowStep: z.number().min(0, "Cannot be empty"),
# });

def run_main():
    # load properties from all_properties.json
    with open("all_properties.json", "r") as json_file:
        all_properties = json.load(json_file)

    properties_for_sale = [property for property in all_properties if property["for_sale"]]
    print(f"Total properties for sale: {len(properties_for_sale)}")

    print(all_properties[0].keys())

    # Format the first property in this format:
    new_property = {
        "title": all_properties[0]["title"],
        "description": all_properties[0]["observations"],
        "address": all_properties[0]["address"],
        "latitude": all_properties[0]["latitude"],
        "longitude": all_properties[0]["longitude"],
        "bedrooms": all_properties[0]["bedrooms"],
        "bathrooms": all_properties[0]["bathrooms"],
        "photos": all_properties[0]["photos"],
        "price": all_properties[0][""]
    }
    print(new_property)


if __name__ == "__main__":
    run_main()
