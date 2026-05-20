const {
  Weapon, Arm, Bow, Sword, Knife, Staff, LongBow, Axe, StormStaff,
  Player, Warrior, Archer, Mage, Dwarf, Crossbowman, Demiurge, play,
} = require('./rpg');

describe('Weapons', () => {
  test('weapon damage lifecycle', () => {
    const bow = new Bow();
    expect(bow.getDamage()).toBe(10);
    bow.takeDamage(150);
    expect(bow.getDamage()).toBe(5);
    bow.takeDamage(1000);
    expect(bow.getDamage()).toBe(0);
    expect(bow.isBroken()).toBe(true);
  });

  test('special weapons inherit stats', () => {
    expect(new Arm().durability).toBe(Infinity);
    expect(new LongBow().range).toBe(4);
    expect(new Axe().durability).toBe(800);
    expect(new StormStaff().attack).toBe(10);
  });
});

describe('Players core', () => {
  beforeEach(() => jest.spyOn(Math, 'random').mockReturnValue(0.5));
  afterEach(() => jest.restoreAllMocks());

  test('base player movement and damage', () => {
    const p = new Player(5, 'Test');
    p.moveLeft(10);
    expect(p.position).toBe(4);
    p.moveRight(2);
    expect(p.position).toBe(5);
    p.takeDamage(200);
    expect(p.life).toBe(0);
    expect(p.isDead()).toBe(true);
  });

  test('checkWeapon fallback', () => {
    const w = new Warrior(0, 'W');
    w.weapon.takeDamage(10000);
    w.checkWeapon();
    expect(w.weapon).toBeInstanceOf(Knife);
    w.weapon.takeDamage(10000);
    w.checkWeapon();
    expect(w.weapon).toBeInstanceOf(Arm);
  });

  test('takeAttack branches and tryAttack', () => {
    const attacker = new Warrior(0, 'A');
    const target = new Archer(1, 'T');
    jest.spyOn(target, 'isAttackBlocked').mockReturnValue(false);
    jest.spyOn(target, 'dodged').mockReturnValue(false);
    const lifeBefore = target.life;
    attacker.tryAttack(target);
    expect(target.life).toBeLessThan(lifeBefore);

    const defender = new Warrior(2, 'D');
    jest.spyOn(defender, 'isAttackBlocked').mockReturnValue(true);
    const durabilityBefore = defender.weapon.durability;
    defender.takeAttack(10);
    expect(defender.weapon.durability).toBeLessThan(durabilityBefore);
  });
});

describe('Class specifics and battle', () => {
  afterEach(() => jest.restoreAllMocks());

  test('warrior and mage custom damage intake', () => {
    const warrior = new Warrior(0, 'W');
    warrior.life = 50;
    jest.spyOn(warrior, 'getLuck').mockReturnValue(0.9);
    warrior.takeDamage(10);
    expect(warrior.magic).toBe(10);

    const mage = new Mage(0, 'M');
    mage.takeDamage(20);
    expect(mage.life).toBe(60);
    expect(mage.magic).toBe(88);
  });

  test('dwarf and demiurge specials', () => {
    const dwarf = new Dwarf(0, 'D');
    jest.spyOn(dwarf, 'getLuck').mockReturnValue(0.9);
    for (let i = 0; i < 5; i += 1) dwarf.takeDamage(10);
    const before = dwarf.life;
    dwarf.takeDamage(10);
    expect(before - dwarf.life).toBe(5);

    const demiurge = new Demiurge(0, 'DE');
    jest.spyOn(demiurge, 'getLuck').mockReturnValue(0.7);
    expect(demiurge.getDamage(1)).toBeGreaterThan(0);
  });

  test('chooseEnemy moveToEnemy turn and play', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const p1 = new Warrior(0, 'W1');
    const p2 = new Archer(4, 'A1');
    const p3 = new Crossbowman(8, 'C1');
    p2.life = 10;
    expect(p1.chooseEnemy([p1, p2, p3])).toBe(p2);
    p1.moveToEnemy(p2);
    expect(p1.position).toBe(2);
    p1.turn([p1, p2, p3]);

    const winner = play([new Warrior(0, 'W'), new Archer(1, 'A')]);
    expect(winner).toBeTruthy();
    expect(winner.isDead()).toBe(false);
  });
});
