require("../../scenario/dates");

const PrisonsStoryBaseDate = [5, 8, 22];
const getDate = cyclesDelta =>
  scenarioDates.formatAerianDate(
    PrisonsStoryBaseDate[0],
    PrisonsStoryBaseDate[1],
    PrisonsStoryBaseDate[2] + cyclesDelta
  );

const htmlRich = str => str.replace(/\n/g, "").replace(/\s\s\s\s/g, "");
const journalBase = (page, date, text) => ({
  name: `Journal note`,
  language: LANGUAGES.AERIAN,
  text: `You found what looks to be a journal page. It reads: <br/>§<div class="left">${getDate(
    date
  )}<br/><br/>${text}</div>§`
});
const guardEastJournalPage = (page, date, text) => ({
  ...journalBase(page, date, text),
  icon: `/${ICONS_PATH}/notes/book_17_b.png`
});
const guardWestJournalPage = (page, date, text) => ({
  ...journalBase(page, date, text),
  icon: `/${ICONS_PATH}/notes/book_15_b.png`
});
const TatteredJournalPage = (page, date, text) => ({
  ...journalBase(page, date, text),
  icon: `/${ICONS_PATH}/notes/b_m_01_b_recolor.png`
});
const LeatherBoundJournalPage = (page, date, text) => ({
  ...journalBase(page, date, text),
  icon: `/${ICONS_PATH}/notes/book_01_b.png`
});

