Game.registerMod("AutoInsugarTrading", {
    init: function () {
        // https://staticvariablejames.github.io/InsugarTrading/
        let fn = [
            ["CRL", 14.78,  1,   4.85,   9.06,   23.97,  118.7],
            ["CHC", 19.92,  1,   5.45,   15.74,  32.41,  121.4],
            ["BTR", 25.98,  1,   7.7,    23.98,  41.59,  123.6],
            ["SUG", 33.36,  1,   13.36,  33.3,   51.29,  128.3],
            ["NUT", 42.45,  1,   22.25,  43.02,  61.21,  129.9],
            ["SLT", 49.56,  1,   31.8,   52.67,  70.96,  131.0],
            ["VNL", 57.67,  1,   41.58,  62.46,  80.9,   139.0],
            ["EGG", 64.84,  1,   51.33,  72.02,  90.0,   141.1],
            ["CNM", 71.6,   1,   61.14,  81.53,  97.67,  151.5],
            ["CRM", 79.11,  1,   70.91,  90.65,  103.98, 160.9],
            ["JAM", 87.74,  1,   80.74,  99.76,  113.33, 169.4],
            ["WCH", 97.03,  1,   90.67,  108.83, 123.09, 179.9],
            ["HNY", 106.73, 1.6, 100.55, 118.45, 133.01, 190.1],
            ["CKI", 116.64, 1.8, 110.46, 128.33, 142.94, 198.9],
            ["RCP", 126.63, 3.2, 120.42, 138.32, 152.99, 209.4],
            ["SBD", 0,      0,   130.4,  148.28, 162.97, 0],
        ];

        let logs = [];
        // logs.unshift([(new Date()).toLocaleString().slice(5), 3, "Buy", 5.34, 600, -600 * 5.34]);
        // logs.unshift([(new Date()).toLocaleString().slice(5), 3, "Sell", 15.13, 600, 600 * 15.13]);
        
        const jsInitCheckTimer = setInterval(jsLoaded, 1000);
        function jsLoaded() {
            if (parseInt(l("bankGood-0-stock").innerHTML, 10) != NaN) {
                clearInterval(jsInitCheckTimer);

                // ほんへここから
                // 新しいstyle要素を作成
                var newStyle = document.createElement('style');
                newStyle.type = 'text/css';
                // CSSの内容を書く
                newStyle.innerText = `
                td, th {
                    padding: 5px 15px;
                    text-align: center;
                }
                `;
                // HEAD要素の最後に作成したstyle要素を追加
                document.getElementsByTagName('HEAD').item(0).appendChild(newStyle);

                let M = Game.Objects["Bank"].minigame;

                let before = Array(M.goodsById.length);
                // [transaction, profit]
                let sum = [0, 0.0];
                
                function getLog(){
                    let s = "";
                    if(logs.length == 0){
                        s = "まだ取引が行われていません";
                    }
                    else{
                        s = `<table width="450px"><tr><th>取引時刻</th><th>銘柄</th>
                            <th style='white-space: nowrap;'><span style='color:#FF000099;'>購入</span>/<span style='color:#00FF0099;'>売却</span></th>
                            <th>相場</th><th>個数</th><th>利益</th></tr>`;
                        for(let i = 0; i < Math.min(10, logs.length); i++){
                            if(logs[i][2] == "Buy"){
                                s += "<tr style='background-color:#FF000025;'>";
                            }
                            else{
                                s += "<tr style='background-color:#00FF0025;'>";
                            }
                            s += "<td>" + logs[i][0] + "</td><td>" + fn[logs[i][1]][0] + "</td><td>" + logs[i][2] + "</td><td>"
                                + logs[i][3] + "</td><td>" + logs[i][4].toLocaleString(undefined, {maximumFractionDigits: 2}) + "</td><td>" + logs[i][5].toLocaleString(undefined, {maximumFractionDigits: 2}) + "</tr>";
                        }
                        s += "<tr><th>合計</th><td></td><td></td><td></td><td>" + sum[0].toLocaleString(undefined, {maximumFractionDigits: 2}) + "</td><td>" + sum[1].toLocaleString(undefined, {maximumFractionDigits: 2}) + "</td></tr>";
                        s += "</table>"
                    }
                    console.log(logs);
                    return "<div style='padding:8px 4px; min-width:450px;'>" + s + "</div>";
                }

                l("bankBrokers").insertAdjacentHTML("afterend",
                    `<div id="history" style="display:inline-block;padding:0px 4px;">
                        <span class="bankSymbol">履歴</span>
                    </div>`
                );

                l("history").onmouseout = function(){
                    Game.tooltip.shouldHide=1;
                }
                l("history").onmouseover = function(){
                    Game.tooltip.dynamic=1;
                    Game.tooltip.draw(this, getLog(), 'this');
                    Game.tooltip.wobble();
                }

                for (var i = 0; i < M.goodsById.length; i++) {
                    before[i] = parseInt(l("bankGood-" + i + "-stock").innerHTML, 10);
                }

                setInterval(function () {
                    autoBank();
                }, 60000);

                function autoBank() {
                    for (var i = 0; i < M.goodsById.length; i++) {
                        let after = parseInt(l("bankGood-" + i + "-stock").innerHTML, 10);
                        if (M.goodsById[i].val < fn[i][3]) {
                            l("bankGood-" + i + "_Max").click();
            
                            if(before[i] != after && before[i] != undefined){
                                let price = parseFloat(l("bankGood-" + i + "-val").innerHTML.slice(1));
                                logs.unshift([(new Date()).toLocaleString().slice(5), i, "Buy", price, after - before[i], (before[i] - after) * price]);
                                sum[0] += after - before[i];
                                sum[1] += (before[i] - after) * price;
                            }
                            console.log(logs[0]);
                        } 
                        else if (M.goodsById[i].val >= fn[i][5]) {
                            l("bankGood-" + i + "_-All").click();
            
                            if(before[i] != after && before[i] != undefined){
                                let price = parseFloat(l("bankGood-" + i + "-val").innerHTML.slice(1));
                                logs.unshift([(new Date()).toLocaleString().slice(5), i, "Sell", price, before[i] - after, (before[i] - after) * price]);
                                sum[0] += before[i] - after;
                                sum[1] += (before[i] - after) * price
                            }
                            console.log(logs[0]);
                        }
                        before[i] = after;
                    }
                }
            }
        }
    }
});
