import { DataService } from "../../services/data.js";

Vue.component("audio-player", {
  data: () => ({
    muted: true,
    isStarted: false,
    appliedVolume: 0
  }),

  watch: {
    muted() {
      this.updateVolume(this.volumeSetting);
    }
  },

  subscriptions() {
    this.playedSounds = {};

    return {
      ambientAudio: DataService.getAmbientAudioStream().do(files => {
        this.updateSounds(files || []);
      }),
      volumeSetting: ServerService.getAudioVolumeStream().do(value => {
        this.updateVolume(value);
      })
    };
  },

  mounted() {
    this.boundFn = this.startPlaying.bind(this);
    window.addEventListener("mousedown", this.boundFn);
    window.addEventListener("blur", () => {
      this.muted = true;
    });
    window.addEventListener("focus", () => {
      this.muted = false;
    });
  },

  methods: {
    updateSounds(files) {
      if (!this.isStarted) {
        return;
      }
      Object.values(this.playedSounds).forEach(s => (s.remove = true));
      files.forEach(file => {
        if (!this.playedSounds[file]) {
          this.playFile(file);
        }
        this.playedSounds[file].remove = false;
      });
      Object.keys(this.playedSounds).forEach(file => {
        if (this.playedSounds[file].remove) {
          this.playedSounds[file].howl.unload();
          delete this.playedSounds[file];
        }
      });
    },

    playFile(file) {
      this.playedSounds[file] = {
        howl: new Howl({
          src: [file],
          autoplay: true,
          loop: true,
          volume: this.appliedVolume
        })
      };
    },

    startPlaying() {
      this.isStarted = true;
      this.updateSounds(this.ambientAudio || []);
      window.removeEventListener("mousedown", this.boundFn);
      this.muted = false;
    },

    updateVolume(volumeSetting) {
      this.targetVolume = this.muted ? 0 : volumeSetting;

      this.appliedVolume = this.targetVolume;
      Object.values(this.playedSounds).forEach(s => {
        s.howl.volume(this.appliedVolume);
      });

      // const change = (this.targetVolume - this.appliedVolume) / 5;
      // if (change) {
      //     const interval = setInterval(() => {
      //         const sign = Math.sign(change);
      //         this.appliedVolume += change;
      //         if (this.appliedVolume * sign > this.targetVolume * sign) {
      //             this.appliedVolume = this.targetVolume;
      //             clearInterval(interval);
      //         }
      //         Object.values(this.playedSounds)
      //             .forEach(s => {
      //                 s.howl.volume(this.appliedVolume);
      //             });
      //     }, 100);
      // }
    }
  },

  template: `
<div class="audio-player"></div>
`
});
