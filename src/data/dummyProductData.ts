

export interface ProductItem {
  intempt_id: string;
  title: string;
  image_link: string | null;
  id: string;
  description: string;
  price: string | number;
  original_price: string | number | null;
  link: string;
}

export const dummyProductData: ProductItem[] = [
  {
    "intempt_id": "5953840115522073997",
    "title": "Black Sports Costume",
    "image_link": "https://cdn.prod.website-files.com/65ccaab7b745fb95fb96e485/67937dafc02c86426416be21_Black%20sports%20costume.jpg",
    "id": "sports-costume-003",
    "description": "A sleek black sports costume designed for comfort and performance. Perfect for workouts, sports activities, or athleisure wear. Features breathable fabric and a modern fit.",
    "price": "129.99 USD",
    "original_price": null,
    "link": "https://cdn.prod.website-files.com/65ccaab7b745fb95fb96e485/67937dafc02c86426416be21_Black%20sports%20costume.jpg"
  },
  {
    "intempt_id": "5424560473500743787",
    "title": "Classic Black Sweater",
    "image_link": "https://cdn.prod.website-files.com/65ccaab7b745fb95fb96e485/67937dafe0992834a81e6d00_Black%20sweater.jpg",
    "id": "sweater-002",
    "description": "A refined black sweater made from high-quality materials, perfect for casual outings or smart-casual events. Features a textured design for added style and pairs easily with trousers or jeans.",
    "price": "79.99 USD",
    "original_price": null,
    "link": "https://cdn.prod.website-files.com/65ccaab7b745fb95fb96e485/67937dafe0992834a81e6d00_Black%20sweater.jpg"
  },
  {
    "intempt_id": "8284838864325838522",
    "title": "Elegant Black Leather Dress",
    "image_link": "https://cdn.prod.website-files.com/65ccaab7b745fb95fb96e485/67937daf4bc020287ae55430_Dress.jpg",
    "id": "dress-001",
    "description": "A sleek and elegant black leather sleeveless dress, designed to fit the contours of the body. Perfect for formal events or a night out. The dress combines timeless sophistication with a modern minimalist look.",
    "price": "249.99 USD",
    "original_price": null,
    "link": "https://cdn.prod.website-files.com/65ccaab7b745fb95fb96e485/67937daf4bc020287ae55430_Dress.jpg"
  },
  {
    "intempt_id": "4417424589303252619",
    "title": "Cashmere Tassel Blanket in Brown",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/IMG_7031_1024x1024_56f058ba-8925-4432-9d80-e684c7bad347.jpg?v=1554808044",
    "id": "2369423736890",
    "description": "Lover of travel and culture, Designer Denis Colomb discovered his lifestyle brand of blankets and shawls through inspired of the traditional Nepalese artisans. In combination of genuine Mongolian cashmere, traditional methods, and a modern aesthetic, Colomb offers stunning pieces to last the years. Color Brown. 100% Cashmere. Made in Nepal. ﻿Length 52 X 80\".",
    "price": 2748,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/cashmere-tassel-blanket-in-brown"
  },
  {
    "intempt_id": "1419515306201777797",
    "title": "Mirco Pant in Stone",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2014-09-20_Lana_Look_30_06.jpg?v=1554807121",
    "id": "2369404764218",
    "description": "A slim pant with a fantastic shape thanks to seaming details running down front and back. A thick wool and poly blend that recovers quickly. No Pockets to disrupt the perfect line. Belt loops and a nylon zipper fly. Annette Gortz. Color Stone. 55% Wool, 40% Polyamide, 5% Elastane. Made in Germany. Lana is wearing a German 36. Also Available in Black.",
    "price": 378,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/mirco-pant-stone"
  },
  {
    "intempt_id": "3102516520517568124",
    "title": "Circle Bag in Black",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/Marsell_6933.jpg?v=1554807965",
    "id": "2369422164026",
    "description": "Married aesthetics of innovation and tradition, Marséll crafts leatherwear of mastering technique. Where modern classism takes wearable shape, anticipate artistic expression epitomized in leather footwear and bags. This enticing piece presents accessible artistry. Beautifully folded material is intoxicating to touch and see. Top zip for main closure. Two interior lining zip pockets. Two hidden side zip pockets. Adjustable strap with luggage tag. Color Black. 100% Leather, 100% Linen Lining. Made in Italy.",
    "price": 1598,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/circle-bag-in-black"
  },
  {
    "intempt_id": "8041292310203663944",
    "title": "Short Sleeve T-Shirt",
    "image_link": null,
    "id": "569010192442",
    "description": "This is a sample product.",
    "price": 15.5,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/short-sleeve-t-shirt"
  },
  {
    "intempt_id": "8373368882314282637",
    "title": "Adania Pant",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-06-11-Ashley_Look10_50102_23612.jpg?v=1554810574",
    "id": "2369467908154",
    "description": "This is a demonstration store. You can purchase products like this from Baby & CompanySuper stretch Adaina Pant offers the classic skinny with all the fun bits. Zip closure at back with concealed zip openings at ankles. By Malene Birger. Color Blue. 90% Polyamide, 10% Elastane. Made in China. Ashley is wearing a European 36.",
    "price": 99,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/adania-pant"
  },
  {
    "intempt_id": "553984615405779316",
    "title": "5 Panel Camp Cap, United by Blue",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/5-panel-hat_4ee20a27-8d5a-490e-a2fc-1f9c3beb7bf5.jpg?v=1554806743",
    "id": "2369398636602",
    "description": "This is a demonstration store. You can purchase products like this from United By Blue. A classic 5 panel hat with our United By Blue logo on the front and an adjustable strap to keep fit and secure. Made with recycled polyester and organic cotton mix. Made in New Jersey 7oz Eco-Twill fabric: 35% organic cotton, 65% recycled PET (plastic water and soda bottles) Embossed leather patch",
    "price": 24,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/5-panel-hat"
  },
  {
    "intempt_id": "1850437763084912270",
    "title": "Hamlet Pant",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-05-14_Ashley_Look17_40983_22197_9d59a420-6e11-4666-8476-d5cde8a6c164.jpg?v=1554810534",
    "id": "2369467285562",
    "description": "This is a demonstration store. You can purchase products like this from Baby & CompanyThe Hamlet is a cozy pant with intentional wrinkling. Perfected beachwear for a seasonless look, these pants offer an elastic waistband for ease. Side angled pockets at front. Trim leg through the ankle. Manuelle Guibal. 100% Linen. Made in France. Ashley is wearing a Size 1. Shop our collection of Manuelle Guibal.",
    "price": 208.6,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/hamlet-pant"
  },
  {
    "intempt_id": "2751527322721778043",
    "title": "Surplice Dress",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-07-02_Ashley_35_51027_24046.jpg?v=1554810741",
    "id": "2369471119418",
    "description": "The Surplice Dress from Co. is seductively soft. Flattering V-neckline framed with lapels. Invisible zip closure at side. Color Black. 49% Polyester, 48% Viscose, 3% Elastane. Made in China. Ashley is wearing an X-Small.",
    "price": 788,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/dress"
  },
  {
    "intempt_id": "8361711564366412142",
    "title": "Tie Trousers",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-06-04-Matt_Look_23380_40904_23109_61e79210-adfe-481d-8d46-c0725e84b4ae.jpg?v=1554810474",
    "id": "2369466269754",
    "description": "The Tie Trouser by Hansen offers a relaxed fit and aces our everyday needs. Drop crotch. Tie belt with four button fly closure at front. Three exterior pockets. 100% Cotton. Made in EU. Matt is wearing a size Medium. Matt is 6'2\", Chest 38\", Waist 31\", Inseam 34.5\".",
    "price": 268,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/tie-trousers"
  },
  {
    "intempt_id": "1253610624443677049",
    "title": "Silk Drop Crotch Pant",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-05-14_Ashley_Look18_23682_22229.jpg?v=1554810152",
    "id": "2369461321786",
    "description": "This is a demonstration store. You can purchase products like this from Baby & CompanyThe Silk Pant is a slim pant with slight drop. Single button with zip fly closure at front. Side angled pockets with coin pocket at front, one exterior pocket at back. Sibel Saral. Color Stone. 100% Silk. Made in Turkey. Ashley is wearing a Small. Also available in Pink. Shop our collection of Sibel Saral.",
    "price": 299.6,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/silk-drop-crotch-pant-stone"
  },
  {
    "intempt_id": "7994689089066501773",
    "title": "Elastic Waist Dress",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-07-02_Ashley_36_51037_24062.jpg?v=1554810750",
    "id": "2369471447098",
    "description": "This is a demonstration store. You can purchase products like this from Baby & CompanyWith Kimono-like sleeves, this sheath dress from Co. pairs beautifully with the season. High neckline with billowing material. Invisible zip closure at center back neck. Elastic waistband for ease. Color Black. 82% Triacetate, 18% Polyester. Made in China. Ashley is wearing an X-Small.",
    "price": 748,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/dress-1"
  },
  {
    "intempt_id": "2352172342203516556",
    "title": "Grand Trunk",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-05-08_Laydown_Look20_40944_21734.jpg?v=1554810521",
    "id": "2369467056186",
    "description": "This is a demonstration store. You can purchase products like this from Baby & CompanyThis prewashed cotton trunk is composed of the finest gauge for the softest materials. Offers stretch and softness in wear. Elastic waistband for ease. Etiquette. Color Navy/Grey. 95% Cotton, 5% Elastane. Made in Italy. Shop our collection of Etiquette.",
    "price": 58,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/grand-trunk"
  },
  {
    "intempt_id": "5483874276096018063",
    "title": "Wrapped Golf Shoe",
    "image_link": "https://cdn.shopify.com/s/files/1/0017/3611/4234/products/2015-07-08_Laydown_51238_24379.jpg?v=1554810756",
    "id": "2369471676474",
    "description": "The Wrapped Golf Shoe by Amelia Toro.",
    "price": 678,
    "original_price": null,
    "link": "https://intempt1.myshopify.com/products/wrapped-golf-shoe"
  }
];

