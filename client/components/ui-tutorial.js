import { ServerService } from "../services/server.js";
import { ToastNotification } from "./generic/toast-notification.js";
import { DataService } from "../services/data.js";

window.tutorialInstance = null;

let doneDynamicSteps =
  JSON.parse(localStorage.getItem("tutorialDoneDynamicSteps")) || {};
const step = JSON.parse(localStorage.getItem("tutorialStep")) || "welcome";

const questNotification = () => document.querySelector(".quest-notification");
const playerOnAQuest = questName =>
  window.tutorialInstance.quests.find(q => q.title === questName);
const isQuestComplete = questName => playerOnAQuest(questName).completed;
const aFrameIsOpen = () => document.querySelector(".content-frame");
const nodeHasResource = resName =>
  window.tutorialInstance.node.resources.find(r => r.name === resName);
const isObjectiveComplete = objectiveName =>
  window.tutorialInstance.quests.find(q =>
    q.objectives.some(
      o => o.label === objectiveName && +o.progress === +(o.target || 1)
    )
  );
const isModalOpen = () => document.querySelector(".modal");
const isPanelOpened = type =>
  document.querySelector(`.main-controls .btn.${type}.selected .icon`);
const isDoingAction = actionName =>
  window.tutorialInstance.currentAction.actionName === actionName ||
  window.tutorialInstance.currentAction.progress === 0;
const isOverburdened = () =>
  window.tutorialInstance.inventory.weights.currentLevel >= 3;
const anyToolEquipped = () =>
  window.tutorialInstance.equipment.find(s => s.slot === "Tool").item;
const researchMaterialsSelected = () =>
  window.tutorialInstance.researchMaterials.length;
const hasItem = itemName =>
  window.tutorialInstance.inventory.items.find(i => i.name === itemName);
const hasBuff = buff =>
  document.querySelector(
    `.main-status .creature-effects .buff.${buff.replace(/ /g, ".")}`
  );

const foodName = "Bread Roll";

let dynamicSteps = [
  {
    selectors: [".quest-notification"],
    text:
      "You have a new quest notification, click here to open the quests panel",
    clickable: true,
    oneTimeDynamicStep: "questUpdate",
    condition: () => !aFrameIsOpen() && !isModalOpen()
  },
  {
    selectors: [".content-frame .quest"],
    text: "Here you can see a short summary of your quest",
    oneTimeDynamicStep: "questSummary"
  },
  {
    selectors: [".content-frame .quest .proceed"],
    text: 'Click "Proceed" to see the dialogue and finish the quest.',
    oneTimeDynamicStep: "completeQuest",
    clickable: true
  },
  {
    selectors: [".content-frame .quest .objective"],
    text: "You have a new quest! You can see the quest objectives here.",
    oneTimeDynamicStep: "newQuestWithObjectives",
    condition: () => {
      return (
        document.querySelector(".content-frame .quest .info") && !isModalOpen()
      );
    }
  },
  {
    selectors: [".content-frame .quest .info"],
    text: "Review the dialogue to learn more about the quest.",
    oneTimeDynamicStep: "checkQuestInfo",
    clickable: true,
    condition: () => {
      return !isModalOpen();
    }
  },
  {
    selectors: [".main-controls .btn.character"],
    text:
      "You can review your quest objectives at any time by selecting Character panel...",
    oneTimeDynamicStep: "howToSeeQuests1",
    condition: () => {
      return doneDynamicSteps["checkQuestInfo"] && !isModalOpen();
    }
  },
  {
    selectors: [".content-frame .tab-headers .tab-header.quests"],
    text: "... and then the Quests tab.",
    oneTimeDynamicStep: "howToSeeQuests2",
    condition: () => {
      return doneDynamicSteps["howToSeeQuests1"];
    }
  },
  {
    selectors: [".main-controls .btn.character"],
    text: `For now let's close this panel`,
    oneTimeDynamicStep: "howToSeeQuests3",
    clickable: true,
    condition: () => {
      return doneDynamicSteps["howToSeeQuests2"];
    }
  }
];

