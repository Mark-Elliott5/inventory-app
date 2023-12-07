#! /usr/bin/env node

console.log(
  'This script populates supplement products (items) and cateogories to the provided mongoDB database.'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const Category = require('./models/category');
const Item = require('./models/item');

const categories = [];
const items = [];

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name, description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  numberInStock
) {
  const item = new Item({
    name,
    description,
    category,
    price,
    numberInStock,
  });

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(
      0,
      'Vitamins and Minerals',
      'Essential nutrients for overall health'
    ),
    categoryCreate(
      1,
      'Digestive Health',
      'Promotes a healthy digestive system'
    ),
    categoryCreate(
      2,
      'Joint and Bone Health',
      'Supports strong joints and bones'
    ),
    categoryCreate(
      3,
      'Antioxidants and Anti-Inflammatories',
      'Reduces oxidative stress and inflammation'
    ),
    categoryCreate(
      4,
      'Amino Acids and Proteins',
      'Building blocks for muscle and tissue'
    ),
    categoryCreate(
      5,
      'Mind and Relaxation',
      'Supports mental well-being and relaxation'
    ),
    categoryCreate(
      6,
      'Herbal Supplements',
      'Natural remedies from herbs and plants'
    ),
    categoryCreate(
      7,
      'Metabolism and Energy',
      'Boosts metabolism and provides energy'
    ),
    categoryCreate(
      8,
      'Hormonal Support',
      'Balances and supports hormone levels'
    ),
    categoryCreate(
      9,
      'Heart and Cholesterol',
      'Promotes cardiovascular health and cholesterol management'
    ),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(
      0,
      'Multivitamins',
      'Comprehensive daily vitamins',
      [categories[0]],
      29.99,
      100
    ),
    itemCreate(
      1,
      'Omega-3 Fatty Acids',
      'Essential for heart health',
      [categories[0], categories[9]],
      19.99,
      150
    ),
    itemCreate(
      2,
      'Vitamin D3',
      'Supports bone health',
      [categories[0]],
      12.99,
      200
    ),
    itemCreate(
      3,
      'Calcium',
      'Essential for bone strength',
      [categories[0], categories[2]],
      14.99,
      120
    ),
    itemCreate(
      4,
      'Magnesium',
      'Supports muscle function',
      [categories[0]],
      17.99,
      180
    ),
    itemCreate(
      5,
      'Probiotics',
      'Promotes digestive health',
      [categories[1], categories[5]],
      24.99,
      75
    ),
    itemCreate(
      6,
      'B-complex vitamins',
      'Supports energy metabolism',
      [categories[0]],
      21.99,
      100
    ),
    itemCreate(
      7,
      'Vitamin C',
      'Boosts immune system',
      [categories[0], categories[5]],
      15.99,
      150
    ),
    itemCreate(
      8,
      'Iron',
      'Essential for red blood cells',
      [categories[0], categories[5]],
      11.99,
      90
    ),
    itemCreate(
      9,
      'Zinc',
      'Supports immune function',
      [categories[0]],
      9.99,
      120
    ),
    itemCreate(
      10,
      'Glucosamine',
      'Maintains joint health',
      [categories[2], categories[5]],
      27.99,
      60
    ),
    itemCreate(
      11,
      'Turmeric',
      'Natural anti-inflammatory',
      [categories[3], categories[5]],
      23.99,
      100
    ),
    itemCreate(
      12,
      'Coenzyme Q10',
      'Antioxidant for heart health',
      [categories[3]],
      32.99,
      80
    ),
    itemCreate(13, 'Melatonin', 'Promotes sleep', [categories[5]], 18.99, 120),
    itemCreate(
      14,
      'Collagen',
      'Supports skin elasticity',
      [categories[4], categories[2]],
      39.99,
      50
    ),
    itemCreate(
      15,
      'Ashwagandha',
      'Adaptogen for stress relief',
      [categories[3]],
      26.99,
      90
    ),
    itemCreate(
      16,
      'Rhodiola',
      'Enhances mood and endurance',
      [categories[3]],
      29.99,
      70
    ),
    itemCreate(
      17,
      'Ginseng',
      'Boosts energy and mental clarity',
      [categories[4]],
      31.99,
      60
    ),
    itemCreate(
      18,
      'L-Theanine',
      'Promotes relaxation',
      [categories[5]],
      16.99,
      120
    ),
    itemCreate(
      19,
      'Quercetin',
      'Antioxidant and anti-inflammatory',
      [categories[3], categories[9]],
      22.99,
      100
    ),
    itemCreate(
      20,
      'N-Acetyl Cysteine (NAC)',
      'Supports respiratory health',
      [categories[3]],
      28.99,
      80
    ),
    itemCreate(
      21,
      'Choline',
      'Essential for brain health',
      [categories[0]],
      19.99,
      110
    ),
    itemCreate(
      22,
      'Creatine',
      'Enhances athletic performance',
      [categories[4]],
      25.99,
      75
    ),
    itemCreate(
      23,
      'MSM (Methylsulfonylmethane)',
      'Supports joint health',
      [categories[0], categories[2]],
      14.99,
      90
    ),
    itemCreate(
      24,
      'Spirulina',
      'Nutrient-rich superfood',
      [categories[4]],
      20.99,
      120
    ),
    itemCreate(
      25,
      'Chlorella',
      'Detoxifies and supports immunity',
      [categories[4]],
      18.99,
      100
    ),
    itemCreate(
      26,
      'Aloe Vera',
      'Soothes digestive system',
      [categories[6], categories[1]],
      13.99,
      150
    ),
    itemCreate(
      27,
      'MCT Oil',
      'Boosts energy and metabolism',
      [categories[7]],
      26.99,
      80
    ),
    itemCreate(
      28,
      'Green Tea Extract',
      'Antioxidant and fat burner',
      [categories[7], categories[3]],
      17.99,
      100
    ),
    itemCreate(
      29,
      'DHEA (Dehydroepiandrosterone)',
      'Supports hormone production',
      [categories[8]],
      23.99,
      70
    ),
    itemCreate(
      30,
      'Saw Palmetto',
      'Promotes prostate health',
      [categories[6]],
      21.99,
      80
    ),
    itemCreate(
      31,
      'Milk Thistle',
      'Liver detoxification',
      [categories[6]],
      15.99,
      120
    ),
    itemCreate(
      32,
      'Ginkgo Biloba',
      'Improves cognitive function',
      [categories[6]],
      19.99,
      100
    ),
    itemCreate(
      33,
      'Maca Root',
      'Enhances stamina and libido',
      [categories[8]],
      28.99,
      60
    ),
    itemCreate(
      34,
      '5-HTP',
      'Promotes serotonin production',
      [categories[5], categories[9]],
      24.99,
      90
    ),
    itemCreate(
      35,
      'Magnolia Bark',
      'Natural stress reliever',
      [categories[3]],
      22.99,
      100
    ),
    itemCreate(
      36,
      'Berberine',
      'Regulates blood sugar',
      [categories[8]],
      27.99,
      70
    ),
    itemCreate(
      37,
      'Inositol',
      'Supports mental health',
      [categories[8], categories[5]],
      16.99,
      110
    ),
    itemCreate(
      38,
      'Pycnogenol',
      'Antioxidant for skin and heart',
      [categories[3]],
      31.99,
      50
    ),
    itemCreate(
      39,
      'SAM-e (S-adenosylmethionine)',
      'Mood and joint support',
      [categories[8]],
      34.99,
      40
    ),
    itemCreate(
      40,
      'Boswellia',
      'Anti-inflammatory for joint pain',
      [categories[3], categories[2]],
      23.99,
      80
    ),
    itemCreate(
      41,
      'Elderberry',
      'Immune system booster',
      [categories[6], categories[1]],
      14.99,
      120
    ),
    itemCreate(
      42,
      'Fenugreek',
      'Supports digestive health',
      [categories[6], categories[1]],
      18.99,
      100
    ),
    itemCreate(
      43,
      'Quinoa Extract',
      'Rich in nutrients',
      [categories[7], categories[2]],
      12.99,
      150
    ),
    itemCreate(
      44,
      'Echinacea',
      'Supports immune system',
      [categories[3], categories[5]],
      9.99,
      250
    ),
    itemCreate(
      45,
      'Bromelain',
      'Natural enzyme for digestion',
      [categories[1]],
      22.99,
      80
    ),
    itemCreate(
      46,
      'Valerian Root',
      'Promotes relaxation',
      [categories[5], categories[3]],
      18.99,
      60
    ),
    itemCreate(
      47,
      'Red Yeast Rice',
      'Supports heart health',
      [categories[9]],
      25.99,
      100
    ),
    itemCreate(
      48,
      'Peppermint Oil',
      'Aids in digestion',
      [categories[1]],
      15.99,
      120
    ),
    itemCreate(
      49,
      'Olive Leaf Extract',
      'Antioxidant for overall health',
      [categories[3]],
      20.99,
      90
    ),
  ]);
}
