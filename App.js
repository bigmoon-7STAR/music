<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>My Music Player</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/music-metadata-browser/2.5.9/index.min.js"></script>
    <style>
        :root { --bg-gradient: linear-gradient(135deg, #1e1e1e 0%, #000000 100%); }
        body {
            margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #000; color: white; height: 100vh; overflow: hidden;
        }
        #bg-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--bg-gradient); z-index: -1; transition: background 1.2s ease;
        }
        .container { padding: 20px; height: calc(100vh - 120px); overflow-y: auto; padding-top: 60px; }
        h1 { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        #drop-zone {
            border: 2px dashed #444; padding: 30px; text-align: center;
            border-radius: 12px; margin-bottom: 20px; color: #aaa; background: rgba(255,255,255,0.05);
        }
        .track-item {
            display: flex; align-items: center; padding: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer;
        }
        .track-item img { width: 45px; height: 45px; border-radius: 4px; margin-right: 15px; object-fit: cover; }
        .track-info-text { flex: 1; }
        .track-name { font-weight: 600; display: block; }
        .track-meta { color: #888; font-size: 13px; }
        .mini-player {
            position: fixed; bottom: 20px; left: 10px; right: 10px;
            height: 75px; background: rgba(40, 40, 40, 0.85);
            backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-radius: 12px; display: flex; align-items: center; padding: 0 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5); border: 0.5px solid rgba(255,255,255,0.1);
        }
        .player-art { width: 50px; height: 50px; border-radius: 6px; margin-right: 15px; }
        .player-text { flex: 1; overflow: hidden; }
        .player-title { font-weight: bold; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .player-artist { color: #aaa; font-size: 12px; }
        .controls { display: flex; gap: 20px; font-size: 24px; margin-right: 5px; }
    </style>
</head>
<body>
    <div id="bg-overlay"></div>
    <div class="container">
        <h1>ライブラリ</h1>
        <div id="drop-zone">タップしてM4aファイルを追加</div>
        <div id="track-list"></div>
    </div>
    <div class="mini-player">
        <canvas id="color-canvas" style="display:none;"></canvas>
        <img src="https://via.placeholder.com/50" class="player-art" id="player-art">
        <div class="player-text">
            <span class="player-title" id="player-title">未選択</span>
            <span class="player-artist" id="player-artist">-</span>
        </div>
<div class="controls">
    <span id="shuffle-btn" style="cursor:pointer; font-size: 18px; opacity: 0.5;">🔀</span>
    <span id="play-btn" style="cursor:pointer;">▶️</span>
    <span id="repeat-btn" style="cursor:pointer; font-size: 18px; opacity: 0.5;">🔁</span>
</div>

    <script>
        const canvas = document.getElementById('color-canvas');
        const ctx = canvas.getContext('2d');
        const dropZone = document.getElementById('drop-zone');
        const trackList = document.getElementById('track-list');
        const playBtn = document.getElementById('play-btn');
        const playerTitle = document.getElementById('player-title');
        const playerArtist = document.getElementById('player-artist');
        const playerArt = document.getElementById('player-art');
        const bgOverlay = document.getElementById('bg-overlay');

        let audio = new Audio();
        let isPlaying = false;

        // 1. ファイル追加処理
        dropZone.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = 'audio/*'; input.multiple = true;
            input.onchange = (e) => handleFiles(e.target.files);
            input.click();
        };

        async function handleFiles(files) {
            for (const file of Array.from(files)) {
                const metadata = await musicMetadata.parseBlob(file).catch(() => null);
                const common = metadata?.common;
                let coverUrl = "https://via.placeholder.com/150/333/fff?text=No+Image";
                if (common?.picture?.[0]) {
                    const pic = common.picture[0];
                    coverUrl = URL.createObjectURL(new Blob([pic.data], { type: pic.format }));
                }
                const track = {
                    url: URL.createObjectURL(file),
                    title: common?.title || file.name,
                    artist: common?.artist || "不明なアーティスト",
                    cover: coverUrl
                };
                addTrackToUI(track);
            }
        }

        // 2. UI表示処理
        function addTrackToUI(track) {
            const div = document.createElement('div');
            div.className = 'track-item';
            div.innerHTML = `
                <img src="${track.cover}">
                <div class="track-info-text">
                    <span class="track-name">${track.title}</span>
                    <span class="track-meta">${track.artist}</span>
                </div>
            `;
            div.onclick = () => playTrack(track);
            trackList.appendChild(div);
        }

        // 3. 再生 & 動的背景色
        function playTrack(track) {
            audio.src = track.url;
            audio.play();
            isPlaying = true;
            playBtn.innerText = '⏸';
            playerTitle.innerText = track.title;
            playerArtist.innerText = track.artist;
            playerArt.src = track.cover;

            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = track.cover;
            img.onload = () => {
                const color = getDominantColor(img);
                updateBackground(color);
            };
        }

        function getDominantColor(img) {
            canvas.width = 10; canvas.height = 10;
            ctx.drawImage(img, 0, 0, 10, 10);
            const data = ctx.getImageData(5, 5, 1, 1).data;
            return { r: data[0], g: data[1], b: data[2] };
        }

        function updateBackground(color) {
            const { r, g, b } = color;
            const mainColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
            const subColor = `rgba(${r}, ${g}, ${b}, 0.1)`;
            bgOverlay.style.background = `
                radial-gradient(circle at 20% 30%, ${mainColor} 0%, transparent 70%),
                radial-gradient(circle at 80% 70%, ${subColor} 0%, #000 100%)
            `;
        }

        // 4. 再生コントロール
        playBtn.onclick = () => {
            if (isPlaying) { audio.pause(); playBtn.innerText = '▶️'; }
            else { audio.play(); playBtn.innerText = '⏸'; }
            isPlaying = !isPlaying;
        };

        audio.onended = () => {
            console.log("曲が終了しました。");
            playBtn.innerText = '▶️';
            isPlaying = false;
        };
    </script>
</body>
</html>
