class Weapon {
  constructor(name, attack, durability, range) {
    this.name = name;
    this.attack = attack;
    this.durability = durability;
    this.initDurability = durability;
    this.range = range;
  }

  takeDamage(damage) {
    this.durability = Math.max(0, this.durability - damage);
  }

  getDamage() {
    if (this.durability <= 0) {
      return 0;
    }

    return this.durability >= this.initDurability * 0.3 ? this.attack : this.attack / 2;
  }

  isBroken() {
    return this.durability === 0;
  }
}

class Arm extends Weapon {
  constructor() { super('Рука', 1, Infinity, 1); }
}
class Bow extends Weapon {
  constructor() { super('Лук', 10, 200, 3); }
}
class Sword extends Weapon {
  constructor() { super('Меч', 25, 500, 1); }
}
class Knife extends Weapon {
  constructor() { super('Нож', 5, 300, 1); }
}
class Staff extends Weapon {
  constructor() { super('Посох', 8, 300, 2); }
}

class LongBow extends Bow {
  constructor() {
    super();
    this.name = 'Длинный лук';
    this.attack = 15;
    this.range = 4;
  }
}
class Axe extends Sword {
  constructor() {
    super();
    this.name = 'Секира';
    this.attack = 27;
    this.durability = 800;
    this.initDurability = 800;
  }
}
class StormStaff extends Staff {
  constructor() {
    super();
    this.name = 'Посох Бури';
    this.attack = 10;
    this.range = 3;
  }
}

class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
    this.weapons = [Arm, Knife, Arm];
  }

  log(message) {
    return `${this.description} ${this.name}: ${message}`;
  }

  getLuck() {
    return (Math.random() * 100 + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    return (this.attack + this.weapon.getDamage()) * this.getLuck() / distance;
  }

  takeDamage(damage) {
    this.life = Math.max(0, this.life - damage);
  }

  isDead() {
    return this.life === 0;
  }

  moveLeft(distance) {
    this.position -= Math.min(this.speed, Math.abs(distance));
  }

  moveRight(distance) {
    this.position += Math.min(this.speed, Math.abs(distance));
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(distance);
      return;
    }
    this.moveRight(distance);
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      return;
    }

    if (this.dodged()) {
      return;
    }

    this.takeDamage(damage);
  }

  checkWeapon() {
    if (!this.weapon.isBroken()) {
      return;
    }

    const weaponIndex = this.weapons.findIndex((weaponClass) => this.weapon instanceof weaponClass);
    const nextWeaponClass = this.weapons[weaponIndex + 1] || Arm;
    this.weapon = new nextWeaponClass();
  }

  tryAttack(enemy) {
    const distance = Math.abs(this.position - enemy.position);

    if (distance > this.weapon.range) {
      return;
    }

    const luck = this.getLuck();
    const damage = (this.attack + this.weapon.getDamage()) * luck / (distance || 1);

    this.weapon.takeDamage(10 * luck);
    this.checkWeapon();

    if (distance === 0) {
      enemy.moveRight(1);
      enemy.takeAttack(damage * 2);
      return;
    }

    enemy.takeAttack(damage);
  }

  chooseEnemy(players) {
    const enemies = players.filter((player) => player !== this && !player.isDead());
    if (enemies.length === 0) {
      return null;
    }

    return enemies.reduce((lowest, current) => (current.life < lowest.life ? current : lowest));
  }

  moveToEnemy(enemy) {
    if (!enemy) {
      return;
    }

    const shift = enemy.position - this.position;
    this.move(shift);
  }

  turn(players) {
    if (this.isDead()) {
      return;
    }

    const enemy = this.chooseEnemy(players);
    if (!enemy) {
      return;
    }

    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
  }
}

class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 120;
    this.speed = 2;
    this.description = 'Воин';
    this.weapon = new Sword();
    this.weapons = [Sword, Knife, Arm];
  }

  takeDamage(damage) {
    const lowLife = this.life < 60;
    if (lowLife && this.magic > 0 && this.getLuck() > 0.8) {
      this.magic = Math.max(0, this.magic - damage);
      return;
    }

    super.takeDamage(damage);
  }
}

class Archer extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 35;
    this.attack = 5;
    this.agility = 10;
    this.description = 'Лучник';
    this.weapon = new Bow();
    this.weapons = [Bow, Knife, Arm];
  }

  getDamage(distance) {
    if (distance > this.weapon.range) {
      return 0;
    }

    return (this.attack + this.weapon.getDamage()) * this.getLuck() * distance / this.weapon.range;
  }
}

class Mage extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 70;
    this.magic = 100;
    this.attack = 5;
    this.agility = 8;
    this.description = 'Маг';
    this.weapon = new Staff();
    this.weapons = [Staff, Knife, Arm];
  }

  takeDamage(damage) {
    if (this.magic > 50) {
      this.magic = Math.max(0, this.magic - 12);
      super.takeDamage(damage / 2);
      return;
    }

    super.takeDamage(damage);
  }
}

class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';
    this.weapon = new Axe();
    this.weapons = [Axe, Knife, Arm];
    this.hitCounter = 0;
  }

  takeDamage(damage) {
    this.hitCounter += 1;
    if (this.hitCounter % 6 === 0 && this.getLuck() > 0.5) {
      super.takeDamage(damage / 2);
      return;
    }

    super.takeDamage(damage);
  }
}

class Crossbowman extends Archer {
  constructor(position, name) {
    super(position, name);
    this.life = 85;
    this.attack = 8;
    this.agility = 20;
    this.luck = 15;
    this.description = 'Арбалетчик';
    this.weapon = new LongBow();
    this.weapons = [LongBow, Knife, Arm];
  }
}

class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 120;
    this.attack = 6;
    this.luck = 12;
    this.description = 'Демиург';
    this.weapon = new StormStaff();
    this.weapons = [StormStaff, Knife, Arm];
  }

  getDamage(distance) {
    const damage = super.getDamage(distance);
    return this.magic > 0 && this.getLuck() > 0.6 ? damage * 1.5 : damage;
  }
}

function play(players) {
  const alivePlayers = players.slice();

  while (alivePlayers.filter((player) => !player.isDead()).length > 1) {
    alivePlayers.forEach((player) => player.turn(alivePlayers));
  }

  return alivePlayers.find((player) => !player.isDead()) || null;
}

module.exports = {
  Weapon,
  Arm,
  Bow,
  Sword,
  Knife,
  Staff,
  LongBow,
  Axe,
  StormStaff,
  Player,
  Warrior,
  Archer,
  Mage,
  Dwarf,
  Crossbowman,
  Demiurge,
  play,
};
