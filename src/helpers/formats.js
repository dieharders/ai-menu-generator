export const extractionOutputFormat = `
# Company Name

(if none exists generate one)

## Company Description

(if none exists generate one)

## Food Type

(american, japanese, greek)

## Establishment Category

(bar, restaurant, food truck, chain, take-out)

## Contact Info

((XXX)XXX-XXXX, if none exists, leave out)

## Location Info

(if none exists, leave out)

## Cost

(how expensive on scale: $, $$, $$$, $$$$)

## Theme Color

(an integer between 0 and 360 degrees on color wheel that best represents the hue of this menu)

## Company Website

(if none exists, leave out)

## Language

(ISO 639-1 format: en, de, ko)

## Banner Image Description

(generate a description of this menu's banner image based on color, language, location, food type, company name, company description)

# Section

(section name)

## Item

(item name)

### Description

(if none exists generate one based on item name)

### Price

(number)

### Currency

(USD, YEN, EUR)

### Food Category

(protein, grain, vegetable, fruit, dairy, food, alcoholic beverage, non-alcoholic beverage, other)

### Ingredients

(if none exists generate one based on description, price, item name, section name)

### Image Description

(if none exists generate one based on description, ingredients, price, item name, section name)

### Health (Nutritional) Info

(if none exists generate one based on source of calories, protein, fat, cholesterol, carbs. whether it is vegan/vegetarian or dietary considerations)

### Allergy Info

(list if it contains any fish, dairy, nuts, or other common allergens)
`;

export const structuredOutputFormat = `
{
  "name": "",
  "id": "", // leave blank
  "description": "",
  "type": "",
  "category: "",
  "contact": "",
  "location": "",
  "cost": "",
  "color": 0,
  "website": "",
  "language": "",
  "imageDescription": "", // banner image description
  "imageSource": "", // leave blank
  "documentHash": "", // leave blank
  "sectionNames": [""],
  "items": [
    {
      "name": "",
      "id": "", // leave blank
      "description": "",
      "sectionName": "",
      "price": "0.00",
      "currency": "",
      "category": "",
      "ingredients": "",
      "imageDescription": "",
      "imageSource": "", // leave blank
      "health": "",
      "allergy": ""
    }
  ],
}
`;