global.DUNGEON_NOTES = {
  DC_A1: LeatherBoundJournalPage(
    1,
    -90,
    `This is my second chapter of this apprenticeship and I don't feel like I've learned anything. My cycles consist mostly of different chores, like cleaning, cooking or watering plants. I take care of all these plants and I don't even know what their bloody names are! Sometimes I worry that I accidentally ended up on housekeeping apprenticeship, if such a thing exists.`
  ),
  DC_A2: LeatherBoundJournalPage(
    2,
    -80,
    `All my lessons seem to consist of never ending monologues by the old master about energy and how it flows through the world and manifests in living things and how alchemy is a noble art of harnessing and enhancing that energy. I find it absurd how the master constantly chuckles, like every second thing they say is highly amusing. I can't wait for this bloody apprenticeship to be over!`
  ),
  DC_A3: LeatherBoundJournalPage(
    3,
    -70,
    `Of all the mundane things I have been asked, catching and butchering rats is probably the most bizzare. How can this be relevant to my alchemical studies? The master assures me it is necessary, but I never see them butchering a bloody rat!`
  ),
  DC_A4: LeatherBoundJournalPage(
    4,
    -34,
    `Something unexpected happened today. I have received a letter and the contents are somewhat uneasing. I must consider the proposal put before me, at least that means I'd get something from this apprenticeship. I'd be well off actually.<br/>
But why would anyone care about this old fool? And am I really considering doing it? I must be careful.`
  ),
  DC_A5: LeatherBoundJournalPage(
    5,
    -30,
    `I had enough, I can't stand this any longer. I have the endurance potions ready, I'm sure the old master will enjoy tonight's drinks so much more. Once asleep, I need to finish this, get the proof and I am out of here. This couldn't be any easier. I just hope the powers to be will honour their promise, I deserve this payment for all that I suffered in this bloody place.`
  ),
  D2_V1: TatteredJournalPage(
    1,
    -10,
    `I finally found a proper shelter. Looks to be an abandoned prison. It's decrepit, but I supposed it must do. It was a huge mistake to agree to this bloody contract. I don't know what I was thinking - I knew they were powerful! I stood no chance! I was a fool.`
  ),
  D2_V2: TatteredJournalPage(
    2,
    -6,
    `How long will I need to suffer in this bloody hole?! A chapter? Two?<br/> 
Maybe I could settle in one of the smaller towns, out of way, out of mind? But what if they know, what if they recognize me? I can't take the risk.`
  ),
  D1_J1: guardEastJournalPage(
    1,
    0,
    `It's been a half a dozen cycles since I arrived in this decrepit place. Trueport wasn't treating me that well, but this is something else. I wonder how many chapters it's been since anyone was stationed here.<br/>
We've been working hard to clean this mess. I still have hope we can turn this place around. We must. After all there's no telling how long we will be posted here.`
  ),
  D1_J2: guardEastJournalPage(
    2,
    9,
    `We finally had some good news from the eastern coast - our scouts spotted a raid in time to intercept them. Emrut, one of the rangers, told me the battle was quick and that hespans stood no chance.<br/>
They brought only three with them, all in really bad shape. We tended to them the best we could. With some luck they will pull through.`
  ),
  D1_J3: guardEastJournalPage(
    3,
    11,
    `One of the prisoners succumbed to their wounds today. I keep telling myself we've done everything we could, but doubt clouds my mind. We need to do better.<br/>
At least the other two are still holding up. I try to check on them every few hours. It's the least we can do.`
  ),
  D1_J4: guardEastJournalPage(
    4,
    15,
    `A ranger squad came by today. This time they brought us nineteen new prisoners. I worry that at this pace this place will be full in well under a chapter.<br/>
Regardless, we need to manage as best we can. The wounds were severe, hespans clearly do not give up without a fight.`
  ),
  D1_R1: {
    name: `Status Report`,
    language: LANGUAGES.AERIAN,
    icon: `/${ICONS_PATH}/notes/scroll_11_b.png`,
    text: `A piece of paper that reads:<br/>§
<div class="center">Status report Stoneward / 3<br/>
By Commander Isaras<br/>
On ${getDate(20)}</div>
<br/>
52 prisoners in hold, nearing capacity. 6 prisoners have died since the last report due to sustained wounds. Requesting to consider alternatives to accommodate future incoming prisoners. All cells operational. The repairs continue on the second floor.<br/>
<br/>
Resource requisition<br/>
• Casts - 10kg<br/>
• Bandages - 50<br/>
• Rations - 200<br/>
• Planks - 10<br/>
• Nails - 1kg§<br/>
<br/>
There is what looks like a faded stamp at the bottom.`
  },
  D2_V3: TatteredJournalPage(
    3,
    23,
    `I think someone's here! I heard a rumble, some heavy equipment? I'm hiding away on the second level. I hope they are not here to stay.`
  ),
  D2_J1: guardWestJournalPage(
    1,
    23,
    `We arrived to establish the secondary internment location. The place is in disrepair, but we found some signs that someone has been living here. Whoever that was they seem to be gone now.<br/>
The first floor will do for now. We have an armoury room in the southern section, protected with a simple two-person lock. The six cells to the north should be enough for at least forty or fifty prisoners.`
  ),
  D1_SCRATCH1: {
    name: `Wall scratchings`,
    language: LANGUAGES.AERIAN,
    icon: `/${ICONS_PATH}/notes/sgi_86_text.png`,
    text:
      `
You notice some writing scratched on the wall:§` +
      htmlRich(`
<div class="no-wrap">
    <div class="flex">
        <div class="flex">
            <div class="scratchouts bottom-align">
                <div>Eight</div>
                <div class="strikethrough">Five</div>
            </div>
            <div class="bottom-align">
                guards
            </div>
        </div>
        <div class="flex">
            <div class="scratchouts bottom-align">
                <div>Forty five?</div>
                <div class="strikethrough">Twenty eight?</div>
                <div class="strikethrough">Seventeen</div>
                <div class="strikethrough">Two</div>
                <div class="strikethrough">Three</div>
            </div>
            <div class="bottom-align">
                people
            </div>
        </div>
    </div>
</div>`) +
      htmlRich(`<div class="left">Three shifts.</div>
<div class="left">Supplies: planks, nails, unknown. Planning transport.</div>§`)
  },
  D1_J5: guardEastJournalPage(
    5,
    28,
    `We are preparing to transport the first group of prisoners to the secondary location. It is expected to now be ready to host the six prisoners that we'll be sending there.<br/>
With three of our men taking to the road to transport them, I have concerns we'll find ourselves short-staffed here. I hope to convince the rangers, should they bring more prisoners, to help us look after them upon their arrival.`
  ),
  D2_J2: guardWestJournalPage(
    2,
    29,
    `The first transport arrived today. All five of them are in perfect condition. I fail to understand why we waste so many of our resources tending to these invaders.<br/>
Regardless, I will perform my duty until new orders arrive.`
  ),
  D2_V4: TatteredJournalPage(
    4,
    32,
    `Blast it! It seems like they are here to stay. They stick to the first level, so at least I still have some room for myself. But I'm sure they plan to expand later. At least I don't have to worry about food anymore, they seem to have plenty to share.`
  ),
  D2_V5: TatteredJournalPage(
    5,
    38,
    `I can't hide here anymore. The first floor is buzzing with activity, they will soon run out of space. Tonight, I'll take whatever supplies I can and sneak out.`
  ),
  D1_J6: guardEastJournalPage(
    6,
    42,
    `The strangest thing happened today. The rangers brought us twelve prisoners, but some of them seem to be in a good condition, hardly any injuries on them. Did they yield without a fight? Could they be looking to spy on us? I must send a report to Trueport immediately.<br/>
For now we will be keeping them in separate cells and watching them closely. Something is not right.`
  ),
  D2_J3: guardWestJournalPage(
    3,
    44,
    `Prisoners getting restless, we had to subdue some of them. We'll reduce the food rations, this should bring them in line.<br/>
Second floor is now being filled. I hope the regiment at the first site is coping well. I can't imagine the kind of strain they must be dealing with.`
  ),
  D2_R1: {
    name: `Status Report`,
    language: LANGUAGES.AERIAN,
    icon: `/${ICONS_PATH}/notes/scroll_11_b.png`,
    text: `A piece of paper that reads:<br/>§
<div class="center">Status report Blackstorm / 2<br/>
By Commander Phexis<br/>
On ${getDate(60)}</div>
<br/>
140 prisoners in hold. 21 prisoners have died since the last report.<br/>
<br/>
Resource requisition<br/>
• Rations - 400§<br/>
<br/>
There is what looks like a faded stamp at the bottom.`
  },
  D2_TATTERED1: {
    name: `Torn note`,
    language: LANGUAGES.AERIAN,
    icon: `/${ICONS_PATH}/notes/scroll_12_b.png`,
    text: `A piece of paper with a rough, scribbled note:<br/>§
Volunteering to join the raid to get here was a mistake. The stories were true, but no one mentioned this place. We won't last long like ...§<br/>
The text trails off as the rest of the note seems torn off.`
  },
  D5_TRIAL_combat: {
    name: `Wall plaque`,
    language: LANGUAGES.AERIAN,
    icon: `/${ICONS_PATH}/notes/sgi_86_text_plaque.png`,
    text: `There is a plaque with some text written on it:<br/>
§Only those of indomitable prowess stand a chance to complete the Trial of Might.<br/>
Warning: This is your final exam. Once you enter there only way out is victory or death.§`
  },
  D5_TRIAL_wisdom: {
    name: `Wall plaque`,
    language: LANGUAGES.AERIAN,
    icon: `/${ICONS_PATH}/notes/sgi_86_text_plaque.png`,
    text: `There is a plaque with some text written on it:<br/>
§Only those of sharp wit stand a chance to complete the Trial of Wisdom.<br/>
Warning: This is your final exam. Once you enter there only way out is victory or death.§`
  },
  D5_TRIAL_cunning: {
    name: `Wall plaque`,
    language: LANGUAGES.AERIAN,
    icon: `/${ICONS_PATH}/notes/sgi_86_text_plaque.png`,
    text: `There is a plaque with some text written on it:<br/>
§Only those of keen senses stand a chance to complete the Trial of Cunning.<br/>
Warning: This is your final exam. Once you enter there only way out is victory or death.§`
  }
};

