import "../game/dialog-pane-with-logo.js";

export const CreditsView = {
  methods: {
    goBack() {
      window.location = "#/main";
    }
  },

  template: `
<div>
    <dialog-pane-with-logo>
        <p>Design & Programming</p>
        <a class="credits" href="mailto:ethnar.dev@gmail.com" target="_blank">Arkadiusz Bisaga</a>
        <p>Graphics (attribution)</p>
        <a class="credits" href="https://assetstore.unity.com/publishers/13229" target="_blank">Rexard</a>
        <a class="credits" href="https://icons8.com/" target="_blank">Icons8</a>
        <p>Audio (attribution)</p>
        <a class="credits" href="https://freesound.org/people/anne82/">Anne82</a>
        <a class="credits" href="https://freesound.org/people/Arctura/">Arctura</a>
        <a class="credits" href="https://freesound.org/people/blouhond/">Blouhond</a>
        <a class="credits" href="https://freesound.org/people/craftcrest/">Craftcrest</a>
        <a class="credits" href="https://freesound.org/people/Eelke/">Eelke</a>
        <a class="credits" href="https://freesound.org/people/Imjeax/">Imjeax</a>
        <a class="credits" href="https://freesound.org/people/kangaroovindaloo/">Kangaroovindaloo</a>
        <a class="credits" href="https://freesound.org/people/LilyMarie/">LilyMarie</a>
        <a class="credits" href="https://freesound.org/people/LittleRobotSoundFactory/">LittleRobotSoundFactory</a>
        <a class="credits" href="https://freesound.org/people/Proxima4/">Proxima4</a>
        <a class="credits" href="https://freesound.org/people/Suburbanwizard/">Suburbanwizard</a>
        <br/>
        <button class="text" @click="goBack()">Go back</button>
    </dialog-pane-with-logo>
</div>
`
};
