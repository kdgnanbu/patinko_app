        const add_del = document.querySelector("#add_del");
        // 追加削除ボタン
        const add_button = document.querySelector("#add_button");
        // 一回の獲得出玉の割合を追加するボタン
        const del_button = document.querySelector("#del_button");
        // 削除するボタン
        const button = document.querySelector("#button");
        const button_simulation = document.querySelector("#button_simulation");
        const button_simulation_dedama = document.querySelector("#button-simulation-dedama");
        const content = document.querySelector("#content");
        // 追加する場所
        let arry = [0, 0];
        // 現在のあたり数、総出玉の配列
        let firstClick = true;
        let firstSimulationClick = true;  // シミュレーション用
        let firstDedamaClick = true;
        // 最初のクリックアクション
        let dedama_arry = [];
        // Rush時に獲得できる出玉の配列。
        let arr_wariai_total = 0;
        // Rush時出玉の割合
        let x_today = 0;
        let arr_wariai;
        let sikin = 0;
        let rush = 0;
        let rupu = 0;
        let arr = [];
        let dedama = 0;
        let count;
        let keizoku;
        let atari_count = 0;
        let simulationData = [];

        function weightedRandom(weights) {
            const sum = weights.reduce((a, b) => a + b, 0);
            let r = Math.random() * sum;
            for (let i = 0; i < weights.length; i++) {
                if (r < weights[i]) return i;
                r -= weights[i];
            }
        };
        // 重み乱数

        add_button.addEventListener("click", () => {
            const text = '<div class="box"><input type="text" class="kitai back" placeholder="例：1500" pattern="^[0-9]+$">玉 <input type="text" class="wariai back" placeholder="例：50" maxlength="3" minlength="1" pattern="^[0-9]+$">%<br></div>';
            // 追加するテキスト
            content.insertAdjacentHTML("beforeend", text);
        })
        // 追加イベント

        del_button.addEventListener("click", () => {
            const last = content.querySelector(".box:last-child");
            if (last) {
                last.remove();
            }
        })
        // 削除イベント

        function lockBackInputs() {
            document.querySelectorAll(".back").forEach(el => {
                el.readOnly = true;
                el.classList.add("black_theme");
            });
            add_del.remove();
        }

        document.querySelectorAll(".search-btn").forEach(btn => {
            btn.addEventListener("click", () => {

                function validateInputs() {
                    // 必須入力チェック
                    for (const el of document.querySelectorAll(".back")) {
                        if (el.value.trim() === "") {
                            alert("入力されていない項目があります");
                            return false;
                        }
                        if (isNaN(el.value) || el.value < 0) {
                            alert("数値で正しい値を入力してください");
                            return false;
                        }
                    }

                    let wariaiValues = Array.from(document.querySelectorAll(".wariai")).map(el => Number(el.value));
                    let wariaiTotal = wariaiValues.reduce((a, b) => a + b, 0);
                    return true;
                }
                if (!validateInputs()) return;
                let arr = Array.from(document.querySelectorAll(".kitai")).map(el => Number(el.value));
                let arr_wariai = Array.from(document.querySelectorAll(".wariai")).map(el => Number(el.value));
                let rush = Number(document.getElementById("rush").value);
                let rupu = Number(document.getElementById("rupu").value);
                let sikin = Number(document.getElementById("sikin").value);
                let trials = Number(document.querySelector("#kaiten").value);
                let kakuritu = Number(document.querySelector("#kakuritu").value);
                simulationData = [arr, arr_wariai, rush, rupu, sikin, trials, kakuritu,];
            });
        });
        function showResult(text, highlight = false) {
            button.insertAdjacentHTML("beforebegin", `<p>${text}</p>`)
        }
        function showSimulation(text, highlight = false) {
            button_simulation.insertAdjacentHTML("beforebegin", `<p>${text}</p>`)
        }
        function showDedama(text, highlight = false) {
            button_simulation_dedama.insertAdjacentHTML("beforebegin", `<p>${text}</p>`)
        }

        button.addEventListener("click", () => {
            arr_wariai = 0;
            // ボタン文字変更
            arr = Array.from(document.querySelectorAll(".kitai")).map(el => Number(el.value));
            // 出玉のクラス取得
            arr_wariai = Array.from(document.querySelectorAll(".wariai")).map(el => Number(el.value));
            // 出玉のクラスの割合取得
            for (x of simulationData[1]) {
                arr_wariai_total = Number(arr_wariai_total) + Number(x);
            };
            // 合計割合を出力
            if (arr_wariai_total === 100) {
                lockBackInputs();
                let today = simulationData[5] * (simulationData[4] / 1000);
                const missProb = ((simulationData[6] - 1) / simulationData[6]) ** simulationData[5];
                const missProb_today = ((simulationData[6] - 1) / simulationData[6]) ** today;
                // 1回以上当たる確率
                let hitProb = 1 - missProb;
                let hitProb_today = 1 - missProb_today;
                let x = (hitProb * 100).toFixed(1);
                x_today = (hitProb_today * 100).toFixed(1);
                let z = x * (simulationData[3] / 100);
                let z_today = x_today * (simulationData[3] / 100);

                showResult(`1/${simulationData[6]} を1000円で当たる確率は ${x}% です`);
                showResult(`突入率が${simulationData[2]}%の場合、当たりかつ、Rush獲得率は${z.toFixed(1)}% です`);
                showResult(`1/${simulationData[6]} を${simulationData[4]}円で当たる確率は ${x_today}% です。総回転数は${today}回転程度です。`);
                showResult(`突入率が${simulationData[2]}%の場合、当たりかつ、Rush獲得率は${z_today.toFixed(1)}% です`);
                firstClick = false; // 次回以降は実行されないようにする

                button.remove();
            } else {
                alert(`現在Rushの合計%が${arr_wariai_total}%です。100%になるように入力してください`);
                arr_wariai_total = 0;
            }
            return arry;
        });
        button_simulation.addEventListener("click", () => {
            if (firstSimulationClick) {
                lockBackInputs();
                firstSimulationClick = false;
            }
            const simulationTarget = document.querySelectorAll("#simulation p");


            if (button_simulation.textContent === "シミュレーションを始める") {
                let today = simulationData[5] * (simulationData[4] / 1000);
                const missProb = ((simulationData[6] - 1) / simulationData[6]) ** simulationData[5];
                const missProb_today = ((simulationData[6] - 1) / simulationData[6]) ** today;
                // 1回以上当たる確率
                let hitProb = 1 - missProb;
                let hitProb_today = 1 - missProb_today;

                x_today = (hitProb_today * 100).toFixed(1);
                let today_omomiransuu = [Math.floor(x_today), Math.floor(100 - x_today)];
                let result = weightedRandom(today_omomiransuu);
                showSimulation(`今日の軍資金で当たる確率${Math.floor(x_today)}%`);
                button_simulation.classList.add("button_simulation");
                if (result === 0) {
                    showSimulation("当たり！Rush取れるか試してく？");
                    button_simulation.classList.remove("button_simulation");
                    button_simulation.textContent = (`${simulationData[2]}%を突破できるかな？`);
                } else {
                    showSimulation(`はずれ！${simulationData[4]}円無駄にするから帰ろう！`);
                    button_simulation.textContent = "リセットする";
                }


            } else if (button_simulation.textContent === (`${simulationData[2]}%を突破できるかな？`)) {
                let rush_omomiransuu = [Number(simulationData[2]), Number(100 - simulationData[2])];
                let result = weightedRandom(rush_omomiransuu);
                showSimulation(`Rush入る確率${simulationData[2]}%`);
                if (result === 0) {
                    showSimulation("Rush取れたよ！ここから何回続くかな？");
                    button_simulation.classList.remove("button_simulation");
                    button_simulation.textContent = "何回連続で当てることができるかな？";
                    firstSimulationClick = true;
                } else {
                    showSimulation("残念！Rushは取れなかったね。");
                    button_simulation.textContent = "リセットする";
                }


            } else if (button_simulation.textContent === "何回連続で当てることができるかな？") {
                let rupu_omomiransuu = [Number(simulationData[3]), Number(100 - simulationData[3])];
                let result = weightedRandom(rupu_omomiransuu);
                if (result === 0) {
                    if (firstClick) {
                        dedama = 0;
                        keizoku = simulationData[3] / 100;
                        firstClick = false;
                    }
                    atari_count = atari_count + 1;
                    let result = weightedRandom(simulationData[1]);
                    dedama = Number(dedama) + Number(simulationData[0][result]);
                    keizoku_kakuritu = keizoku * 100;
                    showSimulation(`${atari_count}回目は当たり！連続で当たる確率は${keizoku_kakuritu.toFixed(2)}%です。今回でた出玉は${simulationData[0][result]}です。現在の合計は${dedama}玉です。`);
                    arry = [atari_count + 1, dedama];
                    keizoku = keizoku * (simulationData[3] / 100);

                } else {
                    atari_count = atari_count + 1;
                    alert(`${atari_count}回目ではずれ引いたね。`);
                    showSimulation(`${atari_count}回目ではずれ引いたね。`);
                    button_simulation.textContent = "リセットする";
                }
                //今ある文章を消す
            } else if (button_simulation.textContent === "リセットする") {
                atari_count = 0;
                if (simulationTarget) { simulationTarget.forEach(el => el.remove()); }
                button_simulation.textContent = "シミュレーションを始める";
                firstSimulationClick = true;
                firstClick = true;
            }
        })
        button_simulation_dedama.addEventListener("click", () => {
            if (firstDedamaClick) {
                lockBackInputs();
                firstDedamaClick = false;
                arry = [0, 0]
                dedama = 0;
            }
            let i = simulationData[1].length;
            if (button_simulation_dedama.textContent === "出玉のシミュレーションを始める") {
                button_simulation_dedama.textContent = "更に10回計算する";
            }
            for (let r = 0; r < 10; r++) {
                let result = weightedRandom(simulationData[1]);
                for (let g = 0; g < i; g++) {
                    if (result === g) {
                        count = g;
                    }
                }
                arry = [arry[0] + 1, dedama];
                keizoku = ((simulationData[3] / 100) ** arry[0]);
                dedama = Number(dedama) + Number(simulationData[0][count]);
                keizoku_kakuritu = keizoku * 100;
                showDedama(`${arry[0]}回目の継続確率は${keizoku_kakuritu.toFixed(2)}%です。今回でた出玉は${simulationData[0][count]}です。現在の合計は${dedama}玉です。`);
                arr_wariai_total = 0;
                if (Math.trunc(keizoku_kakuritu) === 0) {
                    showDedama("これ以上続く可能性は限りなく0に近いため出玉シミュレーションを終了します");
                    button.style.display = "none";
                    alert("これ以上続く可能性は限りなく0に近いためシミュレーションを終了します");
                    button_simulation_dedama.remove();
                    break;
                }
            }
        });
        document.getElementById("reset").addEventListener("click", () => {
            location.reload(); // ページをリロード
        });

        const buttons = document.querySelectorAll('.result-nav button');
        const boxes = document.querySelectorAll('.result-box');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    boxes.forEach(box => {
      box.classList.remove('active');
    });

    document.getElementById(target).classList.add('active');
  });
});

    const tabContainer = document.querySelector('.tab-container');
    const tabMenuItems = tabContainer.querySelectorAll('ul li');
    const tabContents = tabContainer.querySelectorAll('.tab-content');

    tabMenuItems.forEach(tabMenuItem => {
        tabMenuItem.addEventListener('click', () => {
            tabMenuItems.forEach(item => {
                item.classList.remove('selected');
            });

            tabMenuItem.classList.add('selected');

            tabContents.forEach(tabContent => {
                tabContent.classList.remove('selected');
            });

            document.getElementById(tabMenuItem.dataset.id).classList.add('selected');
        });
    });

        