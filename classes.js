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

			this.copy = function() {
				return new this.constructor(this.id+1, this.name, this.type, this.attack, this.fortitude, this.rarity);
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

			this.drawCard = function() {
				this.hand = this.hand.concat(this.stash.splice(Math.random() * this.stash.length, 1));
			};

			this.playCard = function(card) {
				// Play the card
				if(this.play.length < 4) {
					for(var i = this.hand.length - 1; i >= 0; i--) {
						if(this.hand[i].id == card.id) {
							this.play = this.play.concat(this.hand.splice(i, 1));
						}
					}
					this.drawCard();
				}
			};

			this.defendCard = function(attacker, defender) {
				for(var i = 0; i < this.play.length; i++) {
					if(this.play[i].id == defender.id) {
						this.play[i].fortitude -= attacker.attack;

						// Card must be discarded
						if(this.play[i].fortitude <= 0) {
							this.play.splice(i, 1);
						}
					}
				}
			};

			// Fill the users hand for the start of the game
			for(var i = 0; i < 4; i++) {
				this.drawCard();
			}
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

			this.fortFall = function() {
				for(var i = 0; i < deck1.play.length; i++) {
					deck1.play[i].fortitude--;
					if(deck1.play[i].fortitude <= 0) {
						deck1.play.splice(i, 1);
					}
				}

				for(var i = 0; i < deck2.play.length; i++) {
					deck2.play[i].fortitude--;
					if(deck2.play[i].fortitude <= 0) {
						deck2.play.splice(i, 1);
					}
				}
			};
		}
	},

	clientWorld: class {
		constructor(board, p1, winner, myturn) {
			this.myHand = p1 ? board.deck1.hand : board.deck2.hand;
			this.myPlay = p1 ? board.deck1.play : board.deck2.play;
			this.enemyPlay = p1 ? board.deck2.play : board.deck1.play;
			this.myStashSize = p1 ? board.deck1.stash.length : board.deck2.stash.length;
			this.enemyStashSize = p1 ? board.deck2.stash.length : board.deck1.stash.length;
			this.winner = winner;
			this.myturn = myturn;
		}
	},

	type: ['water', 'earth', 'fire', 'air'],
	rarity: ['common', 'uncommon', 'rare', 'ultra-rare', 'legendary', 'god tier', 'singleton']
};