/******************** ACTION IN PROGRESS *********************/
dynamicSteps = dynamicSteps.concat([
  {
    selectors: [".main-status .current-action"],
    oneTimeDynamicStep: "actionIsInProgress1",
    text: `Your character is now performing the action. It will take some time. You can click the current action indicator to see the details.`,
    clickable: true,
    scrollIntoView: false,
    condition: () => {
      return (
        !questNotification() &&
        !isModalOpen() &&
        !aFrameIsOpen() &&
        !isDoingAction("Sleep")
      );
    }
  },
  {
    selectors: [".modal .contents .estimate"],
    oneTimeDynamicStep: "actionIsInProgress2",
    text: `Here you can see the estimated time remaining for the action to complete. Consider signing up to Slack to get notifications when the action completes.`,
    scrollIntoView: false,
    condition: () => {
      return !questNotification() && !isDoingAction("Sleep");
    }
  }
]);

/************************* EATING QUEST ****************************/
const isOnHungerQuest = () => playerOnAQuest("Your needs");

dynamicSteps = dynamicSteps.concat([
  {
    selectors: [".main-status .creature-effects .buff.Hungry"],
    scrollIntoView: false,
    oneTimeDynamicStep: "questHungry1",
    text: `Your character is hungry...`,
    condition: () => {
      return (
        !questNotification() &&
        !aFrameIsOpen() &&
        isOnHungerQuest() &&
        !isModalOpen() &&
        !isDoingAction("Eat")
      );
    }
  },
  {
    selectors: [".main-status .buff.Sad"],
    scrollIntoView: false,
    oneTimeDynamicStep: "questHungry2",
    text: `... and that makes them slightly sad.`,
    condition: () => {
      return (
        doneDynamicSteps["questHungry1"] &&
        !questNotification() &&
        !aFrameIsOpen() &&
        isOnHungerQuest() &&
        !isModalOpen() &&
        !isDoingAction("Eat") &&
        hasBuff("Slightly Sad")
      );
    }
  },
  {
    selectors: [".main-controls .btn.items .icon"],
    scrollIntoView: false,
    clickable: true,
    text: `To fix this let's open your inventory.`,
    condition: () => {
      return (
        !questNotification() &&
        !aFrameIsOpen() &&
        isOnHungerQuest() &&
        !isModalOpen() &&
        !isDoingAction("Eat") &&
        !isQuestComplete("Your needs") &&
        hasItem(foodName)
      );
    }
  },
  {
    selectors: [".content-frame .item-list .item-icon.Bread.Roll .slot"],
    scrollIntoView: false,
    clickable: true,
    text: `Select the food that you received from Aymar...`,
    condition: () => {
      return (
        !questNotification() &&
        isOnHungerQuest() &&
        !isModalOpen() &&
        !isDoingAction("Eat") &&
        !isQuestComplete("Your needs") &&
        hasItem(foodName)
      );
    }
  },
  {
    selectors: [".modal .action.Eat"],
    clickable: true,
    text: `... select the action to eat it ...`,
    condition: () => {
      return (
        !questNotification() &&
        isOnHungerQuest() &&
        isModalOpen() &&
        !isDoingAction("Eat") &&
        !isQuestComplete("Your needs") &&
        hasItem(foodName) &&
        !document.querySelector('.action-modal [type="submit"]')
      );
    }
  },
  {
    selectors: ['.action-modal [type="submit"]'],
    clickable: true,
    text: `... and confirm the action.`,
    condition: () => {
      return (
        !questNotification() &&
        isOnHungerQuest() &&
        isModalOpen() &&
        !isDoingAction("Eat") &&
        !isQuestComplete("Your needs") &&
        hasItem(foodName)
      );
    }
  }
]);

/************************* GATHERING QUEST ****************************/
const gatherStonesObjective = "Collect 10 stones";
const gatherTwigsObjective = "Collect 10 twigs";
const canGetStonesForGatherQuest = () =>
  !isObjectiveComplete(gatherStonesObjective) && nodeHasResource("Stones");
const canGetTwigsForGatherQuest = () =>
  !isObjectiveComplete(gatherTwigsObjective) && nodeHasResource("Twigs");
const isOnLocationForGatherQuest = () =>
  playerOnAQuest("Gather") &&
  (canGetStonesForGatherQuest() || canGetTwigsForGatherQuest());
const needsToMoveForGatherQuest = () =>
  playerOnAQuest("Gather") &&
  ((!isObjectiveComplete(gatherStonesObjective) &&
    !nodeHasResource("Stones")) ||
    (!isObjectiveComplete(gatherTwigsObjective) && !nodeHasResource("Twigs")));
const isTabSelected = tab =>
  document.querySelector(
    `.content-frame .tab-headers .tab-header.${tab}.active`
  );

