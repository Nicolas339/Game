from flask import Flask
from game_crawler import GameCrawler

app = Flask(__name__)

@app.route('/get_game_offers')
def get_game_offers():
    url = 'https://www.instantgaming.com/'
    crawler = GameCrawler(url)
    crawler.crawl()
    return jsonify(crawler.game_offers)

if __name__ == '__main__':
    app.run(debug=True)