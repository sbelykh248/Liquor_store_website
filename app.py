from flask import Flask, render_template
from flask_talisman import Talisman

app = Flask(__name__)
# Security headers to protect the business logic
Talisman(app, content_security_policy=None, force_https=False)

@app.route('/')
def index():
    inventory = [
        # ==========================================
        # 1. WINE & BOXED WINE (Jugs, Boxes, Bottles)
        # ==========================================
        {"brand": "19 Crimes Hard Chard", "cat": "wine", "image": "19.jpg", "prices": {"750ml": "13.99"}},
        {"brand": "Barefoot Moscato", "cat": "wine", "image": "bfoot.jpg", "prices": {"750ml": "7.99"}},
        {"brand": "Barefoot Pink Moscato", "cat": "wine", "image": "pmbfoot.jpg", "prices": {"750ml": "7.99"}},
        {"brand": "Barefoot Sauv Blanc", "cat": "wine", "image": "sbbfoot.jpg", "prices": {"750ml": "7.99"}},
        {"brand": "Bogle Petite Sirah", "cat": "wine", "image": "psbogle.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Bogle Sauv Blanc", "cat": "wine", "image": "sbbogle.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Cape Red", "cat": "wine", "image": "cape.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Carlo Rossi Burgundy", "cat": "wine", "image": "cr.jpg", "prices": {"4L": "21.99"}},
        {"brand": "Carlo Rossi Chablis", "cat": "wine", "image": "ccr.jpg", "prices": {"3L": "16.99"}},
        {"brand": "Carlo Rossi Paisano", "cat": "wine", "image": "pcr.jpg", "prices": {"3L": "16.99", "4L": "21.99"}},
        {"brand": "Cavit Pinot Grigio", "cat": "wine", "image": "cavit.jpg", "prices": {"750ml": "9.99"}},
        {"brand": "Cupcake Riesling", "cat": "wine", "image": "rcupcake.jpg", "prices": {"750ml": "11.99"}},
        {"brand": "Cupcake Sauv Blanc", "cat": "wine", "image": "sbcupcake.jpg", "prices": {"750ml": "11.99"}},
        {"brand": "Double Eagle", "cat": "wine", "image": "deagle.jpg", "prices": {"750ml": "45.00"}},
        {"brand": "Finca Feroes", "cat": "wine", "image": "fferoes.jpg", "prices": {"750ml": "13.99"}},
        {"brand": "Franzia Chardonnay Box", "cat": "wine", "image": "cfranzia.jpg", "prices": {"5L": "24.99"}},
        {"brand": "Franzia Merlot Box", "cat": "wine", "image": "mfranzia.jpg", "prices": {"5L": "24.99"}},
        {"brand": "Frontera Cab/Merlot Blend", "cat": "wine", "image": "frontera.jpg", "prices": {"750ml": "6.99", "1.5L": "11.99"}},
        {"brand": "Iter", "cat": "wine", "image": "iter.jpg", "prices": {"750ml": "18.99"}},
        {"brand": "Josh Cabernet", "cat": "wine", "image": "csjosh.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Josh Hearth", "cat": "wine", "image": "hjosh.jpg", "prices": {"750ml": "16.99"}},
        {"brand": "Josh Pinot Grigio", "cat": "wine", "image": "pnjosh.jpg", "prices": {"750ml": "13.99"}},
        {"brand": "Josh Sauvignon Blanc", "cat": "wine", "image": "sbjosh.png", "prices": {"750ml": "13.99"}},
        {"brand": "Kendall Jackson Sauv Blanc", "cat": "wine", "image": "sbkendall.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Menage a Trois Decadence", "cat": "wine", "image": "dmenage.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Menage a Trois Red Blend", "cat": "wine", "image": "rbmenage.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Menage a Trois Silk", "cat": "wine", "image": "smenage.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Mondavi Cabernet", "cat": "wine", "image": "csrmondavi.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Mondavi Merlot", "cat": "wine", "image": "mrmondavi.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Real Sangria", "cat": "wine", "image": "sangria.jpg", "prices": {"750ml": "8.99", "1.5L": "13.99"}},
        {"brand": "Riunite Lambrusco", "cat": "wine", "image": "lambrusco.jpg", "prices": {"750ml": "8.99", "1.5L": "13.99"}},
        {"brand": "Ruffino Chianti", "cat": "wine", "image": "cruffino.jpg", "prices": {"750ml": "13.99"}},
        {"brand": "Ruffino Toscana", "cat": "wine", "image": "truffino.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Santa Margherita Pinot Grigio", "cat": "wine", "image": "margherita.jpg", "prices": {"750ml": "24.99"}},
        {"brand": "Santa Marina Cabernet", "cat": "wine", "image": "cabmarina.jpg", "prices": {"750ml": "7.99"}},
        {"brand": "Santa Marina Chardonnay", "cat": "wine", "image": "csmarina.jpg", "prices": {"750ml": "7.99", "1.5L": "12.99"}},
        {"brand": "Santa Marina Merlot", "cat": "wine", "image": "msmarina.png", "prices": {"750ml": "7.99", "1.5L": "12.99"}},
        {"brand": "Santa Marina Pinot Grigio", "cat": "wine", "image": "pgsmarina.jpg", "prices": {"750ml": "7.99", "1.5L": "12.99"}},
        {"brand": "Santa Marina Pinot Noir", "cat": "wine", "image": "pnsmarina.jpg", "prices": {"750ml": "7.99", "1.5L": "12.99"}},
        {"brand": "Santa Marina Toscana", "cat": "wine", "image": "tsmarina.jpg", "prices": {"750ml": "7.99"}},
        {"brand": "Stella Rosa Red", "cat": "wine", "image": "rstella.jpg", "prices": {"750ml": "13.99"}},
        {"brand": "Stella Rosa White", "cat": "wine", "image": "mstella.jpg", "prices": {"750ml": "13.99"}},
        {"brand": "Tisdales Cabernet Sauv", "cat": "wine", "image": "cstis.jpg", "prices": {"750ml": "6.99"}},
        {"brand": "Tisdales Chardonnay", "cat": "wine", "image": "chtis.jpg", "prices": {"750ml": "6.99"}},
        {"brand": "Tisdales Merlot", "cat": "wine", "image": "mtis.jpg", "prices": {"750ml": "6.99"}},
        {"brand": "Tisdales Pinot Noir", "cat": "wine", "image": "pntis.jpg", "prices": {"750ml": "6.99"}},
        {"brand": "Woodbridge Cab Sauv", "cat": "wine", "image": "cswood.jpg", "prices": {"750ml": "8.99"}},
        {"brand": "Woodbridge Chardonnay", "cat": "wine", "image": "cwood.jpg", "prices": {"750ml": "8.99", "1.5L": "14.99"}},
        {"brand": "Woodbridge Merlot", "cat": "wine", "image": "mwood.jpg", "prices": {"750ml": "8.99"}},
        {"brand": "Woodbridge Pinot Noir", "cat": "wine", "image": "pnwood.jpg", "prices": {"750ml": "8.99"}},

        # ==========================================
        # 2. VODKA
        # ==========================================
        {"brand": "360 Chocolate Vodka", "cat": "vodka", "image": "360.jpg", "prices": {"750ml": "15.99"}},
        {"brand": "Absolut Citron", "cat": "vodka", "image": "cabsolut.jpg", "prices": {"750ml": "30.00"}},
        {"brand": "Absolut", "cat": "vodka", "image": "absolute.jpg", "prices": {"50ml": "2.25", "750ml": "27.00"}},
        {"brand": "Absolut Vanilla", "cat": "vodka", "image": "vabsolut.jpg", "prices": {"750ml": "30.00"}},
        {"brand": "Deep Eddy Ruby Red", "cat": "vodka", "image": "eddy.jpg", "prices": {"750ml": "19.99"}},
        {"brand": "Effen Vodka", "cat": "vodka", "image": "effen.jpg", "prices": {"750ml": "24.99"}},
        {"brand": "Georgi Vodka", "cat": "vodka", "image": "georgie.jpg", "prices": {"750ml": "9.99", "1.75L": "16.99"}},
        {"brand": "Grey Goose", "cat": "vodka", "image": "ggoose.jpg", "prices": {"750ml": "32.99"}},
        {"brand": "Jewel of Russia", "cat": "vodka", "image": "russia.jpg", "prices": {"750ml": "34.99"}},
        {"brand": "Ketel One", "cat": "vodka", "image": "ketel.jpg", "prices": {"750ml": "29.99"}},
        {"brand": "New Amsterdam Apple", "cat": "vodka", "image": "aamsterdam.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "New Amsterdam Peach", "cat": "vodka", "image": "phamsterdam.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "New Amsterdam Pineapple", "cat": "vodka", "image": "pamsterdam.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "New Amsterdam Pink Whitney", "cat": "vodka", "image": "pwamsterdam.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "New Amsterdam Regular", "cat": "vodka", "image": "ramsterdam.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "New Amsterdam Watermelon", "cat": "vodka", "image": "wamsterdam.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Shakers Vodka", "cat": "vodka", "image": "shakers.jpg", "prices": {"750ml": "18.99"}},
        {"brand": "Skyy Vodka", "cat": "vodka", "image": "skyy.jpg", "prices": {"750ml": "16.99"}},
        {"brand": "Smirnoff", "cat": "vodka", "image": "smirnoff.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Svedka", "cat": "vodka", "image": "svedka.jpg", "prices": {"750ml": "15.99", "1.75L": "25.99"}},
        {"brand": "Titos", "cat": "vodka", "image": "titos.jpg", "prices": {"750ml": "21.99"}},

        # ==========================================
        # 3. GIN
        # ==========================================
        {"brand": "Beefeater London Dry", "cat": "gin", "image": "beef.jpg", "prices": {"750ml": "24.99"}},
        {"brand": "Bombay Dry Gin", "cat": "gin", "image": "bombay.jpg", "prices": {"750ml": "24.99"}},
        {"brand": "Bombay Sapphire", "cat": "gin", "image": "sbombay.jpg", "prices": {"750ml": "29.99"}},
        {"brand": "Hendricks Gin", "cat": "gin", "image": "hendricks.jpg", "prices": {"750ml": "38.99"}},
        {"brand": "New Amsterdam London Dry Gin", "cat": "gin", "image": "gamsterdam.jpg", "prices": {"750ml": "15.99"}},
        {"brand": "Tanqueray", "cat": "gin", "image": "tanq.jpg", "prices": {"750ml": "26.99"}},

        # ==========================================
        # 4. TEQUILA
        # ==========================================
        {"brand": "1800", "cat": "tequila", "image": "1800.png", "prices": {"750ml": "42.99"}},
        {"brand": "1800 Coconut", "cat": "tequila", "image": "c1800.jpg", "prices": {"750ml": "42.99"}},
        {"brand": "Espolon Blanco", "cat": "tequila", "image": "espolon.jpg", "prices": {"750ml": "28.99"}},
        {"brand": "Hornitos Plata", "cat": "tequila", "image": "hornitos.jpg", "prices": {"750ml": "29.99"}},
        {"brand": "Patron Anejo", "cat": "tequila", "image": "apat.jpg", "prices": {"750ml": "59.99"}},
        {"brand": "Patron Blanco", "cat": "tequila", "image": "pat.jpg", "prices": {"750ml": "49.99"}},
        {"brand": "Patron Reposado", "cat": "tequila", "image": "rpat.jpg", "prices": {"750ml": "54.99"}},
        {"brand": "Patron Cristalino", "cat": "tequila", "image": "cpat.jpg", "prices": {"750ml": "64.99"}},
        {"brand": "Patron XO Cafe", "cat": "tequila", "image": "xopat.jpg", "prices": {"750ml": "34.99"}},
        {"brand": "Casamigos Blanco", "cat": "tequila", "image": "casa.jpg", "prices": {"750ml": "52.99"}},
        {"brand": "Casamigos Reposado", "cat": "tequila", "image": "rcasa.jpg", "prices": {"750ml": "59.99"}},
        {"brand": "Don Julio Blanco", "cat": "tequila", "image": "dj.jpg", "prices": {"750ml": "56.99"}},
        {"brand": "Don Julio Reposado", "cat": "tequila", "image": "rdj.jpg", "prices": {"750ml": "64.99"}},
        {"brand": "Herradura Silver", "cat": "tequila", "image": "herra.jpg", "prices": {"750ml": "44.99"}},
        {"brand": "Teremana Blanco", "cat": "tequila", "image": "tere.jpg", "prices": {"750ml": "31.99"}},
        {"brand": "Teremana Reposado", "cat": "tequila", "image": "rtere.jpg", "prices": {"750ml": "34.99"}},
        {"brand": "Teremana Anejo", "cat": "tequila", "image": "atere.jpg", "prices": {"750ml": "44.99"}},

        # ==========================================
        # 5. WHISKEY & COGNAC
        # ==========================================
        {"brand": "Buchanan's Deluxe 12", "cat": "whiskey", "image": "buchanan.jpg", "prices": {"750ml": "34.99"}},
        {"brand": "Buchanan's Pineapple", "cat": "whiskey", "image": "pbuchanan.jpg", "prices": {"750ml": "32.99"}},
        {"brand": "Hennessy VS", "cat": "cognac", "image": "henny.jpg", "prices": {"750ml": "45.99"}},
        {"brand": "Hennessy VSOP", "cat": "cognac", "image": "vsophenny.jpg", "prices": {"750ml": "59.99"}},
        {"brand": "Johnnie Walker Black Label", "cat": "whiskey", "image": "bjohnnie.jpg", "prices": {"750ml": "38.99"}},
        {"brand": "Johnnie Walker Red Label", "cat": "whiskey", "image": "rjohnnie.jpg", "prices": {"750ml": "24.99"}},
        {"brand": "Brenne Whisky", "cat": "whiskey", "image": "brenne.jpg", "prices": {"750ml": "59.99"}},
        {"brand": "Bulleit Bourbon", "cat": "whiskey", "image": "bullit.jpg", "prices": {"750ml": "32.99"}},
        {"brand": "Bulleit Rye", "cat": "whiskey", "image": "rbulliet.jpg", "prices": {"750ml": "32.99"}},
        {"brand": "Bulleit 10 Year", "cat": "whiskey", "image": "tenbulliet.jpg", "prices": {"750ml": "45.99"}},
        {"brand": "Dewars White Label", "cat": "whiskey", "image": "dewars.jpg", "prices": {"750ml": "24.99", "1.75L": "42.99"}},
        {"brand": "Evan Williams Regular", "cat": "whiskey", "image": "ew.jpg", "prices": {"750ml": "15.99"}},
        {"brand": "Evan Williams Apple", "cat": "whiskey", "image": "aew.jpg", "prices": {"750ml": "15.99"}},
        {"brand": "Evan Williams Peach", "cat": "whiskey", "image": "pew.jpg", "prices": {"750ml": "15.99"}},
        {"brand": "Fireball Cinnamon", "cat": "whiskey", "image": "fireball.jpg", "prices": {"750ml": "18.99", "1L": "24.99"}},
        {"brand": "Jack Daniel's Regular", "cat": "whiskey", "image": "jack.jpg", "prices": {"750ml": "28.99", "1L": "36.99"}},
        {"brand": "Jack Daniel's Bonded", "cat": "whiskey", "image": "bjack.jpg", "prices": {"750ml": "34.99"}},
        {"brand": "Jack Daniel's Bonded Rye", "cat": "whiskey", "image": "brjack.jpg", "prices": {"750ml": "34.99"}},
        {"brand": "Jack Daniel's Single Barrel", "cat": "whiskey", "image": "sbjack.jpg", "prices": {"750ml": "54.99"}},
        {"brand": "Jack Daniel's Honey", "cat": "whiskey", "image": "hjack.jpg", "prices": {"750ml": "28.99"}},
        {"brand": "Jack Daniel's Fire", "cat": "whiskey", "image": "fjack.jpg", "prices": {"750ml": "28.99"}},
        {"brand": "Jack Daniel's Apple", "cat": "whiskey", "image": "ajack.jpg", "prices": {"750ml": "28.99"}},
        {"brand": "Jameson", "cat": "whiskey", "image": "jameson.jpg", "prices": {"750ml": "32.99"}},
        {"brand": "Jameson Orange", "cat": "whiskey", "image": "ojameson.jpg", "prices": {"750ml": "32.99"}},
        {"brand": "Maker's Mark", "cat": "whiskey", "image": "makers.jpg", "prices": {"750ml": "31.99"}},
        {"brand": "Maker's Mark 46", "cat": "whiskey", "image": "makers46.jpg", "prices": {"750ml": "39.99"}},
        {"brand": "Proper Twelve", "cat": "whiskey", "image": "twelve.jpg", "prices": {"750ml": "27.99", "1.75L": "48.99"}},
        {"brand": "Salignac Cognac", "cat": "cognac", "image": "salignoc.jpg", "prices": {"750ml": "24.99"}},
        {"brand": "Seagrams 7", "cat": "whiskey", "image": "seagrams.jpg", "prices": {"1.75L": "32.99"}},
        {"brand": "Tullamore Dew", "cat": "whiskey", "image": "tullamore.jpg", "prices": {"750ml": "29.99"}},
        {"brand": "Suntory Toki", "cat": "canned", "image": "toki.jpg", "prices": {"750ml": "26.00"}},

        # ==========================================
        # 6. LIQUEURS & CREAMS
        # ==========================================
        {"brand": "Alize", "cat": "liqueur", "image": "alize.jpg", "prices": {"1L": "22.99"}},
        {"brand": "Baileys Churro", "cat": "liqueur", "image": "chbaileys.jpg", "prices": {"750ml": "29.99"}},
        {"brand": "Baileys Coffee", "cat": "liqueur", "image": "cbaileys.jpg", "prices": {"750ml": "29.99"}},
        {"brand": "Baileys Cookies & Cream", "cat": "liqueur", "image": "ccbaileys.jpg", "prices": {"750ml": "29.99"}},
        {"brand": "Baileys Irish Cream", "cat": "liqueur", "image": "baileys.jpg", "prices": {"1.75L": "54.99"}},
        {"brand": "Bradys Irish Cream", "cat": "liqueur", "image": "bradys.jpg", "prices": {"750ml": "14.99", "1L": "19.99", "1.75L": "29.99"}},
        {"brand": "Di Amore Amaretto", "cat": "liqueur", "image": "diamore.jpg", "prices": {"750ml": "15.99"}},
        {"brand": "Du Bouchard Blue Curacao", "cat": "liqueur", "image": "dbbc.jpg", "prices": {"750ml": "11.99"}},
        {"brand": "Fabrizio Limoncello", "cat": "liqueur", "image": "lfabrizio.jpg", "prices": {"750ml": "18.99"}},
        {"brand": "Fragolino", "cat": "liqueur", "image": "frago.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Jagermeister", "cat": "liqueur", "image": "jager.jpg", "prices": {"750ml": "26.99"}},
        {"brand": "Kahlua Dunkin", "cat": "liqueur", "image": "dunkin.jpg", "prices": {"750ml": "24.99"}},
        {"brand": "Llords Amaretto", "cat": "liqueur", "image": "allords.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Llords Creme de Cassis", "cat": "liqueur", "image": "cllords.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Llords Peppermint", "cat": "liqueur", "image": "pllords.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Mr. Boston Anisette", "cat": "liqueur", "image": "aboston.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Sambuca", "cat": "liqueur", "image": "sambvca.jpg", "prices": {"750ml": "24.99", "1L": "32.99"}},

        # ==========================================
        # 7. RUM
        # ==========================================
        {"brand": "Bacardi Gold", "cat": "rum", "image": "gbacardi.jpg", "prices": {"750ml": "20.00"}},
        {"brand": "Bacardi Limon", "cat": "rum", "image": "lbacardi.jpg", "prices": {"750ml": "20.00"}},
        {"brand": "Bacardi White", "cat": "rum", "image": "wbacardi.jpg", "prices": {"750ml": "20.00"}},
        {"brand": "Captain Morgan Chili Lime", "cat": "rum", "image": "clmorgan.jpg", "prices": {"750ml": "20.00"}},
        {"brand": "Captain Morgan Spiced", "cat": "rum", "image": "smorgan.jpg", "prices": {"750ml": "20.00"}},
        {"brand": "Kuya Fusion Rum", "cat": "rum", "image": "kuya.jpg", "prices": {"750ml": "21.99"}},
        {"brand": "Malibu Coconut Rum", "cat": "rum", "image": "malibu.jpg", "prices": {"750ml": "21.99"}},

        # ==========================================
        # 8. CHAMPAGNE & SPARKLING (NEW SECTION)
        # ==========================================
        {"brand": "Cupcake Prosecco", "cat": "champagne", "image": "pcupcake.jpg", "prices": {"750ml": "13.99"}},
        {"brand": "La Marca Prosecco", "cat": "champagne", "image": "plamarca.jpg", "prices": {"750ml": "17.99"}},
        {"brand": "La Marca Rose", "cat": "champagne", "image": "prlamarca.jpg", "prices": {"750ml": "17.99"}},
        {"brand": "Martini & Rossi Asti", "cat": "champagne", "image": "martini.jpg", "prices": {"750ml": "15.99"}},
        {"brand": "Mionetto Prosecco", "cat": "champagne", "image": "pmoinetto.jpg", "prices": {"750ml": "16.99"}},
        {"brand": "Nando Fragolino", "cat": "champagne", "image": "nfrag.jpg", "prices": {"750ml": "12.99"}},
        {"brand": "Nano Mimosa", "cat": "champagne", "image": "mandre.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Ruffino di Moscato", "cat": "champagne", "image": "mruffino.jpg", "prices": {"750ml": "14.99"}},
        {"brand": "Santa Marina Prosecco", "cat": "champagne", "image": "pmarina.jpg", "prices": {"750ml": "12.99"}},

        # ==========================================
        # 9. CANNED COCKTAILS (From your photos)
        # ==========================================
        {"brand": "Buzzball Cocktails", "cat": "mixed", "image": "buzz.jpg", "prices": {"Individual": "4.25", "Box": "16.00"}},
        {"brand": "Gorae Soju", "cat": "mixed", "image": "soju.jpg", "prices": {"Individual": "5.40", "Box": "32.50"}},
        {"brand": "High Noon Sun Sips", "cat": "mixed", "image": "highnoon.jpg", "prices": {"Individual": "3.50", "Box": "28.00"}},
        {"brand": "Jack & Coke", "cat": "mixed", "image": "cokejack.jpg", "prices": {"Individual": "3.50", "Box": "14.00"}},
    ]
    return render_template('index.html', items=inventory)

if __name__ == '__main__':

    app.run(host='0.0.0.0', port=5000)



