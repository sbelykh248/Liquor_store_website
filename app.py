from flask import Flask, render_template
from flask_talisman import Talisman

app = Flask(__name__)

# This line forces the site to use HTTPS (the Padlock)
Talisman(app, content_security_policy=None)

@app.route('/')
def home():
    # This is your actual inventory data
    wine_list = [
        {"brand": "Santa Marina", "type": "Pinot Grigio", "price": "$12.99"},
        {"brand": "Josh Cellars", "type": "Cabernet Sauvignon", "price": "$15.99"},
        {"brand": "Robert Mondavi", "type": "Chardonnay", "price": "$14.50"}
    ]
    return render_template('index.html', wines=wine_list)

if __name__ == '__main__':
    app.run(debug=True)