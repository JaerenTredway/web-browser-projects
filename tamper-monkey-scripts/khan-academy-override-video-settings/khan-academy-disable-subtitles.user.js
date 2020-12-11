// ==UserScript==
// @name         khan-academy-disable-subtitles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  override the default settings for Khan Academy video playback speed
// @author       Jaeren Tredway
// @include      https://www.khanacademy.org/*
// @run-at       document-end
// @grant        none
// ==/UserScript==
// references:
// https://khanacademy.zendesk.com/hc/en-us/community/posts/201283450-Default-Speed
// https://openuserjs.org/scripts/rixils/khanacademy-disable-sub/source
// https://gitlab.com/zalent/khanacademy-disable-sub
(() => {
    addOnChangeEventListenerTo(document.body, () => {
        if (isVideoPlayerLoaded()) {
            disableVideoPlayerSubtitles();
        }
    });


    function addOnChangeEventListenerTo(element, listener) {
        let observer = new MutationObserver(listener);
        observer.observe(
            element,
            {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false,
            }
        );
    }


    function isVideoPlayerLoaded() {
        let playerContainer = getVideoPlayerContainer();
        return playerContainer !== null;
    }


    function disableVideoPlayerSubtitles() {
        let playerIframe = getVideoPlayerContainer().firstChild;
        let isSubEnabled = playerIframe.src.includes(SUB_ENABLED_URL_PARAM);
        if (isSubEnabled) {
            let srcUrlWithSubDisabled = playerIframe.src.replace(
                SUB_ENABLED_URL_PARAM,
                SUB_DISABLED_URL_PARAM
            );
            playerIframe.src = srcUrlWithSubDisabled;
        }
    }


    function getVideoPlayerContainer() {
        return document.querySelector(PLAYER_CONTAINER_SELECTOR);
    }


    const PLAYER_CONTAINER_SELECTOR = '.ka-video-player-container';
    const SUB_ENABLED_URL_PARAM = 'cc_load_policy=1';
    const SUB_DISABLED_URL_PARAM = 'cc_load_policy=0';
})();
