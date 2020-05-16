import { ServerService } from "../../../services/server.js";
import { Utils } from "../../generic/utils.js";
import { ContentFrameService } from "../../../services/content-frame.js";
import "../../generic/slider.js";
import { DataService } from "../../../services/data.js";

const LABELS_BLOOD = {
  0: "Never",
  1: "Extreme",
  2: "Severe",
  3: "Minor",
  4: "Initial",
  5: "Always"
};
const LABELS_PAIN = {
  0: "Never",
  1: "Extreme pain",
  2: "Major pain",
  3: "Pain",
  4: "Minor pain",
  5: "Always"
};

Vue.component("settings", {
  data: () => ({
    legalText: null,
    audioVolume: 0,
    painSafety: 0,
    bloodSafety: 0,
    weatherEffects: false,
    disableAutoRefresh: false
  }),

  computed: {
    painSafetyLabel() {
      return LABELS_PAIN[this.painSafety];
    },

    bloodSafetyLabel() {
      return LABELS_BLOOD[this.bloodSafety];
    }
  },

  created() {
    this.legalText = window.LEGAL_HTML;
    ServerService.getAudioVolumeStream()
      .first()
      .subscribe(value => {
        this.audioVolume = value;
      });

    ServerService.getLocalSettingStream("disableWeatherEffects")
      .first()
      .subscribe(disableWeatherEffects => {
        this.weatherEffects = !disableWeatherEffects;
      });

    ServerService.getLocalSettingStream("disableAutoRefresh")
      .first()
      .subscribe(disableAutoRefresh => {
        this.disableAutoRefresh = disableAutoRefresh;
      });
  },

  subscriptions() {
    const discordInfoStream = ServerService.getDataStream("discord-info");
    ServerService.request("get-discord-info");
    return {
      tutorialArea: DataService.getIsTutorialAreaStream(),
      dataUsed: ServerService.getUsedDataStream().map(number =>
        Utils.formatSize(number)
      ),
      joinDiscordUrl: Rx.Observable.fromPromise(
        ServerService.request("get-join-discord-url")
      ),
      discordInfo: discordInfoStream,
      settings: ServerService.getSettingsStream().do(settings => {
        this.painSafety = settings.safeties.pain;
        this.bloodSafety = settings.safeties.blood;
      }),
      pushNotificationsAllowed: ServerService.getPushNotificationsAllowedStream(),
      pushNotificationsEnabled: ServerService.getPushNotificationsEnabledStream()
    };
  },

  methods: {
    restartTutorial() {
      window.tutorialInstance.restart();
      ContentFrameService.triggerClosePanel();
    },

    onChangePainSafety() {
      ServerService.setSetting("safeties.pain", this.painSafety);
    },

    onChangeBloodSafety() {
      ServerService.setSetting("safeties.blood", this.bloodSafety);
    },

    onChangeVolume() {
      ServerService.setAudioVolume(this.audioVolume);
    },

    updateSetting(key, value) {
      ServerService.setSetting(key, value);
    },

    setPushNotificationsEnabled(value) {
      ServerService.togglePushNotifications(value);
    },

    setWeatherEffects() {
      ServerService.setLocalSetting(
        "disableWeatherEffects",
        !this.weatherEffects
      );
    },

    setDisableAutoRefresh() {
      ServerService.setLocalSetting(
        "disableAutoRefresh",
        this.disableAutoRefresh
      );
    }
  },

  template: `
<div>
    <section v-if="tutorialArea">
        <header>Tutorials</header>
        <div class="centered">
            <button @click="restartTutorial()">Restart tutorial</button>
        </div>
    </section>
    <section>
        <header>Sound volume</header>
        <slider :min="0" :max="1" :step="0.05" v-model="audioVolume" @input="onChangeVolume()"></slider>
    </section>
    <section>
        <header>Discord</header>
        <div v-if="discordInfo">
            Discord user: {{discordInfo.name}}
        </div>
        <div class="centered">
            <a class="button" target="_blank" :href="joinDiscordUrl">
                {{discordInfo ? 'Change user' : 'Join on Discord'}}
            </a>
        </div>
    </section>
    <section v-if="settings">
        <header>
            Accident safety
            <help-icon title="Accident safety">
                You can use these settings to automatically adjust at what level your character will stop performing an action when they get an injury.<br/>
                By selecting "Never" your character will never stop the actions and continue regardless of their wounds.<br/>
                By selecting "Always" any accident will make the character stop performing the action.<br/>
                By selecting a specific value - only when character will be in that, or worse, state will they stop the action when accident happens.<br/>
            </help-icon>
        </header>
        <div class="help-text" :class="{ disabled: bloodSafety === 5 }"><span class="label">Pain threshold:</span> <span class="value">{{painSafetyLabel}}</span></div>
        <slider :disabled="bloodSafety === 5" :min="0" :max="5" :step="1" v-model="painSafety" @input="onChangePainSafety()"></slider>
        <div class="help-text" :class="{ disabled: painSafety === 5 }"><span class="label">Blood threshold:</span> <span class="value">{{bloodSafetyLabel}}</span></div>
        <slider :disabled="painSafety === 5" :min="0" :max="5" :step="1" v-model="bloodSafety" @input="onChangeBloodSafety()"></slider>
    </section>
    <section v-if="settings">
        <header>Notifications</header>
        <label class="checkbox-row">
            <div><input type="checkbox" v-model="pushNotificationsEnabled" @change="setPushNotificationsEnabled(pushNotificationsEnabled)" :disabled="!pushNotificationsAllowed" /></div>
            <div>Device <span v-if="!pushNotificationsAllowed">(allow notifications in your browser)</span></div>
        </label>
        <label class="checkbox-row" v-if="settings.notifications.slack !== undefined">
            <div><input type="checkbox" :checked="settings.notifications.slack" @change="updateSetting('notifications.slack', !settings.notifications.slack)" /></div>
            <div>Slack</div>
        </label>
        <label class="checkbox-row">
            <div><input type="checkbox" :checked="settings.notifications.discord" @change="updateSetting('notifications.discord', !settings.notifications.discord)" :disabled="!discordInfo" /></div>
            <div>Discord</div>
        </label>
        <label class="checkbox-row">
            <div><input type="checkbox" :checked="settings.alwaysNotify" @change="updateSetting('alwaysNotify', !settings.alwaysNotify)" /></div>
            <div>Send notification when the game is focused</div>
        </label>
    </section>
    <section v-if="settings">
        <header>Miscellaneous</header>
        <label class="checkbox-row">
            <div><input type="checkbox" v-model="weatherEffects" @change="setWeatherEffects" /></div>
            <div>Animated weather effects</div>
        </label>    
        <label class="checkbox-row">
            <div><input type="checkbox" v-model="disableAutoRefresh" @change="setDisableAutoRefresh" /></div>
            <div>Disable auto-reload on connection issues</div>
        </label>    
    </section>
    <br/>
    <div class="legal bright">Data used: {{dataUsed}}</div>
    <div class="legal bright" v-html="legalText"></div>
</div>
    `
});
