/* Sveit site: the five worlds of the hero floor.
   Each world is five stations for the five phases (intake, prepare and agent, scan, finish, pull request)
   plus the troop that works them. Station drawings keep the same part names in every world, so one
   state machine runs them all: .scr lines animate while the work screen is on, .beam sweeps during scan,
   .led and .gauge light during finish, .lamp and .door are the pull request gate. */
window.SVEIT_WORLDS = (function () {
  'use strict';

  var workshop = [
    '<path class="ln" d="M32 74V36M20 74H44M6 30L58 22L60 32L8 40Z"></path><rect class="pg" x="24" y="23" width="15" height="9"></rect>',
    '<path class="ln" d="M2 46H168M2 46V40H168V46M14 46V84M156 46V84M14 70H156M85 36V40M72 40H98"></path><rect class="mon" x="58" y="4" width="54" height="32"></rect><rect class="scr scr1" x="64" y="10" width="34" height="2.5"></rect><rect class="scr scr2" x="64" y="16" width="26" height="2.5"></rect><rect class="scr scr3" x="64" y="22" width="38" height="2.5"></rect><rect class="scr scr4" x="64" y="28" width="18" height="2.5"></rect><path class="ln" d="M128 40V30H148V40"></path>',
    '<path class="ln" d="M6 120V6H64V120M2 6H68"></path><rect class="sensor" x="30" y="0" width="10" height="4"></rect><rect class="beam" x="9" y="10" width="52" height="1.5"></rect>',
    '<path class="ln" d="M40 12V4H56V12"></path><rect class="cab" x="8" y="12" width="80" height="80"></rect><path class="ln" d="M8 32H88M20 46H76M20 54H76M20 62H76M20 70H60"></path><rect class="led led1" x="18" y="19" width="6" height="6"></rect><rect class="led led2" x="30" y="19" width="6" height="6"></rect><rect class="led led3" x="42" y="19" width="6" height="6"></rect><rect class="gauge" x="60" y="20" width="20" height="4"></rect>',
    '<rect class="lamp" x="31" y="0" width="14" height="7"></rect><path class="ln" d="M4 134V14H72V134"></path><rect class="door" x="8" y="18" width="60" height="116"></rect><rect class="knob" x="58" y="76" width="4" height="4"></rect>'
  ];

  var forest = [
    // a stump with the scroll on it, a mushroom at its foot
    '<path class="ln" d="M14 74V44Q14 36 22 36H42Q50 36 50 44V74M20 46V74M44 46V74"></path><ellipse class="pg" cx="32" cy="36" rx="18" ry="6"></ellipse><rect class="pg" x="24" y="25" width="16" height="8" rx="4"></rect><path class="ln" d="M28 25V33M36 25V33"></path><rect class="ln2" x="8" y="66" width="3" height="8"></rect><path class="ac" d="M2 66Q9.5 56 17 66Z"></path>',
    // a root bench under a mushroom lamp, a crystal for the screen
    '<rect class="pg" x="14" y="46" width="142" height="14" rx="7"></rect><path class="ln" d="M24 60V84M146 60V84M24 70Q14 76 10 84M146 70Q156 76 160 84M40 50Q60 54 80 50Q100 54 120 50"></path><rect class="ln2" x="30" y="22" width="4" height="24"></rect><path class="ac" d="M14 26Q32 2 50 26Z"></path><path class="mon" d="M74 6H98L108 21L98 36H74L64 21Z"></path><rect class="scr scr1" x="70" y="12" width="30" height="2.5"></rect><rect class="scr scr2" x="70" y="18" width="22" height="2.5"></rect><rect class="scr scr3" x="70" y="24" width="34" height="2.5"></rect><rect class="scr scr4" x="70" y="30" width="16" height="2.5"></rect><path class="ln" d="M86 36V46"></path>',
    // a hollow log stood on end: the scan tunnel, a glow-worm at the top
    '<path class="ln" d="M6 120V32Q6 6 35 6Q64 6 64 32V120M14 120V36Q14 16 35 16Q56 16 56 36V120M8 60Q4 70 8 80M62 50Q66 62 62 74"></path><rect class="sensor" x="31" y="9" width="8" height="4" rx="2"></rect><rect class="beam" x="16" y="18" width="38" height="1.5"></rect>',
    // a forge: the cauldron over embers on a stone hearth
    '<path class="ln" d="M48 2V26M28 2H68"></path><path class="mon" d="M24 28Q24 56 48 56Q72 56 72 28Z"></path><rect class="ln2" x="20" y="25" width="56" height="4" rx="2"></rect><rect class="gauge" x="38" y="36" width="20" height="4"></rect><rect class="cab" x="8" y="58" width="80" height="34"></rect><path class="ln" d="M8 70H88M8 82H88M32 58V70M62 58V70M20 70V82M46 70V82M72 70V82"></path><rect class="led led1" x="34" y="61" width="6" height="6"></rect><rect class="led led2" x="45" y="61" width="6" height="6"></rect><rect class="led led3" x="56" y="61" width="6" height="6"></rect>',
    // a cave mouth with a plank gate and a lantern
    '<path class="ln" d="M2 134V40Q2 8 38 8Q74 8 74 40V134M12 134V44Q12 20 38 20Q64 20 64 44V134"></path><path class="ln" d="M38 20V30"></path><rect class="lamp" x="31" y="30" width="14" height="10" rx="2"></rect><g class="door"><rect x="14" y="46" width="48" height="88"></rect><path class="ln" d="M26 46V134M38 46V134M50 46V134M14 70H62M14 110H62"></path></g><rect class="knob" x="54" y="90" width="4" height="4"></rect>'
  ];

  var line = [
    // a terminal pylon
    '<rect class="cab" x="26" y="26" width="12" height="42"></rect><rect class="cab" x="12" y="68" width="40" height="6"></rect><rect class="mon" x="12" y="2" width="40" height="26" rx="1"></rect><rect class="pline" x="18" y="8" width="24" height="2"></rect><rect class="pline" x="18" y="13" width="16" height="2"></rect><rect class="pline" x="18" y="18" width="28" height="2"></rect><rect class="ac" x="46" y="6" width="3" height="3"></rect>',
    // a conveyor with rollers, a robotic arm over it, the status screen on a stand
    '<rect class="cab" x="2" y="56" width="166" height="12" rx="6"></rect><circle class="roller" cx="14" cy="62" r="4"></circle><circle class="roller" cx="50" cy="62" r="4"></circle><circle class="roller" cx="86" cy="62" r="4"></circle><circle class="roller" cx="122" cy="62" r="4"></circle><circle class="roller" cx="158" cy="62" r="4"></circle><path class="ln" d="M22 68V84M148 68V84"></path><rect class="cab" x="112" y="40" width="22" height="16"></rect><path class="ln" d="M123 40V16H96V30M90 30H102M90 30V38M102 30V38"></path><rect class="ac" x="119" y="44" width="8" height="3"></rect><rect class="mon" x="20" y="16" width="48" height="30" rx="1"></rect><rect class="scr scr1" x="26" y="22" width="30" height="2.5"></rect><rect class="scr scr2" x="26" y="28" width="22" height="2.5"></rect><rect class="scr scr3" x="26" y="34" width="34" height="2.5"></rect><rect class="scr scr4" x="26" y="40" width="14" height="2.5"></rect><path class="ln" d="M44 46V56"></path>',
    // a laser gate between two pylons
    '<rect class="cab" x="6" y="10" width="10" height="110"></rect><rect class="cab" x="54" y="10" width="10" height="110"></rect><path class="ln" d="M6 10H64"></path><rect class="sensor" x="31" y="3" width="8" height="6"></rect><rect class="beam" x="16" y="18" width="38" height="1.5"></rect><path class="ln" d="M8 40H14M8 70H14M8 100H14M56 40H62M56 70H62M56 100H62"></path>',
    // a server rack
    '<rect class="cab" x="12" y="4" width="72" height="88"></rect><path class="ln" d="M12 22H84M12 40H84M12 58H84M12 76H84"></path><rect class="led led1" x="18" y="10" width="6" height="6"></rect><rect class="led led2" x="18" y="28" width="6" height="6"></rect><rect class="led led3" x="18" y="46" width="6" height="6"></rect><rect class="gauge" x="50" y="11" width="26" height="4"></rect><rect class="gauge" x="50" y="29" width="26" height="4"></rect><rect class="ac" x="18" y="64" width="6" height="6"></rect><path class="ln" d="M30 13H44M30 31H44M30 49H44M30 67H44M30 82H70"></path>',
    // an airlock with a porthole
    '<rect class="lamp" x="31" y="0" width="14" height="7"></rect><path class="ln" d="M4 134V22Q4 12 14 12H62Q72 12 72 22V134"></path><g class="door"><rect x="10" y="18" width="56" height="116" rx="8"></rect><circle class="ln" cx="38" cy="58" r="10"></circle><path class="ln" d="M20 100H56"></path></g><rect class="knob" x="56" y="78" width="4" height="8"></rect>'
  ];

  var house = [
    // a basket with the post in it
    '<path class="ln" d="M18 44Q32 16 46 44"></path><rect class="pg" x="22" y="30" width="20" height="14"></rect><path class="ln" d="M22 30L32 38L42 30"></path><path class="cab" d="M10 44H54L50 74H14Z"></path><path class="ln" d="M14 54H50M16 64H48M24 44L23 74M32 44V74M40 44L41 74"></path>',
    // a sofa with a laptop on the seat
    '<rect class="pg" x="8" y="24" width="154" height="18" rx="6"></rect><rect class="pg" x="8" y="40" width="154" height="30" rx="6"></rect><rect class="pg" x="2" y="36" width="14" height="34" rx="6"></rect><rect class="pg" x="154" y="36" width="14" height="34" rx="6"></rect><path class="ln" d="M22 70V84M148 70V84M8 54H162"></path><rect class="ac" x="34" y="44" width="54" height="10" rx="3"></rect><rect class="cab" x="108" y="38" width="40" height="3"></rect><rect class="mon" x="110" y="12" width="36" height="26" rx="1"></rect><rect class="scr scr1" x="115" y="17" width="24" height="2.5"></rect><rect class="scr scr2" x="115" y="22" width="16" height="2.5"></rect><rect class="scr scr3" x="115" y="27" width="26" height="2.5"></rect><rect class="scr scr4" x="115" y="32" width="12" height="2.5"></rect>',
    // a wall with a window and the cat flap; the flap is the beam, it swings during scan
    '<path class="ln" d="M2 120V18H68V120M8 18V12H62V18"></path><rect class="pg" x="22" y="28" width="26" height="20"></rect><path class="ln" d="M35 28V48M22 38H48"></path><rect class="sensor" x="31" y="54" width="8" height="6"></rect><rect class="ln" x="14" y="62" width="42" height="58" rx="2"></rect><rect class="beam" x="18" y="66" width="34" height="50" rx="2"></rect>',
    // a scratching tower with hanging toys
    '<rect class="cab" x="42" y="22" width="12" height="70"></rect><rect class="pg" x="18" y="16" width="60" height="6" rx="2"></rect><rect class="pg" x="26" y="52" width="44" height="6" rx="2"></rect><rect class="cab" x="12" y="86" width="72" height="6"></rect><path class="ln" d="M28 22V34M70 22V38M60 58V66"></path><rect class="led led1" x="25" y="34" width="6" height="6"></rect><rect class="led led2" x="67" y="38" width="6" height="6"></rect><rect class="led led3" x="57" y="66" width="6" height="6"></rect><rect class="gauge" x="40" y="64" width="16" height="4"></rect><rect class="ac" x="40" y="74" width="16" height="4"></rect>',
    // a front door with the porch lamp, a cat flap in the door, a mat
    '<rect class="lamp" x="31" y="0" width="14" height="7"></rect><path class="ln" d="M4 134V14H72V134"></path><g class="door"><rect x="8" y="18" width="60" height="116"></rect><path class="ln" d="M16 26H60V60H16Z M26 104H50V128H26Z"></path></g><rect class="knob" x="58" y="76" width="4" height="4"></rect><rect class="ac" x="18" y="130" width="40" height="4"></rect>'
  ];

  var roost = [
    // a signpost with the note pinned to it
    '<rect class="cab" x="30" y="8" width="4" height="66"></rect><path class="pg" d="M8 18H44L50 23L44 28H8Z"></path><path class="pg" d="M56 34H20L14 39L20 44H56Z"></path><rect class="pg" x="22" y="52" width="14" height="10"></rect><path class="ln" d="M25 55H33M25 58H31"></path>',
    // a nest on a branch, a slate leaning against the branch for the screen
    '<path class="ln2" d="M2 72Q60 60 110 62Q150 64 168 56V60Q150 68 110 66Q60 64 2 76Z"></path><path class="ln" d="M40 65L30 54M92 62L98 48M24 74V84M146 62V84"></path><path class="cab" d="M56 42Q56 66 86 66Q116 66 116 42Z"></path><path class="ln" d="M62 48L72 58M110 48L100 58M80 46L86 60M66 44L92 52"></path><g transform="rotate(-8 143 41)"><rect class="mon" x="126" y="28" width="34" height="26" rx="1"></rect><rect class="scr scr1" x="130" y="33" width="22" height="2.5"></rect><rect class="scr scr2" x="130" y="38" width="16" height="2.5"></rect><rect class="scr scr3" x="130" y="43" width="24" height="2.5"></rect><rect class="scr scr4" x="130" y="48" width="12" height="2.5"></rect></g>',
    // a hollow tree: the scan runs inside the hole
    '<path class="ln" d="M6 120Q4 60 12 8Q35 0 58 8Q66 60 64 120M18 100Q10 90 14 70"></path><path class="mon" d="M20 42Q20 20 35 20Q50 20 50 42Q50 70 35 72Q20 70 20 42Z"></path><rect class="sensor" x="31" y="25" width="8" height="4"></rect><rect class="beam" x="23" y="34" width="24" height="1.5"></rect><path class="ln" d="M58 30L68 22M60 44L70 40"></path>',
    // a lighthouse on rocks
    '<path class="cab" d="M34 92L38 22H58L62 92Z"></path><path class="ln" d="M37 44H59M36 66H60"></path><rect class="mon" x="34" y="10" width="28" height="12"></rect><path class="ln" d="M32 10L48 2L64 10Z"></path><rect class="led led1" x="38" y="13" width="6" height="6"></rect><rect class="led led2" x="46" y="13" width="6" height="6"></rect><rect class="led led3" x="54" y="13" width="6" height="6"></rect><rect class="gauge" x="40" y="24" width="16" height="4"></rect><path class="ln" d="M4 92Q12 80 24 86Q30 78 40 88M56 90Q66 78 76 86Q84 80 92 92"></path><rect class="ac" x="45" y="4" width="6" height="3"></rect>',
    // a dovecote on a post with a round hatch and a lantern at the ridge
    '<rect class="cab" x="34" y="70" width="8" height="64"></rect><rect class="pg" x="10" y="26" width="56" height="44"></rect><path class="ln" d="M6 26L38 8L70 26Z"></path><rect class="lamp" x="31" y="11" width="14" height="7"></rect><g class="door"><rect x="26" y="38" width="24" height="26" rx="12"></rect></g><path class="ln" d="M18 70H58"></path><rect class="ac" x="14" y="64" width="48" height="3"></rect>'
  ];

  return {
    order: ['workshop', 'forest', 'line', 'house', 'roost'],
    worlds: {
      workshop: { troop: 'people', stations: workshop },
      forest: { troop: 'gnomes', stations: forest },
      line: { troop: 'robots', stations: line },
      house: { troop: 'cats', stations: house },
      roost: { troop: 'birds', stations: roost }
    }
  };
})();
