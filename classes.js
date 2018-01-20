module.exports = {
	card: class {
		constructor(id, name, type, attack, fortitude, rarity) {
			this.id = id;
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
			this.hand = [];
			this.play = [];

			this.toString = function() {
				var str = "<b>Stash:</b><br>";
				for(var i = 0; i < this.stash.length; i++) {
					str += this.stash[i].toString();
				}

				str += '<br><b>Hand:</b><br>';
				for(var i = 0; i < this.hand.length; i++) {
					str += this.hand[i].toString();
				}

				str += '<br><b>Play:</b><br>';
				for(var i = 0; i < this.play.length; i++) {
					str += this.hand[i].toString();
				}
				return str;
			};
		}
	},

	board: class {
		constructor(deck1, deck2) {
			this.deck1 = deck1;
			this.deck2 = deck2;			

			this.toString = function() {
				var str = "";
				str += "DECK 1<br>" + deck1.toString() + "<br>";
				str += "DECK 2<br>" + deck2.toString() + "<br>";
				return str;
			}
		}
	},

	type: ['water', 'earth', 'fire', 'air'],
	rarity: ['common', 'uncommon', 'rare', 'ultra-rare', 'legendary', 'god tier', 'singleton']
};