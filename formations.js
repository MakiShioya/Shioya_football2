// formations.js
const FORMATIONS = {
    "4-2-3-1": [
        { id: "GK", reqPos: "GK", top: 85, left: 50 },
        { id: "RSB", reqPos: "RSB", top: 65, left: 85 },
        { id: "RCB", reqPos: "CB", top: 70, left: 65 }, // 右のCB（適性はCBを見る）
        { id: "LCB", reqPos: "CB", top: 70, left: 35 }, // 左のCB（適性はCBを見る）
        { id: "LSB", reqPos: "LSB", top: 65, left: 15 },
        { id: "RDMF", reqPos: "DMF", top: 50, left: 65 },
        { id: "LDMF", reqPos: "DMF", top: 50, left: 35 },
        { id: "RSH", reqPos: "RSH", top: 35, left: 85 },
        { id: "OMF", reqPos: "OMF", top: 35, left: 50 },
        { id: "LSH", reqPos: "LSH", top: 35, left: 15 },
        { id: "CF", reqPos: "CF", top: 15, left: 50 }
    ],
    "4-3-3": [
        // 同じように11人分定義する...
    ]
};
