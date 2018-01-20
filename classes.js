module.exports = {
	card: class Card {
		constructor(name, type, attack, fortitude, rarity) {
			this.name = name;
			this.type = type;
			this.attack = attack;
			this.fortitude = fortitude;
			this.rarity = rarity;

			this.toString = function() { return this.name + ":" + this.type + ":" + this.attack + ":" + this.fortitude + ":" + this.rarity};
		}
	},

	deck: class Deck {
		constructor(cards) {
			this.stash = cards;
			this.hand = null;
			this.play = null;
		}
	},

	board: class Board {
		constructor(decks) {
			this.decks = decks;
		}
	},

	type: ['water', 'earth', 'fire', 'air'],
	rarity: ['common', 'uncommon', 'rare', 'ultra-rare', 'legendary', 'god tier', 'singleton']


};