module.exports = {
	card: class {
		constructor(name, type, attack, fortitude, rarity) {
			this.name = name;
			this.type = type;
			this.attack = attack;
			this.fortitude = fortitude;
			this.rarity = rarity;

			this.toString = function() { 
				return this.name + ":" + this.type + ":" + this.attack + ":" + this.fortitude + ":" + this.rarity + "<br>";
			};
		}
	},

	deck: class {
		constructor(cards) {
			this.stash = cards;
			this.hand = null;
			this.play = null;

			this.toString = function() {
				var str = "";
				for(var i = 0; i < stash.length; i++) {
					str += stash[i].toString();
				}
				return str;
			};
		}
	},

	board: class {
		constructor(decks) {
			this.decks = decks;

			this.toString = function() {
				var str = "";
				str += "DECK 1<br>" + decks.deck1.toString() + "<br>";
				str += "DECK 2<br>" + decks.deck2.toString() + "<br>";
				return str;
			}
		}
	},

	type: ['water', 'earth', 'fire', 'air'],
	rarity: ['common', 'uncommon', 'rare', 'ultra-rare', 'legendary', 'god tier', 'singleton']
};