global.DungeonNotesInit = () => {
  // Eastern prison
  Entity.getById(14173).notes = [
    {
      roomType: "Tier1_GuardRoom",
      noteType: "DungeonNoteItem",
      noteIds: ["D1_J1", "D1_J2", "D1_J3", "D1_J4"],
      chance: 90
    },
    {
      roomType: "Tier1_Treasury",
      noteType: "DungeonNoteItem",
      noteIds: ["D1_R1"],
      chance: 40
    },
    {
      roomIds: [14345],
      noteType: "DungeonNoteStructure",
      noteIds: ["D1_SCRATCH1"],
      roomPlacement: "S",
      chance: 100
    },
    {
      roomType: "Tier2_GuardRoom",
      noteType: "DungeonNoteItem",
      noteIds: ["D1_J5", "D1_J6"],
      chance: 50
    }
  ];
  // West prison
  Entity.getById(16546).notes = [
    {
      roomType: "Tier2_GuardRoom",
      noteType: "DungeonNoteItem",
      noteIds: ["D2_J1", "D2_J2"],
      chance: 60
    },
    {
      roomType: "Tier3_GuardRoom",
      noteType: "DungeonNoteItem",
      noteIds: ["D2_J3"],
      chance: 30
    },
    {
      roomType: "Tier2_Treasury",
      noteType: "DungeonNoteItem",
      noteIds: ["D2_R1"],
      chance: 30
    },
    {
      roomType: "Tier2_PrisonCell",
      noteType: "DungeonNoteItem",
      noteIds: ["D2_TATTERED1"],
      chance: 35
    },
    {
      roomType: "Tier2_MessHall",
      noteType: "DungeonNoteItem",
      noteIds: ["D2_V1", "D2_V2", "D2_V3"],
      chance: 50
    },
    {
      roomType: "Tier3_MessHall",
      noteType: "DungeonNoteItem",
      noteIds: ["D2_V4", "D2_V5"],
      chance: 30
    }
  ];
  // Chur's citadel
  Entity.getById(34791).notes = [
    {
      roomType: "Tier1_MessHall",
      noteType: "DungeonNoteItem",
      noteIds: ["DC_A1", "DC_A2"],
      chance: 80
    },
    {
      roomType: "Tier2_MessHall",
      noteType: "DungeonNoteItem",
      noteIds: ["DC_A3", "DC_A4"],
      chance: 80
    },
    {
      roomType: "Tier3_Storage",
      noteType: "DungeonNoteItem",
      noteIds: ["DC_A5"],
      chance: 70
    }
  ];
};

(() => {
  const invalidWords = [
    "days?",
    "months?",
    "years?",
    "he",
    "she",
    "him",
    "his",
    "her"
  ].map(regexPart => new RegExp(`[^a-zA-Z]${regexPart}[^a-zA-Z]`, "i"));
  Object.values(global.DUNGEON_NOTES).forEach(note => {
    invalidWords.forEach(regex => {
      if (`.${note.text}.`.match(regex)) {
        throw new Error(`Invalid word used: ${regex} ${note.text}`);
      }
    });
  });
})();

// TODO: make sure wall notes work ok

// Entity.getById(14173).entryNodes[0]
// Entity.getEntities(Dungeon).filter(d => !(d instanceof MonsterDen))

// Entity.getEntities(Dungeon).filter(d => !(d instanceof MonsterDen)).map(d => d.id).join(' ')
// 14173 14244 16546 19403 34791 37501 38749
// debug.getCreature('Ethnar II').move(Entity.getById(34791).entryNodes[0])