dynamicSteps = dynamicSteps.concat([
  {
    selectors: [".node-token.current:not(.selected) .click-trigger"],
    scrollIntoView: false,
    extraMargin: 0.3,
    text: `You now need to gather some resources. You can gather resources from your location or the neighbouring ones. For now - just select your current location.`,
    clickable: true,
    condition: () => {
      return (
        !questNotification() &&
        !aFrameIsOpen() &&
        isOnLocationForGatherQuest() &&
        !isModalOpen() &&
        !isDoingAction("Gather")
      );
    }
  },
  {
    selectors: [".node-token.current.showing-details .click-trigger"],
    scrollIntoView: false,
    extraMargin: 0.3,
    text: `With the location selected you can preview the creatures, structures and resources present here. Click again to show more details.`,
    clickable: true,
    condition: () => {
      return (
        !questNotification() &&
        !aFrameIsOpen() &&
        isOnLocationForGatherQuest() &&
        !isModalOpen() &&
        !isDoingAction("Gather")
      );
    }
  },
  {
    selectors: [
      ".content-frame .tab-headers .tab-header.resources:not(.active)"
    ],
    scrollIntoView: false,
    text: `Select the resources tab.`,
    clickable: true,
    condition: () => {
      return (
        !questNotification() &&
        aFrameIsOpen() &&
        isOnLocationForGatherQuest() &&
        !isModalOpen() &&
        !isDoingAction("Gather")
      );
    }
  },
  {
    selectors: [".content-frame .action"],
    oneTimeDynamicStep: "gatheringQuestShownTheResources",
    text: `And here you can start gathering the resources you require to complete the quest`,
    condition: () => {
      return (
        !questNotification() &&
        isTabSelected("resources") &&
        isOnLocationForGatherQuest() &&
        !isModalOpen() &&
        !isDoingAction("Gather")
      );
    }
  }
]);

/*********************** RESEARCH QUEST **********************/
dynamicSteps = dynamicSteps.concat([
  {
    selectors: [".main-controls .btn.craft .icon"],
    scrollIntoView: false,
    text: `To start a research, open the crafting section.`,
    clickable: true,
    condition: () => {
      return (
        !questNotification() &&
        playerOnAQuest("Research") &&
        !isQuestComplete("Research") &&
        !isDoingAction("Research") &&
        !isModalOpen() &&
        !isPanelOpened("craft")
      );
    }
  },
  {
    selectors: [".content-frame .tab-headers .tab-header.research"],
    scrollIntoView: false,
    text: `Since you cannot craft anything yet, the only available section is Research. That's exactly what you need.`,
    oneTimeDynamicStep: "research2",
    condition: () => {
      return (
        !questNotification() &&
        playerOnAQuest("Research") &&
        !isQuestComplete("Research") &&
        !isDoingAction("Research") &&
        !isModalOpen()
      );
    }
  },
  {
    selectors: [".content-frame .tool-selector .selected-item .item-icon"],
    scrollIntoView: false,
    text: `The outcome of a research is based off the tool equipped and materials used. First, select a tool. A simple stone will do for now...`,
    clickable: true,
    oneTimeDynamicStep: "research3",
    condition: () => {
      return (
        !questNotification() &&
        playerOnAQuest("Research") &&
        !anyToolEquipped() &&
        !isQuestComplete("Research") &&
        !isDoingAction("Research") &&
        !isModalOpen()
      );
    }
  },
  {
    selectors: [".content-frame .research-mats-list .research-material"],
    scrollIntoView: false,
    text: `... and then select an item, as a material. Again, select a Stone as it is all you need right now.`,
    clickable: true,
    oneTimeDynamicStep: "research4",
    condition: () => {
      return (
        !questNotification() &&
        playerOnAQuest("Research") &&
        anyToolEquipped() &&
        !isQuestComplete("Research") &&
        !isDoingAction("Research") &&
        !isModalOpen()
      );
    }
  },
  {
    selectors: [".content-frame .action.Research"],
    scrollIntoView: false,
    text: `... and finally start the research. This will take just a few seconds.`,
    clickable: true,
    oneTimeDynamicStep: "research5",
    condition: () => {
      return (
        !questNotification() &&
        playerOnAQuest("Research") &&
        anyToolEquipped() &&
        researchMaterialsSelected() &&
        !isQuestComplete("Research") &&
        !isDoingAction("Research") &&
        !isModalOpen()
      );
    }
  }
]);

// equipping items
// explain hidden state

