import { WeatherData, ClothingRecommendation } from '../types';

interface UserStyle {
  style: string;
  colors: string[];
}

export const getClothingRecommendation = (weather: WeatherData, userStyle?: UserStyle): ClothingRecommendation => {
  // Temperature ranges for clothing recommendations
  const HOT = 25; // 25°C and above
  const WARM = 18; // 18-24°C
  const MILD = 12; // 12-17°C
  const COOL = 5;  // 5-11°C
  const COLD = 0;  // 0-4°C
  // Below 0 is VERY_COLD

  // Determine the language to use (default to French if not specified)
  const language = localStorage.getItem('timeClothesLanguage') || 'fr';
  const isEnglish = language === 'en';

  let mainOutfit = '';
  let accessories = '';
  let additionalTips = '';
  let styleTip = '';

  const isRainy = weather.description.toLowerCase().includes(isEnglish ? 'rain' : 'pluie') || 
                  weather.icon.includes('09') || 
                  weather.icon.includes('10');
  
  const isSnowy = weather.description.toLowerCase().includes(isEnglish ? 'snow' : 'neige') || 
                  weather.icon.includes('13');
  
  const isCloudy = weather.description.toLowerCase().includes(isEnglish ? 'cloud' : 'nuage') || 
                   weather.icon.includes('02') || 
                   weather.icon.includes('03') || 
                   weather.icon.includes('04');
  
  const isWindy = weather.windSpeed > 20;
  
  // Bilingual outfit recommendations based on temperature and weather conditions
  if (weather.temperature >= HOT) {
    // Hot weather options
    const hotOutfits = {
      fr: [
        'Une tenue légère et respirante : t-shirt en coton ou lin, short ou bermuda, chaussures ouvertes comme des sandales ou des espadrilles.',
        'Optez pour une robe d\'été fluide en tissu naturel, des sandales confortables et un chapeau à larges bords.',
        'Un ensemble débardeur et short en matière légère, avec des chaussures légères comme des mocassins ou des ballerines en toile.',
        'Une chemise à manches courtes en lin, un pantalon léger coupé droit, et des chaussures de ville légères ou des mocassins sans chaussettes.'
      ],
      en: [
        'Light and breathable outfit: cotton or linen t-shirt, shorts or bermuda, open shoes like sandals or espadrilles.',
        'Go for a flowing summer dress in natural fabric, comfortable sandals, and a wide-brimmed hat.',
        'A tank top and shorts in lightweight material, with light footwear like loafers or canvas flats.',
        'A short-sleeved linen shirt, straight-cut lightweight pants, and light city shoes or loafers without socks.'
      ]
    };
    
    const hotAccessories = {
      fr: [
        'Un chapeau à larges bords ou une casquette, des lunettes de soleil UV400, et un petit sac léger pour transporter votre crème solaire.',
        'Lunettes de soleil polarisées, un éventail portable, une casquette ou un panama, et un bracelet léger pour une touche de style.',
        'Un chapeau de paille, des lunettes de soleil avec protection UV, et un bracelet fin qui résiste à la transpiration.',
        'Une visière ou un bob, des lunettes de soleil enveloppantes, et éventuellement un bracelet ou un collier léger résistant à l\'eau.'
      ],
      en: [
        'A wide-brimmed hat or cap, UV400 sunglasses, and a small lightweight bag to carry your sunscreen.',
        'Polarized sunglasses, a portable fan, a cap or panama hat, and a lightweight bracelet for a touch of style.',
        'A straw hat, sunglasses with UV protection, and a thin bracelet that resists perspiration.',
        'A visor or bucket hat, wrap-around sunglasses, and possibly a lightweight water-resistant bracelet or necklace.'
      ]
    };
    
    const hotTips = {
      fr: [
        'Privilégiez les tissus naturels comme le coton, le lin ou la soie qui laissent respirer la peau. Hydratez-vous régulièrement et réappliquez de la crème solaire toutes les 2 heures.',
        'Portez des vêtements amples pour permettre à l\'air de circuler. Les couleurs claires reflètent mieux les rayons du soleil. N\'oubliez pas de vous hydrater même si vous ne ressentez pas la soif.',
        'Évitez les matières synthétiques qui retiennent la chaleur. Planifiez vos activités extérieures tôt le matin ou en fin de journée pour éviter les heures les plus chaudes.',
        'Pour rester élégant malgré la chaleur, optez pour des tissus légers mais de qualité. Un petit brumisateur d\'eau peut être un accessoire pratique pour vous rafraîchir.'
      ],
      en: [
        'Choose natural fabrics like cotton, linen, or silk that allow your skin to breathe. Stay hydrated regularly and reapply sunscreen every 2 hours.',
        'Wear loose clothing to allow air circulation. Light colors reflect sunlight better. Remember to stay hydrated even if you don\'t feel thirsty.',
        'Avoid synthetic materials that retain heat. Plan your outdoor activities early in the morning or late in the day to avoid the hottest hours.',
        'To stay elegant despite the heat, opt for lightweight but quality fabrics. A small water mister can be a practical accessory to cool yourself down.'
      ]
    };
    
    // Randomly select from options for variety
    const index = Math.floor(Math.random() * hotOutfits.fr.length);
    mainOutfit = isEnglish ? hotOutfits.en[index] : hotOutfits.fr[index];
    accessories = isEnglish ? hotAccessories.en[index] : hotAccessories.fr[index];
    additionalTips = isEnglish ? hotTips.en[index] : hotTips.fr[index];
    
    // Adjust for rain if needed
    if (isRainy) {
      if (isEnglish) {
        mainOutfit += ' Since it\'s raining, choose quick-drying clothes and avoid white or transparent fabrics.';
        accessories += ' Add a small foldable waterproof and lightweight umbrella, and perhaps a thin breathable waterproof jacket.';
        additionalTips += ' In hot and rainy weather, humidity can be uncomfortable. Favor materials that wick away perspiration.';
      } else {
        mainOutfit += ' Comme il pleut, choisissez des vêtements qui sèchent rapidement et évitez les tissus blancs ou transparents.';
        accessories += ' Ajoutez un petit parapluie pliable imperméable et léger, et peut-être une fine veste imperméable respirante.';
        additionalTips += ' Par temps chaud et pluvieux, l\'humidité peut être inconfortable. Privilégiez les matières qui évacuent la transpiration.';
      }
    }
    
    // Adjust for wind if needed
    if (isWindy) {
      if (isEnglish) {
        mainOutfit += ' With this wind, prefer clothes that don\'t fly away easily, such as shorts rather than a light skirt.';
        accessories += ' A well-fitted cap will be more practical than a wide-brimmed hat in windy weather.';
        additionalTips += ' The wind can make it feel cooler despite the heat. Keep a light shirt to tie around your waist if needed.';
      } else {
        mainOutfit += ' Avec ce vent, préférez des vêtements qui ne s\'envolent pas facilement, comme un short plutôt qu\'une jupe légère.';
        accessories += ' Une casquette bien ajustée sera plus pratique qu\'un chapeau large par temps venteux.';
        additionalTips += ' Le vent peut donner une sensation de fraîcheur malgré la chaleur. Gardez une chemise légère à nouer autour de la taille en cas de besoin.';
      }
    }
  } 
  else if (weather.temperature >= WARM) {
    // Warm weather options
    const warmOutfits = {
      fr: [
        'Un t-shirt ou un polo, un pantalon chino léger ou un jean confortable, avec des sneakers ou des mocassins.',
        'Une blouse légère ou une chemise, une jupe midi ou un pantalon fluide, avec des ballerines ou des sandales à talon bas.',
        'Une chemise décontractée à manches courtes, un bermuda ou un pantalon en toile, avec des loafers ou des baskets en toile.',
        'Une robe légère ou une combinaison en jersey, avec une veste en jean ou un cardigan fin pour le soir, et des sandales confortables.'
      ],
      en: [
        'A t-shirt or polo, light chino pants or comfortable jeans, with sneakers or loafers.',
        'A light blouse or shirt, a midi skirt or flowing pants, with ballet flats or low-heeled sandals.',
        'A casual short-sleeved shirt, bermuda shorts or canvas pants, with loafers or canvas sneakers.',
        'A light dress or jersey jumpsuit, with a denim jacket or thin cardigan for the evening, and comfortable sandals.'
      ]
    };
    
    const warmAccessories = {
      fr: [
        'Une paire de lunettes de soleil, une montre légère, et éventuellement un chapeau en cas de forte exposition au soleil.',
        'Un foulard léger qui peut servir de protection pour les épaules en soirée, des lunettes de soleil, et des bijoux discrets.',
        'Une casquette décontractée, des lunettes de soleil stylées, et une ceinture assortie à vos chaussures pour une touche élégante.',
        'Un petit sac bandoulière pratique, des lunettes de soleil, et un joli chapeau ou une casquette selon votre style.'
      ],
      en: [
        'A pair of sunglasses, a lightweight watch, and possibly a hat for strong sun exposure.',
        'A light scarf that can protect your shoulders in the evening, sunglasses, and discreet jewelry.',
        'A casual cap, stylish sunglasses, and a belt matching your shoes for an elegant touch.',
        'A practical small crossbody bag, sunglasses, and a nice hat or cap according to your style.'
      ]
    };
    
    const warmTips = {
      fr: [
        'Les températures peuvent varier au cours de la journée. Prévoyez une couche supplémentaire comme un sweat ou une veste légère pour le soir.',
        'C\'est la température idéale pour jouer avec les superpositions légères. Un cardigan fin ou une veste de chemise peut être parfait pour s\'adapter aux variations.',
        'Cette météo permet de porter presque tous les types de vêtements confortablement. Profitez-en pour expérimenter avec votre style.',
        'Pensez à adapter votre tenue en fonction de vos activités. Plus habillé pour un restaurant, plus décontracté pour une balade en ville.'
      ],
      en: [
        'Temperatures can vary throughout the day. Plan for an extra layer such as a sweatshirt or light jacket for the evening.',
        'This is the ideal temperature for playing with light layering. A thin cardigan or shirt jacket can be perfect to adapt to variations.',
        'This weather allows you to comfortably wear almost all types of clothing. Take advantage of it to experiment with your style.',
        'Consider adapting your outfit according to your activities. More dressed up for a restaurant, more casual for a city walk.'
      ]
    };
    
    const index = Math.floor(Math.random() * warmOutfits.fr.length);
    mainOutfit = isEnglish ? warmOutfits.en[index] : warmOutfits.fr[index];
    accessories = isEnglish ? warmAccessories.en[index] : warmAccessories.fr[index];
    additionalTips = isEnglish ? warmTips.en[index] : warmTips.fr[index];
    
    if (isRainy) {
      if (isEnglish) {
        mainOutfit += ' Due to the rain, opt for waterproof shoes and clothes that don\'t get easily soaked.';
        accessories += ' A compact umbrella is essential today, and perhaps a lightweight waterproof or water-repellent jacket.';
        additionalTips += ' Showers can be intermittent in this type of weather. A lightweight waterproof jacket that can be easily stored is ideal.';
      } else {
        mainOutfit += ' En raison de la pluie, optez pour des chaussures imperméables et des vêtements qui ne se trempent pas facilement.';
        accessories += ' Un parapluie compact est indispensable aujourd\'hui, et peut-être une veste légère imperméable ou déperlante.';
        additionalTips += ' Les averses peuvent être passagères par ce type de temps. Une veste imperméable légère que l\'on peut facilement ranger est idéale.';
      }
    }
    
    if (isCloudy && !isRainy) {
      if (isEnglish) {
        additionalTips += ' Despite the clouds, UV rays can still reach you. Sun protection is still recommended.';
      } else {
        additionalTips += ' Malgré les nuages, les rayons UV peuvent toujours vous atteindre. La protection solaire reste recommandée.';
      }
    }
  } 
  else if (weather.temperature >= MILD) {
    // Mild weather options
    const mildOutfits = {
      fr: [
        'Un pull fin ou un sweat léger sur une chemise ou un t-shirt, avec un pantalon en toile ou un jean, et des bottines ou des sneakers.',
        'Une blouse avec un cardigan ou un blazer léger, un pantalon droit ou une jupe avec collants fins, et des bottines ou des mocassins.',
        'Une chemise en flanelle légère ou un henley à manches longues, un pantalon chino ou un jean, avec des desert boots ou des sneakers montantes.',
        'Une robe avec collants légers ou une jupe avec un pull fin, une veste légère ou un trench, et des bottines ou des derbies élégants.'
      ],
      en: [
        'A thin sweater or light sweatshirt over a shirt or t-shirt, with canvas pants or jeans, and ankle boots or sneakers.',
        'A blouse with a cardigan or light blazer, straight pants or a skirt with thin tights, and ankle boots or loafers.',
        'A light flannel shirt or long-sleeved henley, chino pants or jeans, with desert boots or high-top sneakers.',
        'A dress with light tights or a skirt with a thin sweater, a light jacket or trench coat, and ankle boots or elegant derby shoes.'
      ]
    };
    
    const mildAccessories = {
      fr: [
        'Une écharpe légère ou un foulard, des lunettes de soleil pour les jours lumineux, et éventuellement des gants fins si vous êtes sensible au froid.',
        'Un joli foulard ou une écharpe fine, un sac à main ou besace assorti à votre tenue, et des bijoux adaptés à votre style.',
        'Une écharpe tissée légère, une montre élégante, et éventuellement un bonnet fin pour les jours plus frais.',
        'Un béret ou un chapeau tendance, une écharpe fine ou un foulard, et des accessoires coordonnés comme une ceinture ou un sac.'
      ],
      en: [
        'A light scarf or neckerchief, sunglasses for bright days, and possibly thin gloves if you\'re sensitive to cold.',
        'A nice scarf or thin shawl, a handbag or satchel matching your outfit, and jewelry adapted to your style.',
        'A lightweight woven scarf, an elegant watch, and possibly a thin beanie for cooler days.',
        'A beret or trendy hat, a fine scarf or neckerchief, and coordinated accessories like a belt or bag.'
      ]
    };
    
    const mildTips = {
      fr: [
        'C\'est la saison idéale pour les superpositions! Combinez différentes épaisseurs pour ajuster facilement votre confort thermique.',
        'Les mi-saisons permettent de porter des pièces à la fois fonctionnelles et stylées. Un trench ou une veste en daim peut ajouter de l\'élégance.',
        'Gardez toujours une couche supplémentaire à portée de main, car les températures peuvent chuter en fin de journée.',
        'Privilégiez les matières naturelles comme la laine fine ou le coton qui gardent une température corporelle agréable sans surchauffer.'
      ],
      en: [
        'This is the ideal season for layering! Combine different thicknesses to easily adjust your thermal comfort.',
        'Mid-seasons allow you to wear pieces that are both functional and stylish. A trench coat or suede jacket can add elegance.',
        'Always keep an extra layer handy, as temperatures can drop late in the day.',
        'Favor natural materials like fine wool or cotton that maintain a pleasant body temperature without overheating.'
      ]
    };
    
    const index = Math.floor(Math.random() * mildOutfits.fr.length);
    mainOutfit = isEnglish ? mildOutfits.en[index] : mildOutfits.fr[index];
    accessories = isEnglish ? mildAccessories.en[index] : mildAccessories.fr[index];
    additionalTips = isEnglish ? mildTips.en[index] : mildTips.fr[index];
    
    if (isRainy) {
      if (isEnglish) {
        mainOutfit += ' Since it\'s raining, favor pants that don\'t get easily soaked and waterproof shoes.';
        accessories += ' A sturdy umbrella is necessary today, as well as a waterproof jacket rather than just a cardigan.';
        additionalTips += ' In rainy weather, intermediate wool layers maintain their insulating power even when slightly damp.';
      } else {
        mainOutfit += ' Comme il pleut, privilégiez un pantalon qui ne se trempe pas facilement et des chaussures imperméables.';
        accessories += ' Un parapluie robuste est nécessaire aujourd\'hui, ainsi qu\'une veste imperméable plutôt qu\'un simple cardigan.';
        additionalTips += ' Par temps de pluie, les couches intermédiaires en laine gardent leur pouvoir isolant même légèrement humides.';
      }
    }
    
    if (isWindy) {
      if (isEnglish) {
        mainOutfit += ' With this wind, prefer more fitted clothes and denser fabrics that protect better.';
        accessories += ' A well-wrapped scarf will effectively protect your neck from the wind.';
        additionalTips += ' Wind can significantly reduce the perceived temperature. A thin windbreaker layer can make all the difference.';
      } else {
        mainOutfit += ' Avec ce vent, préférez des vêtements plus ajustés et des tissus plus denses qui protègent mieux.';
        accessories += ' Une écharpe bien enroulée protégera efficacement votre cou du vent.';
        additionalTips += ' Le vent peut significativement réduire la température ressentie. Une couche coupe-vent fine peut faire toute la différence.';
      }
    }
  } 
  else if (weather.temperature >= COOL) {
    // Cool weather options
    const coolOutfits = {
      fr: [
        'Un pull chaud ou un sweatshirt sur une chemise ou un t-shirt à manches longues, un jean ou un pantalon épais, et des boots ou des sneakers montantes.',
        'Un pull en laine ou en cachemire sur une chemise, un pantalon en laine ou en velours côtelé, et des bottines ou des derbies.',
        'Un col roulé ou un pull épais, un pantalon chaud, une veste en laine ou un blouson matelassé léger, et des chaussures montantes.',
        'Une robe en laine ou en jersey épais avec collants épais, ou un pantalon avec un pull oversize, un manteau ou une veste structurée, et des bottines.'
      ],
      en: [
        'A warm sweater or sweatshirt over a shirt or long-sleeved t-shirt, jeans or thick pants, and boots or high-top sneakers.',
        'A wool or cashmere sweater over a shirt, wool or corduroy pants, and ankle boots or derby shoes.',
        'A turtleneck or thick sweater, warm pants, a wool jacket or light quilted jacket, and high-top shoes.',
        'A wool or thick jersey dress with thick tights, or pants with an oversized sweater, a coat or structured jacket, and ankle boots.'
      ]
    };
    
    const coolAccessories = {
      fr: [
        'Une écharpe chaude, des gants, et éventuellement un bonnet léger si vous êtes sensible au froid.',
        'Une belle écharpe en laine ou en cachemire, des gants en cuir ou en laine, et un chapeau ou un béret élégant.',
        'Une écharpe volumineuse, des gants confortables, et un bonnet ou une casquette chaude selon votre style.',
        'Un ensemble coordonné bonnet-écharpe-gants, et éventuellement des chaussettes hautes pour plus de chaleur.'
      ],
      en: [
        'A warm scarf, gloves, and possibly a light beanie if you\'re sensitive to cold.',
        'A beautiful wool or cashmere scarf, leather or wool gloves, and an elegant hat or beret.',
        'A voluminous scarf, comfortable gloves, and a beanie or warm cap according to your style.',
        'A coordinated hat-scarf-gloves set, and possibly high socks for more warmth.'
      ]
    };
    
    const coolTips = {
      fr: [
        'La technique des couches est votre meilleure alliée: une couche de base près du corps, une couche isolante, et une couche extérieure protectrice.',
        'Privilégiez les matières naturelles comme la laine qui gardent la chaleur même si elles sont légèrement humides.',
        'Pensez à protéger les extrémités (tête, mains, pieds) qui perdent beaucoup de chaleur. Des chaussettes chaudes font une grande différence.',
        'Pour rester élégant par temps frais, misez sur des pièces bien coupées et des accessoires comme une belle écharpe qui peut transformer une tenue simple.'
      ],
      en: [
        'The layering technique is your best ally: a base layer close to the body, an insulating layer, and a protective outer layer.',
        'Prefer natural materials like wool that retain heat even if they are slightly damp.',
        'Remember to protect extremities (head, hands, feet) which lose a lot of heat. Warm socks make a big difference.',
        'To stay elegant in cool weather, focus on well-cut pieces and accessories like a beautiful scarf that can transform a simple outfit.'
      ]
    };
    
    const index = Math.floor(Math.random() * coolOutfits.fr.length);
    mainOutfit = isEnglish ? coolOutfits.en[index] : coolOutfits.fr[index];
    accessories = isEnglish ? coolAccessories.en[index] : coolAccessories.fr[index];
    additionalTips = isEnglish ? coolTips.en[index] : coolTips.fr[index];
    
    if (isRainy) {
      if (isEnglish) {
        mainOutfit += ' With this rain, opt for a waterproof jacket rather than a wool coat that would absorb moisture.';
        accessories += ' A sturdy umbrella and waterproof shoes are essential today.';
        additionalTips += ' Moisture accentuates the feeling of cold. Make sure your outer layer is truly waterproof.';
      } else {
        mainOutfit += ' Avec cette pluie, optez pour une veste imperméable plutôt qu\'un manteau en laine qui absorberait l\'humidité.';
        accessories += ' Un parapluie solide et des chaussures imperméables sont essentiels aujourd\'hui.';
        additionalTips += ' L\'humidité accentue la sensation de froid. Assurez-vous que votre couche extérieure soit vraiment imperméable.';
      }
    }
    
    if (isSnowy) {
      if (isEnglish) {
        mainOutfit += ' With the snow, waterproof boots with good grip are essential.';
        accessories += ' Think of waterproof gloves and a hat that covers the ears well.';
        additionalTips += ' Snow reflects UV rays. Sunglasses can be useful even in winter on sunny, snowy days.';
      } else {
        mainOutfit += ' Avec la neige, des bottes imperméables avec une bonne adhérence sont indispensables.';
        accessories += ' Pensez à des gants imperméables et un bonnet qui couvre bien les oreilles.';
        additionalTips += ' La neige reflète les rayons UV. Des lunettes de soleil peuvent être utiles même en hiver par temps ensoleillé et neigeux.';
      }
    }
  } 
  else if (weather.temperature >= COLD) {
    // Cold weather options
    const coldOutfits = {
      fr: [
        'Des sous-vêtements thermiques, un pull épais, un pantalon doublé ou thermique, un manteau d\'hiver chaud ou une doudoune.',
        'Une première couche thermique, un gros pull ou un sweat à capuche épais, un jean doublé ou un pantalon d\'hiver, et un manteau long ou une parka.',
        'Un col roulé thermique sous un pull en laine épaisse, un pantalon d\'hiver résistant, et un manteau long bien isolant ou une doudoune épaisse.',
        'Un ensemble thermique sous un pull ou un sweat épais, un pantalon chaud, et un manteau matelassé long ou une veste d\'hiver technique très chaude.'
      ],
      en: [
        'Thermal underwear, a thick sweater, lined or thermal pants, a warm winter coat or puffer jacket.',
        'A thermal base layer, a thick sweater or hoodie, lined jeans or winter pants, and a long coat or parka.',
        'A thermal turtleneck under a thick wool sweater, durable winter pants, and a well-insulated long coat or thick down jacket.',
        'A thermal set under a thick sweater or sweatshirt, warm pants, and a long quilted coat or very warm technical winter jacket.'
      ]
    };
    
    const coldAccessories = {
      fr: [
        'Un bonnet chaud qui couvre les oreilles, une grosse écharpe enveloppante, des gants ou moufles isolants, et des chaussettes thermiques.',
        'Un ensemble bonnet-écharpe-gants coordonnés et chauds, des chaussettes en laine, et éventuellement des cache-oreilles.',
        'Un bonnet en laine doublé ou en polaire, une écharpe épaisse ou un snood, des gants techniques isolants, et des chaussettes thermiques.',
        'Un chapeau d\'hiver avec protection pour les oreilles, une grande écharpe ou un châle épais, des gants doublés, et des chaussettes en laine mérinos.'
      ],
      en: [
        'A warm hat that covers the ears, a large wrap-around scarf, insulating gloves or mittens, and thermal socks.',
        'A coordinated and warm hat-scarf-gloves set, wool socks, and possibly earmuffs.',
        'A lined wool or fleece hat, a thick scarf or snood, technical insulating gloves, and thermal socks.',
        'A winter hat with ear protection, a large scarf or thick shawl, lined gloves, and merino wool socks.'
      ]
    };
    
    const coldTips = {
      fr: [
        'Superposez au moins trois couches: une couche de base thermique qui évacue l\'humidité, une couche isolante pour retenir la chaleur, et une couche extérieure coupe-vent et imperméable.',
        'Pour les températures froides, la qualité prime sur la quantité. Un bon manteau technique avec un indice thermique adapté peut remplacer plusieurs couches encombrantes.',
        'Adaptez votre activité: si vous marchez beaucoup, vous aurez besoin de moins de couches que si vous restez immobile. Prévoyez de pouvoir retirer une couche si nécessaire.',
        'Pour un froid sec, la laine est excellente. Pour un froid humide, privilégiez les matières synthétiques techniques qui gardent leurs propriétés isolantes même mouillées.'
      ],
      en: [
        'Layer at least three layers: a thermal base layer that wicks away moisture, an insulating layer to retain heat, and a windproof and waterproof outer layer.',
        'For cold temperatures, quality trumps quantity. A good technical coat with an appropriate thermal index can replace several bulky layers.',
        'Adapt to your activity: if you walk a lot, you\'ll need fewer layers than if you remain stationary. Plan to be able to remove a layer if necessary.',
        'For dry cold, wool is excellent. For damp cold, prefer technical synthetic materials that maintain their insulating properties even when wet.'
      ]
    };
    
    const index = Math.floor(Math.random() * coldOutfits.fr.length);
    mainOutfit = isEnglish ? coldOutfits.en[index] : coldOutfits.fr[index];
    accessories = isEnglish ? coldAccessories.en[index] : coldAccessories.fr[index];
    additionalTips = isEnglish ? coldTips.en[index] : coldTips.fr[index];
    
    if (isRainy) {
      if (isEnglish) {
        mainOutfit += ' With this cold rain, a waterproof and warm coat is essential, as well as completely waterproof shoes.';
        accessories += ' Waterproof gloves and a water-resistant hat will keep you dry.';
        additionalTips += ' Damp cold is particularly penetrating. Make sure your outer layer is perfectly waterproof and windproof.';
      } else {
        mainOutfit += ' Avec cette pluie froide, un manteau imperméable et chaud est indispensable, ainsi que des chaussures totalement étanches.';
        accessories += ' Des gants imperméables et un bonnet résistant à l\'eau vous garderont au sec.';
        additionalTips += ' Le froid humide est particulièrement pénétrant. Assurez-vous que votre couche extérieure soit parfaitement imperméable et coupe-vent.';
      }
    }
    
    if (isSnowy) {
      if (isEnglish) {
        mainOutfit += ' With the snow, add insulated and waterproof winter boots with a good non-slip sole.';
        accessories += ' A hat that protects the forehead and ears well is essential, as well as waterproof gloves or mittens.';
        additionalTips += ' Snow can wet your clothes by contact. Waterproof pants or gaiters can keep you dry.';
      } else {
        mainOutfit += ' Avec la neige, ajoutez des bottes d\'hiver isolantes et imperméables avec une bonne semelle antidérapante.';
        accessories += ' Un bonnet qui protège bien le front et les oreilles est essentiel, ainsi que des gants ou moufles imperméables.';
        additionalTips += ' La neige peut mouiller vos vêtements par contact. Des pantalons imperméables ou des guêtres peuvent vous garder au sec.';
      }
    }
  } 
  else {
    // VERY_COLD (below 0°C)
    const veryColdOutfits = {
      fr: [
        'Plusieurs couches: sous-vêtements thermiques, pull très épais ou polaire, pantalon thermique doublé, et un manteau d\'hiver technique à haute isolation.',
        'Une première couche thermique à manches longues et un legging thermique, une seconde couche en laine polaire épaisse, un pantalon d\'hiver technique, et une parka arctique ou une doudoune ultra-chaude.',
        'Des sous-vêtements thermiques en laine mérinos, une couche intermédiaire en polaire épaisse, un pantalon d\'hiver doublé, et un manteau d\'expédition ou une doudoune conçue pour les températures extrêmes.',
        'Une combinaison thermique ou des sous-vêtements longs techniques, un pull en laine épais, un pantalon de ski ou d\'hiver spécial grand froid, et un manteau long à isolation renforcée.'
      ],
      en: [
        'Multiple layers: thermal underwear, very thick sweater or fleece, lined thermal pants, and a high-insulation technical winter coat.',
        'A long-sleeved thermal base layer and thermal leggings, a second layer of thick fleece, technical winter pants, and an arctic parka or ultra-warm down jacket.',
        'Merino wool thermal underwear, a thick fleece middle layer, lined winter pants, and an expedition coat or down jacket designed for extreme temperatures.',
        'A thermal suit or long technical underwear, a thick wool sweater, ski pants or special extreme cold winter pants, and a long coat with reinforced insulation.'
      ]
    };
    
    const veryColdAccessories = {
      fr: [
        'Un bonnet épais qui couvre complètement les oreilles, une écharpe tubulaire ou un cache-cou, des moufles doublées plus chaudes que des gants, et des chaussettes thermiques.',
        'Un bonnet en laine doublé de polaire, un tour de cou ou une cagoule fine sous le bonnet, des gants techniques pour grand froid ou des moufles, et des chaussettes spéciales grand froid.',
        'Une cagoule fine protégeant le visage sous un bonnet chaud, une écharpe épaisse ou un cache-cou montant, des moufles à forte isolation, et plusieurs couches de chaussettes dont une thermique.',
        'Un chapka ou bonnet avec rabats pour les oreilles et la nuque, un cache-cou ou une écharpe très épaisse, des gants à plusieurs couches ou des moufles d\'expédition, et des chaussettes techniques pour températures extrêmes.'
      ],
      en: [
        'A thick hat that completely covers the ears, a tubular scarf or neck gaiter, lined mittens warmer than gloves, and thermal socks.',
        'A wool hat lined with fleece, a neck warmer or thin balaclava under the hat, technical gloves for extreme cold or mittens, and special extreme cold socks.',
        'A thin balaclava protecting the face under a warm hat, a thick scarf or high neck gaiter, highly insulated mittens, and several layers of socks including a thermal one.',
        'A ushanka or hat with flaps for the ears and neck, a neck gaiter or very thick scarf, multi-layer gloves or expedition mittens, and technical socks for extreme temperatures.'
      ]
    };
    
    const veryColdTips = {
      fr: [
        'Par grand froid, la règle des trois couches devient essentielle: base thermique, isolation épaisse, et protection extérieure coupe-vent absolu. Chaque couche piège de l\'air qui sert d\'isolant.',
        'Protégez particulièrement votre tête, votre cou, vos mains et vos pieds où la perte de chaleur est la plus importante. Ne négligez pas de protéger votre visage avec un cache-nez ou une cagoule fine.',
        'Évitez de transpirer car la sueur refroidit rapidement et augmente la sensation de froid. Habillez-vous pour être juste confortable, pas trop chaudement si vous devez être actif.',
        'Pour les températures très basses, les vêtements techniques spécialisés sont préférables aux vêtements classiques. Cherchez des indications de température sur les étiquettes de vos vêtements d\'hiver.'
      ],
      en: [
        'In extreme cold, the three-layer rule becomes essential: thermal base, thick insulation, and absolute windproof outer protection. Each layer traps air that serves as insulation.',
        'Particularly protect your head, neck, hands, and feet where heat loss is greatest. Don\'t neglect to protect your face with a scarf or thin balaclava.',
        'Avoid sweating as sweat cools quickly and increases the feeling of cold. Dress to be just comfortable, not too warmly if you need to be active.',
        'For very low temperatures, specialized technical clothing is preferable to classic clothing. Look for temperature indications on the labels of your winter clothing.'
      ]
    };
    
    const index = Math.floor(Math.random() * veryColdOutfits.fr.length);
    mainOutfit = isEnglish ? veryColdOutfits.en[index] : veryColdOutfits.fr[index];
    accessories = isEnglish ? veryColdAccessories.en[index] : veryColdAccessories.fr[index];
    additionalTips = isEnglish ? veryColdTips.en[index] : veryColdTips.fr[index];
    
    if (isSnowy) {
      if (isEnglish) {
        mainOutfit += ' With the snow, high-performance winter boots with thermal insulation and optimal grip are essential.';
        accessories += ' Gaiters can be useful to prevent snow from entering your boots if you need to walk in deep snow.';
        additionalTips += ' In very cold and snowy weather, limit skin exposure to a minimum. A thin balaclava under your hat can protect your face.';
      } else {
        mainOutfit += ' Avec la neige, des bottes d\'hiver haute performance avec isolation thermique et adhérence optimale sont indispensables.';
        accessories += ' Des guêtres peuvent être utiles pour empêcher la neige d\'entrer dans vos bottes si vous devez marcher dans la neige profonde.';
        additionalTips += ' Par temps très froid et neigeux, limitez l\'exposition de la peau au minimum. Une cagoule fine sous votre bonnet peut protéger votre visage.';
      }
    }
    
    if (isWindy) {
      if (isEnglish) {
        mainOutfit += ' With this icy wind, make sure your coat is perfectly windproof and covers your hips well.';
        accessories += ' A scarf or neck gaiter covering the lower part of your face will protect you from the icy wind.';
        additionalTips += ' Wind can drastically lower the perceived temperature. Make sure all your clothes fit well to prevent cold air from infiltrating.';
      } else {
        mainOutfit += ' Avec ce vent glacial, assurez-vous que votre manteau soit parfaitement coupe-vent et couvre bien les hanches.';
        accessories += ' Une écharpe ou un cache-cou couvrant le bas du visage vous protégera du vent glacial.';
        additionalTips += ' Le vent peut faire chuter drastiquement la température ressentie. Assurez-vous que tous vos vêtements soient bien ajustés pour éviter que l\'air froid ne s\'infiltre.';
      }
    }
  }

  // Add personalized style tips based on user preferences
  if (userStyle) {
    const styleNames = {
      'casual': isEnglish ? 'casual' : 'décontracté',
      'formal': isEnglish ? 'formal' : 'formel',
      'sportif': isEnglish ? 'sporty' : 'sportif',
      'boheme': isEnglish ? 'bohemian' : 'bohème',
      'streetwear': 'streetwear',
      'minimaliste': isEnglish ? 'minimalist' : 'minimaliste'
    };
    
    const styleName = styleNames[userStyle.style as keyof typeof styleNames] || userStyle.style;
    
    // Style-specific tips
    const styleSpecificTips = {
      'casual': {
        fr: [
          `Pour votre style ${styleName}, associez un jean confortable avec un t-shirt ou un pull selon la température, et complétez avec une veste décontractée adaptée à la météo du jour.`,
          `Restez fidèle à votre style ${styleName} en privilégiant le confort avec des pièces basiques bien coupées comme un chino et un sweat, tout en vous adaptant aux conditions météo.`,
          `Votre style ${styleName} se prête parfaitement aux superpositions. Jouez avec différentes couches qui peuvent être ajustées en fonction des variations de température.`
        ],
        en: [
          `For your ${styleName} style, pair comfortable jeans with a t-shirt or sweater depending on the temperature, and complete with a casual jacket adapted to today's weather.`,
          `Stay true to your ${styleName} style by prioritizing comfort with well-cut basic pieces like chinos and a sweatshirt, while adapting to weather conditions.`,
          `Your ${styleName} style is perfect for layering. Play with different layers that can be adjusted according to temperature variations.`
        ]
      },
      'formal': {
        fr: [
          `Pour maintenir votre élégance ${styleName} même par ce temps, optez pour un pantalon de costume avec une chemise bien repassée, et ajustez avec un blazer ou un manteau structuré selon la température.`,
          `Votre style ${styleName} peut s'adapter à cette météo en choisissant des tissus de qualité adaptés à la saison: laine fine par temps froid, coton léger par temps chaud.`,
          `Pour rester ${styleName} tout en vous adaptant à la météo, misez sur des accessoires raffinés comme une cravate fine ou une pochette qui apportent de l'élégance à une tenue fonctionnelle.`
        ],
        en: [
          `To maintain your ${styleName} elegance even in this weather, opt for suit pants with a well-pressed shirt, and adjust with a blazer or structured coat depending on the temperature.`,
          `Your ${styleName} style can adapt to this weather by choosing quality fabrics suited to the season: fine wool in cold weather, light cotton in hot weather.`,
          `To stay ${styleName} while adapting to the weather, focus on refined accessories like a thin tie or pocket square that bring elegance to a functional outfit.`
        ]
      },
      'sportif': {
        fr: [
          `Pour votre look ${styleName}, combinez des vêtements techniques respirants avec des couches adaptables selon l'intensité de vos activités et les conditions météo.`,
          `Restez dans votre style ${styleName} avec des leggings ou un jogging confortable, une veste technique adaptée à la météo, et des sneakers fonctionnelles.`,
          `Votre esthétique ${styleName} est parfaite pour cette météo: privilégiez les matières qui évacuent la transpiration près du corps et ajoutez des couches techniques selon la température.`
        ],
        en: [
          `For your ${styleName} look, combine breathable technical clothing with adaptable layers according to the intensity of your activities and weather conditions.`,
          `Stay in your ${styleName} style with leggings or comfortable joggers, a technical jacket adapted to the weather, and functional sneakers.`,
          `Your ${styleName} aesthetic is perfect for this weather: prioritize materials that wick away perspiration close to the body and add technical layers according to the temperature.`
        ]
      },
      'boheme': {
        fr: [
          `Exprimez votre style ${styleName} en superposant des pièces fluides aux imprimés variés, en adaptant l'épaisseur des tissus à la température du jour.`,
          `Pour un look ${styleName} adapté à cette météo, associez une jupe longue ou un pantalon ample avec un haut en matière naturelle, et ajoutez un gilet ou un kimono comme couche supplémentaire.`,
          `Votre esprit ${styleName} peut s'exprimer par des accessoires comme un chapeau à larges bords par temps ensoleillé ou un châle enveloppant par temps plus frais.`
        ],
        en: [
          `Express your ${styleName} style by layering fluid pieces with varied prints, adapting the thickness of fabrics to today's temperature.`,
          `For a ${styleName} look adapted to this weather, pair a long skirt or loose pants with a natural material top, and add a vest or kimono as an additional layer.`,
          `Your ${styleName} spirit can be expressed through accessories like a wide-brimmed hat in sunny weather or an enveloping shawl in cooler weather.`
        ]
      },
      'streetwear': {
        fr: [
          `Pour votre style ${styleName}, associez un hoodie ou un sweat avec un jean ou un jogging, et complétez avec une veste oversize ou une doudoune selon la température.`,
          `Restez fidèle à votre esthétique ${styleName} en jouant sur les proportions: t-shirt oversize, pantalon cargo ou jogging, et une veste adaptée à la météo du jour.`,
          `Votre look ${styleName} peut s'adapter à ces conditions avec des sneakers adaptées à la météo, un bonnet ou une casquette stylée, et des pièces aux coupes amples superposables.`
        ],
        en: [
          `For your ${styleName} style, pair a hoodie or sweatshirt with jeans or joggers, and complete with an oversized jacket or puffer jacket depending on the temperature.`,
          `Stay true to your ${styleName} aesthetic by playing with proportions: oversized t-shirt, cargo pants or joggers, and a jacket adapted to today's weather.`,
          `Your ${styleName} look can adapt to these conditions with weather-appropriate sneakers, a beanie or stylish cap, and layerable loose-cut pieces.`
        ]
      },
      'minimaliste': {
        fr: [
          `Pour votre style ${styleName}, misez sur des pièces essentielles bien coupées dans des tons neutres, en adaptant l'épaisseur et la matière à la température du jour.`,
          `Votre esthétique ${styleName} est parfaite pour cette météo: quelques pièces intemporelles de qualité, bien choisies pour leur fonctionnalité et leur polyvalence.`,
          `Restez fidèle à votre look ${styleName} en privilégiant des vêtements aux lignes épurées et aux matières nobles, choisies spécifiquement pour s'adapter aux conditions météo actuelles.`
        ],
        en: [
          `For your ${styleName} style, focus on well-cut essential pieces in neutral tones, adapting the thickness and material to today's temperature.`,
          `Your ${styleName} aesthetic is perfect for this weather: a few quality timeless pieces, well-chosen for their functionality and versatility.`,
          `Stay true to your ${styleName} look by favoring clothes with clean lines and noble materials, specifically chosen to adapt to current weather conditions.`
        ]
      }
    };
    
    // Add color suggestions based on user's preferred colors
    let colorTip = '';
    if (userStyle.colors && userStyle.colors.length > 0) {
      const colorNames = userStyle.colors.slice(0, 2).join(isEnglish ? ' and ' : ' et ');
      colorTip = isEnglish 
        ? `Incorporate your preferred colors like ${colorNames} into your outfit to stay true to your personal palette.`
        : `Intégrez vos couleurs préférées comme ${colorNames} à votre tenue pour rester fidèle à votre palette personnelle.`;
    }
    
    // Select a random style tip
    const specificStyleKey = userStyle.style as keyof typeof styleSpecificTips || 'casual';
    const specificTips = styleSpecificTips[specificStyleKey];
    const tipIndex = Math.floor(Math.random() * specificTips.fr.length);
    styleTip = (isEnglish ? specificTips.en[tipIndex] : specificTips.fr[tipIndex]) + ' ' + colorTip;
  }

  return {
    mainOutfit,
    accessories,
    additionalTips,
    styleTip
  };
};
