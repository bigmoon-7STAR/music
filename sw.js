<script>
    // 1. ここにさっきのキャッシュバスターを貼る
    if ('serviceWorker' in navigator) { ... }
    (function() { ... })();

    // 2. この下に、元からあるプレイヤーの動くコード（dbの接続など）を書く
    let db, tracks = []; 
    ...
</script>

// 1. まず「過去の亡霊（Service Worker）」を完全に消し去る
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

// 2. 究極のキャッシュ・バスター（これ1つでOK）
(function() {
    // 【重要】コードを書き換えたら、この数字を 1.01 -> 1.02 と変えるだけ！
    const APP_VERSION = "1.0.5"; 
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentV = urlParams.get('v');

    if (currentV !== APP_VERSION) {
        // 以前のlocalStorage方式ではなく、URLパラメータ方式に一本化
        const newURL = window.location.pathname + '?v=' + APP_VERSION;
        window.location.replace(newURL);
    }
})();