/********************* TRAVEL TO GET RESOURCES ***********************/
const needsToMoveToGather = () => needsToMoveForGatherQuest();

dynamicSteps = dynamicSteps.concat([
  {
    extraMargin: 0.05,
    selectors: ["body"],
    oneTimeDynamicStep: "moveToGetResources1",
    text: `Unfortunately the resources you need are not available in this location. To get them you will have to travel to another location.`,
    scrollIntoView: false,
    condition: () => {
      return (
        !questNotification() &&
        needsToMoveToGather() &&
        !isModalOpen() &&
        !isDoingAction("Travel") &&
        !isOverburdened()
      );
    }
  },
  {
    extraMargin: 0.05,
    selectors: ["body"],
    oneTimeDynamicStep: "moveToGetResources2",
    text: `Select one of the tiles, preferably one that has the resources you need, and double click it.`,
    scrollIntoView: false,
    condition: () => {
      return (
        !questNotification() &&
        needsToMoveToGather() &&
        !isModalOpen() &&
        !isDoingAction("Travel") &&
        !isOverburdened()
      );
    }
  },
  {
    extraMargin: 0.3,
    selectors: [".node-token.selected:not(.current)"],
    text: `With the location selected, click it the second time to view the location details.`,
    scrollIntoView: false,
    clickable: true,
    oneTimeDynamicStep: "moveToGetResources3",
    condition: () => {
      return (
        !questNotification() &&
        !aFrameIsOpen() &&
        needsToMoveToGather() &&
        !isModalOpen() &&
        !isDoingAction("Travel") &&
        !isOverburdened()
      );
    }
  },
  {
    selectors: [".content-frame .action.Travel"],
    text: `Select the action to begin the journey.`,
    clickable: true,
    oneTimeDynamicStep: "moveToGetResources4",
    condition: () => {
      return (
        !questNotification() &&
        aFrameIsOpen() &&
        needsToMoveToGather() &&
        !isModalOpen() &&
        !isDoingAction("Travel") &&
        !isOverburdened()
      );
    }
  },
  {
    selectors: ["body"],
    text: `You need to travel to find resources, but you are currently overburdened - which makes travel impossible.`,
    oneTimeDynamicStep: "overburden1",
    condition: () => {
      return needsToMoveToGather() && !isModalOpen() && isOverburdened();
    }
  },
  {
    selectors: [".main-controls .btn.items .icon"],
    text: `To resolve this problem open your inventory...`,
    clickable: true,
    oneTimeDynamicStep: "overburden2",
    condition: () => {
      return needsToMoveToGather() && !isModalOpen() && isOverburdened();
    }
  },
  {
    selectors: [".content-frame .item-list"],
    text: `... select one of the items and "Dump" a few of them on the ground.`,
    oneTimeDynamicStep: "overburden3",
    condition: () => {
      return (
        document.querySelector(".tab-header.inventory.active") &&
        needsToMoveToGather() &&
        !isModalOpen() &&
        isOverburdened()
      );
    }
  }
]);

/***************** COMPONENTS *********************/
const triggerComponentInstance = new Promise(resolve => {
  Vue.component("tutorial-trigger", {
    data: () => ({
      step: null
    }),

    subscriptions() {
      return {
        tutorialArea: DataService.getIsTutorialAreaStream()
      };
    },

    mounted() {
      resolve(this);
    },

    methods: {
      continueTutorial() {
        ToastNotification.notify("Tutorial hints enabled");
        window.tutorialInstance.resumeTutorial();
      },

      setStep(step) {
        this.step = step;
      }
    },

    template: `
<div
    v-if="tutorialArea && (step === 'paused' || step === 'step10')"
    class="tutorial-trigger"
    @click="continueTutorial"
>
    <div class="icon"></div>
</div>
    `
  });
});

