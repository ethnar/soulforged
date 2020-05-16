window.LEGAL_HTML = '© All rights reserved. <a href="#/credits">Credits</a>';
window.LOOKS = {
  HAIR_COLORS: 5,
  SKIN_COLORS: 6,
  HAIR_STYLES: 12
};
window.RESOURCE_SIZES = {
  0: "absent",
  1: "scarce",
  2: "ample",
  3: "abundant",
  4: "countless"
};

import { LoginView } from "./components/views/login.js";
import { MainView } from "./components/views/main.js";
import { FightView } from "./components/views/fight.js";
import { AvatarCreatorView } from "./components/views/avatar-creator.js";
import { CreditsView } from "./components/views/credits.js";
import { DeadView } from "./components/views/dead.js";
import { RegisterView } from "./components/views/register.js";
import "./components/generic/toast-notification.js";
import "./components/game/connection-checker.js";

// document.addEventListener('click', () => {
//     var docElm = document.documentElement;
//     if (docElm.requestFullscreen) {
//         docElm.requestFullscreen();
//     } else if (docElm.mozRequestFullScreen) {
//         docElm.mozRequestFullScreen();
//     } else if (docElm.webkitRequestFullScreen) {
//         docElm.webkitRequestFullScreen();
//     }
// });

Vue.use(VueRx, Rx);
Vue.use(VueTouch);

Array.prototype.toObject = function(keyGetter, valueGetter = i => i) {
  const object = {};
  this.forEach((i, idx) => {
    object[keyGetter(i, idx)] = valueGetter(i);
  });
  return object;
};

Rx.Observable.combineLatestMap = map => {
  const keys = Object.keys(map);
  return Rx.Observable.combineLatest(Object.values(map)).map(result =>
    result.toObject((v, idx) => keys[idx])
  );
};

Vue.prototype.stream = function(prop) {
  return this.$watchAsObservable(prop)
    .pluck("newValue")
    .startWith(this[prop]);
};

window.router = new VueRouter({
  routes: [
    {
      path: "/login",
      component: LoginView
    },
    {
      path: "/avatar-creator",
      component: AvatarCreatorView
    },
    {
      path: "/register",
      component: RegisterView
    },
    {
      path: "/credits",
      component: CreditsView
    },
    {
      path: "/dead",
      component: DeadView
    },
    {
      path: "/main",
      component: MainView
    },
    {
      path: "/fight",
      component: FightView
    },
    {
      path: "*",
      redirect: "/main"
    }
  ]
});

const app = new Vue({
  router: window.router,
  template: `
<div class="main-container-wrapper">
    <router-view></router-view>
    <toast-notification />
    <connection-checker />
    <audio-player />
</div>
    `
}).$mount("#app");

window.onerror = function(error) {
  console.error(error);
  ServerService.reportClientSideError({
    message: error.toString(),
    stack: error.stack
  });
};

Vue.config.errorHandler = (error, vm, info) => {
  console.error("Error in component:", vm.$vnode && vm.$vnode.tag, `(${info})`);
  console.error(error);
  ServerService.reportClientSideError({
    message: error.toString(),
    component: vm.$vnode && vm.$vnode.tag,
    info,
    stack: error.stack
  });
};
