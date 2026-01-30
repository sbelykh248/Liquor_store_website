from flask import Flask, render_template, abort
from flask_talisman import Talisman

app = Flask(__name__)
Talisman(app, content_security_policy=None, force_https=False)

def get_inventory():
    return [
        # 1. WINE
        {
            "brand": "19 Crimes Hard Chard", "cat": "wine", 
            "images": {"750ml": "19.jpg"}, "prices": {"750ml": "13.99"},
            "description": "Bold and strong in character, this deep golden Chardonnay offers aromas of stone fruits and a creamy texture with toasted oak finish."
        },
        {"brand": "Barefoot Moscato", "cat": "wine", "images": {"750ml": "bfoot.jpg"}, "prices": {"750ml": "7.99"}, "description": "A crisp and refreshing white wine with notes of juicy peach and sweet apricot. Finishes with a bright, floral aroma."},
        {"brand": "Barefoot Pink Moscato", "cat": "wine", "images": {"750ml": "pmbfoot.jpg"}, "prices": {"750ml": "7.99"}, "description": "A fruity and vibrant wine with layers of red fruit including cherry, raspberry, and pomegranate."},
        {"brand": "Barefoot Sauv Blanc", "cat": "wine", "images": {"750ml": "sbbfoot.jpg"}, "prices": {"750ml": "7.99"}, "description": "An elegant, dry white wine with crisp notes of citrus, honeydew melon, and nectarine."},
        {"brand": "Bogle Petite Sirah", "cat": "wine", "images": {"750ml": "psbogle.jpg"}, "prices": {"750ml": "12.99"}, "description": "Intense and full-bodied, this wine features dark berry flavors with a touch of cocoa and black pepper."},
        {"brand": "Bogle Sauv Blanc", "cat": "wine", "images": {"750ml": "sbbogle.jpg"}, "prices": {"750ml": "12.99"}, "description": "Refreshingly crisp with vibrant acidity, offering notes of lime zest, boxwood, and passion fruit."},
        {"brand": "Cape Red", "cat": "wine", "images": {"750ml": "cape.jpg"}, "prices": {"750ml": "12.99"}, "description": "A classic South African red blend featuring ripe fruit flavors and a smooth, earthy finish."},
        {"brand": "Carlo Rossi Burgundy", "cat": "wine", "images": {"4L": "cr.jpg"}, "prices": {"4L": "21.99"}, "description": "A hearty, medium-bodied red wine with a rich color and flavors of red berries and black cherry."},
        {"brand": "Carlo Rossi Chablis", "cat": "wine", "images": {"3L": "ccr.jpg"}, "prices": {"3L": "16.99"}, "description": "A crisp, clean white wine with hints of citrus and a refreshing, dry finish."},
        {"brand": "Carlo Rossi Paisano", "cat": "wine", "images": {"3L": "pcr.jpg", "4L": "pcr.jpg"}, "prices": {"3L": "16.99", "4L": "21.99"}, "description": "A light-bodied, easy-to-drink red wine inspired by the classic table wines of Italy."},
        {
            "brand": "Cavit Pinot Grigio", "cat": "wine", 
            "images": {"750ml": "cavit.jpg"}, "prices": {"750ml": "9.99"},
            "description": "With a delicate, floral aroma and clean citrus flavors, this is the definitive Italian Pinot Grigio."
        },
        {"brand": "Cupcake Riesling", "cat": "wine", "images": {"750ml": "rcupcake.jpg"}, "prices": {"750ml": "11.99"}, "description": "Vibrantly sweet with flavors of nectarine, honey, and peach. A zesty acidity keeps the finish clean."},
        {"brand": "Cupcake Sauv Blanc", "cat": "wine", "images": {"750ml": "sbcupcake.jpg"}, "prices": {"750ml": "11.99"}, "description": "Zesty and refreshing, featuring notes of lemon, lime, and a hint of key lime pie."},
        {"brand": "Double Eagle", "cat": "wine", "images": {"750ml": "deagle.jpg"}, "prices": {"750ml": "45.00"}, "description": "A premium luxury red blend from Napa Valley, offering complex layers of dark fruit and oak."},
        {"brand": "Finca Feroes", "cat": "wine", "images": {"750ml": "fferoes.jpg"}, "prices": {"750ml": "13.99"}, "description": "A Tempranillo-based Spanish red with deep fruit complexity and a smooth, structured finish."},
        {"brand": "Franzia Chardonnay Box", "cat": "wine", "images": {"5L": "cfranzia.jpg"}, "prices": {"5L": "24.99"}, "description": "A medium-bodied white wine with apple and pear aromas. Conveniently packaged to stay fresh."},
        {"brand": "Franzia Merlot Box", "cat": "wine", "images": {"5L": "mfranzia.jpg"}, "prices": {"5L": "24.99"}, "description": "A smooth red wine with aromas of raspberry and blackberry. Pairs perfectly with beef or pasta."},
        {"brand": "Frontera Cab/Merlot Blend", "cat": "wine", "images": {"750ml": "frontera.jpg", "1.5L": "frontera.jpg"}, "prices": {"750ml": "6.99", "1.5L": "11.99"}, "description": "A versatile Chilean blend with a soft texture and fruit-forward notes of plum and red berries."},
        {"brand": "Iter", "cat": "wine", "images": {"750ml": "iter.jpg"}, "prices": {"750ml": "18.99"}, "description": "An artisanal Napa Cabernet Sauvignon with structured tannins and notes of black currant."},
        {"brand": "Josh Cabernet", "cat": "wine", "images": {"750ml": "csjosh.jpg"}, "prices": {"750ml": "14.99"}, "description": "Full-bodied and bold, featuring dark fruit, hazelnut, and cinnamon notes with a long finish."},
        {"brand": "Josh Hearth", "cat": "wine", "images": {"750ml": "hjosh.jpg"}, "prices": {"750ml": "16.99"}, "description": "A bold red blend with high-octane flavors of blackberry, plum, and warm oak."},
        {"brand": "Josh Pinot Grigio", "cat": "wine", "images": {"750ml": "pnjosh.jpg"}, "prices": {"750ml": "13.99"}, "description": "Clean and bright, offering fresh citrus and apple flavors with a hint of white flower."},
        {"brand": "Josh Sauvignon Blanc", "cat": "wine", "images": {"750ml": "sbjosh.png"}, "prices": {"750ml": "13.99"}, "description": "Aromatic and bright with flavors of lemon and kiwi, backed by a crisp acidity."},
        {"brand": "Kendall Jackson Sauv Blanc", "cat": "wine", "images": {"750ml": "sbkendall.jpg"}, "prices": {"750ml": "14.99"}, "description": "Crisp and grassy with notes of lime, green apple, and melon. A classic California style."},
        {"brand": "Menage a Trois Decadence", "cat": "wine", "images": {"750ml": "dmenage.jpg"}, "prices": {"750ml": "12.99"}, "description": "An indulgent Cabernet Sauvignon with ultra-rich flavors of dark chocolate and blackberry."},
        {"brand": "Menage a Trois Red Blend", "cat": "wine", "images": {"750ml": "rbmenage.jpg"}, "prices": {"750ml": "12.99"}, "description": "A blend of Zinfandel, Merlot, and Cabernet, offering jammy fruit and a soft finish."},
        {"brand": "Menage a Trois Silk", "cat": "wine", "images": {"750ml": "smenage.jpg"}, "prices": {"750ml": "12.99"}, "description": "A smooth and velvety red blend that glides across the palate with raspberry and spice notes."},
        {"brand": "Mondavi Cabernet", "cat": "wine", "images": {"750ml": "csrmondavi.jpg"}, "prices": {"750ml": "14.99"}, "description": "A timeless classic with blackberry, plum, and cedar notes. Balanced and elegant."},
        {"brand": "Mondavi Merlot", "cat": "wine", "images": {"750ml": "mrmondavi.jpg"}, "prices": {"750ml": "14.99"}, "description": "Smooth and approachable with flavors of black cherry, plum, and a hint of spice."},
        {"brand": "Real Sangria", "cat": "wine", "images": {"750ml": "sangria.jpg", "1.5L": "sangria.jpg"}, "prices": {"750ml": "8.99", "1.5L": "13.99"}, "description": "An authentic Spanish Sangria made from Spanish red wine and natural citrus fruit extracts."},
        {"brand": "Riunite Lambrusco", "cat": "wine", "images": {"750ml": "lambrusco.jpg", "1.5L": "lambrusco.jpg"}, "prices": {"750ml": "8.99", "1.5L": "13.99"}, "description": "A soft, fizzy, and sweet Italian red wine. Best served chilled."},
        {"brand": "Ruffino Chianti", "cat": "wine", "images": {"750ml": "cruffino.jpg"}, "prices": {"750ml": "13.99"}, "description": "A medium-bodied Italian classic with notes of violet, cherry, and plum."},
        {"brand": "Ruffino Toscana", "cat": "wine", "images": {"750ml": "truffino.jpg"}, "prices": {"750ml": "14.99"}, "description": "An elegant Super Tuscan blend with dark fruit flavors and a hint of balsamic."},
        {"brand": "Santa Margherita Pinot Grigio", "cat": "wine", "images": {"750ml": "margherita.jpg"}, "prices": {"750ml": "24.99"}, "description": "The world-renowned premium Pinot Grigio from Italy. Dry, clean, and crisp with Golden Apple notes."},
        {"brand": "Santa Marina Cabernet", "cat": "wine", "images": {"750ml": "cabmarina.jpg"}, "prices": {"750ml": "7.99"}, "description": "A smooth and reliable Cabernet with red fruit notes and a balanced finish."},
        {
            "brand": "Santa Marina Chardonnay", "cat": "wine", 
            "images": {"750ml": "csmarina.jpg", "1.5L": "csmarina_15.jpg"}, "prices": {"750ml": "7.99", "1.5L": "12.99"},
            "description": "A well-balanced, easy-drinking white wine with elegant notes of apple and tropical fruits."
        },
        {"brand": "Santa Marina Merlot", "cat": "wine", "images": {"750ml": "msmarina.png", "1.5L": "msmarina.png"}, "prices": {"750ml": "7.99", "1.5L": "12.99"}, "description": "Classic smooth Merlot with flavors of plum and mild herbs."},
        {"brand": "Santa Marina Pinot Grigio", "cat": "wine", "images": {"750ml": "pgsmarina.jpg", "1.5L": "pgsmarina.jpg"}, "prices": {"750ml": "7.99", "1.5L": "12.99"}, "description": "Light, crisp, and refreshing with delicate notes of pear and citrus."},
        {"brand": "Santa Marina Pinot Noir", "cat": "wine", "images": {"750ml": "pnsmarina.jpg", "1.5L": "pnsmarina.jpg"}, "prices": {"750ml": "7.99", "1.5L": "12.99"}, "description": "A light-bodied and fruity Pinot Noir with cherry and spice notes."},
        {"brand": "Santa Marina Toscana", "cat": "wine", "images": {"750ml": "tsmarina.jpg"}, "prices": {"750ml": "7.99"}, "description": "A versatile Tuscan red blend with smooth tannins and red berry flavors."},
        {"brand": "Stella Rosa Red", "cat": "wine", "images": {"750ml": "rstella.jpg"}, "prices": {"750ml": "13.99"}, "description": "The original semi-sweet, semi-sparkling red wine from Italy with strawberry and raspberry notes."},
        {"brand": "Stella Rosa White", "cat": "wine", "images": {"750ml": "mstella.jpg"}, "prices": {"750ml": "13.99"}, "description": "A refreshing semi-sweet white wine with peach, honey, and pear flavors."},
        {"brand": "Tisdales Cabernet Sauv", "cat": "wine", "images": {"750ml": "cstis.jpg"}, "prices": {"750ml": "6.99"}, "description": "Accessible and smooth Cabernet with blackberry and oak notes."},
        {"brand": "Tisdales Chardonnay", "cat": "wine", "images": {"750ml": "chtis.jpg"}, "prices": {"750ml": "6.99"}, "description": "Light Chardonnay with notes of pineapple and vanilla."},
        {"brand": "Tisdales Merlot", "cat": "wine", "images": {"750ml": "mtis.jpg"}, "prices": {"750ml": "6.99"}, "description": "Easy-drinking Merlot with soft tannins and red fruit flavor."},
        {"brand": "Tisdales Pinot Noir", "cat": "wine", "images": {"750ml": "pntis.jpg"}, "prices": {"750ml": "6.99"}, "description": "A classic light Pinot Noir with cherry and plum aromas."},
        {"brand": "Woodbridge Cab Sauv", "cat": "wine", "images": {"750ml": "cswood.jpg"}, "prices": {"750ml": "8.99"}, "description": "A dependable California Cabernet with cedar and dark berry notes."},
        {"brand": "Woodbridge Chardonnay", "cat": "wine", "images": {"750ml": "cwood.jpg", "1.5L": "cwood.jpg"}, "prices": {"750ml": "8.99", "1.5L": "14.99"}, "description": "A classic crisp Chardonnay with apple and oak notes."},
        {"brand": "Woodbridge Merlot", "cat": "wine", "images": {"750ml": "mwood.jpg"}, "prices": {"750ml": "8.99"}, "description": "Smooth and fruit-forward Merlot with black cherry and chocolate flavors."},
        {"brand": "Woodbridge Pinot Noir", "cat": "wine", "images": {"750ml": "pnwood.jpg"}, "prices": {"750ml": "8.99"}, "description": "Light and elegant with strawberry and floral notes."},

        # 2. VODKA
        {
            "brand": "Absolut Regular", "cat": "vodka", 
            "images": {"50ml": "absolut50.jpg", "200ml": "absolut200.jpg", "375ml": "absolut375.jpg", "750ml": "absolut750.jpg"}, 
            "prices": {"50ml": "2.25", "200ml": "7.99", "375ml": "14.99", "750ml": "27.00"},
            "description": "A rich, full-bodied Swedish vodka with no added sugar, offering hints of dried fruit, caramel, and vanilla with a smooth mouthfeel."
        },
        {
            "brand": "Titos", "cat": "vodka", 
            "images": {"50ml": "titos50.png", "200ml": "titos200.png", "375ml": "titos375.png", "750ml": "titos750.png", "1L": "titos1.png", "1.75L": "titos175.png"}, 
            "prices": {"50ml": "2.00", "200ml": "8.50", "375ml": "12.50", "750ml": "23.00", "1L": "30.00", "1.75L": "43.00"},
            "description": "Handcrafted from yellow corn in Austin, Texas. Distilled 6 times in copper pot stills for a naturally pure, gluten-free finish."
        },
        {"brand": "360 Chocolate Vodka", "cat": "vodka", "images": {"750ml": "360.jpg"}, "prices": {"750ml": "15.99"}, "description": "A sustainably made, quadruple-distilled vodka infused with rich, velvety chocolate flavor."},
        {"brand": "Absolut Citron", "cat": "vodka", "images": {"750ml": "absolutc.jpg"}, "prices": {"750ml": "30.00"}, "description": "The benchmark for citrus vodka, featuring aromas of candied lemon and a fresh lime finish."},
        {"brand": "Absolut Vanilla", "cat": "vodka", "images": {"750ml": "vabsolut.jpg"}, "prices": {"750ml": "30.00"}, "description": "A smooth vodka with rich notes of natural vanilla, dark chocolate, and butterscotch."},
        {"brand": "Deep Eddy Ruby Red", "cat": "vodka", "images": {"750ml": "eddy.jpg"}, "prices": {"750ml": "19.99"}, "description": "Made with real grapefruit juice for a tart, sweet, and refreshing citrus experience."},
        {"brand": "Effen Vodka", "cat": "vodka", "images": {"750ml": "effen.jpg"}, "prices": {"750ml": "24.99"}, "description": "A premium Dutch vodka distilled from wheat, offering an ultra-smooth and clean profile."},
        {"brand": "Georgi Vodka", "cat": "vodka", "images": {"750ml": "georgie.jpg", "1.75L": "georgie.jpg"}, "prices": {"750ml": "9.99", "1.75L": "16.99"}, "description": "A high-quality mixing vodka known for its versatility and smooth finish."},
        {"brand": "Grey Goose", "cat": "vodka", "images": {"750ml": "ggoose.jpg"}, "prices": {"750ml": "32.99"}, "description": "An ultra-premium French vodka distilled from soft winter wheat and spring water."},
        {"brand": "Jewel of Russia", "cat": "vodka", "images": {"750ml": "russia.jpg"}, "prices": {"750ml": "34.99"}, "description": "A traditional Russian vodka made from a centuries-old recipe for ultimate purity."},
        {"brand": "Ketel One", "cat": "vodka", "images": {"750ml": "ketel.jpg"}, "prices": {"750ml": "29.99"}, "description": "Crafted in small batches in copper pot stills, this Dutch vodka is exceptionally crisp."},
        {"brand": "New Amsterdam Regular", "cat": "vodka", "images": {"50ml": "ramsterdam.jpg", "200ml": "ramsterdam.jpg", "375ml": "ramsterdam.jpg", "750ml": "ramsterdam.jpg"}, "prices": {"50ml": "1.50", "200ml": "5.99", "375ml": "9.99", "750ml": "14.99"}, "description": "Distilled 5 times and filtered 3 times for a smooth, clean taste with a soft mouthfeel."},
        {"brand": "New Amsterdam Apple", "cat": "vodka", "description": "Crisp and refreshing with natural flavors of sweet, bright apples.", "images": {"50ml": "aamsterdam.jpg", "375ml": "aamsterdam.jpg", "750ml": "aamsterdam.jpg"}, "prices": {"50ml": "1.50", "375ml": "9.99", "750ml": "14.99"}},
        {"brand": "New Amsterdam Peach", "cat": "vodka", "description": "Succulent peach flavors meet a smooth vodka base.", "images": {"50ml": "phamsterdam.jpg", "375ml": "phamsterdam.jpg", "750ml": "phamsterdam.jpg"}, "prices": {"50ml": "1.50", "375ml": "9.99", "750ml": "14.99"}},
        {"brand": "New Amsterdam Pineapple", "cat": "vodka", "description": "Tropical pineapple flavors provide a lush, sweet escape.", "images": {"50ml": "pamsterdam.jpg", "375ml": "pamsterdam.jpg", "750ml": "pamsterdam.jpg"}, "prices": {"50ml": "1.50", "375ml": "9.99", "750ml": "14.99"}},
        {"brand": "New Amsterdam Watermelon", "cat": "vodka", "description": "Refreshing and crisp with the natural sweetness of watermelon.", "images": {"50ml": "wamsterdam.jpg", "375ml": "wamsterdam.jpg", "750ml": "wamsterdam.jpg"}, "prices": {"50ml": "1.50", "375ml": "9.99", "750ml": "14.99"}},
        {"brand": "New Amsterdam Pink Whitney", "cat": "vodka", "description": "Pink lemonade infused vodka, inspired by Ryan Whitney.", "images": {"50ml": "pwamsterdam.jpg", "375ml": "pwamsterdam.jpg", "750ml": "pwamsterdam.jpg"}, "prices": {"50ml": "1.50", "375ml": "9.99", "750ml": "14.99"}},
        {"brand": "Shakers Vodka", "cat": "vodka", "images": {"750ml": "shakers.jpg", "1.75L": "shakers.jpg"}, "prices": {"750ml": "24.99", "1.75L": "39.99"}, "description": "An American luxury vodka distilled from wheat for a creamy, smooth texture."},

        # 3. TEQUILA
        {"brand": "Teremana Blanco", "cat": "tequila", "images": {"750ml": "tere.jpg"}, "prices": {"750ml": "31.99"}, "description": "A small-batch tequila with notes of bright citrus and a smooth, fresh finish."},
        {"brand": "Teremana Reposado", "cat": "tequila", "images": {"750ml": "rtere.jpg"}, "prices": {"750ml": "34.99"}, "description": "Aged in oak barrels, offering notes of oak and vanilla with a smooth finish."},
        {"brand": "Teremana Anejo", "cat": "tequila", "images": {"750ml": "atere.jpg"}, "prices": {"750ml": "44.99"}, "description": "Rich and complex, with flavors of roasted agave, vanilla, and warm oak."},
        {"brand": "Don Julio Blanco", "cat": "tequila", "description": "Crisp agave flavor and hints of citrus.", "images": {"375ml": "djblanco.jpg", "750ml": "dj.jpg", "1.75L": "dj175.jpg"}, "prices": {"375ml": "32.99", "750ml": "55.00", "1.75L": "115.00"}},
        {"brand": "Herradura Silver", "cat": "tequila", "description": "Naturally fermented and aged for 45 days in American White Oak.", "images": {"375ml": "herra375.jpg", "750ml": "herra.jpg"}, "prices": {"375ml": "24.99", "750ml": "44.99"}},
        {"brand": "Herradura Reposado", "cat": "tequila", "description": "The first reposado in the world, aged for 11 months.", "images": {"375ml": "rherra375.jpg", "750ml": "rherra.jpg"}, "prices": {"375ml": "26.99", "750ml": "48.99"}},
        {"brand": "Hornitos Plata", "cat": "tequila", "description": "A clean, lively tequila with herbal and citrus notes.", "images": {"750ml": "hornitos.jpg"}, "prices": {"750ml": "29.99"}},
        {"brand": "Espolon Blanco", "cat": "tequila", "description": "Handcrafted with 100% Blue Weber Agave in the Highlands of Jalisco.", "images": {"750ml": "espolon.jpg"}, "prices": {"750ml": "32.99"}},
        {"brand": "Patron Silver", "cat": "tequila", "description": "The perfect white spirit made from the finest Weber Blue Agave.", "images": {"50ml": "psilver.jpg", "100ml": "pat100.jpg", "200ml": "psilver.jpg", "375ml": "psilver.jpg", "750ml": "pat.jpg"}, "prices": {"50ml": "6.99", "100ml": "12.99", "200ml": "19.99", "375ml": "28.99", "750ml": "49.99"}},
        {"brand": "Patron Anejo", "cat": "tequila", "description": "Oak-aged for over 12 months for a smooth, sweet, and smoky finish.", "images": {"750ml": "apat.jpg"}, "prices": {"750ml": "59.99"}},
        {"brand": "Patron Reposado", "cat": "tequila", "description": "Aged for at least two months for a hint of oak and fresh agave.", "images": {"750ml": "rpat.jpg"}, "prices": {"750ml": "54.99"}},
        {"brand": "Patron XO Cafe", "cat": "tequila", "description": "Dry, low-proof coffee liqueur made with Patron Silver.", "images": {"750ml": "xopat.jpg"}, "prices": {"750ml": "45.99"}},
        {"brand": "Patron El Cielo (Cristal)", "cat": "tequila", "description": "Distilled four times for ultimate smoothness and citrus notes.", "images": {"750ml": "cpat.jpg"}, "prices": {"750ml": "129.99"}},

        # 4. WHISKEY & COGNAC
        {
            "brand": "Jameson", "cat": "whiskey", 
            "images": {"50ml": "jameson50.jpg", "200ml": "jameson200.jpg", "375ml": "jameson375.jpg", "750ml": "jameson.jpg"}, 
            "prices": {"50ml": "3.50", "200ml": "11.99", "375ml": "19.99", "750ml": "32.99"},
            "description": "Triple-distilled, remarkably smooth Irish Whiskey with a sweet sherry finish."
        },
        {"brand": "Buchanan's Deluxe 12", "cat": "whiskey", "images": {"750ml": "buchanan.jpg"}, "prices": {"750ml": "34.99"}, "description": "A light and smooth blended Scotch with notes of honey and vanilla."},
        {"brand": "Buchanan's Pineapple", "cat": "whiskey", "images": {"750ml": "pbuchanan.jpg"}, "prices": {"750ml": "32.99"}, "description": "The smooth taste of Scotch whisky paired with the juicy sweetness of pineapple."},
        {"brand": "Hennessy VS", "cat": "cognac", "images": {"750ml": "henny.jpg"}, "prices": {"750ml": "45.99"}, "description": "Matured in new oak barrels, offering bold notes of fresh toast and roasted almond."},
        {"brand": "Hennessy VSOP", "cat": "cognac", "images": {"750ml": "vsophenny.jpg"}, "prices": {"750ml": "59.99"}, "description": "A harmonious and well-structured cognac with a long, satisfying finish."},
        {"brand": "Johnnie Walker Black Label", "cat": "whiskey", "images": {"750ml": "bjohnnie.jpg"}, "prices": {"750ml": "38.99"}, "description": "A rich, complex blended Scotch aged for 12 years, with signature smoke notes."},
        {"brand": "Johnnie Walker Red Label", "cat": "whiskey", "images": {"750ml": "rjohnnie.jpg"}, "prices": {"750ml": "24.99"}, "description": "A bold Scotch whisky with hints of spicy cinnamon and fresh black pepper."},
        {"brand": "Brenne Whisky", "cat": "whiskey", "images": {"750ml": "brenne.jpg"}, "prices": {"750ml": "59.99"}, "description": "A French single malt aged in Cognac barrels, offering notes of fruit and cream."},
        {"brand": "Bulleit Bourbon", "cat": "whiskey", "images": {"750ml": "bullit.jpg"}, "prices": {"750ml": "32.99"}, "description": "A high-rye bourbon with a bold, spicy character and a clean finish."},
        {"brand": "Bulleit Rye", "cat": "whiskey", "images": {"750ml": "rbulliet.jpg"}, "prices": {"750ml": "32.99"}, "description": "An award-winning straight rye whiskey with an unparalleled spice profile."},
        {"brand": "Bulleit 10 Year", "cat": "whiskey", "images": {"750ml": "tenbulliet.jpg"}, "prices": {"750ml": "45.99"}, "description": "Aged for a full decade in charred American white oak for a deep, smooth finish."},
        {"brand": "Dewars White Label", "cat": "whiskey", "images": {"750ml": "dewars.jpg", "1.75L": "dewars.jpg"}, "prices": {"750ml": "24.99", "1.75L": "42.99"}, "description": "A blended Scotch with notes of honey, citrus, and a hint of smoke."},
        {"brand": "Evan Williams Regular", "cat": "whiskey", "images": {"750ml": "ew.jpg"}, "prices": {"750ml": "15.99"}, "description": "A classic Kentucky Straight Bourbon with notes of oak and vanilla."},
        {"brand": "Evan Williams Apple", "cat": "whiskey", "images": {"750ml": "aew.jpg"}, "prices": {"750ml": "15.99"}, "description": "Bourbon infused with the flavor of crisp green apples."},
        {"brand": "Evan Williams Peach", "cat": "whiskey", "images": {"750ml": "pew.jpg"}, "prices": {"750ml": "15.99"}, "description": "Bourbon with the flavor of sweet, sun-ripened peaches."},
        {"brand": "Fireball Cinnamon", "cat": "whiskey", "images": {"750ml": "fireball.jpg", "1L": "fireball.jpg"}, "prices": {"750ml": "18.99", "1L": "24.99"}, "description": "The original cinnamon-flavored whisky with a legendary heat."},
        {
            "brand": "Jack Daniel's Regular", "cat": "whiskey", 
            "images": {"750ml": "jack.jpg", "1L": "jack_1L.jpg"}, "prices": {"750ml": "28.99", "1L": "36.99"},
            "description": "Tennessee Whiskey mellowed through sugar maple charcoal for its signature taste."
        },
        {"brand": "Jack Daniel's Bonded", "cat": "whiskey", "images": {"750ml": "bjack.jpg"}, "prices": {"750ml": "34.99"}, "description": "Bottled-in-bond for extra depth and character with oaky sweetness."},
        {"brand": "Jack Daniel's Bonded Rye", "cat": "whiskey", "images": {"750ml": "brjack.jpg"}, "prices": {"750ml": "34.99"}, "description": "A complex rye whiskey with spicy notes and a long, smooth finish."},
        {"brand": "Jack Daniel's Single Barrel", "cat": "whiskey", "images": {"750ml": "sbjack.jpg"}, "prices": {"750ml": "54.99"}, "description": "Uniquely crafted from a single barrel for a one-of-a-kind flavor profile."},
        {"brand": "Jack Daniel's Honey", "cat": "whiskey", "images": {"750ml": "hjack.jpg"}, "prices": {"750ml": "28.99"}, "description": "A blend of Jack Daniel’s Tennessee Whiskey and a unique honey liqueur."},
        {"brand": "Jack Daniel's Fire", "cat": "whiskey", "images": {"750ml": "fjack.jpg"}, "prices": {"750ml": "28.99"}, "description": "Jack Daniel’s whiskey blended with a red-hot cinnamon liqueur."},
        {"brand": "Jack Daniel's Apple", "cat": "whiskey", "images": {"750ml": "ajack.jpg"}, "prices": {"750ml": "28.99"}, "description": "Jack Daniel’s Tennessee Whiskey with the refreshing taste of green apples."},
        {"brand": "Jameson Orange", "cat": "whiskey", "images": {"750ml": "ojameson.jpg"}, "prices": {"750ml": "32.99"}, "description": "Smooth Irish whiskey with a zesty, natural orange twist."},
        {"brand": "Maker's Mark", "cat": "whiskey", "images": {"750ml": "makers.jpg"}, "prices": {"750ml": "31.99"}, "description": "A wheated bourbon with a mild, sweet profile and signature red wax seal."},
        {"brand": "Maker's Mark 46", "cat": "whiskey", "images": {"750ml": "makers46.jpg"}, "prices": {"750ml": "39.99"}, "description": "Created with seared oak staves for amplified flavors of caramel and vanilla."},
        {"brand": "Proper Twelve", "cat": "whiskey", "images": {"750ml": "twelve.jpg", "1.75L": "twelve.jpg"}, "prices": {"750ml": "27.99", "1.75L": "48.99"}, "description": "A blend of fine grain and single malt Irish whiskey for a smooth profile."},
        {"brand": "Salignac Cognac", "cat": "cognac", "images": {"750ml": "salignoc.jpg"}, "prices": {"750ml": "24.99"}, "description": "A classic French cognac with notes of grape and a soft oak finish."},
        {"brand": "Seagrams 7", "cat": "whiskey", "images": {"1.75L": "seagrams.jpg"}, "prices": {"1.75L": "32.99"}, "description": "An American blended whiskey known for its light profile and ease of mixing."},
        {"brand": "Tullamore Dew", "cat": "whiskey", "images": {"750ml": "tullamore.jpg"}, "prices": {"750ml": "29.99"}, "description": "The original triple-distilled, triple-blend Irish whiskey."},
        {"brand": "Suntory Toki", "cat": "whiskey", "images": {"750ml": "toki.jpg"}, "prices": {"750ml": "26.00"}, "description": "A vivid Japanese whisky with notes of basil, green apple, and honey."},

        # 5. LIQUEURS & CREAMS
        {"brand": "Alize", "cat": "liqueur", "images": {"1L": "alize.jpg"}, "prices": {"1L": "22.99"}, "description": "French vodka infused with the nectar of passion fruit."},
        {"brand": "Baileys Churro", "cat": "liqueur", "images": {"750ml": "chbaileys.jpg"}, "prices": {"750ml": "29.99"}, "description": "Irish cream with the warm flavor of cinnamon churros."},
        {"brand": "Baileys Coffee", "cat": "liqueur", "images": {"750ml": "cbaileys.jpg"}, "prices": {"750ml": "29.99"}, "description": "Irish cream infused with the flavor of roasted coffee beans."},
        {"brand": "Baileys Cookies & Cream", "cat": "liqueur", "images": {"750ml": "ccbaileys.jpg"}, "prices": {"750ml": "29.99"}, "description": "Irish cream with the nostalgic flavor of chocolate cookies and cream."},
        {"brand": "Baileys Irish Cream", "cat": "liqueur", "images": {"1.75L": "baileys.jpg"}, "prices": {"1.75L": "54.99"}, "description": "The original blend of Irish whiskey and cream with cocoa and vanilla."},
        {"brand": "Bradys Irish Cream", "cat": "liqueur", "images": {"750ml": "bradys.jpg", "1L": "bradys.jpg", "1.75L": "bradys.jpg"}, "prices": {"750ml": "14.99", "1L": "19.99", "1.75L": "29.99"}, "description": "A smooth and creamy Irish liqueur at a great value."},
        {"brand": "Di Amore Amaretto", "cat": "liqueur", "images": {"750ml": "diamore.jpg"}, "prices": {"750ml": "15.99"}, "description": "A classic almond-flavored liqueur from Italy."},
        {"brand": "Du Bouchard Blue Curacao", "cat": "liqueur", "images": {"750ml": "dbbc.jpg"}, "prices": {"750ml": "11.99"}, "description": "A bright blue orange-flavored liqueur, essential for colorful cocktails."},
        {"brand": "Fabrizio Limoncello", "cat": "liqueur", "images": {"750ml": "lfabrizio.jpg"}, "prices": {"750ml": "18.99"}, "description": "A traditional Italian lemon liqueur made with sun-ripened citrus."},
        {"brand": "Fragolino", "cat": "liqueur", "images": {"750ml": "frago.jpg"}, "prices": {"750ml": "14.99"}, "description": "A strawberry-flavored liqueur that is sweet and aromatic."},
        {"brand": "Jagermeister", "cat": "liqueur", "images": {"750ml": "jager.jpg"}, "prices": {"750ml": "26.99"}, "description": "A herbal liqueur made with 56 different herbs, blossoms, and roots."},
        {"brand": "Kahlua Dunkin", "cat": "liqueur", "images": {"750ml": "dunkin.jpg"}, "prices": {"750ml": "24.99"}, "description": "Coffee liqueur with the signature flavor of Dunkin’ coffee."},
        {"brand": "Llords Amaretto", "cat": "liqueur", "images": {"750ml": "allords.jpg"}, "prices": {"750ml": "12.99"}, "description": "A rich and smooth almond-flavored liqueur."},
        {"brand": "Llords Creme de Cassis", "cat": "liqueur", "images": {"750ml": "cllords.jpg"}, "prices": {"750ml": "12.99"}, "description": "A dark red liqueur made from blackcurrants."},
        {"brand": "Llords Peppermint", "cat": "liqueur", "images": {"750ml": "pllords.jpg"}, "prices": {"750ml": "12.99"}, "description": "Cool and refreshing peppermint-flavored liqueur."},
        {"brand": "Mr. Boston Anisette", "cat": "liqueur", "images": {"750ml": "aboston.jpg"}, "prices": {"750ml": "12.99"}, "description": "A sweet liqueur with the distinct flavor of licorice."},
        {"brand": "Sambuca", "cat": "liqueur", "images": {"750ml": "sambvca.jpg", "1L": "sambvca.jpg"}, "prices": {"750ml": "24.99", "1L": "32.99"}, "description": "An Italian anise-flavored liqueur often served with coffee beans."},

        # 6. RUM
        {"brand": "Bacardi Gold", "cat": "rum", "images": {"50ml": "gbacardi.jpg", "375ml": "gbacardi.jpg", "750ml": "gbacardi.jpg"}, "prices": {"50ml": "2.00", "375ml": "11.99", "750ml": "20.00"}, "description": "Mellowed in toasted oak barrels for a soft, smoky profile with notes of vanilla."},
        {"brand": "Bacardi Limon", "cat": "rum", "images": {"50ml": "lbacardi.jpg", "375ml": "lbacardi.jpg", "750ml": "lbacardi.jpg"}, "prices": {"50ml": "2.00", "375ml": "11.99", "750ml": "20.00"}, "description": "Infused with the essence of lemon, lime, and grapefruit for a zesty finish."},
        {"brand": "Bacardi White", "cat": "rum", "images": {"50ml": "wbacardi.jpg", "375ml": "wbacardi.jpg", "750ml": "wbacardi.jpg"}, "prices": {"50ml": "2.00", "375ml": "11.99", "750ml": "20.00"}, "description": "A light and aromatically balanced rum, perfect for mixing classic cocktails."},
        {"brand": "Captain Morgan Chili Lime", "cat": "rum", "images": {"750ml": "clmorgan.jpg"}, "prices": {"750ml": "20.00"}, "description": "Spiced rum with a unique kick of chili and refreshing lime."},
        {"brand": "Captain Morgan Spiced", "cat": "rum", "images": {"750ml": "smorgan.jpg"}, "prices": {"750ml": "20.00"}, "description": "The world's most famous spiced rum with notes of vanilla and spice."},
        {"brand": "Kuya Fusion Rum", "cat": "rum", "images": {"750ml": "kuya.jpg"}, "prices": {"750ml": "21.99"}, "description": "A fusion of spiced rum and tropical flavors for a unique spirit."},
        {"brand": "Malibu Coconut Rum", "cat": "rum", "images": {"750ml": "malibu.jpg"}, "prices": {"750ml": "21.99"}, "description": "The world’s best-selling Caribbean rum with natural coconut flavor."},

        # 7. CHAMPAGNE & SPARKLING
        {"brand": "Cupcake Prosecco", "cat": "champagne", "images": {"750ml": "pcupcake.jpg"}, "prices": {"750ml": "13.99"}, "description": "A refreshing prosecco with notes of white peach and honeydew melon."},
        {"brand": "La Marca Prosecco", "cat": "champagne", "images": {"750ml": "plamarca.jpg"}, "prices": {"750ml": "17.99"}, "description": "A luxury prosecco with a pale straw color and fresh citrus aromas."},
        {"brand": "La Marca Rose", "cat": "champagne", "images": {"750ml": "prlamarca.jpg"}, "prices": {"750ml": "17.99"}, "description": "An elegant sparkling rose with hints of strawberry and cherry."},
        {"brand": "Martini & Rossi Asti", "cat": "champagne", "images": {"750ml": "martini.jpg"}, "prices": {"750ml": "15.99"}, "description": "A sweet, fragrant Italian sparkling wine from Piedmont."},
        {"brand": "Mionetto Prosecco", "cat": "champagne", "images": {"750ml": "pmoinetto.jpg"}, "prices": {"750ml": "16.99"}, "description": "A premium dry prosecco with notes of golden apple and honey."},
        {"brand": "Nando Fragolino", "cat": "champagne", "images": {"750ml": "nfrag.jpg"}, "prices": {"750ml": "12.99"}, "description": "A sparkling strawberry wine from Italy that is sweet and refreshing."},
        {"brand": "Nano Mimosa", "cat": "champagne", "images": {"750ml": "mandre.jpg"}, "prices": {"750ml": "14.99"}, "description": "A ready-to-drink mimosa made with premium sparkling wine and orange juice."},
        {"brand": "Ruffino di Moscato", "cat": "champagne", "images": {"750ml": "mruffino.jpg"}, "prices": {"750ml": "14.99"}, "description": "A sweet and sparkling Moscato d’Asti with notes of sage and honey."},
        {"brand": "Santa Marina Prosecco", "cat": "champagne", "images": {"750ml": "pmarina.jpg"}, "prices": {"750ml": "12.99"}, "description": "A crisp Italian prosecco with a fine perlage and fresh fruity notes."},

        # 8. CANNED COCKTAILS
        {
          "brand": "BuzzBallz Cocktails",
         "cat": "mixed",
         "is_flavor_based": True,
         "images": {
            "Tequila Rita": "tbuzz.jpg",
            "Mango Chiller": "mbuzz.jpg",
            "Lotta Colada": "cbuzz.jpg",
            "Espresso Martini": "ebuzz.jpg",
            "Berry Cherry Limeade": "bluebuzz.jpg",
            "Choc Tease": "chocbuzz.jpg"
        },
         "prices": {
             "Tequila Rita": "4.25",
            "Mango Chiller": "4.25",
            "Lotta Colada": "4.25",
            "Espresso Martini": "4.25",
            "Berry Cherry Limeade": "4.25",
            "Choc Tease": "4.25"
      },
        "descriptions": {
        "Tequila Rita": "A vibrant take on the classic margarita. Crafted with premium silver tequila and crisp lime, it delivers a smooth, tart, and legendary citrus punch.",
        "Mango Chiller": "A tropical escape in every sip. This cocktail blends premium vodka with authentic, juicy mango flavors for a sweet and refreshing finish.",
        "Lotta Colada": "A tropical vacation in a ball. Rich coconut cream and sweet pineapple juice blended with premium rum.",
        "Espresso Martini": "Bold roasted coffee notes and premium vodka for a smooth, caffeinated cocktail experience.",
        "Berry Cherry Limeade": "A refreshing blast of bright blue raspberry, cherry, and lime flavors.",
        "Choc Tease": "Indulgent and creamy, this vodka-based cocktail tastes like liquid chocolate silk."
        }
        },
        {"brand": "Gorae Soju", "cat": "mixed", "images": {"Individual": "soju.jpg", "Box": "soju.jpg"}, "prices": {"Individual": "5.40", "Box": "32.50"}, "description": "A modern Korean Soju that is smooth and refreshing."},
        {
            "brand": "High Noon Sun Sips", "cat": "mixed", 
            "images": {"Individual": "highnoon.jpg", "Box": "highnoon_box.jpg"}, "prices": {"Individual": "3.50", "Box": "28.00"},
            "description": "Made with real vodka, real fruit juice, and sparkling water. Gluten-free and low calorie."
        },
        {"brand": "Jack & Coke", "cat": "mixed", "images": {"Individual": "cokejack.jpg", "Box": "cokejack.jpg"}, "prices": {"Individual": "3.50", "Box": "14.00"}, "description": "The classic blend of Jack Daniel’s Tennessee Whiskey and Coca-Cola in a can."}
    ]

@app.route('/')
def index():
    return render_template('index.html', items=get_inventory())

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    inventory = get_inventory()
    if 0 <= product_id < len(inventory):
        product = inventory[product_id]
        return render_template('product_detail.html', product=product)
    abort(404)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)