Vue.component("ui-tutorial", {
  data: () => ({
    step,
    explainerHighlight: null,
    explainerTextStyle: {},
    explainerTextShow: false,
    explainer: null
  }),

  mounted() {
    window.addEventListener("resize", () => this.updatePositioning());
    window.tutorialInstance = this;
  },

  subscriptions() {
    setInterval(() => this.checkNextDynamicStep(), 500);
    setInterval(() => this.saveTheProgress(), 2000);

    return {
      node: ServerService.getNodeStream(),
      currentAction: DataService.getCurrentActionStream(),
      equipment: DataService.getMyEquipmentStream(),
      inventory: DataService.getMyInventoryStream(),
      quests: DataService.getMyQuestsStream(),
      researchMaterials: DataService.getResearchMaterialsStream()
    };
  },

  methods: {
    checkNextDynamicStep() {
      if (this.step === "paused") {
        return;
      }
      this.nextExplainer = dynamicSteps.find(stepDef => {
        const element = document.querySelector(stepDef.selectors[0]);
        return (
          !!element &&
          (!stepDef.condition || stepDef.condition()) &&
          (!stepDef.oneTimeDynamicStep ||
            !doneDynamicSteps[stepDef.oneTimeDynamicStep])
        );
      });
      if (this.step === "dynamic") {
        if (this.explainer !== this.nextExplainer) {
          this.explainer = this.nextExplainer;
        }
      }
    },

    saveTheProgress() {
      localStorage.setItem(
        "tutorialDoneDynamicSteps",
        JSON.stringify(doneDynamicSteps)
      );
      localStorage.setItem("tutorialStep", JSON.stringify(this.step));
    },

    restart() {
      this.step = "welcome";
      doneDynamicSteps = {};
    },

    updatePositioning() {
      if (!this.explainer) {
        return;
      }
      let explainerHighlight = {
        right: Infinity,
        bottom: Infinity,
        top: Infinity,
        left: Infinity
      };
      this.explainer.selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) {
          setTimeout(() => {
            this.updatePositioning();
          }, 1000);
          return;
        }
        elements.forEach(element => {
          if (this.explainer.scrollIntoView !== false) {
            element.scrollIntoView();
          }
          const rect = element.getBoundingClientRect();
          const right = window.innerWidth - rect.left - rect.width;
          const bottom = window.innerHeight - rect.top - rect.height;
          explainerHighlight = {
            right: Math.min(explainerHighlight.right, right),
            bottom: Math.min(explainerHighlight.bottom, bottom),
            top: Math.min(explainerHighlight.top, rect.top),
            left: Math.min(explainerHighlight.left, rect.left)
          };
        });
      });
      if (explainerHighlight.top === Infinity) {
        this.explainerHighlight = null;
        return;
      }

      const width =
        window.innerWidth - explainerHighlight.left - explainerHighlight.right;
      const height =
        window.innerHeight - explainerHighlight.top - explainerHighlight.bottom;
      const margin = 5;
      const extraMarginLeftRight = (this.explainer.extraMargin || 0) * width;
      const extraMarginTopBottom = (this.explainer.extraMargin || 0) * height;

      const { left, top, bottom, right } = explainerHighlight;

      let targetLeft = `${left + width / 2}px`;
      this.explainerTextStyle = {
        top: `${window.innerHeight -
          bottom +
          (margin + extraMarginTopBottom) * 2}px`,
        left: targetLeft
      };
      this.explainerTextShow = false;
      setTimeout(() => {
        if (this.$refs.explainerText) {
          const rect = this.$refs.explainerText.getBoundingClientRect();
          if (rect.left < 0) {
            targetLeft = `${rect.width / 2}px`;
          } else if (rect.right > window.innerWidth) {
            targetLeft = `${window.innerWidth - rect.width / 2}px`;
          }
          if (rect.bottom <= window.innerHeight) {
            this.explainerTextShow = true;
            this.explainerTextStyle.left = targetLeft;
          } else {
            this.explainerTextStyle = {
              bottom: `${bottom +
                height +
                (margin + extraMarginTopBottom) * 2}px`,
              left: targetLeft
            };
            setTimeout(() => {
              if (this.$refs.explainerText) {
                const rect = this.$refs.explainerText.getBoundingClientRect();
                if (rect.top < 0) {
                  this.explainerTextStyle = {
                    bottom: `${2}px`,
                    left: `${2}px`,
                    "margin-left": "0"
                  };
                }
                this.explainerTextShow = true;
              }
            });
          }
        }
      });

      this.explainerHighlight = {
        right: explainerHighlight.right - margin - extraMarginLeftRight + "px",
        bottom:
          explainerHighlight.bottom - margin - extraMarginTopBottom + "px",
        top: explainerHighlight.top - margin - extraMarginTopBottom + "px",
        left: explainerHighlight.left - margin - extraMarginLeftRight + "px"
      };
    },

    resumeTutorial() {
      this.step = "dynamic";
      this.checkNextDynamicStep();
    },

    pauseTutorial() {
      ToastNotification.notify("Suspended tutorial hints");
      this.step = "paused";
    },

    toggleTutorial() {
      if (this.step === "dynamic") {
        this.step = "paused";
      } else {
        this.step = "dynamic";
        this.checkNextDynamicStep();
      }
    },

    clickedHighlight() {
      if (!this.explainer.clickable) {
        return;
      }
      this.nextStep();
      document.querySelector(this.explainer.selectors).click();
      this.explainer = null;
      setTimeout(() => this.checkNextDynamicStep());
    },

    nextStep() {
      if (this.explainer.oneTimeDynamicStep) {
        doneDynamicSteps[this.explainer.oneTimeDynamicStep] = true;
      }
      if (this.explainer.nextStep) {
        this.step = this.explainer.nextStep;
      }
    }
  },

  watch: {
    "explainer.selectors": {
      handler() {
        if (this.explainer && this.explainer.selectors) {
          this.updatePositioning();
        }
      },
      immediate: true
    },

    step: {
      handler() {
        this.explainer = null;

        triggerComponentInstance.then(i => i.setStep(this.step));

        const steps = [
          {
            selectors: [
              ".main-status .player-avatar",
              ".main-status .current-action",
              ".main-status .creature-effects"
            ],
            text: "Here you can see your character status at a glance"
          },
          {
            selectors: [".main-status .current-action"],
            text: "What they currently are doing..."
          },
          {
            selectors: [".main-status .creature-effects"],
            text: "... and the most important effects"
          },
          {
            extraMargin: 0.3,
            selectors: [".node-token.current"],
            text:
              "Here you can see your current location, as indicated by the blue flag...",
            scrollIntoView: false
          },
          {
            extraMargin: 0.05,
            selectors: [".node-token"],
            text: "... and the surrounding areas.",
            scrollIntoView: false
          },
          {
            selectors: [".main-controls"],
            text:
              "The buttons open panels that provide you with essential information"
          },
          {
            selectors: [".main-controls .btn.character .icon"],
            text:
              "The first one gives you access to your character statistics, skills and effects"
          },
          {
            selectors: [".main-controls .btn.items .icon"],
            text: "Next you can access your inventory and equipment"
          },
          {
            selectors: [".main-controls .btn.craft .icon"],
            text:
              "Here you can review crafting recipes and building plans, as well as try to discover new ones"
          },
          {
            selectors: [".main-controls"],
            text:
              "Later in the game you may see additional buttons added that will give you access to new features"
          },
          {
            selectors: [".tutorial-trigger"],
            text: `For now you may want to explore the interface on your own. When you're ready to continue simply click the question mark button`
          }
        ];
        if (this.step.indexOf("step") === 0) {
          const stepNo = +this.step.replace("step", "");
          this.explainer = steps[stepNo];
          if (steps[stepNo + 1]) {
            this.explainer.nextStep = `step${stepNo + 1}`;
          } else {
            this.explainer.nextStep = `paused`;
          }
        }
      },
      immediate: true
    }
  },

  template: `
<div class="ui-tutorial">
    <div>
        <modal v-if="step === 'welcome'" @close="step = 'skip_tutorial'">
            <template slot="header">
                Welcome to Soulforged!
            </template>
            <template slot="main">
                <p>
                    Let me guide you through the basics of the UI.
                </p>
                <button @click="step = 'step0'">Let's do this</button>
                <button @click="step = 'skip_tutorial'" class="secondary">Skip tutorial</button>
            </template>
        </modal>
        <modal v-if="step === 'skip_tutorial'" :closeable="false">
            <template slot="header">
                Skip tutorial
            </template>
            <template slot="main">
                <p>
                    You can restart this tutorial at any point from character screen.
                </p>
                <button @click="step = 'paused'">Skip tutorial</button>
                <button @click="step = 'welcome'" class="secondary">Back to tutorial</button>
            </template>
        </modal>
    </div>
    <div class="explainer" v-if="explainer && explainerHighlight">
        <div class="explainer-highlight" :style="explainerHighlight" @click="clickedHighlight()" :class="{ interactable: explainer.clickable }"></div>
        <div class="explainer-text-box" :style="explainerTextStyle" ref="explainerText" :class="{ visible: explainerTextShow }">
            <div class="help-text">
                <div class="close" v-if="step === 'dynamic'" @click="pauseTutorial();"></div>
                {{explainer.text}}
            </div>
            <div class="action-call" v-if="!explainer.clickable">
                <button @click="nextStep()">Next</button>
            </div>
        </div>
        <div class="backdrop"></div>
    </div>
</div>
`
});
