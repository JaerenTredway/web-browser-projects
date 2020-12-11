// ==UserScript==
// @name         khan-academy-set-default-playback-speed
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
            setDefaultPlaybackSpeed();
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


    function setDefaultPlaybackSpeed() {
        let playerIframe = getVideoPlayerContainer().firstChild;

        let speed = 1.7; // <-- SET THIS DESIRED SPEED MULTIPLIER

        let attempts = 0;
        let myInterval = setInterval(function() {
            if (typeof playerIframe !== 'undefined') {
                playerIframe.contentWindow.postMessage(
                    JSON.stringify({event: 'command', func: 'setPlaybackRate', args: [speed, true]})
                    , '*');
            }

            if (++attempts >= 5) {
                clearInterval(myInterval);
            }
        }, 1000);
    }


    function getVideoPlayerContainer() {
        return document.querySelector(PLAYER_CONTAINER_SELECTOR);
    }


    const PLAYER_CONTAINER_SELECTOR = '.ka-video-player-container';
    const SUB_ENABLED_URL_PARAM = 'cc_load_policy=1';
    const SUB_DISABLED_URL_PARAM = 'cc_load_policy=0';
})();